import { prisma } from "../lib/prisma.js"

export const getIndex = async (req, res) => {
    const folders = await prisma.folder.findMany();
    res.render("index", {folders});
}
