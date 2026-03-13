type DeliveryResult = {
  attempted: boolean;
  delivered: boolean;
  simulated: boolean;
  reason: string | null;
};

export type BrowserPushSubscriptionPayload = {
  anonymousId: string;
  subscription: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
    userAgent?: string;
  };
};

export type TestNotificationResponse = {
  anonymousId: string;
  neighborhood: string;
  alertsCount: number;
  email: DeliveryResult;
  push: DeliveryResult;
};
