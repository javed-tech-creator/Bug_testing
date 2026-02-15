import express from "express";

import { authWithPermissions } from "../../../../middlewares/master/authMiddleware.js";
import { updateClientBasicDetails, updateLeadContactPersonDetails } from "../../controllers/common/modifyPreviousData.controller.js";

const modifyPreviousDataRouter = express.Router();

modifyPreviousDataRouter.patch("/client-info/:id", authWithPermissions(), updateClientBasicDetails);
modifyPreviousDataRouter.patch("/contact-person-info/:id", authWithPermissions(), updateLeadContactPersonDetails);

export default modifyPreviousDataRouter;
