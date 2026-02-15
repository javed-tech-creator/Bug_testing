self.addEventListener("push", (event) => {
  console.log("🔔 Push event received in SW:", event);

  let data = {};
  if (event.data) data = event.data.json();

  const options = {
    body: data.body,
    icon: data.icon,
    image: data.image,       
    data: { url: data.url || "/" } 
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "Default title", options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";
  event.waitUntil(clients.openWindow(targetUrl));
});
