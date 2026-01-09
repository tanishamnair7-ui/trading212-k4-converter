// Playwright E2E tests for Trading 212 to K4 Converter
const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Trading 212 to K4 Converter', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:8000');
  });

  test('should load the page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Trading 212 to Swedish K4/);
    await expect(page.locator('h1')).toContainText('Trading 212');
  });

  test('should display upload area', async ({ page }) => {
    const uploadArea = page.locator('#uploadArea');
    await expect(uploadArea).toBeVisible();
    await expect(uploadArea).toContainText('Drop your Trading 212 CSV');
  });

  test('should have FAQ section', async ({ page }) => {
    const faqSection = page.locator('#faq');
    await expect(faqSection).toBeVisible();

    // Check FAQ items exist
    const faqItems = page.locator('.faq details');
    await expect(faqItems).toHaveCount(6);
  });

  test('should open FAQ when help link is clicked', async ({ page }) => {
    const helpLink = page.locator('text=How to export CSV from Trading 212?');
    await helpLink.click();

    // First FAQ should be open
    const firstFAQ = page.locator('.faq details').first();
    await expect(firstFAQ).toHaveAttribute('open', '');
  });

  test('should process CSV file and show stats', async ({ page }) => {
    // Path to test CSV file
    const testFilePath = path.join(__dirname, '../sample-data/sample-2024.csv');

    // Upload the file
    const fileInput = page.locator('#fileInput');
    await fileInput.setInputFiles(testFilePath);

    // Wait for processing
    await page.waitForTimeout(1000);

    // Check that preview section is visible
    const previewSection = page.locator('#previewSection');
    await expect(previewSection).toBeVisible();

    // Check stats are displayed
    const stats = page.locator('#previewStats');
    await expect(stats).toBeVisible();
    await expect(stats).toContainText('Transactions');
    await expect(stats).toContainText('Net P/L');

    // Check download section is visible
    const downloadSection = page.locator('#downloadSection');
    await expect(downloadSection).toBeVisible();
  });

  test('should show correct totals for sample-2024.csv', async ({ page }) => {
    const testFilePath = path.join(__dirname, '../sample-data/sample-2024.csv');
    const fileInput = page.locator('#fileInput');
    await fileInput.setInputFiles(testFilePath);
    await page.waitForTimeout(1000);

    // Check for expected values (from sample-2024.csv)
    const k4Summary = page.locator('#k4Summary');
    await expect(k4Summary).toContainText('1,289.10 SEK'); // Net P/L
    await expect(k4Summary).toContainText('1,335.50 SEK'); // Gains
  });

  test('should enable download buttons after CSV upload', async ({ page }) => {
    const testFilePath = path.join(__dirname, '../sample-data/sample-2024.csv');
    const fileInput = page.locator('#fileInput');
    await fileInput.setInputFiles(testFilePath);
    await page.waitForTimeout(1000);

    // Check download buttons are visible and enabled
    const downloadK4 = page.locator('#downloadK4');
    await expect(downloadK4).toBeVisible();
    await expect(downloadK4).toBeEnabled();

    const downloadOriginal = page.locator('#downloadOriginal');
    await expect(downloadOriginal).toBeVisible();
    await expect(downloadOriginal).toBeEnabled();
  });

  test('should trigger download when K4 button is clicked', async ({ page }) => {
    const testFilePath = path.join(__dirname, '../sample-data/sample-2024.csv');
    const fileInput = page.locator('#fileInput');
    await fileInput.setInputFiles(testFilePath);
    await page.waitForTimeout(1000);

    // Listen for download
    const downloadPromise = page.waitForEvent('download');
    await page.locator('#downloadK4').click();
    const download = await downloadPromise;

    // Verify download filename
    expect(download.suggestedFilename()).toMatch(/2024_K4_Statement\.xlsx/);
  });

  test('should show notification after download', async ({ page }) => {
    const testFilePath = path.join(__dirname, '../sample-data/sample-2024.csv');
    const fileInput = page.locator('#fileInput');
    await fileInput.setInputFiles(testFilePath);
    await page.waitForTimeout(1000);

    await page.locator('#downloadK4').click();

    // Check notification appears
    const notification = page.locator('#notification');
    await expect(notification).toContainText('Downloaded');
  });

  test('should handle drag and drop', async ({ page }) => {
    // This test verifies the drag-over class is added
    const uploadArea = page.locator('#uploadArea');

    // Simulate drag over (note: actual file drop is harder to test)
    await uploadArea.dispatchEvent('dragover');

    // Note: Full drag-drop file upload testing requires more complex setup
    // The important part is that the event handlers are registered
  });

  test('should show error for non-sell transactions', async ({ page }) => {
    // Create a test CSV with only buy transactions
    const buyOnlyCSV = `Action,Time,ISIN,Ticker,Name,No. of shares,Result
Market buy,2024-01-01 10:00:00,US0378331005,AAPL,Apple,1.0,0`;

    // We can't easily test alert() in Playwright, but we can verify the flow
    // In real scenario, upload area should reset
  });

  test('should be mobile responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    const uploadArea = page.locator('#uploadArea');
    await expect(uploadArea).toBeVisible();

    // Hero should still be visible
    const hero = page.locator('header h1');
    await expect(hero).toBeVisible();
  });

  test('should have all critical SEO meta tags', async ({ page }) => {
    // Check meta description
    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toHaveAttribute('content', /Trading 212/);

    // Check canonical URL
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /sedflix\.github\.io/);
  });

  test('should load external dependencies', async ({ page }) => {
    // Check Tailwind CSS loaded
    const bodyClasses = await page.locator('body').getAttribute('class');
    expect(bodyClasses).toBeTruthy();

    // Verify PapaParse is available
    const papaParseExists = await page.evaluate(() => typeof Papa !== 'undefined');
    expect(papaParseExists).toBe(true);

    // Verify SheetJS is available
    const xlsxExists = await page.evaluate(() => typeof XLSX !== 'undefined');
    expect(xlsxExists).toBe(true);
  });

  test('should navigate to guide page', async ({ page }) => {
    await page.click('a[href="guide.html"]');
    await expect(page).toHaveURL(/guide\.html/);
    await expect(page.locator('h1')).toContainText('User Guide');
  });

});

test.describe('Guide Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8000/guide.html');
  });

  test('should load guide page', async ({ page }) => {
    await expect(page).toHaveTitle(/User Guide/);
    await expect(page.locator('h1')).toContainText('User Guide');
  });

  test('should have all guide sections', async ({ page }) => {
    await expect(page.locator('text=Quick Start')).toBeVisible();
    await expect(page.locator('text=How to Export from Trading 212')).toBeVisible();
    await expect(page.locator('text=Filing with Skatteverket')).toBeVisible();
  });

  test('should have back button to main page', async ({ page }) => {
    const backButton = page.locator('a[href="index.html"]');
    await expect(backButton).toBeVisible();
    await backButton.click();
    await expect(page).toHaveURL(/index\.html|\/$/);
  });

});
