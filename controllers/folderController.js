import { prisma } from "../lib/prisma.js";
import { body, validationResult } from "express-validator";


const folderNameValidator = [
    body("name").trim().escape()
    .isLength({min: 1}).withMessage("Name of the folder cant be empty string.")
]

export const getCreateFolder = (req, res) => {
    res.render("addFolder");
}

export const postCreateFolder = [
    folderNameValidator,
    async (req, res, next) => {
        try {

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.render("addFolder", {errors: errors.array()})
            }
            const name = req.body.name;

            const folder = await prisma.folder.create({
                data: {
                    name: name,
                    userId: req.session.userId
                }
            })

            res.redirect('/');
        } catch (err) {
            next(err)
        }
    }
]

export const getFolderById = async (req, res, next) => {
    try {
        const id = req.params.id;

        const folder = await prisma.folder.findUnique({ 
            where: {
                id: id
            }
        })

        const files = await prisma.file.findMany({
            where: {
                folderId: folder.id
            }
        })
        
        res.render('folder', {folder, files});
    } catch (err) {
        next(err);
    }
}

export const getFolderEdit = async (req, res, next) => {
    try {
        const id = req.params.id;
        
        const folder = await prisma.folder.findUnique({
            where: {
                id: id
            }
        })
        if (!folder) throw new Error("There is no such a folder");

        res.render("addFolder", {folder})
    } catch (err) {
        next(err)
    }
}

export const postFolderEdit = [
    folderNameValidator,
    async (req, res, next) => {
        try {
            const id = req.params.id;

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                const folder = await prisma.folder.findUnique({
                    where: {
                        id: id
                    }
                })
                return res.render("addFolder", {folder, errors: errors.array()})
            }

            const folder = await prisma.folder.update({
                where: {
                    id: id
                },
                data: {
                    name: req.body.name
                }
            })
            if (!folder) throw new Error("There is no such a folder");

            res.redirect('/');
        } catch (err) {
            next(err)
        }
    }
]

export const postFolderDelete = async (req, res, next) => {
    try  {
        const id = req.params.id;

        const folder = await prisma.folder.delete({
            where: {
                id: id
            }
        })

        res.redirect('/')
    } catch (err) {
        next(err)
    }
}