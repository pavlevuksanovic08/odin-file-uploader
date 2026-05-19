import "dotenv/config";
import express from "express"
import indexRouter from "./routes/indexRoute.js";
import path from "path";
import { fileURLToPath } from "url";
import expressSession from "express-session";
import { prisma } from "./lib/prisma.js"
import { PrismaSessionStore } from "@quixo3/prisma-session-store";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))

app.use(express.urlencoded({ extended: true }))

app.use(expressSession({
    cookie: {
        maxAge: 7 * 24* 60 * 60 * 1000, // 7 days
    },
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || "a santa at nasa",
    store: new PrismaSessionStore(
        prisma,
        {
            checkPeriod: 2* 60 * 1000,
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        }
     )
    }
));

app.use(async (req, res, next) => {
    if (req.session?.userId) {
        const user = await prisma.user.findUnique({
            where: {
                id: req.session.userId
            }
        })
        res.locals.currentUser = user;
    } else {
        res.locals.currentUser = null;
    }
    next();
})

app.use('/', indexRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});