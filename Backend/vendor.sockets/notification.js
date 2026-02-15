export const initSockets = (io) => {
io.on("connection", (socket) => {
console.log("Socket connected:", socket.id);


socket.on("joinVendor", (vendorId) => {
if (!vendorId) return;
socket.join(String(vendorId));
console.log(`Joined vendor room: ${vendorId}`);
});


socket.on("disconnect", () => {
console.log("Socket disconnected:", socket.id);
});
});
};