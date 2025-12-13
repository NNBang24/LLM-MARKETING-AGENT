// app.js

document.addEventListener('DOMContentLoaded', () => {
    const contentForm = document.getElementById('content-form');
    const evaluationForm = document.getElementById('evaluation-form');
    const resultArea = document.getElementById('result-area');
    const evaluationSection = document.getElementById('evaluation-section');
    const generateButton = document.getElementById('generate-button');
    const loadingStatus = document.getElementById('loading-status');

    let currentContentId = null;

    // 1. XỬ LÝ TẠO NỘI DUNG (GENERATION AGENT CALL)
    if (contentForm) {
        contentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Đặt trạng thái Loading & vô hiệu hóa nút
            resultArea.textContent = '';
            loadingStatus.textContent = 'Đang gọi AI Agent... Vui lòng chờ.';
            generateButton.disabled = true;
            evaluationSection.style.display = 'none';

            const product = document.getElementById('product').value;
            const audience = document.getElementById('audience').value;
            const goal = document.getElementById('goal').value;
            const tone = document.getElementById('tone').value;

            try {
                const response = await fetch('/api/generate-content', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ product, audience, goal, tone })
                });

                const data = await response.json();
                
                if (response.ok && data.success) {
                    resultArea.textContent = data.content;
                    
                    // Gán ID để chuẩn bị cho việc đánh giá
                    currentContentId = data.content_id || Math.floor(Math.random() * 1000) + 1; 
                    document.getElementById('content-id').value = currentContentId;
                    
                    evaluationSection.style.display = 'block';
                    loadingStatus.textContent = 'Tạo nội dung thành công!';

                } else {
                    resultArea.textContent = 'Lỗi: ' + (data.error || 'Lỗi không xác định từ Backend/API.');
                    loadingStatus.textContent = '';
                }
            } catch (error) {
                console.error('Lỗi kết nối Server:', error);
                resultArea.textContent = 'Lỗi kết nối Server. Vui lòng kiểm tra Node.js server.';
                loadingStatus.textContent = '';
            } finally {
                generateButton.disabled = false;
            }
        });
    }

    // 2. XỬ LÝ ĐÁNH GIÁ NỘI DUNG (EVALUATION)
    if (evaluationForm) {
        evaluationForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const content_id = document.getElementById('content-id').value;
            const rating = document.getElementById('rating').value;
            const feedback = document.getElementById('feedback').value;

            if (!content_id || !rating) {
                alert('Vui lòng chọn đánh giá.');
                return;
            }

            try {
                const response = await fetch('/api/save-evaluation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content_id, rating, feedback })
                });

                const data = await response.json();

                if (data.success) {
                    alert('Đánh giá đã được ghi nhận! Agent đã lưu phản hồi.');
                    evaluationForm.reset();
                    evaluationSection.style.display = 'none'; 
                    // Tùy chọn: Bạn có thể thêm logic gọi Agent chỉnh sửa ở đây
                } else {
                    alert('Lỗi khi gửi đánh giá: ' + (data.error || 'Lỗi không xác định.'));
                }
            } catch (error) {
                console.error('Lỗi khi gọi API đánh giá:', error);
                alert('Lỗi kết nối Server khi gửi đánh giá.');
            }
        });
    }
});