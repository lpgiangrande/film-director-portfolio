export const logoff = async (req, res, next) => {
  try {
    await new Promise((resolve, reject) => {
      req.logout(err => (err ? reject(err) : resolve()));
    });

    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
  } catch (err) {
    console.error('Error during logout:', err);
    next(err);
  }
};
