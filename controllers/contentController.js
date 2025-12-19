const { GeneratedContent, Evaluation } = require('../models');
const llmAgent = require('../agents/llmAgent');

/* TẠO NỘI DUNG */
exports.generateContent = async (req, res) => {
    try {
        const { product, audience, goal, tone } = req.body;

        if (!product || !audience || !goal) {
            return res.status(400).json({
                success: false,
                error: 'Thiếu dữ liệu'
            });
        }

        const prompt = `
            Sản phẩm: ${product}
            Đối tượng: ${audience}
            Mục tiêu: ${goal}
            Phong cách: ${tone || 'chuyên nghiệp'}
        `;

        //  CHỈ GỌI AI – KHÔNG DB
        const content = await llmAgent.generateContent(prompt);

        // CHỈ CONTROLLER MỚI ĐƯỢC GHI DB
        const saved = await GeneratedContent.create({
            product_info: JSON.stringify(req.body), // FIX LỖI JSON
            content,
            status: 'Generated'
        });

        res.status(201).json({
            success: true,
            content,
            content_id: saved.id
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Lỗi server'
        });
    }
};

/* LƯU ĐÁNH GIÁ */
exports.saveEvaluation = async (req, res) => {
    try {
        const { content_id, rating, feedback } = req.body;

        await Evaluation.create({
            content_id,
            rating,
            feedback
        });

        res.json({
            success: true,
            message: 'Đã lưu đánh giá'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Lỗi lưu đánh giá'
        });
    }
};

/* CHỈNH SỬA NỘI DUNG */
exports.reviseContent = async (req, res) => {
    try {
        const { content_id, feedback } = req.body;

        const contentRecord = await GeneratedContent.findByPk(content_id);
        if (!contentRecord) {
            return res.status(404).json({
                success: false,
                error: 'Không tìm thấy nội dung'
            });
        }

        const revised = await llmAgent.generateContent(
            `Nội dung gốc: ${contentRecord.content}\nYêu cầu chỉnh sửa: ${feedback}`
        );

        await contentRecord.update({
            content: revised,
            status: 'Revised'
        });

        res.json({
            success: true,
            revised_content: revised
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Lỗi chỉnh sửa nội dung'
        });
    }
};

/* LỊCH SỬ */
exports.getHistory = async (req, res) => {
    try {
        const history = await GeneratedContent.findAll({
            include: [{ model: Evaluation }],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: history
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Lỗi lấy lịch sử'
        });
    }
};
