use probability::distribution::{Gaussian, Distribution,Continuous,Inverse};

pub fn phi_major(x: f64) -> f64 {
    let normal = Gaussian::new(0.0, 1.0);
    normal.distribution(x)
}

fn phi_major_inverse(x: f64)-> f64{
    let normal = Gaussian::new(0.0, 1.0);
    normal.inverse(x)
}

fn phi_minor(x: f64) -> f64 {
    let normal = Gaussian::new(0.0, 1.0);
    normal.density(x)
}

pub fn v(x: f64, t:f64) -> f64{
    let xt = x - t;
    let denom = phi_major(xt);
    if denom < f64::EPSILON {
        return -xt;
    } else {
        return phi_minor(xt) / denom;
    }
}

pub fn w(x: f64, t: f64) -> f64 {
    let xt = x - t;
    let denom = phi_major(xt);
    if denom < f64::EPSILON {
        if x < 0.0 {
            return 1.0;
        } else {
            return 0.0;
        }
    } else {
        let tmp = v(x,t);
        return tmp * (tmp + xt);
    }
}

pub fn vt(x: f64, t: f64) -> f64 {
    let xx = x.abs();
    let b = phi_major(t-xx)-phi_major(-t-xx);
    if b < 1e-5 {
        if x < 0.0 {
            return -x-t;
        } else {
            return -x+t;
        }
    } else {
        let a = phi_minor(-t-xx) - phi_minor(t-xx);
        if x < 0.0 {
            return -a/b;
        } else {
            return a/b;
        }
    }
}

pub fn wt(x: f64, t: f64) -> f64 {
    let xx = x.abs();
    let b = phi_major(t-xx)-phi_major(-t-xx);
    if b < f64::EPSILON {
        return 1.0;
    } else {
        return ((t-xx)*phi_minor(t-xx)+(t+xx)*phi_minor(-t-xx))/b + vt(x,t)*vt(x,t);
    }
}
