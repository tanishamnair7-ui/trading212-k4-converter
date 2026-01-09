# Test Suite - Trading 212 to K4 Converter

## Overview

Comprehensive automated testing to catch bugs like:
- ✅ Download button not working
- ✅ CSV parsing failures
- ✅ Calculation errors
- ✅ UI rendering issues
- ✅ Missing dependencies
- ✅ Mobile responsiveness problems

---

## Test Types

### 1. Browser-Based Unit Tests

**File:** `test/automated-tests.html`

**What it tests:**
- Library dependencies (PapaParse, SheetJS)
- CSV parsing logic
- Transaction filtering
- Data transformation
- P/L calculations
- Excel generation
- K4 data structure
- Aggregation logic
- Date/number formatting
- Edge cases

**How to run:**
```bash
# Start server
python3 -m http.server 8000

# Open in browser
open http://localhost:8000/test/automated-tests.html
```

**Expected result:** All tests pass (green checkmarks)

---

### 2. End-to-End Tests (Playwright)

**File:** `test/e2e/app.spec.js`

**What it tests:**
- Page loading
- Upload area visibility
- FAQ functionality
- CSV file upload
- Stats display
- Download button functionality
- Notification toasts
- Navigation between pages
- Mobile responsiveness
- SEO meta tags

**How to run:**
```bash
# Install dependencies
npm install

# Run tests
npm test

# Run with UI (interactive)
npm run test:ui

# Run in headed mode (see browser)
npm run test:headed

# View test report
npm run test:report
```

---

### 3. GitHub Actions (CI/CD)

**File:** `.github/workflows/test.yml`

**Runs automatically on:**
- Every push to main
- Every pull request
- Manual trigger via GitHub Actions tab

**Tests run:**
- All Playwright E2E tests
- On multiple browsers (Chrome, Firefox)
- On mobile viewport

**View results:**
- GitHub repo → Actions tab
- See test status and artifacts

---

## Test Coverage

### Functionality Tests

| Test | What It Validates | Catches Bugs Like |
|------|-------------------|-------------------|
| CSV Upload | File can be uploaded | Upload handler broken |
| CSV Parsing | CSV correctly parsed | Parse errors, wrong columns |
| Transaction Filter | Only sells extracted | Wrong transaction types included |
| Calculations | P/L totals correct | Math errors, currency issues |
| **Download K4** | **Button generates Excel** | **Download not working!** ⭐ |
| Download Original | Full statement downloads | Button handler missing |
| K4 Data Structure | 3 sheets created | Missing sheets, wrong format |
| Aggregation | Multiple sales grouped | Duplicate entries, wrong sums |
| Stats Display | Cards show correct data | UI rendering failures |
| FAQ Links | Help links work | Broken navigation |

### UI/UX Tests

| Test | What It Validates |
|------|-------------------|
| Page Load | Title, headers visible |
| Upload Area | Visible and interactive |
| FAQ Section | All FAQs present and expandable |
| Mobile View | Responsive on small screens |
| Navigation | Links between pages work |
| Notifications | Toast messages appear |

### Data Validation Tests

| Test | What It Validates |
|------|-------------------|
| Swedish Dates | DD.MM.YYYY format |
| ISO Dates | YYYY-MM-DD format |
| Number Format | Swedish locale (space as thousands separator) |
| Instrument Type | Stock vs ETF detection |
| Year Extraction | From filename or transaction date |
| Edge Cases | Empty data, NaN, missing fields |

---

## Running Tests Locally

### Quick Test (Browser)

```bash
# Start server (if not running)
python3 -m http.server 8000

# Open automated tests
open http://localhost:8000/test/automated-tests.html

# Result: Should see all green checkmarks
```

### Full E2E Tests (Playwright)

```bash
# First time setup
npm install

# Run all tests
npm test

# Run specific test file
npx playwright test app.spec.js

# Run with browser visible
npm run test:headed

# Interactive mode (best for development)
npm run test:ui
```

---

## GitHub Actions Setup

### Enable in Your Repository

1. Tests run automatically on push (already configured!)
2. No setup needed - GitHub Actions reads `.github/workflows/test.yml`
3. View results: https://github.com/sedflix/trading212-k4-converter/actions

### What Happens on Push

```
git push
  ↓
GitHub Actions triggered
  ↓
Runs Playwright tests
  ↓
✅ Pass: Merge allowed
❌ Fail: Shows which tests failed
```

### Test Results

- **Green checkmark** ✅ - All tests passed, safe to deploy
- **Red X** ❌ - Tests failed, review before merging
- **Yellow circle** 🟡 - Tests running

---

## What Each Test File Does

### test/automated-tests.html (Unit Tests)

**Purpose:** Validate core logic without running the full app

**Tests:**
- CSV parsing with PapaParse
- Excel generation with SheetJS
- Mathematical calculations
- Data transformations
- Edge case handling

**When to run:** After changing app.js logic

---

### test/e2e/app.spec.js (E2E Tests)

**Purpose:** Test the actual user experience

**Tests:**
- Upload CSV file
- See stats appear
- Download Excel files
- Navigate pages
- Mobile view

**When to run:** After changing HTML, CSS, or app.js

---

## Adding New Tests

### Example: Test a New Feature

```javascript
// In test/e2e/app.spec.js

test('should validate new feature', async ({ page }) => {
  await page.goto('http://localhost:8000');

  // Your test steps here
  const element = page.locator('#newFeature');
  await expect(element).toBeVisible();
  await expect(element).toContainText('Expected Text');
});
```

### Example: Test a Calculation

```javascript
// In test/automated-tests.html

const result = yourCalculationFunction(input);
assert(
  result === expectedValue,
  'Your calculation works correctly',
  expectedValue,
  result
);
```

---

## Debugging Failed Tests

### Browser Tests Fail

1. Open `test/automated-tests.html` in browser
2. Open browser DevTools (F12)
3. Check console for errors
4. Look at red test results for details

### Playwright Tests Fail

```bash
# Run with browser visible
npm run test:headed

# Use Playwright inspector
PWDEBUG=1 npm test

# Generate trace
npx playwright test --trace on
npx playwright show-trace trace.zip
```

### GitHub Actions Fail

1. Go to Actions tab on GitHub
2. Click on failed workflow
3. Expand failed step
4. Read error message
5. Download artifacts for screenshots/traces

---

## Test Data

### Sample Files

**test/sample-data/sample-2024.csv**
- 7 sell transactions
- Expected total: 1,289.10 SEK
- Expected gains: 1,335.50 SEK
- Expected losses: -46.40 SEK

**test/sample-data/sample-2023.csv**
- 3 sell transactions
- Expected total: 72.00 SEK
- Expected gains: 120.00 SEK
- Expected losses: -48.00 SEK

### Expected Results

Tests verify that processing these files produces exact expected values.

If tests fail, it means:
- CSV format changed
- Calculation logic broken
- Data parsing issue

---

## Continuous Integration Benefits

### Before (No Tests)

```
Code change → Push → Hope it works → Users find bugs ❌
```

### After (With Tests)

```
Code change → Push → Tests run → Pass ✅ → Safe to deploy
                           ↓
                         Fail ❌ → Fix before deploy
```

### Real Example

**The Download Button Bug:**

Without tests:
- Bug shipped to users
- Users complained
- Had to fix reactively

With tests:
- `test('should trigger download')` would have failed
- Bug caught before push
- Fixed proactively

---

## Test Maintenance

### After Changing Code

```bash
# Always run tests before pushing
npm test

# If tests fail, either:
# 1. Fix the code (if it's a real bug)
# 2. Update tests (if expectations changed)
```

### Update Test Data

If Trading 212 CSV format changes:
1. Update `test/sample-data/*.csv`
2. Update expected values in tests
3. Re-run tests to verify

---

## CI/CD Workflow

```mermaid
Developer pushes code
  ↓
GitHub Actions triggers
  ↓
Runs automated tests
  ├─ Browser unit tests
  ├─ Playwright E2E tests (Chrome)
  ├─ Playwright E2E tests (Firefox)
  └─ Mobile viewport tests
  ↓
All pass? → Deploy to GitHub Pages ✅
Any fail? → Block deploy, notify developer ❌
```

---

## Test Checklist

Before pushing code:
- [ ] Run `npm test` locally
- [ ] All tests pass
- [ ] Test with actual Trading 212 CSV file
- [ ] Verify downloads work
- [ ] Check on mobile (DevTools)
- [ ] Push to GitHub
- [ ] Verify GitHub Actions pass

---

*Last Updated: January 2026*
*Test Framework: Playwright*
*CI/CD: GitHub Actions*
