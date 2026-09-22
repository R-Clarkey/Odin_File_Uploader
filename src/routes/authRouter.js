import { Router } from "express"
import passport from "passport"
import * as authController from "../controllers/authController.js"

const authRouter = Router()

authRouter.get("/sign-up", authController.getSignUp)
authRouter.post("/sign-up", authController.postSignUp)
authRouter.get("/log-out", authController.logOut)

authRouter.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
    failureMessage: true,
  })
)

export default authRouter
