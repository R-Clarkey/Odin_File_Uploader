import express from "express";
import { getFileByKey, deleteFile } from "../controllers/fileController.js";

const fileRouter = express.Router();

fileRouter.get("/:storageKey", getFileByKey);
fileRouter.post("/:id/delete", deleteFile);

export default fileRouter;
