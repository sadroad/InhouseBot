use std::f64::EPSILON;

use super::utils::{team_rating, gamma, score};
use super::statistics::{phi_major,v,w,vt,wt};
use serenity::model::id::UserId;
use tracing::log::info;

const DEFAULT_Z: f64 = 3.0;
const DEFAULT_MU: f64 = 25.0;
pub const DEFAULT_SIGMA: f64 = DEFAULT_MU / DEFAULT_Z;
const BETA: f64 = DEFAULT_SIGMA / 2.0;
const BETA_SQUARED: f64 = BETA * BETA;
const TWO_BETA_SQUARED: f64 = 2.0 * BETA_SQUARED;
const TAU: f64 = 0.083;
const TAU_SQUARED: f64 = TAU * TAU;

#[derive(Clone, Debug)]
pub struct Rating {
    pub user_id: UserId,
    pub mu: f64,
    pub sigma: f64,
}

// impl Rating 

impl Rating {
    pub fn new(user_id: UserId) -> Rating {
        Rating {
            user_id,
            mu: DEFAULT_MU,
            sigma: DEFAULT_SIGMA,
        }
    }
    
    pub fn from(user_id: UserId,mu: f64, sigma: f64) -> Rating {
        Rating {
            user_id,
            mu,
            sigma,
        }
    }
    
    pub fn ordinal(&self) -> f64 {
        20.0 * (self.mu - DEFAULT_Z * self.sigma + 25.0)
    }
}

pub fn rate(teams: &Vec<Vec<Rating>>) -> Vec<Vec<Rating>> {
    let teams_copy = teams.clone();
    let processed_teams = &teams.into_iter().map(|team| {
        let team = team.into_iter().map(|rating| {
            let mut rating = rating.clone();
            rating.sigma = f64::sqrt(rating.sigma*rating.sigma*TAU_SQUARED);
            return rating;
        }).collect::<Vec<Rating>>();
        return team;
    }).collect::<Vec<Vec<Rating>>>();

    let mut new_ratings = bt_full(processed_teams);
    
    new_ratings = new_ratings.into_iter().enumerate().map(|(i,team)| {
        team.into_iter().enumerate().map(|(j,mut rating)| {
            rating.sigma = f64::min(rating.sigma, teams_copy[i][j].sigma);
            return rating
        }).collect::<Vec<Rating>>()
    }).collect::<Vec<Vec<Rating>>>();
    
    new_ratings
}

fn bt_full(teams: &Vec<Vec<Rating>>) -> Vec<Vec<Rating>>{
    let ranks: [usize;2] = [0,1];
    let mut team_mu = vec![0.0; teams.len()];
    let mut team_sigma_sq = vec![0.0; teams.len()];
    let mut team_omega = vec![0.0; teams.len()];
    let mut team_delta = vec![0.0; teams.len()];

    for (team_idx, team) in teams.iter().enumerate() {
        for player in team.iter() {
            team_mu[team_idx] += player.mu;
            team_sigma_sq[team_idx] += player.sigma * player.sigma;
        }
    }

    for team_idx in 0..teams.len() {
        for team2_idx in 0..teams.len() {
            if team_idx == team2_idx {
                continue;
            }

            let c = (team_sigma_sq[team_idx] + team_sigma_sq[team2_idx] + TWO_BETA_SQUARED)
                .sqrt();
            let e1 = (team_mu[team_idx] / c).exp();
            let e2 = (team_mu[team2_idx] / c).exp();
            let piq = e1 / (e1 + e2);
            let pqi = e2 / (e1 + e2);
            let ri = ranks[team_idx];
            let rq = ranks[team2_idx];
            let s = score(rq as f64, ri as f64);

            let omega = (team_sigma_sq[team_idx] / c) * (s - piq);
            let gamma = gamma(c,team_sigma_sq[team_idx]);
            let delta = gamma * (team_sigma_sq[team_idx] / (c * c)) * piq * pqi;

            team_omega[team_idx] += omega;
            team_delta[team_idx] += delta;
        }
    }

    let mut result = Vec::with_capacity(teams.len());

    for (team_idx, team) in teams.iter().enumerate() {
        let mut team_result = Vec::with_capacity(team.len());

        for player in team.iter() {
            let new_mu =
                player.mu + (player.sigma*player.sigma / team_sigma_sq[team_idx]) * team_omega[team_idx];

            let mut sigma_adj =
                1.0 - (player.sigma*player.sigma / team_sigma_sq[team_idx]) * team_delta[team_idx];

            if sigma_adj < 0.0001 {
                sigma_adj = 0.0001;
            }

            let new_sigma_sq = player.sigma*player.sigma * sigma_adj;

            team_result.push(Rating {
                user_id: player.user_id.clone(),
                mu: new_mu,
                sigma: new_sigma_sq.sqrt(),
            });
        }

        result.push(team_result);
    }
    result
}

fn tm_full(teams: &Vec<Vec<Rating>>) -> Vec<Vec<Rating>> {
    let team_ratings = team_rating(teams);
    let mut new_ratings: Vec<Vec<Rating>> = Vec::new();
    for i in 0..team_ratings.len() {
        let mut omega = 0.0;
        let mut delta = 0.0;
        let mut new_team: Vec<Rating> = Vec::new();
        for q in 0..team_ratings.len() {
            if q == i {
                continue
            };
            let ciq = f64::sqrt(team_ratings[i].1 + team_ratings[q].1 + TWO_BETA_SQUARED);
            let tmp = (team_ratings[i].0-team_ratings[q].0)/ciq;
            let sigsq_to_ciq = team_ratings[i].1/ciq;
            let gamma = gamma(ciq, team_ratings[i].1);
            if team_ratings[q].3 > team_ratings[i].3 {
                omega += sigsq_to_ciq*v(tmp,EPSILON/ciq);
                delta += gamma*sigsq_to_ciq/ciq*w(tmp,EPSILON/ciq);
            } else  if team_ratings[q].3 < team_ratings[i].3 {
                omega += -sigsq_to_ciq*v(-tmp,EPSILON/ciq);
                delta += gamma*sigsq_to_ciq/ciq*w(-tmp,EPSILON/ciq);
            } else {
                omega += sigsq_to_ciq*vt(tmp,EPSILON/ciq);
                delta += gamma*sigsq_to_ciq/ciq*wt(tmp,EPSILON/ciq);
            }
        }
        for player in team_ratings[i].2.iter() {
            let sigmasq= player.sigma*player.sigma;
            // dbg!(&player.user_id);
            // dbg!(sigmasq);
            // dbg!(sigmasq/team_ratings[i].1);
            let new_mu =  player.mu + (sigmasq/team_ratings[i].1) * omega;
            let new_sigma = f64::sqrt(f64::max(1.0-sigmasq/team_ratings[i].1*delta, f64::EPSILON));
            new_team.push(Rating::from(player.user_id, new_mu, new_sigma));
        }
        new_ratings.push(new_team);
    }
    new_ratings
}


pub fn predicte_win(teams: &Vec<Vec<Rating>>) {
    let team_ratings = team_rating(teams);
    let n:f64 = teams.len() as f64;
    let denom:f64  = (n * (n - 1.0)) / 2.0;
    for i in 0..team_ratings.len() {
        for q in 0..team_ratings.len() {
            if q == i {
                continue;
            }
            let mu_a = team_ratings[i].0;
            let mu_b = team_ratings[q].0;
            let sigmas_sq_a = team_ratings[i].1;
            let sigmas_sq_b = team_ratings[q].1;
            info!("{}-{}",team_ratings[i].2[0].user_id,phi_major((mu_a - mu_b) / f64::sqrt(n * BETA_SQUARED + f64::powi(sigmas_sq_a,2)+ f64::powi(sigmas_sq_b,2)))/denom);
            for player in team_ratings[i].2.iter() {
                info!("{}-{}",player.user_id,player.ordinal());
            }
        }
    }
}