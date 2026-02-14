// ทดสอบฟังก์ชัน Utility สำหรับ 7K Skill Planner
// เทสฟังก์ชันที่สำคัญที่สุดในแอปพลิเคชัน

// โหลดฟังก์ชันจาก utils.js
const utils = require('../js/utils.js');

describe('🧪 ทดสอบฟังก์ชัน sanitizeInput', () => {
    test('✅ ควรลบ HTML tags ออกจากข้อความ', () => {
        const input = '<script>alert("XSS")</script>name';
        const result = utils.sanitizeInput(input);
        expect(result).not.toContain('<script>');
        expect(result).not.toContain('</script>');
    });

    test('✅ ควรรักษาตัวอักษรภาษาไทย', () => {
        const input = 'น้ำตกล';
        const result = utils.sanitizeInput(input);
        expect(result).toBe('น้ำตกล');
    });

    test('✅ ควรรักษาตัวอักษรภาษาอังกฤษ', () => {
        const input = 'Test Name';
        const result = utils.sanitizeInput(input);
        expect(result).toBe('Test Name');
    });

    test('✅ ควรป้องกัน XSS ด้วย event handler', () => {
        const input = '<img src=x onerror="alert(1)">';
        const result = utils.sanitizeInput(input);
        // ตรวจสอบว่าถูกแปลงเป็น HTML entities (ปลอดภัย)
        expect(result).toContain('&lt;');
        expect(result).toContain('&gt;');
        // ตรวจสอบว่าไม่มี < > จริงๆ (ไม่ใช่ HTML tags)
        expect(result).not.toContain('<img');
    });

    test('✅ ควรจัดการกับข้อความว่าง', () => {
        const result = utils.sanitizeInput('');
        expect(result).toBe('');
    });

    test('✅ ควรจัดการกับ null (เปลี่ยนเป็นสตริงว่าง)', () => {
        const result = utils.sanitizeInput(null);
        expect(result).toBe('');
    });

    test('✅ ควรจัดการกับ undefined (เปลี่ยนเป็นสตริงว่าง)', () => {
        const result = utils.sanitizeInput(undefined);
        expect(result).toBe('');
    });
});

describe('🧮 ทดสอบฟังก์ชัน calculateUsedTier', () => {
    test('✅ สกิล 1 อัน = 0 เทียร์', () => {
        expect(utils.calculateUsedTier(1)).toBe(0);
    });

    test('✅ สกิล 2 อัน = 4 เทียร์', () => {
        expect(utils.calculateUsedTier(2)).toBe(4);
    });

    test('✅ สกิล 5 อัน = 16 เทียร์', () => {
        expect(utils.calculateUsedTier(5)).toBe(16);
    });

    test('✅ สกิล 10 อัน = 36 เทียร์', () => {
        expect(utils.calculateUsedTier(10)).toBe(36);
    });

    test('✅ สูงสุด 18 สกิล = 68 เทียร์', () => {
        expect(utils.calculateUsedTier(18)).toBe(68);
    });
});

describe('🎯 ทดสอบฟังก์ชัน calculateActualTier', () => {
    test('✅ ควรไม่เกิน maxTier', () => {
        // 19 สกิล = 72 เทียร์ แต่ max คือ 70
        expect(utils.calculateActualTier(19, 70)).toBe(70);
    });

    test('✅ ควรใช้ค่าปกติเมื่อไม่เกิน maxTier', () => {
        expect(utils.calculateActualTier(10, 70)).toBe(36);
    });

    test('✅ ควรใช้ค่าเริ่มต้น maxTier = 70', () => {
        expect(utils.calculateActualTier(20)).toBe(70);
    });
});

describe('✓ ทดสอบฟังก์ชัน hasSelectedSkills', () => {
    test('✅ ควรคืนค่า true เมื่อมีสกิล', () => {
        expect(utils.hasSelectedSkills([{id: 1}])).toBe(true);
        expect(utils.hasSelectedSkills([{id: 1}, {id: 2}])).toBe(true);
    });

    test('✅ ควรคืนค่า false เมื่อไม่มีสกิล', () => {
        expect(utils.hasSelectedSkills([])).toBe(false);
        expect(utils.hasSelectedSkills(null)).toBe(false);
        expect(utils.hasSelectedSkills(undefined)).toBe(false);
    });
});

describe('📝 ทดสอบฟังก์ชัน generateFileName', () => {
    test('✅ ควรสร้างชื่อไฟล์ที่ถูกต้องสำหรับชื่อภาษาไทย', () => {
        const result = utils.generateFileName('น้ำตกล', 36);
        expect(result).toBe('น้ำตกล_จบ36_70.png');
    });

    test('✅ ควรสร้างชื่อไฟล์ที่ถูกต้องสำหรับชื่อภาษาอังกฤษ', () => {
        const result = utils.generateFileName('Knight', 16);
        expect(result).toBe('Knight_จบ16_70.png');
    });

    test('✅ ควรแทนที่อักขระพิเศษด้วย underscore', () => {
        const result = utils.generateFileName('Test@#$%Name', 0);
        expect(result).toBe('Test____Name_จบ0_70.png');
    });

    test('✅ ควรจัดการกับชื่อว่าง', () => {
        const result = utils.generateFileName('', 4);
        expect(result).toBe('_จบ4_70.png');
    });

    test('✅ ชื่อไฟล์ต้องลงท้ายด้วย .png', () => {
        const result = utils.generateFileName('Test', 8);
        expect(result).toMatch(/\.png$/);
    });
});

describe('✓ ทดสอบฟังก์ชัน isValidFileName', () => {
    test('✅ ชื่อไฟล์ปกติควรถูกต้อง', () => {
        expect(utils.isValidFileName('test.png')).toBe(true);
        expect(utils.isValidFileName('test_file.png')).toBe(true);
        expect(utils.isValidFileName('test-file.png')).toBe(true);
    });

    test('✅ ชื่อไฟล์ภาษาไทยควรถูกต้อง', () => {
        expect(utils.isValidFileName('น้ำตกล.png')).toBe(true);
    });

    test('✅ ชื่อไฟล์ที่มีอักขระอันตรายควรไม่ถูกต้อง', () => {
        expect(utils.isValidFileName('test<>.png')).toBe(false);
        expect(utils.isValidFileName('test|.png')).toBe(false);
        expect(utils.isValidFileName('test?.png')).toBe(false);
        expect(utils.isValidFileName('test:.png')).toBe(false);
    });
});

describe('📍 ทดสอบฟังก์ชัน calculateSkillPosition', () => {
    test('✅ ควรคำนวณตำแหน่งแถว 0 คอลัมน์ 0 ถูกต้อง', () => {
        const result = utils.calculateSkillPosition(0, 0);
        expect(result.x).toBe(347);
        expect(result.y).toBe(365);
    });

    test('✅ ควรคำนวณตำแหน่งแถว 0 คอลัมน์ 4 ถูกต้อง', () => {
        const result = utils.calculateSkillPosition(0, 4);
        expect(result.x).toBe(347 + 4 * 173); // 1039
        expect(result.y).toBe(365);
    });

    test('✅ ควรคำนวณตำแหน่งแถว 1 คอลัมน์ 0 ถูกต้อง', () => {
        const result = utils.calculateSkillPosition(1, 0);
        expect(result.x).toBe(347);
        expect(result.y).toBe(365 + 70); // 435
    });

    test('✅ ควรใช้ pattern ที่กำหนดเองได้', () => {
        const customPattern = { startX: 100, startY: 200, gapX: 50, gapY: 30 };
        const result = utils.calculateSkillPosition(1, 2, customPattern);
        expect(result.x).toBe(100 + 2 * 50); // 200
        expect(result.y).toBe(200 + 30); // 230
    });
});

describe('🎯 ทดสอบฟังก์ชัน isValidSkillPosition', () => {
    test('✅ ตำแหน่งปกติควรถูกต้อง', () => {
        expect(utils.isValidSkillPosition(0, 0)).toBe(true);
        expect(utils.isValidSkillPosition(0, 4)).toBe(true);
        expect(utils.isValidSkillPosition(1, 0)).toBe(true);
        expect(utils.isValidSkillPosition(1, 4)).toBe(true);
    });

    test('✅ ตำแหน่งเกินขอบเขตควรไม่ถูกต้อง', () => {
        expect(utils.isValidSkillPosition(-1, 0)).toBe(false);
        expect(utils.isValidSkillPosition(0, -1)).toBe(false);
        expect(utils.isValidSkillPosition(2, 0)).toBe(false);
        expect(utils.isValidSkillPosition(0, 5)).toBe(false);
    });

    test('✅ ควรใช้ค่า maxRows, maxCols ที่กำหนดเองได้', () => {
        expect(utils.isValidSkillPosition(2, 0, 3, 5)).toBe(true);
        expect(utils.isValidSkillPosition(3, 0, 3, 5)).toBe(false);
        expect(utils.isValidSkillPosition(0, 5, 3, 6)).toBe(true);
        expect(utils.isValidSkillPosition(0, 6, 3, 6)).toBe(false);
    });
});

describe('🔒 ทดสอบความปลอดภัย - XSS Prevention', () => {
    test('✅ ควรป้องกัน XSS ด้วย script tag', () => {
        const malicious = '<script>alert("XSS")</script>';
        const result = utils.sanitizeInput(malicious);
        // ตรวจสอบว่าถูกแปลงเป็น HTML entities
        expect(result).toContain('&lt;script&gt;');
        // ตรวจสอบว่าไม่มี script tags จริงๆ
        expect(result).not.toMatch(/<script>/i);
    });

    test('✅ ควรป้องกัน XSS ด้วย onerror event', () => {
        const malicious = '<img src="x" onerror="alert(1)">';
        const result = utils.sanitizeInput(malicious);
        // ตรวจสอบว่าถูกแปลงเป็น HTML entities
        expect(result).toContain('&lt;img');
        expect(result).not.toMatch(/<img/i);
    });

    test('✅ ควรป้องกัน XSS ด้วย onclick event', () => {
        const malicious = '<div onclick="alert(1)">Click</div>';
        const result = utils.sanitizeInput(malicious);
        // ตรวจสอบว่าไม่ใช่ HTML element จริง
        expect(result).not.toMatch(/<div/i);
    });

    test('✅ ควรป้องกัน XSS ด้วย javascript: protocol', () => {
        const malicious = '<a href="javascript:alert(1)">Link</a>';
        const result = utils.sanitizeInput(malicious);
        // ตรวจสอบว่าไม่ใช่ HTML element จริง
        expect(result).not.toMatch(/<a/i);
    });
});
