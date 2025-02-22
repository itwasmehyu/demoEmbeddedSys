// #include <Arduino.h>  // Thêm thư viện Arduino Core

// #define LED_PIN D1    // Sử dụng chân D1
// #define ANALOG_PIN A0 // Sử dụng chân A0

// void setup() {
//   Serial.begin(115200);  // Khởi tạo Serial Monitor
//   pinMode(LED_PIN, OUTPUT);  // Cấu hình chân LED_PIN là OUTPUT
// }

// void loop() {
//   // Phát xung LED hồng ngoại
//   digitalWrite(LED_PIN, LOW);  // Bật LED
//   delayMicroseconds(280);      // Đợi 280 micro giây
  
//   int sensorValue = analogRead(ANALOG_PIN);  // Đọc giá trị từ cảm biến
  
//   digitalWrite(LED_PIN, HIGH);  // Tắt LED
//   delayMicroseconds(9680);      // Đợi 9680 micro giây
  
//   // Tính toán nồng độ bụi (mg/m³)
//   float voltage = sensorValue * (3.3 / 1024.0);  // Chuyển đổi giá trị analog sang điện áp
//   float dustDensity = (voltage - 0.1) * 1000.0 / 0.5;  // Tính toán nồng độ bụi

//   // Hiển thị kết quả lên Serial Monitor
//   Serial.print("Nồng độ bụi (PM2.5): ");
//   Serial.print(dustDensity);
//   Serial.println(" µg/m³");
  
//   delay(1000);  // Đợi 1 giây trước khi lặp lại
// }

#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

// Thông tin WiFi
const char* ssid = "Ngoc Huan";       // Thay thế bằng tên WiFi của bạn
const char* password = "0915961858"; // Thay thế bằng mật khẩu WiFi của bạn

// Địa chỉ máy chủ web
const char* serverUrl = "http://192.168.102.8:3030/api/dust"; // Thay thế bằng địa chỉ máy chủ của bạn

// Chân kết nối cảm biến
#define LED_PIN D1    // Sử dụng chân D1
#define ANALOG_PIN A0 // Sử dụng chân A0

// Định nghĩa hàm sendDataToServer trước khi gọi
void sendDataToServer(float dustDensity) {
  // Kiểm tra kết nối WiFi
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    WiFiClient client;

    // Tạo yêu cầu POST
    http.begin(client, serverUrl);
    http.addHeader("Content-Type", "application/json");

    // Tạo dữ liệu JSON
    String jsonData = "{\"dust_density\":" + String(dustDensity) + "}";

    // Gửi yêu cầu POST
    int httpResponseCode = http.POST(jsonData);
    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("Error sending data: ");
      Serial.println(httpResponseCode);
    }

    // Đóng kết nối
    http.end();
  } else {
    Serial.println("WiFi disconnected");
  }
}

void setup() {
  // Khởi tạo Serial Monitor
  Serial.begin(115200);

  // Cấu hình chân LED
  pinMode(LED_PIN, OUTPUT);

  // Kết nối WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

void loop() {
  // Phát xung LED hồng ngoại
  digitalWrite(LED_PIN, LOW);  // Bật LED
  delayMicroseconds(280);      // Đợi 280 micro giây
  
  int sensorValue = analogRead(ANALOG_PIN);  // Đọc giá trị từ cảm biến
  
  digitalWrite(LED_PIN, HIGH);  // Tắt LED
  delayMicroseconds(9680);      // Đợi 9680 micro giây
  
  // Tính toán nồng độ bụi (mg/m³)
  float voltage = sensorValue * (3.3 / 1024.0);  // Chuyển đổi giá trị analog sang điện áp
  float dustDensity = (voltage - 0.1) * 1000.0 / 0.5;  // Tính toán nồng độ bụi

  // Hiển thị kết quả lên Serial Monitor
  Serial.print("Nồng độ bụi (PM2.5): ");
  Serial.print(dustDensity);
  Serial.println(" µg/m³");

  // Gửi dữ liệu lên máy chủ web
  sendDataToServer(dustDensity);
  
  delay(1000);  // Đợi 1 giây trước khi lặp lại
}