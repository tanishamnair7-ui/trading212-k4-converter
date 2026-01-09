# CLAUDE.md - AI Assistant Guide for Trading 212 to K4 Converter

## Project Overview

This is a client-side web application that converts Trading 212 CSV transaction exports to Swedish tax form K4 (Bilaga B) format. The application runs entirely in the browser using JavaScript - no server-side processing, ensuring complete user privacy.

---

## Architecture

### Technology Stack

**Frontend:**
- Pure HTML5, CSS3, JavaScript (ES6+)
- No framework dependencies (React, Vue, etc.)
- No build process or transpilation
- Static site suitable for GitHub Pages

**Libraries (CDN):**
- **PapaParse 5.4.1** - CSV parsing
- **SheetJS 0.18.5** - Excel file generation

**Design Pattern:**
- Event-driven architecture
- Single-page application (SPA) behavior
- Progressive enhancement approach

---

## File Structure & Responsibilities

### Core Application Files

**1. index.html**
- Main application page
- File upload interface (drag & drop + click)
- Preview section (transaction stats and table)
- K4 summary display
- Download buttons
- FAQ section
- Responsive layout

**Key HTML Elements:**
- `#uploadArea` - File drop zone
- `#fileInput` - Hidden file input
- `#previewSection` - Shows after CSV upload
- `#downloadSection` - Shows download buttons
- `#previewStats` - Stats grid (count, P/L, gains, losses)
- `#previewTable` - Transaction preview table
- `#k4Summary` - K4 tax summary boxes

**2. app.js**
- CSV file handling and parsing
- Data transformation (Trading 212 format → K4 format)
- Excel file generation
- UI updates and interactions

**Key Functions:**
```javascript
handleFile(file)              // Processes uploaded CSV
processCSV(data, filename)    // Main conversion logic
determineType(name)           // Categorizes Stock vs ETF
downloadK4Excel()             // Generates K4 Excel file
downloadOriginalExcel()       // Generates full statement Excel
formatSEK(amount)             // Swedish number formatting
formatDate(dateStr)           // Swedish date format (DD.MM.YYYY)
```

**Data Flow:**
```
CSV Upload → Parse with PapaParse → Filter sell transactions →
Calculate totals → Display preview → Generate Excel (3 sheets) → Download
```

**3. styles.css**
- Responsive design (mobile-first approach)
- Swedish color scheme (blue #1F4E78, #4472C4)
- Accessible components (focus states, ARIA-friendly)
- Print-friendly styles

**Key Design Patterns:**
- BEM-like naming for clarity
- CSS custom properties for theming
- Flexbox and Grid for layouts
- Mobile breakpoint: 768px

**4. guide.html**
- Comprehensive user guide
- Step-by-step instructions
- FAQ section
- Contact information
- Privacy & legal information

---

## Data Model

### Trading 212 CSV Schema (Input)

**Required Columns:**
- `Action` - Transaction type (Market sell, Limit sell, etc.)
- `Time` - ISO 8601 timestamp (YYYY-MM-DD HH:MM:SS)
- `ISIN` - International Securities ID
- `Ticker` - Stock symbol
- `Name` - Full company/security name
- `No. of shares` - Quantity (decimal)
- `Price / share` - Price in original currency
- `Currency (Price / share)` - Original currency (USD, EUR, GBP, GBX)
- `Exchange rate` - SEK exchange rate
- `Result` - Realized profit/loss in SEK
- `Total` - Total sale proceeds in SEK

**Optional Columns:**
- `Withholding tax` - Foreign tax withheld
- `Currency conversion fee` - Transaction fees
- `Charge amount` - Broker fees (2024 format)
- `Stamp duty reserve tax` - UK stamp duty (2023 format)

**Important Notes:**
- Column names differ between 2023 and 2024 exports
- 2023: Has "Stamp duty reserve tax"
- 2024: Has "Charge amount" instead
- Code must handle both formats gracefully

### K4 Output Schema (Generated)

**Sheet 1: K4 Detaljerad (Detailed)**
```javascript
{
  'Värdepapper': 'AMZN (US0231351067)',    // Security + ISIN
  'Antal': 0.0384271,                       // Quantity
  'Försäljningspris (SEK)': 75.81,         // Sale proceeds
  'Omkostnadsbelopp (SEK)': 56.24,         // Acquisition cost
  'Vinst (+) / Förlust (-) (SEK)': 19.57,  // P/L
  'Försäljningsdatum': '2024-07-30',       // Sale date (ISO)
  'Land': 'US',                             // Country code
  'ISIN': 'US0231351067',                   // ISIN
  'Typ': 'Stock',                           // Stock or ETF
  'Valuta': 'USD'                           // Original currency
}
```

**Sheet 2: K4 Sammanställning (Aggregated)**
- Groups multiple sales of same security
- Sums quantities, proceeds, costs, P/L
- Counts transactions per security
- Sorted by P/L (descending)

**Sheet 3: Sammanfattning (Summary)**
- Total transactions count
- Total unique securities
- Total sale proceeds
- Total acquisition cost
- **Box 3.3:** Total gains (for K4 form)
- **Box 3.4:** Total losses (for K4 form)
- **Box 3.5:** Net result (for K4 form)

---

## Key Business Logic

### 1. Transaction Filtering

```javascript
// Only process sell transactions
sellTransactions = data.filter(row =>
    row.Action && row.Action.toLowerCase().includes('sell')
);
```

**Rationale:** K4 only requires sell trades. Buys, dividends, interest are excluded.

### 2. Instrument Type Determination

```javascript
function determineType(name) {
    if (!name) return 'Stock';
    const nameLower = name.toLowerCase();
    if (nameLower.includes('etf') || nameLower.includes('ishares') ||
        nameLower.includes('vanguard') || nameLower.includes('pimco')) {
        return 'ETF';
    }
    return 'Stock';
}
```

**Rationale:** Swedish tax differentiates between stocks and funds/ETFs, though both go on K4 Bilaga B for foreign securities.

### 3. Acquisition Cost Calculation

```javascript
acquisitionCost = quantity × pricePerShare × fxRate
```

**Important:** Trading 212 uses the **average cost method** (genomsnittsmetoden). The CSV already contains the correct average price, so we use it directly.

### 4. Swedish Number & Date Formatting

**Numbers:**
- Format: `8 297,89` (space as thousands separator, comma as decimal)
- Implementation: `Intl.NumberFormat('sv-SE')`

**Dates:**
- Swedish format: `DD.MM.YYYY` (dots, not slashes)
- ISO format for K4: `YYYY-MM-DD`

---

## Critical Tax Calculations

### K4 Bilaga B (Part B) - Foreign Securities

**Why Part B?**
- All Trading 212 securities are foreign (non-Swedish)
- ISIN codes starting with US, CA, IE, GB, etc.
- Swedish securities would start with SE (not present in Trading 212)

**Formula Verification:**
```
Sale Proceeds (SEK) - Acquisition Cost (SEK) = Profit/Loss (SEK)
```

**Capital Gains Tax:**
- Rate: 30% (fixed in Sweden)
- Applied to net positive result only
- Losses offset gains in same tax year
- Excess losses can offset other capital income

---

## Code Quality Standards

### JavaScript

**Style:**
- ES6+ syntax (arrow functions, template literals, const/let)
- Descriptive variable names (no single letters except loop iterators)
- Comments for complex logic
- Error handling with try-catch where appropriate

**Performance:**
- No blocking operations (CSV parsing is async)
- Efficient filtering (single pass through data)
- Minimal DOM manipulation

**Browser Compatibility:**
- Target: Modern browsers (Chrome, Firefox, Safari, Edge)
- No IE11 support needed
- Use standard APIs (no polyfills required)

### HTML

**Semantic:**
- Proper heading hierarchy (h1 → h2 → h3)
- Semantic tags (`<header>`, `<main>`, `<section>`, `<footer>`)
- Accessible forms and buttons

**Validation:**
- Valid HTML5
- No deprecated attributes
- Proper DOCTYPE and meta tags

### CSS

**Responsive:**
- Mobile-first approach
- Breakpoint at 768px
- Flexbox and Grid for layouts
- No fixed widths (use max-width)

**Maintainability:**
- CSS custom properties for colors
- Consistent spacing scale
- Clear class naming

---

## Privacy & Security Principles

### Client-Side Only Architecture

**CRITICAL:** This application MUST NOT transmit user data to any server.

**Implementation:**
- All CSV parsing in browser (PapaParse)
- All Excel generation in browser (SheetJS)
- No fetch/XMLHttpRequest to external APIs
- No analytics or tracking by default

**Verification:**
```javascript
// The only network requests should be:
// 1. Loading the HTML/CSS/JS files
// 2. Loading PapaParse and SheetJS from CDN
// NO requests should occur after user uploads file
```

### Data Protection

**What's Protected:**
- User's CSV files (never stored or transmitted)
- Generated Excel files (created in memory, direct download)
- Personal tax information (never logged)

**How:**
- `.gitignore` excludes all CSV and Excel files
- No localStorage or sessionStorage usage
- No cookies

---

## Testing Strategy

### Manual Testing Checklist

**Functional Tests:**
- [ ] Upload CSV file (click)
- [ ] Upload CSV file (drag & drop)
- [ ] Filter sell transactions correctly
- [ ] Calculate totals accurately
- [ ] Display preview table
- [ ] Download K4 Excel file
- [ ] Download original Excel file
- [ ] All links work

**Browser Tests:**
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

**Data Validation:**
- [ ] 2024 test data: 132 transactions, 8,297.89 SEK
- [ ] 2023 test data: 16 transactions, 91.90 SEK
- [ ] Multiple sales of same stock aggregate correctly
- [ ] ETFs detected and labeled correctly
- [ ] Date formatting correct (Swedish format)

### Automated Tests

**test-converter.html:**
- Tests CDN library loading
- Tests CSV parsing
- Tests Excel generation
- Tests date/number formatting
- Run in browser: http://localhost:8000/test-converter.html

### Test Data

**Location:** `test/sample-data/`
- `sample-2024.csv` - Synthetic 2024 data
- `sample-2023.csv` - Synthetic 2023 data

**Expected Results:**
- Documented in DEVELOPMENT.md
- Use for regression testing after changes

---

## Common Modification Scenarios

### Adding a New Feature

**Example: Add PDF export**

1. Add library to index.html:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
```

2. Add button to index.html:
```html
<button id="downloadPDF" class="btn btn-secondary">📄 Download as PDF</button>
```

3. Add handler in app.js:
```javascript
document.getElementById('downloadPDF').addEventListener('click', downloadAsPDF);

function downloadAsPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    // ... PDF generation logic
    doc.save(`${year}_K4_Summary.pdf`);
}
```

### Adding Swedish Language Support

1. Create language strings object in app.js:
```javascript
const lang = {
    en: {
        title: "Trading 212 to Swedish K4 Converter",
        upload: "Upload CSV file",
        // ...
    },
    sv: {
        title: "Trading 212 till Svenskt K4 Konverterare",
        upload: "Ladda upp CSV-fil",
        // ...
    }
};
```

2. Add language toggle in HTML
3. Update all text rendering to use lang object

### Updating for Trading 212 CSV Format Changes

**If Trading 212 changes CSV structure:**

1. Check `app.js` → `processCSV()` function
2. Update column name mappings
3. Test with new format
4. Add backward compatibility if needed
5. Update DEVELOPMENT.md with format notes

---

## Debugging Guide

### Common Issues

**Issue: "No sell transactions found"**
- **Debug:** Check `row.Action` field in CSV
- **Cause:** Action column might have different text
- **Fix:** Update filter condition in `processCSV()`

**Issue: Incorrect totals**
- **Debug:** Console.log `sellTransactions` array
- **Cause:** Data type conversion (strings vs numbers)
- **Fix:** Ensure all numeric fields use `parseFloat()`

**Issue: Excel download doesn't work**
- **Debug:** Check browser console for XLSX errors
- **Cause:** SheetJS CDN not loaded or version incompatible
- **Fix:** Verify CDN URL and test with different version

**Issue: Wrong dates in output**
- **Debug:** Check timezone handling
- **Cause:** Date parsing assumes UTC, but Trading 212 might use local time
- **Fix:** Review `formatDate()` and `formatDateTime()` functions

### Debug Mode

Add to app.js for debugging:

```javascript
const DEBUG = true;

function debug(label, data) {
    if (DEBUG) {
        console.log(`[DEBUG] ${label}:`, data);
    }
}

// Use in processCSV:
debug('Parsed CSV', data);
debug('Sell transactions', sellTransactions);
debug('Total P/L', totalPL);
```

---

## Swedish Tax Context (For AI Assistants)

### K4 Form Background

**Purpose:** Report capital gains/losses from securities sales

**Structure:**
- **Bilaga A** (Part A) - Swedish securities
- **Bilaga B** (Part B) - Foreign securities ← This tool covers this!

**Required Information:**
1. Security name (Värdepapper)
2. Quantity sold (Antal)
3. Sale price in SEK (Försäljningspris)
4. Acquisition cost in SEK (Omkostnadsbelopp)
5. Profit or loss in SEK (Vinst/Förlust)

**Box Numbers on Form:**
- Box 3.3 - Total gains
- Box 3.4 - Total losses
- Box 3.5 - Net result (goes to main tax return)

### Tax Rules

**Calculation Method:**
- Trading 212 uses **genomsnittsmetoden** (average cost method)
- This is standard and accepted by Skatteverket
- Alternative is **schablonmetoden** (20% flat rate) - not used here

**Tax Rate:**
- 30% on net capital gains
- Losses can offset gains
- Excess losses (70% deductible from other income, max 100,000 SEK)

**Reporting Requirement:**
- Must report ALL sales, even if net loss
- Foreign securities require currency conversion to SEK
- ISIN codes must be included

---

## Key Implementation Details

### Why Client-Side Only?

**Privacy:** User's financial data is sensitive. Server-side processing would:
- Require data transmission (security risk)
- Need data storage (privacy concern)
- Require GDPR compliance (complex)
- Create liability for data breaches

**Client-side benefits:**
- Zero data transmission
- No server costs
- No maintenance overhead
- User maintains complete control
- Open source = verifiable security

### CSV Parsing Strategy

**PapaParse Configuration:**
```javascript
Papa.parse(file, {
    header: true,        // Use first row as column names
    complete: callback,  // Async processing
    error: errorHandler  // Graceful error handling
});
```

**Why PapaParse?**
- Handles various CSV dialects
- Proper quote/escape handling
- Async processing (non-blocking)
- Well-tested, industry standard

### Excel Generation Strategy

**SheetJS Implementation:**
```javascript
const wb = XLSX.utils.book_new();                    // Create workbook
const ws = XLSX.utils.json_to_sheet(data);           // JSON to sheet
XLSX.utils.book_append_sheet(wb, ws, 'SheetName');  // Add sheet
XLSX.writeFile(wb, 'filename.xlsx');                 // Download
```

**Three Sheets Created:**
1. **K4 Detaljerad** - Every transaction (for transparency)
2. **K4 Sammanställning** - Aggregated (recommended for filing)
3. **Sammanfattning** - Summary totals (for K4 boxes)

**Why Three Sheets?**
- Flexibility: User chooses detailed vs aggregated
- Verification: Can compare detailed sum to aggregated
- Convenience: Summary provides exact K4 box values

---

## Edge Cases & Error Handling

### Handled Edge Cases

**1. No Sell Transactions**
```javascript
if (sellTransactions.length === 0) {
    alert('No sell transactions found...');
    resetUploadArea();
    return;
}
```

**2. Missing Required Columns**
- Gracefully handle with `|| ''` or `|| 0` defaults
- Log warning in console
- Continue processing with available data

**3. Invalid Number Formats**
```javascript
parseFloat(value) || 0  // Returns 0 if NaN
```

**4. Multiple Same-Day Sales**
- Handled by aggregation in K4 Sammanställning
- Each sale preserved in K4 Detaljerad

**5. Different Currency Formats**
- GBX (pence) vs GBP (pounds)
- EUR vs SEK
- Handled via exchange rate column

### Unhandled Edge Cases (Future Work)

**1. ISK Accounts**
- Trading 212 doesn't offer ISK in Sweden
- If added in future, would need different tax treatment
- ISK = no K4 required (annual fixed fee instead)

**2. Derivatives (Options, Futures)**
- Trading 212 CSV might include these
- Current code would process them as stocks
- May need special handling per Swedish tax rules

**3. Corporate Actions (Splits, Mergers)**
- Not directly visible in CSV
- Might cause acquisition cost discrepancies
- User should verify against Trading 212 UI

---

## Extending the Application

### Adding Support for Another Broker

**Requirements:**
1. CSV format documentation
2. Column mapping logic
3. Test data from that broker
4. Updated documentation

**Implementation:**
1. Create broker-specific parser function
2. Detect broker from CSV structure
3. Normalize to common format
4. Use existing K4 generation logic

**Example:**
```javascript
function detectBroker(csvData) {
    const firstRow = csvData[0];
    if (firstRow.Action && firstRow.ISIN) return 'trading212';
    if (firstRow['Affär'] && firstRow['ISIN-kod']) return 'avanza';
    // ... other brokers
}
```

### Adding Multi-Year Support

**Allow combining 2023 + 2024:**

1. Accept multiple CSV uploads
2. Merge transactions from all files
3. Group by year
4. Generate separate K4 files per year
5. Provide combined summary

**UI Changes:**
- Multiple file upload
- Year selector/filter
- Combined stats view

---

## Deployment & Maintenance

### GitHub Pages Specifics

**Requirements:**
- All assets must be in repository
- Use CDN for libraries (don't commit node_modules)
- Keep total repo size < 1 GB
- Individual files < 100 MB

**Caching:**
- GitHub Pages caches aggressively
- Force refresh: Ctrl+Shift+R (Chrome), Cmd+Shift+R (Safari)
- Update version in HTML comments to bust cache

### Annual Maintenance Tasks

**Before Tax Season (February):**
1. Update year references in documentation
2. Test with latest Trading 212 CSV format
3. Update filing deadlines in guide
4. Check CDN library versions for updates
5. Review Skatteverket rule changes

**After Tax Season (June):**
1. Review GitHub issues
2. Merge community contributions
3. Update FAQ based on common questions

---

## Contributing Guidelines

### Code Style

**JavaScript:**
- Use `const` by default, `let` when reassignment needed
- Arrow functions for callbacks
- Template literals for strings
- Semicolons optional but consistent

**HTML:**
- Indent with 4 spaces
- Lowercase tag and attribute names
- Quote all attribute values
- Self-closing tags: `<input ... />`

**CSS:**
- Indent with 4 spaces
- Properties alphabetically sorted
- One selector per line
- Comments for section breaks

### Pull Request Process

1. Fork repository
2. Create feature branch
3. Make changes
4. Test thoroughly (see DEVELOPMENT.md)
5. Update documentation
6. Submit PR with clear description

### Commit Messages

Format:
```
<type>: <description>

<optional body>

<optional footer>
```

Types: feat, fix, docs, style, refactor, test, chore

---

## Known Limitations

### Technical Limitations

1. **Browser File Size Limits**
   - Most browsers handle < 100 MB files fine
   - For very large CSVs (>1000 transactions), may need optimization
   - Consider chunked processing if needed

2. **Excel Format**
   - Generates .xlsx (Excel 2007+)
   - Some older Excel versions may have compatibility issues
   - Google Sheets fully compatible

3. **Date Parsing**
   - Assumes Trading 212 uses ISO 8601 format
   - May break if format changes
   - No timezone handling (assumes UTC)

### Business Logic Limitations

1. **Single Broker**
   - Only Trading 212 CSV format supported
   - Other brokers need separate implementation

2. **Tax Year Handling**
   - Processes one year at a time
   - Multi-year requires multiple uploads

3. **ISK Not Supported**
   - Trading 212 doesn't offer ISK in Sweden
   - If added, would need different logic (ISK = no K4)

---

## Important Caveats for AI Assistants

### When Modifying This Code

**DO:**
- ✅ Maintain client-side only architecture
- ✅ Test with real Trading 212 CSV files
- ✅ Verify totals match Trading 212 exactly
- ✅ Keep comprehensive documentation
- ✅ Preserve privacy-first design
- ✅ Update tests when changing logic

**DO NOT:**
- ❌ Add server-side processing
- ❌ Transmit user data anywhere
- ❌ Store data in localStorage (privacy concern)
- ❌ Add tracking without user consent
- ❌ Change tax calculation logic without verification
- ❌ Remove error handling

### Tax Accuracy is Critical

**CRITICAL:** This tool generates tax filing documents. Errors can have legal/financial consequences.

**Verification Required:**
1. All calculations must match Trading 212's reported P/L
2. Test with multiple real CSV files
3. Verify against official Skatteverket requirements
4. Document any assumptions or limitations

**When Uncertain:**
- Add warnings in UI
- Recommend tax professional consultation
- Link to official Skatteverket documentation

---

## Resources

### Official Documentation

**Skatteverket (Swedish Tax Agency):**
- K4 Form: https://www.skatteverket.se/privat/skatter/vardepapper
- Instructions: Search for "K4 anvisningar"
- Contact: 0771-567 567

**Trading 212:**
- Help Center: https://helpcentre.trading212.com
- CSV Export Guide: In app under History → Statements

### Technical Resources

**PapaParse:**
- Docs: https://www.papaparse.com/docs
- GitHub: https://github.com/mholt/PapaParse

**SheetJS:**
- Docs: https://docs.sheetjs.com
- GitHub: https://github.com/SheetJS/sheetjs

---

## Version History & Future Roadmap

### Current Version: 1.0.0

**Features:**
- ✅ CSV upload and parsing
- ✅ Sell transaction filtering
- ✅ K4 Excel generation (3 sheets)
- ✅ Swedish number/date formatting
- ✅ Stock vs ETF detection
- ✅ Responsive design
- ✅ Comprehensive documentation

### Planned Features (v1.1)

- [ ] Swedish language UI
- [ ] Dark mode
- [ ] PDF summary export
- [ ] Multi-year CSV support
- [ ] Detailed per-security breakdown modal

### Wishlist (v2.0)

- [ ] Support for other Swedish brokers (Avanza, Nordnet)
- [ ] ISK account handling
- [ ] Dividend reporting (Ku10 form)
- [ ] Historical data visualization
- [ ] Export to Skatteverket's import format (if API available)

---

## Success Metrics

### User Success

**Primary Goal:** User completes K4 filing accurately and easily

**Metrics:**
- Time to convert: < 30 seconds
- Accuracy: 100% match with Trading 212
- User confidence: Clear summary and verification
- Success rate: Skatteverket accepts filing without issues

### Technical Success

**Performance:**
- Page load: < 2 seconds
- CSV parsing: < 1 second for 500 transactions
- Excel generation: < 2 seconds
- Mobile responsive: Works on all screen sizes

**Reliability:**
- No runtime errors
- Handles edge cases gracefully
- Cross-browser compatibility

---

## Contact & Support

### For Development Questions

- **GitHub Issues:** https://github.com/sedflix/trading212-k4-converter/issues
- **Code Review:** Submit PR for review
- **Feature Requests:** Open GitHub issue with [FEATURE] tag

### For Tax Questions

**Important:** This tool is for technical conversion only.

**Tax advice should come from:**
- Skatteverket (0771-567 567)
- Licensed tax advisors
- Accountants with Swedish tax expertise

---

## Final Notes for AI Assistants

This is a **production tax tool** used by real people for official government filings.

**When working on this code:**
1. **Accuracy is paramount** - test thoroughly
2. **Privacy is non-negotiable** - maintain client-side architecture
3. **Documentation is crucial** - update guides when changing logic
4. **User trust matters** - be transparent about limitations

**The code prioritizes:**
- Correctness over cleverness
- Simplicity over features
- Privacy over convenience
- Documentation over assumptions

---

*Last Updated: January 2026*
*Maintainer: sedflix*
*AI Assistant: Claude Sonnet 4.5*
