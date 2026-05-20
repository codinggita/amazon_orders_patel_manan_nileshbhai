import { Router } from "express";
import { getApiInfo } from "../controllers/health.controller.js";
import healthRoutes from "./health.routes.js";

const router = Router();

// API root
router.get("/", getApiInfo);

// Feature routes (auth, products, orders, etc. will mount here later)
router.use("/health", healthRoutes);

// router.use("/auth", authRoutes);
// router.use("/products", productRoutes);
// router.use("/orders", orderRoutes);

export default router;
