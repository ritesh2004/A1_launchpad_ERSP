import { Router } from "express";
import { createRepairRequest, updateRepairRequest, getRepairRequestById, getAllRepairRequests } from "../../controllers/repairReq.controllers.js";
import { authorizeUser, authorizeServicer } from "../../middlewares/authorize.middlewares.js";
import { validateInput } from "../../middlewares/inputValidate.middlewares.js";
import { createRepairReqSchema,updateRepairReqSchema } from "../../schema/repairReq.schema.js";

const router = Router();

router.post("/create", authorizeUser, validateInput(createRepairReqSchema), createRepairRequest);
router.put("/:requestId", authorizeServicer, validateInput(updateRepairReqSchema), updateRepairRequest);
router.get("/:requestId", authorizeUser, getRepairRequestById);
router.get("/", authorizeServicer, getAllRepairRequests);

export default router;
