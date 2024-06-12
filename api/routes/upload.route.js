import express from "express";
import uploadController from "../controllers/upload.controller.js";
import multerConfig from "../multerConfig.js";

const router = express.Router();

// Define the route for file upload
router.post(
  "/upload",
  multerConfig.single("file"),
  uploadController.uploadFile
);

export default router;
