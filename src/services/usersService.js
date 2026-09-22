import { prisma } from "../db/prisma.js"
import bcrypt from "bcryptjs"

async function createUser(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10)

    return prisma.user.create({data: {
        email: data.email,
        password: hashedPassword
    }})
}

export { createUser }