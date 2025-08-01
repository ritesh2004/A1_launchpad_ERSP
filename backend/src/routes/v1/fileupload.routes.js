import { Router } from "express";
import { uploadFileController } from "../../controllers/fileupload.controllers.js";
import { multerUpload } from "../../microservices/fileupload.service.js";
import { authorizeUser } from "../../middlewares/authorize.middlewares.js";

const router = Router();

router.post("/upload", authorizeUser, multerUpload.single("image"), uploadFileController);

export default router;