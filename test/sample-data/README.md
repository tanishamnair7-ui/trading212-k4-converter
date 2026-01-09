# Test Data - Trading 212 to K4 Converter

This folder contains synthetic test data for testing the converter application.

## ⚠️ Important

**This is FAKE data for testing purposes only.**
- Not real transactions
- Not real people
- Use only for testing the application

---

## Sample Files

### sample-2024.csv

**Scenario:** Small portfolio with 5 sell transactions in 2024

**Contents:**
- 6 buy transactions (2024-01-15 to 2024-10-20)
- 7 sell transactions (2024-06-15 to 2024-12-05)
- 1 dividend payment
- Mixed stocks: AAPL, MSFT, GOOGL, NVDA, TSLA, META

**Expected Results:**

| Metric | Value |
|--------|-------|
| Total Sell Transactions | 7 |
| Total P/L | 1,289.10 SEK |
| Total Gains | 1,335.50 SEK |
| Total Losses | -46.40 SEK |
| Tax Year | 2024 |

**K4 Values:**
- Box 3.3 (Gains): 1,335.50 SEK
- Box 3.4 (Losses): -46.40 SEK
- Box 3.5 (Net): 1,289.10 SEK
- Estimated tax: ~386.73 SEK

---

### sample-2023.csv

**Scenario:** Very small portfolio with 3 sell transactions in 2023

**Contents:**
- 3 buy transactions (2023-06-15)
- 3 sell transactions (2023-08-20, same day)
- 2 dividend payments
- Stocks: AAPL, TSLA, MSFT

**Expected Results:**

| Metric | Value |
|--------|-------|
| Total Sell Transactions | 3 |
| Total P/L | 72.00 SEK |
| Total Gains | 120.00 SEK |
| Total Losses | -48.00 SEK |
| Tax Year | 2023 |

**K4 Values:**
- Box 3.3 (Gains): 120.00 SEK
- Box 3.4 (Losses): -48.00 SEK
- Box 3.5 (Net): 72.00 SEK
- Estimated tax: ~21.60 SEK

---

## How to Use for Testing

### Automated Testing

```bash
cd /Users/siddharth.yadav/temp/conversion

# Start local server
python3 -m http.server 8000

# Open in browser
open http://localhost:8000

# Upload test files and verify results
```

### Manual Verification

1. Upload `sample-2024.csv`
2. Check stats show:
   - 7 sell transactions
   - 1,289.10 SEK net P/L
3. Download K4 Excel
4. Verify Sheet 3 shows correct totals
5. Repeat for `sample-2023.csv`

### Regression Testing

After code changes:
1. Upload both sample files
2. Verify totals haven't changed
3. Download Excel files
4. Check all three sheets format correctly

---

## Transaction Details

### sample-2024.csv Breakdown

| Date | Symbol | Quantity | Sale Price | P/L |
|------|--------|----------|------------|-----|
| 2024-06-15 | AAPL | 5.0 | 195.00 USD | +89.50 SEK |
| 2024-06-15 | MSFT | 3.0 | 420.00 USD | +136.80 SEK |
| 2024-07-22 | GOOGL | 8.0 | 155.00 USD | +112.00 SEK |
| 2024-08-10 | NVDA | 2.0 | 950.00 USD | +366.00 SEK |
| 2024-09-05 | TSLA | 10.0 | 220.00 USD | +372.00 SEK |
| 2024-11-18 | META | 4.0 | 550.00 USD | +259.20 SEK |
| 2024-12-05 | GOOGL | 5.0 | 148.00 USD | -46.40 SEK |

**Total:** 1,289.10 SEK

### sample-2023.csv Breakdown

| Date | Symbol | Quantity | Sale Price | P/L |
|------|--------|----------|------------|-----|
| 2023-08-20 | AAPL | 10.0 | 185.00 USD | +47.50 SEK |
| 2023-08-20 | TSLA | 8.0 | 245.00 USD | -48.00 SEK |
| 2023-08-20 | MSFT | 5.0 | 355.00 USD | +72.50 SEK |

**Total:** 72.00 SEK

---

## Notes for Developers

### Why These Values?

- **Realistic but synthetic:** Based on real stock prices but not actual trades
- **Round numbers:** Easier to verify calculations
- **Mix of gains and losses:** Tests both positive and negative P/L
- **Different quantities:** Tests decimal handling
- **Multiple dates:** Tests date formatting and sorting
- **Different stocks:** Common US stocks (easy to recognize as test data)

### Creating More Test Data

Use this template:

```python
import csv
import random
from datetime import datetime, timedelta

# Generate synthetic trades
# ... (see test data generation script)
```

---

## Updating Test Data

If Trading 212 changes CSV format:

1. Export a real statement (with permission)
2. Anonymize all values:
   - Change quantities
   - Change prices
   - Change dates
   - Keep same column structure
3. Update sample CSVs
4. Update expected results in this README
5. Update test cases in DEVELOPMENT.md

---

*Test data created: January 2026*
*Purpose: Application testing and demonstration*
*Status: Synthetic data - not real trades*
