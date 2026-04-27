import { Router } from "express";
import {
  getUserPreferenceByAnonymousIdController,
  updateUserPreferenceController,
  upsertUserPreferenceController,
} from "../controllers/userPreferenceController";
import { validateRequest } from "../middlewares/validateRequest";
import {
  anonymousIdParamSchema,
  createUserPreferenceSchema,
  updateUserPreferenceSchema,
} from "../schemas/userPreferenceSchemas";
import { asyncHandler } from "../utils/asyncHandler";

const userPreferenceRouter = Router();

userPreferenceRouter.get(
  "/:anonymousId",
  validateRequest({ params: anonymousIdParamSchema }),
  asyncHandler(getUserPreferenceByAnonymousIdController),
);

userPreferenceRouter.post(
  "/",
  validateRequest({ body: createUserPreferenceSchema }),
  asyncHandler(upsertUserPreferenceController),
);

userPreferenceRouter.patch(
  "/:anonymousId",
  validateRequest({
    params: anonymousIdParamSchema,
    body: updateUserPreferenceSchema,
  }),
  asyncHandler(updateUserPreferenceController),
);

export { userPreferenceRouter };
