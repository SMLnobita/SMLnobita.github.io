# Trạm Giám Sát GenX

## Giới Thiệu Dự Án

Trạm GenX là hệ thống giám sát môi trường thời gian thực được thiết kế để theo dõi nhiệt độ, độ ẩm và mức độ khí gas. Ứng dụng lấy dữ liệu từ Firebase và hiển thị qua bảng điều khiển trực quan với các số liệu và biểu đồ theo thời gian thực.

### Tính Năng:

- **Giám sát dữ liệu theo thời gian thực** cho nhiệt độ, độ ẩm và mức độ khí gas
- **Biểu đồ trực quan động** với khả năng tự động điều chỉnh tỷ lệ
- **Hệ thống cảnh báo** cho mức độ khí gas nguy hiểm
- **Thiết kế đáp ứng** hoạt động tốt trên điện thoại di động, máy tính bảng và máy tính để bàn

## Công Nghệ Sử Dụng

- HTML5, CSS3 và JavaScript
- [Chart.js](https://www.chartjs.org/) - Để hiển thị dữ liệu trực quan
- [Firebase Realtime Database](https://firebase.google.com/products/realtime-database) - Lưu trữ dữ liệu thời gian thực
- [Font Awesome](https://fontawesome.com/) - Cung cấp biểu tượng

## Cấu Trúc Dự Án

- `index.html` - Cấu trúc HTML chính
- `styles.css` - CSS định dạng giao diện
- `script.js` - Chức năng JavaScript bao gồm tích hợp Firebase và thực hiện Chart.js

## Chi Tiết Tính Năng

### Giám Sát Thời Gian Thực
Hệ thống cung cấp cập nhật theo thời gian thực cho:
- Nhiệt độ (°C)
- Độ ẩm (%)
- Mức độ khí gas (ppm)

### Hệ Thống Cảnh Báo
Giám sát khí gas bao gồm ba mức cảnh báo:
- **An toàn**: Mức khí gas dưới 300 ppm
- **Cảnh báo**: Mức khí gas từ 300-700 ppm
- **Nguy hiểm**: Mức khí gas trên 700 ppm

### Biểu Đồ Tương Tác
- Hiển thị lịch sử gần đây của cả ba chỉ số
- Hiển thị ngưỡng cảnh báo và nguy hiểm cho mức khí gas
- Tự động điều chỉnh tỷ lệ dựa trên giá trị dữ liệu

## Cài Đặt Firebase

1. Tạo dự án Firebase
2. Thiết lập cơ sở dữ liệu Realtime Database
3. Cấu hình với cấu trúc sau:
   ```
   sensor/
     ├── temp: 0
     ├── humid: 0
     └── gas: 0
   ```

## Giấy Phép

Phân phối theo Giấy phép MIT.
