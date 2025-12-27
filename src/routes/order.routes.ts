// routes/order.routes.ts
import { Router } from "express";
import { getLatestOrder } from "../controllers/order.controller";
import {verifyToken} from "../middlewares/isAdmin";

const router = Router();

router.get("/orders/latest", verifyToken, getLatestOrder);

export default router;
