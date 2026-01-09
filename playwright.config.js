// Playwright Configuration for Trading 212 K4 Converter
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './test/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 30000,
  reporter: [
    ['html'],
    ['list'],
    ['github']
  ],

  use: {
    baseURL: 'http://localhost:8000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Don't start web server here - GitHub Actions handles it
  // webServer: {
  //   command: 'python3 -m http.server 8000',
  //   port: 8000,
  //   reuseExistingServer: !process.env.CI,
  // },
});
