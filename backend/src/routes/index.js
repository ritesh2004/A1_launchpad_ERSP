import { Router } from "express";
import userRouter from "./v1/user.routes.js";
import fileUploadRouter from "./v1/fileupload.routes.js";
import repairReqRouter from "./v1/repairReq.routes.js";

const router = Router();

router.use("/users", userRouter);
router.use("/files", fileUploadRouter);
router.use("/repair-requests", repairReqRouter);

// Handle 404 for undefined routes
router.use((req, res) => {
    res.status(404).json({ message: "Not Found" });
});

export default router;
