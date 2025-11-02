import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();

router.post("/sync", userController.createOrUpdateUser);
router.get("/:clerkId", userController.getUserByClerkId);

export default router;
