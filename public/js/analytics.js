

document.addEventListener('DOMContentLoaded', () => {

    const tableBody = document.querySelector('#history-table tbody');
    const averageRatingDiv = document.getElementById('average-rating'); 
    const totalContentSpan = document.getElementById('total-content'); 
    
    function calculateAverageRating(historyData) {
        let totalRating = 0;
        let count = 0;

        historyData.forEach(item => {
            // Đảm bảo item.rating là số và không null
            if (item.rating !== null && !isNaN(item.rating)) { 
                totalRating += parseInt(item.rating);
                count++;
            }
        });

        if (count > 0) {
            const average = (totalRating / count).toFixed(2);
            // Hiển thị điểm trung bình
            averageRatingDiv.textContent = `${average} / 5.0 (${count} lượt đánh giá)`;
        } else {
            averageRatingDiv.textContent = 'Chưa có đủ lượt đánh giá để tính trung bình.';
        }
        
        if (totalContentSpan) {
            totalContentSpan.textContent = historyData.length;
        }
    }

    async function loadHistoryData() {
        // SỬA LỖI: Cập nhật colspan thành 8
        const COL_COUNT = 8;
        const loadingRow = `<tr><td colspan="${COL_COUNT}" style="text-align: center;">Đang tải dữ liệu lịch sử... Vui lòng chờ.</td></tr>`;
        
        tableBody.innerHTML = loadingRow;
        if (averageRatingDiv) averageRatingDiv.textContent = 'Đang tính toán thống kê...';

        try {
            const response = await fetch('/api/history-data'); 
            const data = await response.json();

            tableBody.innerHTML = ''; // Xóa trạng thái tải

            if (data.success && data.history) {
                calculateAverageRating(data.history);

                if (data.history.length === 0) {
                    tableBody.innerHTML = `<tr><td colspan="${COL_COUNT}" style="text-align: center;">Chưa có nội dung nào được tạo.</td></tr>`;
                    return;
                }
                
                data.history.forEach(item => {
                    let productInfo = { product: 'N/A', goal: 'N/A', audience: 'N/A' };
                    try {
                         productInfo = JSON.parse(item.product_info); 
                    } catch (e) {
                        console.warn('Lỗi phân tích product_info:', e);
                    }

                    const row = tableBody.insertRow();
                    
                    const formattedDate = new Date(item.created_at).toLocaleDateString('vi-VN');

                    // ĐỒNG BỘ HÓA THỨ TỰ CỘT (Tổng cộng 8 cột)
                    
                    // 1. ID
                    row.insertCell().textContent = item.id;
                  
                    row.insertCell().textContent = item.content.substring(0, 100) + '...'; 
                    // 6. Rating
                    row.insertCell().textContent = item.rating ? `${item.rating} ⭐` : 'Chưa ĐG';
                    // 7. Feedback
                    row.insertCell().textContent = item.feedback ? item.feedback.substring(0, 50) + '...' : '-';
                    // 8. Ngày tạo
                    row.insertCell().textContent = formattedDate;

                });
            } else {
                tableBody.innerHTML = `<tr><td colspan="${COL_COUNT}">Lỗi tải dữ liệu: ${data.error || 'Lỗi không xác định.'}</td></tr>`;
                if (averageRatingDiv) averageRatingDiv.textContent = 'Không thể tải dữ liệu thống kê.';
            }
        } catch (error) {
            console.error('Lỗi khi tải lịch sử:', error);
            tableBody.innerHTML = `<tr><td colspan="${COL_COUNT}">Lỗi kết nối server khi tải dữ liệu.</td></tr>`;
            if (averageRatingDiv) averageRatingDiv.textContent = 'Không thể tải dữ liệu thống kê.';
        }
    }

    loadHistoryData();
});