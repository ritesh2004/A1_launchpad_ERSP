import { Router } from "express";
import userRouter from "./v1/user.routes.js";
import fileUploadRouter from "./v1/fileupload.routes.js";

const router = Router();

router.use("/users", userRouter);
router.use("/files", fileUploadRouter);

export default router;
