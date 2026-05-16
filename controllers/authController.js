import { body, validationResult } from "express-validator"
import { prisma } from "../lib/prisma.js"
import bcrypt from "bcryptjs"

export const getLogin = (req, res) => {
    res.render("login")
}

export const postLogin = async (req, res) => {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
        where: {
            username: username
        }
    })

    if (!user) return res.render("login", { errors: [new Error("Incorrect username or password.")]});

    if (!bcrypt.compare(password, user.password)) return res.render("login", { errors: [new Error("Incorrect username or password.")]});

    req.session.userId = user.id;
    res.redirect("/")
}

export const getSignup = (req, res) => {
    res.render("signup")
}

const signupValidator = [
    body("first").trim().escape()
    .isLength({min: 2}).withMessage("First name must have more than 2 characters."),
    body("last").trim().escape()
    .isLength({min: 2}).withMessage("Last name must have 2 or more characters."),
    body("username").trim().escape()
    .isLength({min: 2}).withMessage("Username must have 2 or more characters.")
    .custom(async (value) => {
        const user = await prisma.user.findUnique({
            where: {
                username: value
            }
        });

        if (user) throw new Error("Username is already taken.")

        return true;
    }),
    body("password")
    .isLength({min: 5}).withMessage("Password must have at least 5 characters."),
    body("confirm")
    .custom(async (value, { req }) => {
        const password = req.body.password;

        if (value !== password) throw new Error("Password and Confirm doesn't match.");

        return true;
    })
] 

export const postSignup = [
    signupValidator,
    async (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render("signup", { errors: errors.array() })
        }

        try {
            const { first, last, username, password } = req.body;

            const hashedPassword = await bcrypt.hash(password, 10)

            const user = await prisma.user.create({
                data: {
                    first: first,
                    last: last,
                    username: username,
                    password: hashedPassword
                }
            })

            req.session.userId = user.id
            res.redirect("/")

        } catch (err) {
            next(err);
        }
    }
]