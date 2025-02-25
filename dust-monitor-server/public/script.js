// const ctx = document.getElementById('dustChart').getContext('2d');
// const dustChart = new Chart(ctx, {
//   type: 'line',
//   data: {
//     labels: [], // Thời gian
//     datasets: [{
//       label: 'Dust Density (µg/m³)',
//       data: [], // Dữ liệu nồng độ bụi
//       borderColor: 'rgba(75, 192, 192, 1)',
//       borderWidth: 1
//     }]
//   },
//   options: {
//     scales: {
//       y: {
//         beginAtZero: true
//       }
//     }
//   }
// });

// // Hàm cập nhật dữ liệu
// async function updateData() {
//   const response = await fetch('/api/dust');
//   const data = await response.json();

//   // Cập nhật nhãn và dữ liệu
//   dustChart.data.labels = data.map(entry => new Date(entry.timestamp).toLocaleTimeString());
//   dustChart.data.datasets[0].data = data.map(entry => entry.dust_density);

//   // Giới hạn số lượng mốc thời gian hiển thị
//   if (dustChart.data.labels.length > 10) {
//     dustChart.data.labels = dustChart.data.labels.slice(-10); // Giữ lại 10 giá trị cuối cùng
//     dustChart.data.datasets[0].data = dustChart.data.datasets[0].data.slice(-10);
//   }

//   // Cập nhật biểu đồ
//   dustChart.update();
// }

// // Cập nhật dữ liệu mỗi 5 giây
// setInterval(updateData, 5000);


// Khởi tạo biểu đồ Chart.js
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
                beginAtZero: true, // Biểu đồ luôn bắt đầu từ 0
                min: 0 // Ngăn hiển thị giá trị âm trên biểu đồ
            }
        }
    }
});

// Hàm cập nhật dữ liệu từ API
async function updateData() {
    try {
        const response = await fetch('/api/dust');
        const data = await response.json();

        // Lấy giá trị nồng độ bụi mới nhất và giới hạn tối thiểu là 0
        let latestValue = data[data.length - 1]?.dust_density || 0;
        latestValue = Math.max(0, latestValue); // Giới hạn giá trị tối thiểu là 0

        // Cập nhật ô hiển thị giá trị nồng độ bụi
        const valueBox = document.getElementById('dustValueBox');
        valueBox.textContent = `${latestValue.toFixed(1)} µg/m³`;

        // Kiểm tra và hiển thị cảnh báo nếu nồng độ bụi > 150
        const warningIcon = document.getElementById('warningIcon');
        if (latestValue > 150) {
            warningIcon.style.display = 'inline-block';
            valueBox.style.backgroundColor = '#ffcccc'; // Đổi màu ô cảnh báo
        } else {
            warningIcon.style.display = 'none';
            valueBox.style.backgroundColor = '#e0f7fa'; // Màu ô bình thường
        }

        // Cập nhật dữ liệu biểu đồ
        dustChart.data.labels = data.map(entry => new Date(entry.timestamp).toLocaleTimeString());
        dustChart.data.datasets[0].data = data.map(entry => Math.max(0, entry.dust_density)); // Không hiển thị giá trị âm

        // Giới hạn số lượng mốc thời gian hiển thị
        if (dustChart.data.labels.length > 10) {
            dustChart.data.labels = dustChart.data.labels.slice(-10);
            dustChart.data.datasets[0].data = dustChart.data.datasets[0].data.slice(-10);
        }

        // Cập nhật biểu đồ
        dustChart.update();

    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ API:', error);
    }
}

// Cập nhật dữ liệu mỗi 5 giây
setInterval(updateData, 2000);
