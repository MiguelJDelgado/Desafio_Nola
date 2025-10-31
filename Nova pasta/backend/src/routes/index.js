import express from "express";
import { getAllStores } from "../controllers/StoreController.js";

const router = express.Router();

router.get("/stores", getAllStores);

export default router;
