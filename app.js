// Trading 212 to Swedish K4 Converter
// Client-side application - all processing in browser

let transactionData = null;
let sellTransactions = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');

    // Click to upload
    uploadArea.addEventListener('click', () => fileInput.click());

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file && file.name.endsWith('.csv')) {
            handleFile(file);
        } else {
            alert('Please upload a CSV file from Trading 212');
        }
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFile(file);
        }
    });

    // Download buttons
    document.getElementById('downloadK4').addEventListener('click', downloadK4Excel);
    document.getElementById('downloadOriginal').addEventListener('click', downloadOriginalExcel);
});

function handleFile(file) {
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.innerHTML = '<div class="loading">Processing...</div>';

    Papa.parse(file, {
        header: true,
        complete: function(results) {
            processCSV(results.data, file.name);
        },
        error: function(error) {
            alert('Error parsing CSV: ' + error.message);
            resetUploadArea();
        }
    });
}

function processCSV(data, filename) {
    transactionData = data;

    // Filter for sell transactions
    sellTransactions = data.filter(row =>
        row.Action && row.Action.toLowerCase().includes('sell')
    );

    if (sellTransactions.length === 0) {
        alert('No sell transactions found in this CSV file. Please upload a file containing sell trades.');
        resetUploadArea();
        return;
    }

    // Parse and calculate
    sellTransactions = sellTransactions.map(row => {
        return {
            time: row.Time,
            instrument: row.Ticker || '',
            name: row.Name || '',
            isin: row.ISIN || '',
            instrumentType: determineType(row.Name),
            currency: row['Currency (Price / share)'] || '',
            quantity: parseFloat(row['No. of shares']) || 0,
            pricePerShare: parseFloat(row['Price / share']) || 0,
            fxRate: parseFloat(row['Exchange rate']) || 0,
            totalSEK: parseFloat(row.Total) || 0,
            realisedPL: parseFloat(row.Result) || 0,
            transactionCurrency: row['Currency (Result)'] || 'SEK'
        };
    });

    // Sort by time
    sellTransactions.sort((a, b) => new Date(a.time) - new Date(b.time));

    // Calculate totals
    const totalPL = sellTransactions.reduce((sum, t) => sum + t.realisedPL, 0);
    const gains = sellTransactions.filter(t => t.realisedPL > 0).reduce((sum, t) => sum + t.realisedPL, 0);
    const losses = sellTransactions.filter(t => t.realisedPL < 0).reduce((sum, t) => sum + t.realisedPL, 0);

    // Get year from filename or first transaction
    const year = extractYear(filename, sellTransactions[0].time);

    displayPreview(sellTransactions, { totalPL, gains, losses, year });
    displayK4Summary({ totalPL, gains, losses, year, count: sellTransactions.length });

    // Update upload area
    document.getElementById('uploadArea').innerHTML = `
        <div class="upload-success">
            ✅ File loaded: ${filename}<br>
            Found ${sellTransactions.length} sell transactions
        </div>
    `;

    // Show sections
    document.getElementById('previewSection').style.display = 'block';
    document.getElementById('downloadSection').style.display = 'block';

    // Scroll to preview
    document.getElementById('previewSection').scrollIntoView({ behavior: 'smooth' });
}

function determineType(name) {
    if (!name) return 'Stock';
    const nameLower = name.toLowerCase();
    if (nameLower.includes('etf') || nameLower.includes('ishares') ||
        nameLower.includes('vanguard') || nameLower.includes('pimco')) {
        return 'ETF';
    }
    return 'Stock';
}

function extractYear(filename, firstTransactionTime) {
    // Try from filename first
    const yearMatch = filename.match(/202\d/);
    if (yearMatch) return yearMatch[0];

    // Try from transaction time
    if (firstTransactionTime) {
        const dateMatch = firstTransactionTime.match(/(\d{4})-/);
        if (dateMatch) return dateMatch[1];
    }

    return new Date().getFullYear().toString();
}

function displayPreview(transactions, stats) {
    // Stats
    const statsHTML = `
        <div class="stat-card">
            <div class="stat-value">${transactions.length}</div>
            <div class="stat-label">Sell Transactions</div>
        </div>
        <div class="stat-card ${stats.totalPL >= 0 ? 'positive' : 'negative'}">
            <div class="stat-value">${formatSEK(stats.totalPL)}</div>
            <div class="stat-label">Net Profit/Loss</div>
        </div>
        <div class="stat-card positive">
            <div class="stat-value">${formatSEK(stats.gains)}</div>
            <div class="stat-label">Total Gains</div>
        </div>
        <div class="stat-card negative">
            <div class="stat-value">${formatSEK(Math.abs(stats.losses))}</div>
            <div class="stat-label">Total Losses</div>
        </div>
    `;
    document.getElementById('previewStats').innerHTML = statsHTML;

    // Table preview (first 10 and last 5)
    const previewTransactions = [
        ...transactions.slice(0, 10),
        ...(transactions.length > 15 ? [{ separator: true }] : []),
        ...transactions.slice(-5)
    ];

    let tableHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Instrument</th>
                    <th>ISIN</th>
                    <th>Quantity</th>
                    <th>Total (SEK)</th>
                    <th>P/L (SEK)</th>
                </tr>
            </thead>
            <tbody>
    `;

    previewTransactions.forEach(t => {
        if (t.separator) {
            tableHTML += `<tr class="separator"><td colspan="6">... ${transactions.length - 15} more transactions ...</td></tr>`;
        } else {
            const plClass = t.realisedPL >= 0 ? 'positive' : 'negative';
            tableHTML += `
                <tr>
                    <td>${formatDate(t.time)}</td>
                    <td><strong>${t.instrument}</strong></td>
                    <td class="small">${t.isin}</td>
                    <td class="number">${t.quantity.toFixed(6)}</td>
                    <td class="number">${formatSEK(t.totalSEK)}</td>
                    <td class="number ${plClass}">${formatSEK(t.realisedPL)}</td>
                </tr>
            `;
        }
    });

    tableHTML += '</tbody></table>';
    document.getElementById('previewTable').innerHTML = tableHTML;
}

function displayK4Summary(stats) {
    const html = `
        <div class="k4-box">
            <h3>Swedish K4 Summary (Tax Year ${stats.year})</h3>
            <table class="k4-table">
                <tr>
                    <td>Number of transactions:</td>
                    <td><strong>${stats.count}</strong></td>
                </tr>
                <tr>
                    <td>Box 3.3 - Total Gains (Vinster):</td>
                    <td><strong class="positive">${formatSEK(stats.gains)}</strong></td>
                </tr>
                <tr>
                    <td>Box 3.4 - Total Losses (Förluster):</td>
                    <td><strong class="negative">${formatSEK(Math.abs(stats.losses))}</strong></td>
                </tr>
                <tr class="total-row">
                    <td>Box 3.5 - Net Result (Nettoresultat):</td>
                    <td><strong class="${stats.totalPL >= 0 ? 'positive' : 'negative'}">${formatSEK(stats.totalPL)}</strong></td>
                </tr>
                <tr>
                    <td>Estimated tax (30%):</td>
                    <td><strong>~${formatSEK(stats.totalPL * 0.3)}</strong></td>
                </tr>
            </table>
        </div>
        <div class="info-box">
            <strong>⚠️ Important:</strong> All Trading 212 securities are foreign.
            Use <strong>K4 Bilaga B (Part B)</strong> - Foreign securities only.
        </div>
    `;
    document.getElementById('k4Summary').innerHTML = html;
}

function downloadK4Excel() {
    if (!sellTransactions) return;

    const year = extractYear('', sellTransactions[0].time);

    // Create K4 Detailed sheet
    const k4Detailed = sellTransactions.map(t => {
        const acquisitionCost = (t.quantity * t.pricePerShare * t.fxRate).toFixed(2);
        return {
            'Värdepapper': `${t.instrument} (${t.isin})`,
            'Antal': t.quantity,
            'Försäljningspris (SEK)': t.totalSEK,
            'Omkostnadsbelopp (SEK)': parseFloat(acquisitionCost),
            'Vinst (+) / Förlust (-) (SEK)': t.realisedPL,
            'Försäljningsdatum': formatDateISO(t.time),
            'Land': t.isin.substring(0, 2),
            'ISIN': t.isin,
            'Typ': t.instrumentType,
            'Valuta': t.currency
        };
    });

    // Create K4 Aggregated sheet
    const grouped = {};
    sellTransactions.forEach(t => {
        const key = t.isin;
        if (!grouped[key]) {
            grouped[key] = {
                instrument: t.instrument,
                isin: t.isin,
                type: t.instrumentType,
                country: t.isin.substring(0, 2),
                currency: t.currency,
                quantity: 0,
                saleProceeds: 0,
                acquisitionCost: 0,
                profitLoss: 0,
                transactions: 0
            };
        }
        grouped[key].quantity += t.quantity;
        grouped[key].saleProceeds += t.totalSEK;
        grouped[key].acquisitionCost += t.quantity * t.pricePerShare * t.fxRate;
        grouped[key].profitLoss += t.realisedPL;
        grouped[key].transactions += 1;
    });

    const k4Aggregated = Object.values(grouped)
        .sort((a, b) => b.profitLoss - a.profitLoss)
        .map(g => ({
            'Värdepapper': `${g.instrument} (${g.isin})`,
            'Totalt Antal': g.quantity,
            'Totalt Försäljningspris (SEK)': g.saleProceeds,
            'Totalt Omkostnadsbelopp (SEK)': g.acquisitionCost,
            'Totalt Vinst/Förlust (SEK)': g.profitLoss,
            'Antal Transaktioner': g.transactions,
            'Land': g.country,
            'ISIN': g.isin,
            'Typ': g.type
        }));

    // Create summary sheet
    const totalGains = sellTransactions.filter(t => t.realisedPL > 0).reduce((sum, t) => sum + t.realisedPL, 0);
    const totalLosses = sellTransactions.filter(t => t.realisedPL < 0).reduce((sum, t) => sum + t.realisedPL, 0);
    const totalPL = totalGains + totalLosses;
    const totalSaleProceeds = sellTransactions.reduce((sum, t) => sum + t.totalSEK, 0);
    const totalAcquisitionCost = sellTransactions.reduce((sum, t) => sum + (t.quantity * t.pricePerShare * t.fxRate), 0);

    const summary = [
        { 'Beskrivning': 'Totalt antal transaktioner', 'Belopp (SEK)': `${sellTransactions.length} st` },
        { 'Beskrivning': 'Totalt antal unika värdepapper', 'Belopp (SEK)': `${Object.keys(grouped).length} st` },
        { 'Beskrivning': 'Totalt försäljningspris', 'Belopp (SEK)': totalSaleProceeds.toFixed(2) },
        { 'Beskrivning': 'Totalt omkostnadsbelopp', 'Belopp (SEK)': totalAcquisitionCost.toFixed(2) },
        { 'Beskrivning': '', 'Belopp (SEK)': '' },
        { 'Beskrivning': 'VINSTER (Box 3.3)', 'Belopp (SEK)': totalGains.toFixed(2) },
        { 'Beskrivning': 'FÖRLUSTER (Box 3.4)', 'Belopp (SEK)': totalLosses.toFixed(2) },
        { 'Beskrivning': 'NETTORESULTAT (Box 3.5)', 'Belopp (SEK)': totalPL.toFixed(2) },
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Add sheets
    const ws1 = XLSX.utils.json_to_sheet(k4Detailed);
    const ws2 = XLSX.utils.json_to_sheet(k4Aggregated);
    const ws3 = XLSX.utils.json_to_sheet(summary);

    XLSX.utils.book_append_sheet(wb, ws1, 'K4 Detaljerad');
    XLSX.utils.book_append_sheet(wb, ws2, 'K4 Sammanställning');
    XLSX.utils.book_append_sheet(wb, ws3, 'Sammanfattning');

    // Store for download
    window.k4Workbook = wb;
    window.year = year;

    // Enable download button
    document.getElementById('downloadK4').disabled = false;
}

function downloadK4Excel() {
    if (!window.k4Workbook) return;

    const filename = `${window.year}_K4_Statement.xlsx`;
    XLSX.writeFile(window.k4Workbook, filename);

    // Show success message
    showNotification(`✅ Downloaded: ${filename}`);
}

function downloadOriginalExcel() {
    if (!sellTransactions) return;

    const year = window.year || new Date().getFullYear();

    // Create detailed transaction sheet
    const detailedData = sellTransactions.map(t => {
        const dt = new Date(t.time);
        return {
            'EXECUTION TIME': formatDateTime(t.time),
            'INSTRUMENT': t.instrument,
            'NAME': t.name,
            'ISIN': t.isin,
            'INSTRUMENT TYPE': t.instrumentType,
            'INSTRUMENT CURRENCY': t.currency,
            'QUANTITY': t.quantity,
            'PRICE / SHARE': t.pricePerShare,
            'FX RATE': t.fxRate,
            'TRANSACTION CURRENCY': t.transactionCurrency,
            'TOTAL (SEK)': t.totalSEK,
            'REALISED P/L': t.realisedPL
        };
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(detailedData);
    XLSX.utils.book_append_sheet(wb, ws, 'Sell Trades');

    const filename = `${year}_statement.xlsx`;
    XLSX.writeFile(wb, filename);

    showNotification(`✅ Downloaded: ${filename}`);
}

function resetUploadArea() {
    document.getElementById('uploadArea').innerHTML = `
        <div class="upload-icon">📁</div>
        <p class="upload-text">Click to select CSV file or drag & drop here</p>
        <p class="upload-hint">Accepts: .csv files from Trading 212</p>
    `;
}

function formatSEK(amount) {
    return new Intl.NumberFormat('sv-SE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount) + ' SEK';
}

function formatDate(dateStr) {
    const dt = new Date(dateStr);
    const day = String(dt.getDate()).padStart(2, '0');
    const month = String(dt.getMonth() + 1).padStart(2, '0');
    const year = dt.getFullYear();
    return `${day}.${month}.${year}`;
}

function formatDateTime(dateStr) {
    const dt = new Date(dateStr);
    const day = String(dt.getDate()).padStart(2, '0');
    const month = String(dt.getMonth() + 1).padStart(2, '0');
    const year = dt.getFullYear();
    const hours = String(dt.getHours()).padStart(2, '0');
    const minutes = String(dt.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

function formatDateISO(dateStr) {
    const dt = new Date(dateStr);
    const year = dt.getFullYear();
    const month = String(dt.getMonth() + 1).padStart(2, '0');
    const day = String(dt.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
