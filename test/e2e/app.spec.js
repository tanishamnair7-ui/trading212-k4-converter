// Playwright E2E tests for Trading 212 to K4 Converter
const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Trading 212 to K4 Converter - Basic Tests', () => {

  test('page loads correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Trading 212/);
  });

  test('upload area is visible', async ({ page }) => {
    await page.goto('/');
    const uploadArea = page.locator('#uploadArea');
    await expect(uploadArea).toBeVisible();
  });

  test('has FAQ section', async ({ page }) => {
    await page.goto('/');
    const faq = page.locator('#faq');
    await expect(faq).toBeVisible();
  });

  test('external libraries load', async ({ page }) => {
    await page.goto('/');

    // Check PapaParse loaded
    const hasPapa = await page.evaluate(() => typeof Papa !== 'undefined');
    expect(hasPapa).toBe(true);

    // Check SheetJS loaded
    const hasXLSX = await page.evaluate(() => typeof XLSX !== 'undefined');
    expect(hasXLSX).toBe(true);
  });

  test('guide page loads', async ({ page }) => {
    await page.goto('/guide.html');
    await expect(page).toHaveTitle(/User Guide/);
  });

  test('CSV upload works with test data', async ({ page }) => {
    await page.goto('/');

    // Create test CSV content
    const testCSV = `Action,Time,ISIN,Ticker,Name,No. of shares,Price / share,Currency (Price / share),Exchange rate,Result,Currency (Result),Total,Currency (Total)
Market sell,2024-07-30 15:01:04,US0378331005,AAPL,Apple,1.0,150.0,USD,0.095,14.25,SEK,150.00,SEK
Market sell,2024-07-30 15:01:05,US88160R1014,TSLA,Tesla,2.0,200.0,USD,0.095,38.00,SEK,400.00,SEK`;

    // Create a File object from the CSV string
    const blob = new Blob([testCSV], { type: 'text/csv' });
    const file = new File([blob], 'test.csv', { type: 'text/csv' });

    // Upload via file input
    const fileInput = page.locator('#fileInput');

    // Create temporary file for upload
    await page.evaluate(async (csvContent) => {
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const file = new File([blob], 'test.csv', { type: 'text/csv' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      document.getElementById('fileInput').files = dataTransfer.files;
      document.getElementById('fileInput').dispatchEvent(new Event('change', { bubbles: true }));
    }, testCSV);

    // Wait for processing
    await page.waitForTimeout(2000);

    // Check that stats section appears
    const previewSection = page.locator('#previewSection');
    await expect(previewSection).toBeVisible();
  });

  test('download buttons appear after upload', async ({ page }) => {
    await page.goto('/');

    const testCSV = `Action,Time,ISIN,Ticker,Name,No. of shares,Price / share,Currency (Price / share),Exchange rate,Result,Currency (Result),Total,Currency (Total)
Market sell,2024-07-30 15:01:04,US0378331005,AAPL,Apple,1.0,150.0,USD,0.095,14.25,SEK,150.00,SEK`;

    await page.evaluate(async (csvContent) => {
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const file = new File([blob], 'test.csv', { type: 'text/csv' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      document.getElementById('fileInput').files = dataTransfer.files;
      document.getElementById('fileInput').dispatchEvent(new Event('change', { bubbles: true }));
    }, testCSV);

    await page.waitForTimeout(2000);

    // Check download section is visible
    const downloadSection = page.locator('#downloadSection');
    await expect(downloadSection).toBeVisible();

    // Check both download buttons are visible
    const downloadK4 = page.locator('#downloadK4');
    await expect(downloadK4).toBeVisible();

    const downloadOriginal = page.locator('#downloadOriginal');
    await expect(downloadOriginal).toBeVisible();
  });

  test('FAQ section is accessible', async ({ page }) => {
    await page.goto('/');

    // Check FAQ section exists and is scrollable
    const faqSection = page.locator('#faq');
    await expect(faqSection).toBeVisible();

    // Check FAQ items can be clicked
    const firstFAQ = page.locator('#faq details').first();
    await firstFAQ.locator('summary').click();
    await page.waitForTimeout(300);

    // Check it opened
    const isOpen = await firstFAQ.evaluate(el => el.hasAttribute('open'));
    expect(isOpen).toBe(true);
  });

  test('mobile responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const uploadArea = page.locator('#uploadArea');
    await expect(uploadArea).toBeVisible();

    const hero = page.locator('header h1');
    await expect(hero).toBeVisible();
  });

  test('has SEO meta tags', async ({ page }) => {
    await page.goto('/');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toContain('Trading 212');

    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toContain('K4');
  });

});
