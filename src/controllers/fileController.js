import { supabase } from "../config/supabase.js"
import { prisma } from "../db/prisma.js"

async function getFileByKey(req, res) {
  const { storageKey } = req.params

  const { data, error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET)
    .createSignedUrl(storageKey, 60 * 5)

  if (error) {
    return res.status(500).send("Could not load file")
  }

  return res.redirect(data.signedUrl)
}

async function deleteFile(req, res) {
  const { id } = req.params

  const file = await prisma.file.findUnique({
    where: { id },
  })

  if (!file) {
    return res.status(404).send("File not found")
  }

  const { error: storageError } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET)
    .remove([file.storageKey]);

  if (storageError) {
    return res.status(500).send("Could not delete file from storage")
  }

  await prisma.file.delete({
    where: { id },
  })
  
  return res.redirect(req.get('Referer') || "/folders")
}

export { getFileByKey, deleteFile }
