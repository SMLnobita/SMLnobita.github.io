// Firebase config
const firebaseConfig = {
  databaseURL: "https://dht11-51c19-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const ref = db.ref("sensor");

// Điều chỉnh kích thước điểm dựa vào kích thước màn hình
const isMobile = window.innerWidth < 768;
const pointRadius = isMobile ? 3 : 4;
const pointHoverRadius = isMobile ? 5 : 6;
const pointHitRadius = isMobile ? 12 : 15;

// Khởi tạo biểu đồ
const ctx = document.getElementById('chart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      {
        label: 'Nhiệt độ (°C)',
        data: [],
        borderColor: '#ff6384',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: '#ff6384',
        tension: 0.3,
        fill: false,
        pointRadius: pointRadius,
        pointHoverRadius: pointHoverRadius,
        pointHitRadius: pointHitRadius,
        yAxisID: 'y'
      },
      {
        label: 'Độ ẩm (%)',
        data: [],
        borderColor: '#36a2eb',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: '#36a2eb',
        tension: 0.3,
        fill: false,
        pointRadius: pointRadius,
        pointHoverRadius: pointHoverRadius,
        pointHitRadius: pointHitRadius,
        yAxisID: 'y'
      },
      {
        label: 'Gas',
        data: [],
        borderColor: '#4bc0c0',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: '#4bc0c0',
        tension: 0.3,
        fill: false,
        pointRadius: pointRadius,
        pointHoverRadius: pointHoverRadius,
        pointHitRadius: pointHitRadius,
        yAxisID: 'y1'
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        type: 'linear',
        position: 'left',
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: isMobile ? 8 : 11
          }
        },
        title: {
          display: true,
          text: 'Nhiệt độ (°C) / Độ ẩm (%)',
          font: {
            size: isMobile ? 8 : 10
          }
        }
      },
      y1: {
        type: 'linear',
        position: 'right',
        beginAtZero: true,
        max: 1000,
        grid: {
          drawOnChartArea: false
        },
        ticks: {
          font: {
            size: isMobile ? 8 : 11
          }
        },
        title: {
          display: true,
          text: 'Gas (ppm)',
          font: {
            size: isMobile ? 8 : 10
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          maxRotation: 45,
          font: {
            size: isMobile ? 8 : 10
          }
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: isMobile ? 10 : 15,
          padding: isMobile ? 5 : 10,
          font: {
            size: isMobile ? 10 : 12
          }
        }
      },
      tooltip: {
        enabled: true,
        mode: 'nearest',
        intersect: false,
        axis: 'xy',
        titleFont: {
          size: isMobile ? 10 : 12
        },
        bodyFont: {
          size: isMobile ? 10 : 12
        },
        padding: isMobile ? 6 : 10
      }
    },
    interaction: {
      mode: 'nearest',
      intersect: false,
      axis: 'xy'
    },
    animation: {
      duration: 700
    }
  }
});

// Biến toàn cục để theo dõi trạng thái hiển thị đường mức gas
let mouseOnGas = false;

/**
 * Vẽ các đường mức cảnh báo và nguy hiểm cho gas
 */
function drawGasThresholds() {
  if (!mouseOnGas) return;
  
  const yAxis = chart.scales.y1;
  const chartRight = chart.chartArea.right;
  const chartLeft = chart.chartArea.left;
  
  if (!yAxis) return;
  
  const ctx = chart.ctx;
  const width = 60;
  const startX = chartRight - width;
  
  // Vẽ đường cho mức cảnh báo (300)
  const warningY = yAxis.getPixelForValue(300);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(startX, warningY);
  ctx.lineTo(chartRight, warningY);
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(243, 156, 18, 0.5)';
  ctx.setLineDash([5, 5]);
  ctx.stroke();
  
  // Thêm nhãn mức cảnh báo ở bên trái gần khu vực nhiệt độ
  ctx.fillStyle = 'rgba(243, 156, 18, 0.8)';
  ctx.font = (isMobile ? '8px' : '10px') + ' Quicksand';
  ctx.textAlign = 'left';
  ctx.fillText('Cảnh báo (300)', chartLeft + 10, warningY - 5);
  ctx.setLineDash([]);
  ctx.restore();
  
  // Vẽ đường cho mức nguy hiểm (700)
  const dangerY = yAxis.getPixelForValue(700);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(startX, dangerY);
  ctx.lineTo(chartRight, dangerY);
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(231, 76, 60, 0.5)';
  ctx.setLineDash([5, 5]);
  ctx.stroke();
  
  // Thêm nhãn mức nguy hiểm ở bên trái gần khu vực nhiệt độ
  ctx.fillStyle = 'rgba(231, 76, 60, 0.8)';
  ctx.font = (isMobile ? '8px' : '10px') + ' Quicksand';
  ctx.textAlign = 'left';
  ctx.fillText('Nguy hiểm (700)', chartLeft + 10, dangerY - 5);
  ctx.setLineDash([]);
  ctx.restore();
}

/**
 * Cập nhật dữ liệu biểu đồ
 */
function updateChart(temp, humid, gas, time) {
  const MAX_POINTS = 5;
  
  // Sử dụng cách cập nhật dữ liệu của code gốc
  if (chart.data.labels.length >= MAX_POINTS) {
    // Nếu đã đạt giới hạn, tạo sao chép mảng và loại bỏ điểm đầu tiên
    const newLabels = [...chart.data.labels.slice(1), time];
    const newTemp = [...chart.data.datasets[0].data.slice(1), temp];
    const newHumid = [...chart.data.datasets[1].data.slice(1), humid];
    const newGas = [...chart.data.datasets[2].data.slice(1), gas];
    
    // Gán lại toàn bộ mảng dữ liệu mới
    chart.data.labels = newLabels;
    chart.data.datasets[0].data = newTemp;
    chart.data.datasets[1].data = newHumid;
    chart.data.datasets[2].data = newGas;
  } else {
    // Nếu chưa đạt giới hạn, thêm điểm mới như bình thường
    chart.data.labels.push(time);
    chart.data.datasets[0].data.push(temp);
    chart.data.datasets[1].data.push(humid);
    chart.data.datasets[2].data.push(gas);
  }
  
  // Động chỉnh lại max của trục y1 (gas) dựa trên giá trị hiện tại
  const maxGasValue = Math.max(...chart.data.datasets[2].data);
  if (maxGasValue > 700) {
    chart.options.scales.y1.max = Math.ceil(maxGasValue / 100) * 100;
  } else if (maxGasValue > 300) {
    chart.options.scales.y1.max = 800;
  } else if (maxGasValue > 0) {
    chart.options.scales.y1.max = 400;
  } else {
    chart.options.scales.y1.max = 1000;
  }
  
  // Cập nhật chart với animation đầy đủ
  chart.update();
}

/**
 * Cập nhật trạng thái gas dựa vào ngưỡng
 */
function updateGasStatus(gas) {
  const gasElement = document.getElementById("gas");
  const gasStatusElement = document.getElementById("gas-status");
  
  // Hiển thị giá trị gas
  gasElement.innerText = gas;
  
  // Cập nhật trạng thái gas dựa vào ngưỡng
  if (gas > 700) {
    gasElement.className = "value gas-danger";
    gasStatusElement.innerText = "NGUY HIỂM";
    gasStatusElement.className = "gas-status gas-danger";
  } else if (gas > 300) {
    gasElement.className = "value gas-warning";
    gasStatusElement.innerText = "CẢNH BÁO";
    gasStatusElement.className = "gas-status gas-warning";
  } else {
    gasElement.className = "value gas-safe";
    gasStatusElement.innerText = "An toàn";
    gasStatusElement.className = "gas-status gas-safe";
  }
}

// Xử lý sự kiện thay đổi kích thước màn hình
window.addEventListener('resize', function() {
  const newIsMobile = window.innerWidth < 768;
  
  // Chỉ cập nhật nếu trạng thái mobile thay đổi
  if (newIsMobile !== isMobile) {
    location.reload(); // Tải lại trang để cập nhật tất cả cài đặt
  }
});

// Theo dõi vị trí chuột trên canvas
const chartCanvas = document.getElementById('chart');

chartCanvas.addEventListener('mousemove', function(event) {
  const rect = this.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  // Kiểm tra xem chuột có nằm trong khu vực trục Gas không
  const chartRight = chart.chartArea.right;
  const chartTop = chart.chartArea.top;
  const chartBottom = chart.chartArea.bottom;
  
  mouseOnGas = x >= chartRight - 60 && 
              x <= chartRight + 30 && 
              y >= chartTop && 
              y <= chartBottom;
  
  // Vẽ lại chart
  chart.draw();
});

chartCanvas.addEventListener('mouseout', function() {
  mouseOnGas = false;
  chart.draw();
});

// Ghi đè phương thức draw của Chart.js để thêm các đường mức gas
const originalDraw = Chart.prototype.draw;
Chart.prototype.draw = function() {
  originalDraw.apply(this, arguments);
  drawGasThresholds();
};

// Cập nhật dữ liệu từ Firebase
ref.on("value", (snapshot) => {
  const data = snapshot.val();
  if (!data) return;
  
  const temp = data.temp ?? 0;
  const humid = data.humid ?? 0;
  const gas = parseFloat(data.gas ?? 0);
  const time = new Date().toLocaleTimeString();
  
  // Cập nhật hiển thị nhiệt độ và độ ẩm
  document.getElementById("temp").innerText = temp + " °C";
  document.getElementById("humid").innerText = humid + " %";
  
  // Cập nhật hiển thị gas
  updateGasStatus(gas);
  
  // Cập nhật thời gian
  document.getElementById("update-time").innerText = time;
  
  // Cập nhật biểu đồ
  updateChart(temp, humid, gas, time);
});