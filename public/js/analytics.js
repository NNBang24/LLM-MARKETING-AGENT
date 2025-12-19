document.addEventListener('DOMContentLoaded', () => {

    const tableBody = document.querySelector('#history-table tbody');
    const averageRatingDiv = document.getElementById('average-rating'); 
    const totalContentSpan = document.getElementById('total-content'); 
    
    // Tính điểm trung bình từ tất cả đánh giá
    function calculateAverageRating(historyData) {
        let totalRating = 0;
        let count = 0;

        historyData.forEach(item => {
            if (item.Evaluations && item.Evaluations.length > 0) {
                item.Evaluations.forEach(ev => {
                    if (ev.rating !== null && !isNaN(ev.rating)) {
                        totalRating += parseInt(ev.rating);
                        count++;
                    }
                });
            }
        });

        if (count > 0) {
            const average = (totalRating / count).toFixed(2);
            averageRatingDiv.textContent = `${average} / 5.0 (${count} lượt đánh giá)`;
        } else {
            averageRatingDiv.textContent = 'Chưa có đủ lượt đánh giá để tính trung bình.';
        }

        if (totalContentSpan) {
            totalContentSpan.textContent = historyData.length;
        }
    }

    async function loadHistoryData() {
        const COL_COUNT = 8;
        tableBody.innerHTML = `<tr><td colspan="${COL_COUNT}" style="text-align: center;">Đang tải dữ liệu lịch sử...</td></tr>`;
        if (averageRatingDiv) averageRatingDiv.textContent = 'Đang tính toán thống kê...';

        try {
            const response = await fetch('/api/history-data'); 
            const data = await response.json();

            tableBody.innerHTML = ''; // Xóa trạng thái loading

            if (data.success && data.history) {
                calculateAverageRating(data.history);

                if (data.history.length === 0) {
                    tableBody.innerHTML = `<tr><td colspan="${COL_COUNT}" style="text-align: center;">Chưa có nội dung nào được tạo.</td></tr>`;
                    return;
                }

                data.history.forEach(item => {
                    const row = tableBody.insertRow();
                    const formattedDate = new Date(item.createdAt).toLocaleDateString('vi-VN');

                    // 1. ID
                    row.insertCell().textContent = item.id;
                    // 2. Nội dung
                    row.insertCell().textContent = item.content.substring(0, 100) + '...';
                    // 3. Ratings (nếu nhiều đánh giá, ghép lại)
                    const ratings = item.Evaluations.map(ev => ev.rating).join(', ') || 'Chưa ĐG';
                    row.insertCell().textContent = ratings + ' ⭐';
                    // 4. Feedbacks
                    const feedbacks = item.Evaluations.map(ev => ev.feedback).join('; ') || '-';
                    row.insertCell().textContent = feedbacks;
                    // 5. Ngày tạo
                    row.insertCell().textContent = formattedDate;
                });

            } else {
                tableBody.innerHTML = `<tr><td colspan="${COL_COUNT}">Lỗi tải dữ liệu: ${data.error || 'Không xác định'}</td></tr>`;
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
