  const isSignedIn = (req, res, next) => {
    try {
      if (req.session.user) {
        return next(); // User is signed in, proceed to the next middleware
      } else {
        req.session.returnTo = req.originalUrl; // Store the original URL (as discussed earlier)
        res.redirect('/auth/sign-in'); // Redirect to login if not signed in
      }
    } catch (error) {
      console.error("Error in isSignedIn middleware:", error);
      res.status(500).send("There was an error with the isSignedIn middleware, please notify support.");
    }
  };

  module.exports = isSignedIn;