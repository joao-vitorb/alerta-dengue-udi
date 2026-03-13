self.addEventListener("push", (event) => {
  const payload = event.data
    ? event.data.json()
    : {
        title: "Alerta Dengue UDI",
        body: "Nova atualização preventiva disponível.",
        url: "/",
      };

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      data: {
        url: payload.url || "/",
      },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        const existingClient = clientList[0];

        if (existingClient) {
          existingClient.navigate(targetUrl);
          return existingClient.focus();
        }

        return clients.openWindow(targetUrl);
      }),
  );
});
