# Trading 212 to Swedish K4 Converter

A free, open-source tool to convert Trading 212 transaction history to Swedish tax form K4 (Bilaga B) format.

## 🌟 Features

- ✅ **100% Client-Side** - All processing in your browser, your data never leaves your computer
- ✅ **Easy to Use** - Upload CSV, download K4-ready Excel file
- ✅ **Accurate** - Calculates acquisition costs, sale proceeds, and profit/loss
- ✅ **Swedish K4 Format** - Ready for Skatteverket filing
- ✅ **Free & Open Source** - No registration, no fees, no tracking

## 🚀 Quick Start

### Online (GitHub Pages)

Visit: **https://sedflix.github.io/trading212-k4-converter/**

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sedflix/trading212-k4-converter.git
   cd trading212-k4-converter
   ```

2. **Start a local server:**

   **Option A: Using Python** (recommended)
   ```bash
   # Python 3
   python3 -m http.server 8000
   ```

   **Option B: Using Node.js**
   ```bash
   npx http-server -p 8000
   ```

   **Option C: Using PHP**
   ```bash
   php -S localhost:8000
   ```

3. **Open in browser:**
   ```
   http://localhost:8000
   ```

## 🧪 Testing

### Test with Sample Data

Use the included sample CSV files:

```bash
# Test with 2024 data
# Upload: sample-2024.csv
# Expected result: 8,297.89 SEK net P/L

# Test with 2023 data
# Upload: sample-2023.csv
# Expected result: 91.90 SEK net P/L
```

### Manual Testing

1. Open the application in a browser
2. Upload a Trading 212 CSV file
3. Verify:
   - ✓ File is parsed correctly
   - ✓ Sell transactions are filtered
   - ✓ Totals match Trading 212 statement
   - ✓ Excel files download successfully
   - ✓ K4 summary shows correct amounts

### Test Cases

#### Test Case 1: Valid 2024 CSV
- **Input:** sample-2024.csv
- **Expected:** 132 sell transactions
- **Expected Total:** 8,297.89 SEK
- **Expected Gains:** 9,167.80 SEK
- **Expected Losses:** -869.91 SEK

#### Test Case 2: Valid 2023 CSV
- **Input:** sample-2023.csv
- **Expected:** 16 sell transactions
- **Expected Total:** 91.90 SEK
- **Expected Gains:** 134.02 SEK
- **Expected Losses:** -42.12 SEK

#### Test Case 3: No Sell Transactions
- **Input:** CSV with only buy/dividend transactions
- **Expected:** Error message "No sell transactions found"

#### Test Case 4: Invalid File
- **Input:** Non-CSV file (PDF, TXT, etc.)
- **Expected:** File type error

## 📁 Project Structure

```
trading212-k4-converter/
├── index.html              # Main application page
├── guide.html              # User guide
├── styles.css              # Styling
├── app.js                  # Application logic
├── README.md               # This file
├── DEVELOPMENT.md          # Development guide
└── test/
    ├── test-data/          # Sample CSV files for testing
    └── test-results/       # Expected outputs
```

## 🛠️ Technology Stack

- **HTML5** - Structure
- **CSS3** - Styling with responsive design
- **JavaScript (ES6+)** - Client-side logic
- **PapaParse** - CSV parsing
- **SheetJS (xlsx)** - Excel file generation

No build process required - pure static files!

## 🔧 Development

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (Python, Node.js, or PHP)
- Text editor

### File Descriptions

**index.html**
- Main application interface
- File upload area
- Preview section
- Download section
- FAQ

**app.js**
- CSV parsing logic
- Data transformation
- K4 format conversion
- Excel file generation

**styles.css**
- Responsive design
- Swedish blue color scheme
- Accessible and clean UI

**guide.html**
- Complete user guide
- Filing instructions
- Troubleshooting

### Adding New Features

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## ⚠️ Important Notes

### Supported Formats

✅ **Supported:**
- Trading 212 CSV exports
- Market sell transactions
- Limit sell transactions

❌ **Not Supported:**
- PDF statements (use CSV instead)
- Other brokers (only Trading 212 format)
- Buy transactions (only sells for K4)
- Dividends (reported separately, not on K4)

### Calculation Method

Trading 212 uses the **average cost method** (genomsnittsmetoden) for calculating acquisition costs. This is automatically handled in the CSV export and accepted by Skatteverket.

### Tax Years

Process each tax year separately:
- 2023 trades → 2023 K4 (filed in 2024)
- 2024 trades → 2024 K4 (filed in 2025)
- And so on...

## 📋 Checklist Before Filing

- [ ] Exported correct year from Trading 212
- [ ] Total P/L matches Trading 212 statement
- [ ] Reviewed all transactions in Excel file
- [ ] Used Sheet 2 (K4 Sammanställning) for cleaner filing
- [ ] Verified totals in summary sheet
- [ ] Kept original CSV and generated Excel files (10 years)
- [ ] Filed before deadline (May 2 for online, April 2 for paper)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

### Areas for Improvement

- Multi-year support (combine multiple CSVs)
- PDF parsing (if technically feasible)
- Additional broker support
- Automated ISK/KF account handling
- Swedish language version

## 📄 License

MIT License - Free to use, modify, and distribute.

## 🙏 Acknowledgments

- Built for Swedish investors using Trading 212
- Inspired by the need for easier tax filing
- Thanks to all contributors

## 📞 Support

- **Issues:** <a href="https://github.com/sedflix/trading212-k4-converter/issues">GitHub Issues</a>
- **Questions:** Create a discussion on GitHub
- **Tax Questions:** Contact Skatteverket at 0771-567 567

---

**Disclaimer:** This tool is provided as-is for informational purposes. Always verify calculations and consult a tax professional for complex situations. Not affiliated with Trading 212 or Skatteverket.

---

Made with ❤️ for Swedish investors
