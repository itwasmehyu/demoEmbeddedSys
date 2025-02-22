const ctx = document.getElementById('dustChart').getContext('2d');
const dustChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [], // Thời gian
    datasets: [{
      label: 'Dust Density (µg/m³)',
      data: [], // Dữ liệu nồng độ bụi
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

// Hàm cập nhật dữ liệu
async function updateData() {
  const response = await fetch('/api/dust');
  const data = await response.json();

  // Cập nhật nhãn và dữ liệu
  dustChart.data.labels = data.map(entry => new Date(entry.timestamp).toLocaleTimeString());
  dustChart.data.datasets[0].data = data.map(entry => entry.dust_density);

  // Giới hạn số lượng mốc thời gian hiển thị
  if (dustChart.data.labels.length > 10) {
    dustChart.data.labels = dustChart.data.labels.slice(-10); // Giữ lại 10 giá trị cuối cùng
    dustChart.data.datasets[0].data = dustChart.data.datasets[0].data.slice(-10);
  }

  // Cập nhật biểu đồ
  dustChart.update();
}

// Cập nhật dữ liệu mỗi 5 giây
setInterval(updateData, 5000);