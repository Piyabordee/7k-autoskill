// Playwright Configuration สำหรับ 7K Skill Planner
// @ts-check

const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests/e2e',

    /* รันเทสใน headless mode เสมอ */
    use: {
        headless: true,
        viewport: { width: 1280, height: 720 },
        // ใช้ baseURL เพื่อให้สามารถโหลดไฟล์ HTML ได้
        baseURL: 'file:///c:/Users/snowb4ll/Documents/7k-autoskill/',
    },

    /* กำหนด timeout */
    timeout: 30 * 1000,
    expect: {
        timeout: 5000
    },
});
