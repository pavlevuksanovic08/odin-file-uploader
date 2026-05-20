import multer from "multer";
import {fileURLToPath} from "url"
import path from "path";
import { prisma } from "../lib/prisma.js"
import { unlink } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fileLocation = path.join(__dirname, "../dist/files")
console.log(fileLocation)
const upload = multer({dest: fileLocation});

export const postFileUpload = [
    upload.single("file"),
    async (req, res, next) => {
        try {

            const folderId = req.params.id;

            const fileData = req.file;
            const file = await prisma.file.create({
                data: {
                    originalName: fileData.originalname,
                    size: fileData.size,
                    path: fileData.filename,
                    folderId: folderId
                }
            })
            
            res.redirect('/folder/' + folderId);

        } catch(err) {
            next(err)
        }
    }
]

export const postFileDownload = async (req, res, next) => {
    try {
        const id = req.params.id;

        const file = await prisma.file.findUnique({
            where: {
                id: id
            }
        })

        if (!file) {
            return res.status(404).send("Fajl nije pronađen u bazi podataka.");
        }

        const absolutePath = path.join(fileLocation, file.path);

        res.download(absolutePath, file.originalName, (err) => {
            if (err) {
                console.error("Greška prilikom preuzimanja fajla:", err);
                if (!res.headersSent) {
                    next(err);
                }
            }
        })
    } catch (err) {
        next(err)
    }
}

export const postFileDelete = async (req, res, next) => {
    try {
        const id = req.params.id;

        const file = await prisma.file.findUnique({
            where: { id: id }
        });

        if (!file) {
            return res.status(404).send("Fajl ne postoji.");
        }

        await prisma.file.delete({
            where: { id: id }
        });

        const putanjaDoFajla = path.join(fileLocation, file.path);

        unlink(putanjaDoFajla, (err) => {
            if (err) {
                console.error("Greška prilikom brisanja fajla sa diska:", err);
            }
        });

        // 5. Preusmeri korisnika nazad na folder u kome se nalazio
        res.redirect('/folder/' + file.folderId);

    } catch (err) {
        next(err);
    }
};