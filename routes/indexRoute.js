import { Router } from "express";
import * as contoller from "../controllers/indexController.js" 

const router = Router();

router.get('/', contoller.getIndex)
router.get('/signup', contoller.getSignup)
router.get('/login', contoller.getLogin)
export default router;