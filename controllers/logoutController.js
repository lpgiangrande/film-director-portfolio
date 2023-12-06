export const logoff = (req, res, next) => {
  req.logout(function(err) {
    if (err) {
      next(err); 
    } else {
      req.flash('success_msg', 'You are logged out');
      res.redirect('/login');
    }
  });
};
