import { useEffect, useState } from "react";

const WebPushSubscriber = ({ user }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  // Convert base64 public key to Uint8Array
  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String?.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData?.length);

    for (let i = 0; i < rawData?.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Register service worker once
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => console.log("Service Worker registered"))
      .catch((err) => console.error("SW registration failed:", err));
  }, []);

  // Show floating prompt after short delay if not subscribed
  useEffect(() => {
    if (!user?.id) return;
    const saved = localStorage.getItem("webPushSubscribed");
    if (saved === "true") return;
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, [user]);

  const handleSubscribe = async () => {
    if (!user?.id) return console.error("User not found");
    setLoading(true);

    try {
      if (!("Notification" in window))
        return alert("Notifications not supported");
      const permission = await Notification.requestPermission();
      console.log("Permission:", permission);
      if (permission !== "granted") {
        setVisible(false);
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          import.meta.env.VITE_VAPID_PUBLIC_KEY
        ),
      });

      const res = await fetch(
        `${backendUrl}/api/v1/notification/subs/${user.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscription: sub }),
        }
      );
console.log(res)
      if (!res.ok) {
        const errData = await res.json();
        console.error("Subscription API failed:", errData);
      } else {
        localStorage.setItem("webPushSubscribed", "true");
        console.log("Web push subscription saved successfully");
      }
    } catch (err) {
      console.error("Web push subscription error:", err);
    } finally {
      setVisible(false);
      setLoading(false);
    }
  };

  if (!visible || !user) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-fadeIn">
      <div className="bg-neutral-900 text-white border border-neutral-700 rounded-md shadow-lg px-5 py-4 max-w-xs">
        <div className="font-semibold mb-1">Enable Notifications</div>
        <div className="text-sm text-neutral-300 mb-3">
          Get instant updates directly in your browser.
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setVisible(false)}
            className="text-sm px-3 py-1 rounded border border-neutral-500 hover:bg-neutral-800 transition"
          >
            Later
          </button>
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="text-sm px-3 py-1 rounded bg-white text-black hover:bg-neutral-200 transition"
          >
            {loading ? "Enabling..." : "Enable"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebPushSubscriber;
