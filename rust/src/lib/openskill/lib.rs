use super::statistics::phi_major;
use super::utils::{gamma, score, team_rating};
use rayon::prelude::*;
use serenity::model::id::UserId;

const DEFAULT_Z: f64 = 3.0;
const DEFAULT_MU: f64 = 25.0;
pub const DEFAULT_SIGMA: f64 = DEFAULT_MU / DEFAULT_Z;
const BETA: f64 = DEFAULT_SIGMA / 2.0;
const BETA_SQUARED: f64 = BETA * BETA;
const TWO_BETA_SQUARED: f64 = 2.0 * BETA_SQUARED;
const TAU: f64 = 0.083;
const TAU_SQUARED: f64 = TAU * TAU;

#[derive(Copy, Clone, Debug)]
pub struct Rating {
    pub user_id: UserId,
    pub mu: f64,
    pub sigma: f64,
}

impl Rating {
    pub fn from(user_id: UserId, mu: f64, sigma: f64) -> Rating {
        Rating { user_id, mu, sigma }
    }

    pub fn ordinal(&self) -> f64 {
        20.0 * (self.mu - DEFAULT_Z * self.sigma + 25.0)
    }
}

pub fn rate(teams: &[Vec<Rating>]) -> Vec<Vec<Rating>> {
    let teams_copy = teams.to_owned();
    let processed_teams = &teams
        .par_iter()
        .map(|team| {
            let team = team
                .par_iter()
                .map(|rating| {
                    let mut rating = *rating;
                    rating.sigma = f64::sqrt(rating.sigma * rating.sigma * TAU_SQUARED);
                    rating
                })
                .collect::<Vec<Rating>>();
            team
        })
        .collect::<Vec<Vec<Rating>>>();

    let mut new_ratings = bt_full(processed_teams);

    new_ratings = new_ratings
        .into_iter()
        .enumerate()
        .map(|(i, team)| {
            team.into_par_iter()
                .enumerate()
                .map(|(j, mut rating)| {
                    rating.sigma = f64::min(rating.sigma, teams_copy[i][j].sigma);
                    rating
                })
                .collect::<Vec<Rating>>()
        })
        .collect::<Vec<Vec<Rating>>>();

    new_ratings
}

fn bt_full(teams: &Vec<Vec<Rating>>) -> Vec<Vec<Rating>> {
    let ranks: [usize; 2] = [0, 1];
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

            let c = (team_sigma_sq[team_idx] + team_sigma_sq[team2_idx] + TWO_BETA_SQUARED).sqrt();
            let e1 = (team_mu[team_idx] / c).exp();
            let e2 = (team_mu[team2_idx] / c).exp();
            let piq = e1 / (e1 + e2);
            let pqi = e2 / (e1 + e2);
            let ri = ranks[team_idx];
            let rq = ranks[team2_idx];
            let s = score(rq as f64, ri as f64);

            let omega = (team_sigma_sq[team_idx] / c) * (s - piq);
            let gamma = gamma(c, team_sigma_sq[team_idx]);
            let delta = gamma * (team_sigma_sq[team_idx] / (c * c)) * piq * pqi;

            team_omega[team_idx] += omega;
            team_delta[team_idx] += delta;
        }
    }

    let mut result = Vec::with_capacity(teams.len());

    for (team_idx, team) in teams.iter().enumerate() {
        let mut team_result = Vec::with_capacity(team.len());

        for player in team.iter() {
            let new_mu = player.mu
                + (player.sigma * player.sigma / team_sigma_sq[team_idx]) * team_omega[team_idx];

            let mut sigma_adj = 1.0
                - (player.sigma * player.sigma / team_sigma_sq[team_idx]) * team_delta[team_idx];

            if sigma_adj < 0.0001 {
                sigma_adj = 0.0001;
            }

            let new_sigma_sq = player.sigma * player.sigma * sigma_adj;

            team_result.push(Rating {
                user_id: player.user_id,
                mu: new_mu,
                sigma: new_sigma_sq.sqrt(),
            });
        }

        result.push(team_result);
    }
    result
}

pub fn predict_win(teams: &Vec<Vec<Rating>>) -> f64 {
    let team_ratings = team_rating(teams);
    let n: f64 = teams.len() as f64;
    let denom: f64 = (n * (n - 1.0)) / 2.0;
    let mu_a = team_ratings[0].0;
    let mu_b = team_ratings[1].0;
    let sigmas_sq_a = team_ratings[0].1;
    let sigmas_sq_b = team_ratings[1].1;
    phi_major(
        (mu_a - mu_b)
            / f64::sqrt(n * BETA_SQUARED + f64::powi(sigmas_sq_a, 2) + f64::powi(sigmas_sq_b, 2)),
    ) / denom
}
