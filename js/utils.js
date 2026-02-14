// ฟังก์ชัน Utility สำหรับ 7K Skill Planner
// แยกออกมาจาก index.html เพื่อให้สามารถทดสอบได้

/**
 * ทำความสะอาดอินพุตเพื่อป้องกัน XSS
 * @param {string} input - ข้อความที่ต้องการทำความสะอาด
 * @returns {string} - ข้อความที่ปลอดภัย
 */
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

/**
 * คำนวณระดับเทียร์จากจำนวนสกิล
 * @param {number} skillCount - จำนวนสกิลที่เลือก
 * @returns {number} - ระดับเทียร์ที่ใช้
 */
function calculateUsedTier(skillCount) {
    return (skillCount - 1) * 4;
}

/**
 * คำนวณระดับเทียร์สูงสุด
 * @param {number} skillCount - จำนวนสกิลที่เลือก
 * @param {number} maxTier - เทียร์สูงสุด (ค่าเริ่มต้น 70)
 * @returns {number} - เทียร์ที่ใช้ (ไม่เกิน maxTier)
 */
function calculateActualTier(skillCount, maxTier = 70) {
    return Math.min(calculateUsedTier(skillCount), maxTier);
}

/**
 * ตรวจสอบว่ามีสกิลเลือกอย่างน้อย 1 อันหรือไม่
 * @param {Array} skills - อาร์เรย์ของสกิลที่เลือก
 * @returns {boolean} - true ถ้ามีสกิล, false ถ้าไม่มี
 */
function hasSelectedSkills(skills) {
    return !!(skills && skills.length > 0);
}

/**
 * สร้างชื่อไฟล์สำหรับดาวน์โหลด
 * @param {string} displayName - ชื่อตัวละคร
 * @param {number} usedTier - เทียร์ที่ใช้
 * @returns {string} - ชื่อไฟล์
 */
function generateFileName(displayName, usedTier) {
    // ทำความสะอาดชื่อ - ให้เฉพาะตัวอักษรภาษาไทย, อังกฤษ, และตัวเลข
    const sanitizedName = displayName.replace(/[^a-zA-Z0-9\u0E00-\u0E7Fก-๙]/g, "_");
    return `${sanitizedName}_จบ${usedTier}_70.png`;
}

/**
 * ตรวจสอบว่าชื่อไฟล์ถูกต้องหรือไม่
 * @param {string} filename - ชื่อไฟล์ที่ต้องการตรวจสอบ
 * @returns {boolean} - true ถ้าชื่อไฟล์ถูกต้อง
 */
function isValidFileName(filename) {
    // ชื่อไฟล์ต้องมีนามสกุล .png และไม่มีอักขระพิเศษที่อันตราย
    const validPattern = /^[^<>:"|?*\x00-\x1F]+\.png$/i;
    return validPattern.test(filename);
}

/**
 * คำนวณตำแหน่งสกิลบน Canvas จาก Pattern Settings
 * @param {number} row - แถวที่ (0-1)
 * @param {number} col - คอลัมน์ที่ (0-4)
 * @param {Object} pattern - PATTERN_SETTINGS
 * @returns {Object} - {x, y} ตำแหน่ง
 */
function calculateSkillPosition(row, col, pattern = null) {
    const defaultPattern = {
        startX: 347,
        startY: 365,
        gapX: 173,
        gapY: 70
    };

    const p = pattern || defaultPattern;
    return {
        x: p.startX + col * p.gapX,
        y: p.startY + row * p.gapY
    };
}

/**
 * ตรวจสอบว่าตำแหน่ง row, col ถูกต้องหรือไม่
 * @param {number} row - แถวที่
 * @param {number} col - คอลัมน์ที่
 * @param {number} maxRows - แถวสูงสุด (ค่าเริ่มต้น 2)
 * @param {number} maxCols - คอลัมน์สูงสุด (ค่าเริ่มต้น 5)
 * @returns {boolean} - true ถ้าตำแหน่งถูกต้อง
 */
function isValidSkillPosition(row, col, maxRows = 2, maxCols = 5) {
    return row >= 0 && row < maxRows && col >= 0 && col < maxCols;
}

// Export ฟังก์ชันทั้งหมดสำหรับการใช้งานและทดสอบ
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sanitizeInput,
        calculateUsedTier,
        calculateActualTier,
        hasSelectedSkills,
        generateFileName,
        isValidFileName,
        calculateSkillPosition,
        isValidSkillPosition
    };
}
