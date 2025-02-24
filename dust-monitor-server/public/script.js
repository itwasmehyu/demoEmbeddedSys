
var map = L.map("map").setView([21.0285, 105.8542], 6); // Tọa độ mặc định (Hà Nội)
const elementMap = document.getElementById('map')
console.log(elementMap);
 // Thêm bản đồ nền từ OpenStreetMap
 L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
     attribution: "© OpenStreetMap contributors"
 }).addTo(map);
var sensors = { id: 1,dobui: 28, }
 // Kiểm tra nếu trình duyệt hỗ trợ Geolocation API
 if ("geolocation" in navigator) {
     navigator.geolocation.getCurrentPosition(
         function(position) {
             let lat = position.coords.latitude;
             let lng = position.coords.longitude;

             // Hiển thị vị trí của thiết bị lên bản đồ
             let marker = L.marker([lat, lng]).addTo(map)
                 .bindPopup(`
                    <b>Vị trí hiện tại:</b><br>Latitude: ${lat}<br>Longitude: ${lng}<br>
                    <b>Độ bụi: ${sensors.dobui}<br>
                `)
                 .openPopup();

             // Di chuyển bản đồ đến vị trí hiện tại
             map.setView([lat, lng], 14);
         },
         function(error) {
             console.error("Lỗi khi lấy vị trí:", error.message);
         }
     );
 } else {
     alert("Trình duyệt của bạn không hỗ trợ Geolocation API");
}