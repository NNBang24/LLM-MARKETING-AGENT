// app.js

document.addEventListener('DOMContentLoaded', () => {
    const contentForm = document.getElementById('content-form');
    const evaluationForm = document.getElementById('evaluation-form');
    const resultArea = document.getElementById('result-area');
    const evaluationSection = document.getElementById('evaluation-section');
    const generateButton = document.getElementById('generate-button');
    const loadingStatus = document.getElementById('loading-status');
    
    // THÊM CÁC THAM CHIẾU
    const contentIdInput = document.getElementById('content-id');
    const saveEvaluationButton = document.getElementById('save-evaluation-button');
    const reviseButton = document.getElementById('revise-button'); 

    let currentContentId = null;

    // Hàm chung để hiển thị trạng thái
    const setStatus = (message, isError = false) => {
        loadingStatus.textContent = message;
        loadingStatus.style.color = isError ? 'red' : 'green';
    };

    // =========================================================
    // 1. XỬ LÝ TẠO NỘI DUNG (GENERATION AGENT CALL)
    // Lắng nghe sự kiện CLICK trên nút tạo nội dung
    // =========================================================
    if (generateButton) { 
        generateButton.addEventListener('click', async (e) => {
            e.preventDefault(); 
            
            resultArea.textContent = '';
            setStatus('Đang gọi AI Agent... Vui lòng chờ.');
            generateButton.disabled = true;
            if (reviseButton) reviseButton.disabled = true;
            evaluationSection.style.display = 'none';

            const product = document.getElementById('product').value;
            const audience = document.getElementById('audience').value;
            const goal = document.getElementById('goal').value;
            const tone = document.getElementById('tone').value;
            
            // Kiểm tra dữ liệu bắt buộc
            if (!product || !audience || !goal) {
                 alert('Vui lòng điền đủ thông tin Sản phẩm, Đối tượng và Mục tiêu.');
                 generateButton.disabled = false;
                 return;
            }

            try {
                const response = await fetch('/api/generate-content', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ product, audience, goal, tone })
                });

                const data = await response.json();
                
                if (response.ok && data.success) {
                    resultArea.textContent = data.content;
                    
                    currentContentId = data.content_id; 
                    contentIdInput.value = currentContentId;
                    
                    evaluationSection.style.display = 'block';
                    setStatus('✅ Tạo nội dung thành công! Vui lòng đánh giá.', false);

                } else {
                    resultArea.textContent = 'Lỗi: ' + (data.error || 'Lỗi không xác định từ Backend/API.');
                    setStatus('❌ Tạo nội dung thất bại.', true);
                }
            } catch (error) {
                console.error('Lỗi kết nối Server:', error);
                resultArea.textContent = 'Lỗi kết nối Server. Vui lòng kiểm tra Node.js server.';
                setStatus('❌ Lỗi kết nối Server. Kiểm tra Terminal Node.js.', true);
            } finally {
                generateButton.disabled = false;
                if (reviseButton) reviseButton.disabled = false;
            }
        });
    }

    // =========================================================
    // 2. XỬ LÝ ĐÁNH GIÁ NỘI DUNG (EVALUATION)
    // =========================================================
    if (evaluationForm) {
        // Vẫn lắng nghe sự kiện submit để tận dụng HTML required validation
        evaluationForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const content_id = contentIdInput.value;
            const rating = document.getElementById('rating').value;
            const feedback = document.getElementById('feedback').value;

            if (!content_id || !rating) {
                alert('Vui lòng chọn đánh giá.');
                return;
            }
            
            // Logic lưu đánh giá (API 2)
            await saveEvaluation(content_id, rating, feedback);
        });
    }

    async function saveEvaluation(content_id, rating, feedback) {
        setStatus('Đang lưu đánh giá...');
        if (saveEvaluationButton) saveEvaluationButton.disabled = true;

        try {
            const response = await fetch('/api/save-evaluation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content_id, rating: parseInt(rating), feedback })
            });

            const data = await response.json();

            if (data.success) {
                setStatus('✅ Đánh giá đã được ghi nhận!.', false);
                // Giữ lại feedback cho chức năng chỉnh sửa
            } else {
                setStatus('❌ Lỗi khi gửi đánh giá: ' + (data.error || 'Lỗi không xác định.'), true);
            }
        } catch (error) {
            console.error('Lỗi khi gọi API đánh giá:', error);
            setStatus('❌ Lỗi kết nối Server khi gửi đánh giá.', true);
        } finally {
            if (saveEvaluationButton) saveEvaluationButton.disabled = false;
        }
    }


    // =========================================================
    // 3. XỬ LÝ TỰ CHỈNH SỬA (SELF-CORRECTION AGENT CALL)
    // =========================================================
    if (reviseButton) {
        reviseButton.addEventListener('click', async () => {
            const content_id = contentIdInput.value;
            const feedback = document.getElementById('feedback').value;

            if (!content_id) {
                alert('Vui lòng tạo nội dung trước.');
                return;
            }
            if (!feedback) {
                alert('Vui lòng nhập yêu cầu chỉnh sửa chi tiết vào ô phản hồi.');
                return;
            }
            
            await reviseContent(content_id, feedback);
        });
    }

    async function reviseContent(content_id, feedback) {
        setStatus('♻️ Đang gọi Agent chỉnh sửa nội dung...', false);
        if (reviseButton) reviseButton.disabled = true;
        if (generateButton) generateButton.disabled = true;

        try {
            const response = await fetch('/api/revise-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content_id, feedback })
            });

            const data = await response.json();

            if (data.success && data.revised_content) {
                resultArea.textContent = data.revised_content;
                setStatus('✅ Nội dung đã được Agent chỉnh sửa thành công!', false);
            } else {
                setStatus('❌ Lỗi chỉnh sửa: ' + (data.error || 'Không nhận được nội dung chỉnh sửa.'), true);
            }
        } catch (error) {
            console.error('Lỗi gọi API chỉnh sửa:', error);
            setStatus('❌ Lỗi kết nối Server khi yêu cầu chỉnh sửa.', true);
        } finally {
            if (reviseButton) reviseButton.disabled = false;
            if (generateButton) generateButton.disabled = false;
        }
    }

});