use probability::distribution::{Distribution, Gaussian};

pub fn phi_major(x: f64) -> f64 {
    let normal = Gaussian::new(0.0, 1.0);
    normal.distribution(x)
}
