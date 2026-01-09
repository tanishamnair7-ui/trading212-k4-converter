# Development Guide

## Local Testing Instructions

### Step 1: Set Up Local Server

You **must** use a local web server to test (cannot just open index.html in browser due to CORS restrictions with CSV loading).

**Choose one of these methods:**

#### Method A: Python (Simplest)
```bash
cd /Users/siddharth.yadav/temp/conversion
python3 -m http.server 8000
```

#### Method B: Node.js
```bash
npx http-server -p 8000
```

#### Method C: PHP
```bash
php -S localhost:8000
```

### Step 2: Open in Browser

Navigate to: `http://localhost:8000`

### Step 3: Test with Real Data

Upload the sample CSV files:
- `test/sample-data/sample-2024.csv`
- `test/sample-data/sample-2023.csv`

---

## Test Cases

### Test Case 1: 2024 Data (7 sell transactions)

**Input File:** `test/sample-data/sample-2024.csv`

**Expected Results:**
- Number of sell transactions: **7**
- Total P/L: **1,289.10 SEK**
- Total Gains: **1,335.50 SEK**
- Total Losses: **-46.40 SEK**
- Tax Year: **2024**

**Verification Steps:**
1. Upload the CSV file
2. Check preview stats show correct numbers
3. Verify first transaction: AAPL with P/L = 89.50 SEK
4. Verify last transaction: GOOGL with P/L = -46.40 SEK
5. Download K4 Excel file
6. Open Sheet 3 (Sammanfattning) and verify totals
7. Check Sheet 2 has 6 aggregated rows (unique securities)

**Manual Verification:**
```python
# Verify with Python
import pandas as pd
df = pd.read_csv('test/sample-data/sample-2024.csv')
sells = df[df['Action'].str.contains('sell', case=False, na=False)]
total = pd.to_numeric(sells['Result'], errors='coerce').sum()
print(f"Total: {total:.2f} SEK")  # Should be 1289.10
```

---

### Test Case 2: 2023 Data (3 sell transactions)

**Input File:** `test/sample-data/sample-2023.csv`

**Expected Results:**
- Number of sell transactions: **3**
- Total P/L: **72.00 SEK**
- Total Gains: **120.00 SEK**
- Total Losses: **-48.00 SEK**
- Tax Year: **2023**
- All transactions on same day: **August 20, 2023**

**Verification Steps:**
1. Upload the CSV file
2. Verify stats show 3 transactions
3. Verify all dates are 20.08.2023
4. Download K4 file
5. Verify Sheet 2 has 3 rows (same as detailed since no duplicates)

---

### Test Case 3: Empty Sells

**Test:** Upload CSV with only buy/dividend transactions

**Expected:**
- Error message: "No sell transactions found in this CSV file"
- Upload area resets to initial state

---

### Test Case 4: Invalid File Type

**Test:** Try to upload PDF or other non-CSV file

**Expected:**
- File type validation error
- Prompt to upload CSV file

---

## Browser Compatibility Testing

Test in all major browsers:

- [ ] **Chrome/Edge (Chromium)** - Primary target
- [ ] **Firefox** - Should work perfectly
- [ ] **Safari** - Test CSV parsing and downloads
- [ ] **Mobile Safari (iOS)** - Test file upload
- [ ] **Mobile Chrome (Android)** - Test file upload

---

## Debugging

### Enable Console Logging

Add to `app.js`:

```javascript
// At start of processCSV function
console.log('Raw CSV data:', data);
console.log('Sell transactions:', sellTransactions);
console.log('Total P/L:', totalPL);
```

### Check Network Tab

- Should see **NO network requests** after page load
- All CDN libraries (PapaParse, SheetJS) load successfully

### Verify Data Processing

Open browser console and check:

```javascript
// After upload
console.log(sellTransactions);
console.log('Total:', sellTransactions.reduce((s, t) => s + t.realisedPL, 0));
```

---

## Common Development Issues

### Issue: "Cannot read file"

**Cause:** Opening index.html directly (file:///)
**Solution:** Use local web server (see Step 1)

### Issue: CSV not parsing

**Cause:** PapaParse CDN not loaded
**Solution:** Check internet connection or use local copy

### Issue: Excel download not working

**Cause:** SheetJS CDN not loaded
**Solution:** Check browser console for errors

### Issue: Incorrect totals

**Cause:** Data type conversion issues
**Solution:** Verify all numeric fields are parsed correctly with parseFloat()

---

## Code Quality Checks

### Before Committing

1. **Test all functionality:**
   - Upload different CSV files
   - Test both download buttons
   - Check mobile responsiveness

2. **Validate HTML:**
   ```bash
   # Use W3C validator or
   npx html-validate index.html guide.html
   ```

3. **Lint JavaScript:**
   ```bash
   npx eslint app.js
   ```

4. **Check responsiveness:**
   - Test at 320px, 768px, 1024px, 1920px widths
   - Use browser DevTools device simulator

---

## Performance Optimization

### Current Status

- Page loads: < 1 second
- CSV processing: < 500ms for 500 transactions
- Excel generation: < 1 second

### If Processing Large Files (>1000 transactions)

Add progress indicator:

```javascript
function processCSV(data, filename) {
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.innerHTML = '<div class="loading">Processing ' + data.length + ' transactions...</div>';

    // Use setTimeout to avoid blocking UI
    setTimeout(() => {
        // ... existing processing code
    }, 100);
}
```

---

## Deployment

### GitHub Pages Setup

1. **Enable GitHub Pages:**
   - Repository Settings → Pages
   - Source: Deploy from branch `main`
   - Folder: `/` (root)

2. **Custom domain (optional):**
   - Add CNAME file with your domain
   - Configure DNS A/CNAME records

3. **URL will be:**
   ```
   https://yourusername.github.io/trading212-k4-converter/
   ```

### Pre-Deployment Checklist

- [ ] All tests passing
- [ ] README updated
- [ ] Sample CSV files removed (or in separate branch)
- [ ] GitHub repository URL updated in footer
- [ ] Privacy policy reviewed
- [ ] Cross-browser testing completed

---

## File Size Limits

GitHub Pages limits:
- Max file size: 100 MB
- Max repo size: 1 GB
- Recommended page size: < 5 MB

Current project: ~50 KB (well within limits)

---

## Security Considerations

### Client-Side Only

✅ **Secure by design:**
- No server-side processing
- No data transmission
- No data storage
- No cookies or tracking

### CSV File Handling

- Parsed using PapaParse (trusted library)
- No execution of CSV content
- Sanitized before display

### Excel Generation

- Uses SheetJS (trusted library)
- Binary generation in memory
- Direct download to user

---

## Future Enhancements

### Planned Features

- [ ] Multi-year CSV support (combine 2023 + 2024)
- [ ] PDF export of K4 summary
- [ ] Swedish language version
- [ ] Dark mode
- [ ] Detailed per-security breakdown
- [ ] ISK account support (if Trading 212 adds it)

### Under Consideration

- [ ] PDF statement parsing (OCR) - complex
- [ ] Other brokers support (Avanza, Nordnet) - different formats
- [ ] Desktop app (Electron)
- [ ] Mobile app

---

## Maintenance

### Dependencies

Update CDN versions periodically:

**PapaParse:**
- Current: 5.4.1
- Check: https://cdnjs.com/libraries/PapaParse

**SheetJS:**
- Current: 0.18.5
- Check: https://cdnjs.com/libraries/xlsx

### Testing After Updates

1. Test with sample CSV files
2. Verify Excel downloads work
3. Check all calculations match expected values
4. Test on mobile devices

---

## Getting Help

- **Technical Issues:** Open GitHub issue
- **Tax Questions:** Contact Skatteverket
- **Trading 212 Questions:** Contact Trading 212 support

---

## License

MIT License - See LICENSE file for details

---

*Last Updated: January 2026*
