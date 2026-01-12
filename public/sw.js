self.addEventListener("push", e => {
    if (!e.data) return;

    console.log("Push event received:", e);

    const data = e.data.json();

    self.registration.showNotification(
        data.title || "Notification",
        {
            body: data.body || ""
        }
    );
}); 
