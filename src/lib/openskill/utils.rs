use super::lib::Rating;

pub fn score(q: f64, i: f64) -> f64 {
    if q < i {
        return 0.0;
    }
    if q > i {
        return 1.0;
    }
    0.5
}

fn rankings() -> Vec<usize> {
    let team_scores = [0, 1];
    let mut out_rank: Vec<usize> = Vec::new();
    let mut s = 0;

    let mut j = 0;
    while j < team_scores.len() {
        if j > 0 && team_scores[j - 1] < team_scores[j] {
            s = j;
        }

        out_rank.push(s);
        j += 1;
    }
    out_rank
}

pub fn team_rating<'a>(teams: &'a [Vec<Rating>]) -> Vec<(f64, f64, &'a Vec<Rating>, usize)> {
    let rank = rankings();
    return teams
        .iter()
        .enumerate()
        .map(|(i, team)| {
            return (
                team.iter().map(|rating| rating.mu).sum::<f64>(),
                team.iter()
                    .map(|rating| {
                        let sigma = rating.sigma;
                        sigma * sigma
                    })
                    .sum::<f64>(),
                team,
                rank[i],
            );
        })
        .collect::<Vec<(f64, f64, &'a Vec<Rating>, usize)>>();
}

pub fn gamma(c: f64, sigma_sq: f64) -> f64 {
    f64::sqrt(sigma_sq) / c
}
