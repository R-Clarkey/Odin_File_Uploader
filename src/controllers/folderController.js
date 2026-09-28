import {
  createFolder,
  getFolders,
  getFolder,
  createFile,
  shareFolder,
} from "../services/folderService.js";

import { uploadFileToSupabase } from "../services/fileService.js";


async function getDisplayFolder(req, res) {
  const folderId = req.params.id;
  const folder = await getFolder(folderId);
  console.log(`Folder: ${folder}, folderId: ${folderId}`);
  res.render("folder", { folder, files: folder.files });
}

async function getDisplayFolders(req, res) {
  const folders = await getFolders(req.user.id);
  console.log(folders);
  res.render("folders", { folders });
}

async function postNewFolder(req, res) {
  const { folderName } = req.body;
  await createFolder({ folderName, userId: req.user.id });
  console.log(`Created folder| Name: ${folderName}, userId: ${req.user.id}`);
  res.redirect("/folders");
}

async function postUploadFile(req, res) {
  const folderId = req.params.id;

  console.log(
    folderId,
    req.file.originalname,
    req.file.mimetype,
    req.file.size
  );

  const storageKey = await uploadFileToSupabase(req.file);

  await createFile({
    name: req.file.originalname,
    mimeType: req.file.mimetype,
    storageKey,
    size: req.file.size,
    folderId,
  });

  res.redirect(`/folders/${folderId}`);
}

async function postShareFolder(req, res) {
  const folderId = req.params.id;

  const folder = await getFolder(folderId);

  if (!folder) {
    return res.status(404).send("Folder not found");
  }

  if (req.user.id !== folder.userId) {
    return res.status(403).send("Not allowed");
  }

  const share = await shareFolder(folderId);
  console.log(share);
  return res.redirect(`/share/${share.token}`);
}

export {
  getDisplayFolders,
  getDisplayFolder,
  postNewFolder,
  postUploadFile,
  postShareFolder,
};
