import { Router } from "express"
import * as shareController from "../controllers/shareController.js"

const shareRouter = Router()

shareRouter.get("/:token", shareController.getSharedFolder)

export default shareRouter