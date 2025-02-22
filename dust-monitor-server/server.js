const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Thêm thư viện path

const app = express();
const port = 3030;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Phục vụ file tĩnh từ thư mục 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Route cho đường dẫn gốc
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Lưu trữ dữ liệu (tối đa 10 giá trị)
let dustData = [];
const MAX_DATA_POINTS = 10; // Giới hạn số lượng mốc thời gian

// API để nhận dữ liệu từ ESP8266
app.post('/api/dust', (req, res) => {
  const { dust_density } = req.body;

  // Thêm dữ liệu mới
  dustData.push({ dust_density, timestamp: new Date() });

  // Giới hạn mảng chỉ chứa 10 giá trị gần nhất
  if (dustData.length > MAX_DATA_POINTS) {
    dustData = dustData.slice(-MAX_DATA_POINTS); // Giữ lại 10 giá trị cuối cùng
  }

  res.status(200).send('Data received');
});

// API để lấy dữ liệu hiển thị lên trang web
app.get('/api/dust', (req, res) => {
  res.json(dustData);
});

// Khởi động máy chủ
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});