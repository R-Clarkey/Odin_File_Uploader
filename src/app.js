import dotenv from "dotenv"
import path from "node:path"
import { fileURLToPath } from "node:url"
import express from "express"
import session from "express-session"
import passport from "passport"

import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../generated/prisma/index.js";
import { PrismaSessionStore } from "@quixo3/prisma-session-store"

import configurePassport from "./config/passport.js"
import indexRouter from "./routes/indexRouter.js"
import authRouter from "./routes/authRouter.js"
import folderRouter from "./routes/folderRouter.js"
import shareRouter from "./routes/shareRouter.js" 

if (process.env.NODE_ENV !== "production") {
  dotenv.config()
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const connectionString = process.env.DATABASE_URL
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

configurePassport(passport)

const app = express()
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

const assetsPath = path.join(__dirname, "public")
app.use(express.static(assetsPath))
app.use(express.urlencoded({ extended: true }))

app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    secret: "a santa at nasa",
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
)

app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  res.locals.currentUser = req.user
  next()
})

app.use("/", indexRouter)
app.use("/", authRouter)
app.use("/folders", folderRouter)
app.use("/share", shareRouter)

export default app
