import { prisma } from "../db/prisma.js"
import crypto from "node:crypto"


async function getFolder(folderId) {
  const folder = await prisma.folder.findFirst({
    where: {
      id: folderId,
    },
    include: {
      files: true,
    },
  });

  return folder
}

async function getFolders(userId) {
  const folders = await prisma.folder.findMany({
    where: {
      userId,
    },
  });

  return folders
}

async function createFolder(data) {
  return prisma.folder.create({
    data: {
      name: data.folderName,
      userId: data.userId,
    },
  })
}

async function createFile(data) {
  return prisma.file.create({
    data: {
      name: data.name,
      mimeType: data.mimeType,
      storageKey: data.storageKey,
      size: data.size,
      folderId: data.folderId
    }
  })
}

async function shareFolder(folderId) {
  const token = crypto.randomUUID()
  const share = await prisma.share.create({
    data: {
      token,
      folderId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  })
  return share
}

  
async function getSharedFolderByToken(token) {
  return prisma.share.findUnique({
    where: { token },
    include: {
      folder: {
        include: {
          files: true,
        },
      },
    },
  })
}

export {
  createFolder,
  getFolders,
  getFolder,
  createFile,
  shareFolder,
  getSharedFolderByToken
}
