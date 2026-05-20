import multer from "multer";
import {fileURLToPath} from "url"
import path from "path";
import { prisma } from "../lib/prisma.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({dest: path.join(__dirname, "../dist/files")});

export const getIndex = async (req, res) => {
    const folders = await prisma.folder.findMany();
    res.render("index", {folders});
}

export const postFileUpload = [ 
    upload.single("file"),
    (req, res) => {

        if (req.file) console.log("File detetektovan."); 
        res.redirect('/');
    }
]