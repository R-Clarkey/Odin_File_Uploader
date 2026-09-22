import { Router } from "express"
import * as folderController from "../controllers/folderController.js"
import upload from "../middleware/upload.js"

const folderRouter = Router()

folderRouter.get("/", folderController.getDisplayFolders)
folderRouter.post("/new", folderController.postNewFolder)
folderRouter.get("/:id", folderController.getDisplayFolder)
folderRouter.post("/:id/files", upload.single("file"), folderController.postUploadFile)
folderRouter.post("/:id/share", folderController.postShareFolder)

export default folderRouter