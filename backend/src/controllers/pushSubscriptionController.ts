import type { Request, Response } from "express";
import type { UpsertPushSubscriptionInput } from "../schemas/pushSubscriptionSchemas";
import {
  deletePushSubscription,
  upsertPushSubscription,
} from "../services/pushSubscriptionService";

export async function upsertPushSubscriptionController(
  request: Request,
  response: Response,
) {
  const result = await upsertPushSubscription(
    request.body as UpsertPushSubscriptionInput,
  );

  return response.status(200).json(result);
}

export async function deletePushSubscriptionController(
  request: Request,
  response: Response,
) {
  const { anonymousId } = request.params as { anonymousId: string };
  const result = await deletePushSubscription(anonymousId);

  return response.status(200).json(result);
}
