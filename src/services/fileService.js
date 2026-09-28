import { supabase } from "../config/supabase.js"
import crypto from "node:crypto"
import path from "node:path"

async function uploadFileToSupabase(file) {
  const extension = path.extname(file.originalname)
  const storageKey = `${crypto.randomUUID()}${extension}`

  const { error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET)
    .upload(storageKey, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    })

  if (error) throw new Error(error.message)

  return storageKey
}

export { uploadFileToSupabase }