const isAuth = (req, res, next) => {
    if (req.session.User) {
      next();
    } else {
      res.redirect("/signin");
    }
  };
  const isAdmin = (req, res, next) => {
    if (req.session.User && req.session.User.Type=='Admin') {
      next();
    } else {
       
      res.redirect("/");
    }
  };
  export {isAuth,isAdmin};
  