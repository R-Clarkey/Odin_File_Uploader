import { getSharedFolderByToken } from "../services/folderService.js"

async function getSharedFolder(req, res) {
    const { token } = req.params
    const isGuest = !req.user

    const share = await getSharedFolderByToken(token)

    console.log(share, "SHARE")

    if (!share) {
    return res.status(404).send("Share link not found")
    }

    if (share.expiresAt < new Date()) {
    return res.status(410).send("Share link expired")
    }

    return res.render("share", {
    folder: share.folder, isGuest
    });
}

export { getSharedFolder}