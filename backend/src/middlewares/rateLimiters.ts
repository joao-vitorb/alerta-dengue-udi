import rateLimit from "express-rate-limit";

const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;
const ONE_HOUR_MS = 60 * 60 * 1000;

const baseLimiterOptions = {
  standardHeaders: "draft-7" as const,
  legacyHeaders: false,
};

export const generalApiRateLimiter = rateLimit({
  ...baseLimiterOptions,
  windowMs: FIFTEEN_MINUTES_MS,
  limit: 300,
  message: {
    message: "Too many requests, please try again later.",
    details: null,
  },
});

export const notificationTestRateLimiter = rateLimit({
  ...baseLimiterOptions,
  windowMs: ONE_HOUR_MS,
  limit: 5,
  message: {
    message: "Too many test notifications. Try again in an hour.",
    details: null,
  },
});

export const pushSubscriptionRateLimiter = rateLimit({
  ...baseLimiterOptions,
  windowMs: FIFTEEN_MINUTES_MS,
  limit: 10,
  message: {
    message: "Too many push subscription requests. Try again later.",
    details: null,
  },
});

export const symptomCheckerRateLimiter = rateLimit({
  ...baseLimiterOptions,
  windowMs: FIFTEEN_MINUTES_MS,
  limit: 30,
  message: {
    message: "Too many symptom checks. Try again in a few minutes.",
    details: null,
  },
});
