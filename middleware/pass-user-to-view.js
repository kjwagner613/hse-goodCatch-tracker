/*const passUserToView = (req, res, next) => {
    console.log(req.session);
    res.locals.user = req.session.user ? req.session.user : null;
    next();
};
module.exports = passUserToView;
*/

const passUserToView = (req, res, next) => {
    try {
      console.log(req.session);
      res.locals.user = req.session.user ? req.session.user : null;
      next();
    } catch (error) {
      console.error("Error in passUserToView middleware:", error);
      res.status(500).send("There was an error with the passUserToView middleware, please notify support.");
    }
  };
  module.exports = passUserToView;