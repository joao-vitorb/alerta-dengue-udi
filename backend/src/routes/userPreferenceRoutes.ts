import { Router } from "express";
import {
  getUserPreferenceByAnonymousIdController,
  updateUserPreferenceController,
  upsertUserPreferenceController,
} from "../controllers/userPreferenceController";

const userPreferenceRouter = Router();

userPreferenceRouter.get(
  "/:anonymousId",
  getUserPreferenceByAnonymousIdController,
);
userPreferenceRouter.post("/", upsertUserPreferenceController);
userPreferenceRouter.patch("/:anonymousId", updateUserPreferenceController);

export { userPreferenceRouter };
