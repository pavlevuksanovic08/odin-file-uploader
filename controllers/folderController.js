import { prisma } from "../lib/prisma.js";

export const getCreateFolder = (req, res) => {
    res.render("addFolder");
}

export const postCreateFolder = async (req, res, next) => {
    try {
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

export const getFolderById = async (req, res, next) => {
    try {
        const id = req.params.id;

        const folder = await prisma.folder.findUnique({ 
            where: {
                id: id
            }
        })
        if (!folder) throw new Error("There is no such a folder");
        res.render('folder', {folder});
    } catch (err) {
        next(err);
    }

    
}