import { createUser } from "../services/usersService.js"

function getSignUp(req, res){
    res.render("sign-up-form", { errors: [], form: {} })
}

async function postSignUp(req, res){
    await console.log(createUser(req.body))
    res.redirect("/")
}

function logOut(req, res, next) {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect("/");
    });
  });
}

export { getSignUp, postSignUp, logOut }