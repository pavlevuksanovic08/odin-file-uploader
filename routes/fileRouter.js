import { Router } from "express";
import * as controller from "../controllers/fileContoller.js"

const router = Router();

router.post('/:id/download', controller.postFileDownload)
router.post('/:id/delete', controller.postFileDelete)

export default router;
