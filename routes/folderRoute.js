import { Router } from "express";
import * as controller from "../controllers/folderController.js"

const router = Router();

router.get('/create', controller.getCreateFolder)
router.post('/create', controller.postCreateFolder)
router.get('/:id', controller.getFolderById);
router.get('/:id/edit', controller.getFolderEdit);
router.post('/:id/edit', controller.postFolderEdit)
export default router