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
    uploadArea.innerHTML = '<div class="relative z-10"><div class="text-blue-600 font-bold text-2xl animate-pulse">Processing...</div></div>';

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
    prepareK4Data(sellTransactions, year);

    // Update upload area
    document.getElementById('uploadArea').innerHTML = `
        <div class="relative z-10">
            <div class="text-7xl mb-6">✅</div>
            <p class="text-2xl font-bold text-green-600 mb-2">File loaded successfully!</p>
            <p class="text-lg text-gray-700 font-medium">${filename}</p>
            <p class="text-base text-gray-600 mt-2">Found ${sellTransactions.length} sell transactions</p>
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
    // Stats with Tailwind classes
    const statsHTML = `
        <div class="bg-white border-2 border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-all">
            <div class="text-3xl font-bold text-gray-900 mb-2">${transactions.length}</div>
            <div class="text-sm font-semibold text-gray-600 uppercase tracking-wide">Transactions</div>
        </div>
        <div class="bg-gradient-to-br ${stats.totalPL >= 0 ? 'from-green-50 to-emerald-50 border-green-300' : 'from-red-50 to-rose-50 border-red-300'} border-2 rounded-xl p-6 text-center hover:shadow-lg transition-all">
            <div class="text-3xl font-bold ${stats.totalPL >= 0 ? 'text-green-600' : 'text-red-600'} mb-2">${formatSEK(stats.totalPL)}</div>
            <div class="text-sm font-semibold text-gray-600 uppercase tracking-wide">Net P/L</div>
        </div>
        <div class="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6 text-center hover:shadow-lg transition-all">
            <div class="text-3xl font-bold text-green-600 mb-2">${formatSEK(stats.gains)}</div>
            <div class="text-sm font-semibold text-gray-600 uppercase tracking-wide">Gains</div>
        </div>
        <div class="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-300 rounded-xl p-6 text-center hover:shadow-lg transition-all">
            <div class="text-3xl font-bold text-red-600 mb-2">${formatSEK(Math.abs(stats.losses))}</div>
            <div class="text-sm font-semibold text-gray-600 uppercase tracking-wide">Losses</div>
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
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-blue-600 text-white">
                    <tr>
                        <th class="px-4 py-3 text-left font-semibold">Date</th>
                        <th class="px-4 py-3 text-left font-semibold">Instrument</th>
                        <th class="px-4 py-3 text-left font-semibold">ISIN</th>
                        <th class="px-4 py-3 text-right font-semibold">Quantity</th>
                        <th class="px-4 py-3 text-right font-semibold">Total (SEK)</th>
                        <th class="px-4 py-3 text-right font-semibold">P/L (SEK)</th>
                    </tr>
                </thead>
                <tbody>
    `;

    previewTransactions.forEach(t => {
        if (t.separator) {
            tableHTML += `<tr><td colspan="6" class="px-4 py-4 text-center italic text-gray-500 bg-gray-100">... ${transactions.length - 15} more transactions ...</td></tr>`;
        } else {
            const plColorClass = t.realisedPL >= 0 ? 'text-green-600' : 'text-red-600';
            tableHTML += `
                <tr class="border-b border-gray-200 hover:bg-gray-50">
                    <td class="px-4 py-3">${formatDate(t.time)}</td>
                    <td class="px-4 py-3 font-semibold">${t.instrument}</td>
                    <td class="px-4 py-3 text-gray-600 text-xs">${t.isin}</td>
                    <td class="px-4 py-3 text-right font-mono">${t.quantity.toFixed(6)}</td>
                    <td class="px-4 py-3 text-right font-mono">${formatSEK(t.totalSEK)}</td>
                    <td class="px-4 py-3 text-right font-mono font-semibold ${plColorClass}">${formatSEK(t.realisedPL)}</td>
                </tr>
            `;
        }
    });

    tableHTML += '</tbody></table></div>';
    document.getElementById('previewTable').innerHTML = tableHTML;
}

function displayK4Summary(stats) {
    const html = `
        <h3 class="text-2xl font-bold text-blue-900 mb-6">Swedish K4 Summary (Tax Year ${stats.year})</h3>
        <div class="space-y-3">
            <div class="flex justify-between py-3 border-b border-blue-200">
                <span class="text-gray-700 font-medium">Number of transactions:</span>
                <span class="font-bold text-gray-900">${stats.count}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-blue-200">
                <span class="text-gray-700 font-medium">Box 3.3 - Total Gains (Vinster):</span>
                <span class="font-bold text-green-600">${formatSEK(stats.gains)}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-blue-200">
                <span class="text-gray-700 font-medium">Box 3.4 - Total Losses (Förluster):</span>
                <span class="font-bold text-red-600">${formatSEK(Math.abs(stats.losses))}</span>
            </div>
            <div class="flex justify-between py-4 bg-blue-100 rounded-lg px-4 mt-2">
                <span class="text-gray-900 font-bold">Box 3.5 - Net Result (Nettoresultat):</span>
                <span class="font-bold text-xl ${stats.totalPL >= 0 ? 'text-green-600' : 'text-red-600'}">${formatSEK(stats.totalPL)}</span>
            </div>
            <div class="flex justify-between py-3">
                <span class="text-gray-700 font-medium">Estimated tax (30%):</span>
                <span class="font-bold text-gray-900">~${formatSEK(stats.totalPL * 0.3)}</span>
            </div>
        </div>
        <div class="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p class="text-sm text-gray-700"><strong class="text-blue-700">⚠️ Important:</strong> All Trading 212 securities are foreign. Use <strong>K4 Bilaga B (Part B)</strong> - Foreign securities only.</p>
        </div>
    `;
    document.getElementById('k4Summary').innerHTML = html;
}

function prepareK4Data(transactions, year) {
    if (!transactions) return;

    const sellTransactions = transactions;

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
    window.k4Data = {
        detailed: k4Detailed,
        aggregated: k4Aggregated,
        summary: summary
    };
    window.year = year;

    // Enable download button
    document.getElementById('downloadK4').disabled = false;
}

function downloadK4Excel() {
    try {
        const format = document.getElementById('k4Format').value;
        console.log('Selected K4 format:', format);

        if (format === 'excel') {
            downloadK4AsExcel();
        } else if (format === 'pdf') {
            downloadK4AsPDF();
        } else if (format === 'csv') {
            downloadK4AsCSV();
        }
    } catch (error) {
        console.error('Error in downloadK4Excel:', error);
        alert('Error generating download: ' + error.message);
    }
}

function downloadK4AsExcel() {
    if (!window.k4Workbook) return;

    const filename = `${window.year}_K4_Statement.xlsx`;
    XLSX.writeFile(window.k4Workbook, filename);

    // Show success message
    showNotification(`✅ Downloaded: ${filename}`);
}

function downloadK4AsPDF() {
    try {
        console.log('Starting PDF generation...');

        if (!window.k4Data) {
            console.error('No K4 data available');
            alert('No data available for PDF generation');
            return;
        }

        if (!window.jspdf || !window.jspdf.jsPDF) {
            console.error('jsPDF library not loaded');
            alert('PDF library not loaded. Please refresh the page and try again.');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        const year = window.year || new Date().getFullYear();

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;

        // Calculate totals
        const totalGains = sellTransactions.filter(t => t.realisedPL > 0).reduce((sum, t) => sum + t.realisedPL, 0);
        const totalLosses = sellTransactions.filter(t => t.realisedPL < 0).reduce((sum, t) => sum + t.realisedPL, 0);
        const totalPL = totalGains + totalLosses;

        // Helper function to add official K4 header
        const addK4Header = (pageNum) => {
            // Skatteverket header
            doc.setFontSize(11);
            doc.setFont(undefined, 'bold');
            doc.text('Skatteverket', margin, 15);

            // K4 title (top right)
            doc.setFontSize(24);
            doc.text('K4', pageWidth - margin, 15, { align: 'right' });

            // Document title
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text('Försäljning', pageWidth - margin, 23, { align: 'right' });
            doc.setFont(undefined, 'normal');
            doc.setFontSize(10);
            doc.text('Värdepapper m.m.', pageWidth - margin, 28, { align: 'right' });

            // Year box
            doc.setLineWidth(0.5);
            doc.rect(pageWidth - margin - 40, 33, 40, 8);
            doc.setFontSize(9);
            doc.text('Inkomstår', pageWidth - margin - 38, 37);
            doc.setFontSize(11);
            doc.setFont(undefined, 'bold');
            doc.text(year.toString(), pageWidth - margin - 20, 40, { align: 'center' });
            doc.setFont(undefined, 'normal');
        };

        // Helper function to add page footer
        const addFooter = (pageNum) => {
            doc.setFontSize(8);
            doc.setTextColor(100);
            doc.text(`Sida ${pageNum}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
            doc.setTextColor(0);
        };

        // ========== PAGE 1: K4 FORM WITH SECTIONS ==========
        let currentPage = 1;
        addK4Header(currentPage);

        let yPos = 50;

        // Information box (like in official form)
        doc.setFillColor(245, 245, 245);
        doc.setLineWidth(0.3);
        doc.rect(margin, yPos, pageWidth - 2 * margin, 15, 'FD');
        doc.setFontSize(8);
        doc.text('Blankett för försäljning av värdepapper (Trading 212)', margin + 2, yPos + 5);
        doc.text('Detta dokument innehåller sammanställning för K4 Bilaga B - Utländska aktier', margin + 2, yPos + 10);
        doc.text(`Inkomstår ${year}`, margin + 2, yPos + 13);

        yPos += 20;

        // Summary boxes (Tax boxes)
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text('SAMMANFATTNING', margin, yPos);
        yPos += 7;

        // Summary statistics
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.text(`Antal transaktioner: ${sellTransactions.length}`, margin, yPos);
        doc.text(`Antal värdepapper: ${Object.keys(window.k4Data.aggregated.reduce((acc, item) => { acc[item.ISIN] = true; return acc; }, {})).length}`, margin + 60, yPos);
        yPos += 8;

        // Tax boxes section
        doc.setLineWidth(0.5);
        const boxHeight = 10;
        const boxWidth = (pageWidth - 2 * margin) / 2;

        // Box 3.3 - Vinster (Gains)
        doc.setFillColor(255, 255, 255);
        doc.rect(margin, yPos, boxWidth - 2, boxHeight);
        doc.setFontSize(9);
        doc.setFont(undefined, 'bold');
        doc.text('Box 3.3 Vinster:', margin + 2, yPos + 6);
        doc.setTextColor(0, 120, 0);
        doc.text(formatSEK(totalGains), margin + boxWidth - 4, yPos + 6, { align: 'right' });
        doc.setTextColor(0);

        // Box 3.4 - Förluster (Losses)
        doc.setFillColor(255, 255, 255);
        doc.rect(margin + boxWidth, yPos, boxWidth - 2, boxHeight);
        doc.setFont(undefined, 'bold');
        doc.text('Box 3.4 Förluster:', margin + boxWidth + 2, yPos + 6);
        doc.setTextColor(180, 0, 0);
        doc.text(formatSEK(Math.abs(totalLosses)), pageWidth - margin - 2, yPos + 6, { align: 'right' });
        doc.setTextColor(0);

        yPos += boxHeight + 2;

        // Box 3.5 - Nettoresultat (Net Result)
        doc.setFillColor(240, 248, 255);
        doc.rect(margin, yPos, pageWidth - 2 * margin, boxHeight, 'FD');
        doc.setFont(undefined, 'bold');
        doc.setFontSize(10);
        doc.text('Box 3.5 Nettoresultat:', margin + 2, yPos + 6);
        doc.setTextColor(totalPL >= 0 ? 0 : 180, totalPL >= 0 ? 120 : 0, 0);
        doc.text(formatSEK(totalPL), pageWidth - margin - 2, yPos + 6, { align: 'right' });
        doc.setTextColor(0);

        yPos += boxHeight + 3;
        doc.setFont(undefined, 'normal');
        doc.setFontSize(8);
        doc.setTextColor(80);
        doc.text(`Beräknad skatt (30%): ${formatSEK(Math.max(0, totalPL * 0.3))}`, margin, yPos);
        doc.setTextColor(0);

        yPos += 10;

        // ========== SECTION A: MARKNADSNOTERADE AKTIER ==========
        doc.setFillColor(220, 220, 220);
        doc.rect(margin, yPos, pageWidth - 2 * margin, 8, 'F');
        doc.setLineWidth(0.5);
        doc.rect(margin, yPos, pageWidth - 2 * margin, 8);
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text('A. Marknadsnoterade aktier, aktieindexobligationer m.m. (Bilaga B - Utländska)', margin + 2, yPos + 5.5);

        yPos += 12;

        // Section A explanation
        doc.setFontSize(8);
        doc.setFont(undefined, 'italic');
        doc.text('Alla Trading 212 värdepapper är utländska och ska rapporteras i K4 Bilaga B', margin, yPos);

        addFooter(currentPage);

        // ========== PAGE 2: SECTION A DATA (AGGREGATED) ==========
        doc.addPage();
        currentPage++;
        addK4Header(currentPage);

        yPos = 50;
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text('Sektion A: Marknadsnoterade aktier - Sammanställning (Aggregerad)', margin, yPos);

        doc.setFontSize(8);
        doc.setFont(undefined, 'italic');
        yPos += 6;
        doc.text('Rekommenderas för inmatning i Skatteverkets system. Flera försäljningar av samma värdepapper summeras.', margin, yPos);
        yPos += 8;

        // Prepare aggregated data table
        const k4AggregatedData = window.k4Data.aggregated.map(item => [
            item['Värdepapper'].substring(0, 35), // Truncate long names
            item['Totalt Antal'].toFixed(4),
            item['Totalt Försäljningspris (SEK)'].toFixed(2),
            item['Totalt Omkostnadsbelopp (SEK)'].toFixed(2),
            item['Totalt Vinst/Förlust (SEK)'].toFixed(2)
        ]);

        doc.autoTable({
            startY: yPos,
            head: [['Värdepapper', 'Antal', 'Försäljningspris (SEK)', 'Omkostnadsbelopp (SEK)', 'Vinst/Förlust (SEK)']],
            body: k4AggregatedData,
            margin: { left: margin, right: margin, top: 50, bottom: 20 },
            styles: {
                fontSize: 7,
                cellPadding: 2,
                lineColor: [200, 200, 200],
                lineWidth: 0.1
            },
            headStyles: {
                fillColor: [220, 220, 220],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                halign: 'center',
                lineWidth: 0.5,
                lineColor: [100, 100, 100]
            },
            columnStyles: {
                0: { cellWidth: 65 },
                1: { halign: 'right', cellWidth: 25 },
                2: { halign: 'right', cellWidth: 28 },
                3: { halign: 'right', cellWidth: 28 },
                4: { halign: 'right', cellWidth: 24 }
            },
            alternateRowStyles: {
                fillColor: [250, 250, 250]
            },
            didDrawPage: (data) => {
                addK4Header(currentPage + data.pageNumber - 1);
                addFooter(currentPage + data.pageNumber - 1);
            }
        });

        // Update current page after table
        currentPage = doc.internal.getNumberOfPages();

        // ========== PAGE N: SECTION A - DETAILED TRANSACTIONS ==========
        doc.addPage();
        currentPage++;
        addK4Header(currentPage);

        yPos = 50;
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text('Sektion A: Detaljerad - Alla individuella transaktioner', margin, yPos);

        doc.setFontSize(8);
        doc.setFont(undefined, 'italic');
        yPos += 6;
        doc.text('För verifiering och referens. Varje försäljning visas separat.', margin, yPos);
        yPos += 8;

        // Prepare detailed data table
        const k4DetailedData = window.k4Data.detailed.map(item => [
            item['Värdepapper'].substring(0, 30),
            item['Antal'].toFixed(4),
            item['Försäljningspris (SEK)'].toFixed(2),
            item['Omkostnadsbelopp (SEK)'].toFixed(2),
            item['Vinst (+) / Förlust (-) (SEK)'].toFixed(2),
            item['Försäljningsdatum']
        ]);

        doc.autoTable({
            startY: yPos,
            head: [['Värdepapper', 'Antal', 'Försäljningspris', 'Omkostnad', 'Vinst/Förlust', 'Datum']],
            body: k4DetailedData,
            margin: { left: margin, right: margin, top: 50, bottom: 20 },
            styles: {
                fontSize: 6,
                cellPadding: 1.5,
                lineColor: [200, 200, 200],
                lineWidth: 0.1
            },
            headStyles: {
                fillColor: [220, 220, 220],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                fontSize: 7,
                halign: 'center',
                lineWidth: 0.5,
                lineColor: [100, 100, 100]
            },
            columnStyles: {
                0: { cellWidth: 55 },
                1: { halign: 'right', cellWidth: 22 },
                2: { halign: 'right', cellWidth: 27 },
                3: { halign: 'right', cellWidth: 27 },
                4: { halign: 'right', cellWidth: 27 },
                5: { halign: 'center', cellWidth: 22 }
            },
            alternateRowStyles: {
                fillColor: [252, 252, 252]
            },
            didDrawPage: (data) => {
                addK4Header(currentPage + data.pageNumber - 1);
                addFooter(currentPage + data.pageNumber - 1);
            }
        });

        // Update current page after table
        currentPage = doc.internal.getNumberOfPages();

        // ========== FINAL PAGE: SECTIONS B, C, D ==========
        doc.addPage();
        currentPage++;
        addK4Header(currentPage);

        yPos = 50;

        // Section B: Återföring av uppskovsbelopp
        doc.setFillColor(220, 220, 220);
        doc.rect(margin, yPos, pageWidth - 2 * margin, 8, 'F');
        doc.setLineWidth(0.5);
        doc.rect(margin, yPos, pageWidth - 2 * margin, 8);
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text('B. Återföring av uppskovsbelopp', margin + 2, yPos + 5.5);

        yPos += 12;
        doc.setFontSize(8);
        doc.setFont(undefined, 'italic');
        doc.text('Ej tillämpligt - Inga uppskovsbelopp att återföra för Trading 212 transaktioner.', margin, yPos);

        yPos += 15;

        // Section C: Marknadsnoterade obligationer
        doc.setFillColor(220, 220, 220);
        doc.rect(margin, yPos, pageWidth - 2 * margin, 8, 'F');
        doc.setLineWidth(0.5);
        doc.rect(margin, yPos, pageWidth - 2 * margin, 8);
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text('C. Marknadsnoterade obligationer, valuta m.m.', margin + 2, yPos + 5.5);

        yPos += 12;
        doc.setFontSize(8);
        doc.setFont(undefined, 'italic');
        doc.text('Ej tillämpligt - Trading 212 transaktioner innehåller endast aktier och ETF:er.', margin, yPos);

        yPos += 15;

        // Section D: Övriga värdepapper
        doc.setFillColor(220, 220, 220);
        doc.rect(margin, yPos, pageWidth - 2 * margin, 8, 'F');
        doc.setLineWidth(0.5);
        doc.rect(margin, yPos, pageWidth - 2 * margin, 8);
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text('D. Övriga värdepapper, andra tillgångar (t.ex. kryptovalutor)', margin + 2, yPos + 5.5);

        yPos += 12;
        doc.setFontSize(8);
        doc.setFont(undefined, 'italic');
        doc.text('Ej tillämpligt - Inga övriga värdepapper i denna rapport.', margin, yPos);

        yPos += 15;

        // Footer note
        doc.setFillColor(245, 245, 245);
        doc.rect(margin, yPos, pageWidth - 2 * margin, 20, 'F');
        doc.setLineWidth(0.3);
        doc.rect(margin, yPos, pageWidth - 2 * margin, 20);
        doc.setFontSize(8);
        doc.setFont(undefined, 'bold');
        doc.text('OBS!', margin + 2, yPos + 5);
        doc.setFont(undefined, 'normal');
        doc.text('Detta dokument är genererat från Trading 212 transaktionsdata.', margin + 2, yPos + 10);
        doc.text('Verifiera alltid uppgifterna mot dina egna register innan inlämning till Skatteverket.', margin + 2, yPos + 15);

        addFooter(currentPage);

        const filename = `${year}_K4_Bilaga_B.pdf`;
        doc.save(filename);

        console.log('PDF generated successfully');
        showNotification(`✅ Downloaded: ${filename}`);
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF: ' + error.message);
    }
}

function downloadK4AsCSV() {
    try {
        console.log('Starting CSV generation...');

        if (!window.k4Data) {
            console.error('No K4 data available');
            alert('No data available for CSV generation');
            return;
        }

        if (typeof Papa === 'undefined') {
            console.error('PapaParse library not loaded');
            alert('CSV library not loaded. Please refresh the page and try again.');
            return;
        }

        const year = window.year || new Date().getFullYear();

        // Use aggregated data for CSV (recommended for filing)
        const csvContent = Papa.unparse(window.k4Data.aggregated);

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `${year}_K4_Statement.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log('CSV generated successfully');
        showNotification(`✅ Downloaded: ${year}_K4_Statement.csv`);
    } catch (error) {
        console.error('Error generating CSV:', error);
        alert('Error generating CSV: ' + error.message);
    }
}

function downloadOriginalExcel() {
    try {
        const format = document.getElementById('originalFormat').value;
        console.log('Selected Original format:', format);

        if (format === 'excel') {
            downloadOriginalAsExcel();
        } else if (format === 'pdf') {
            downloadOriginalAsPDF();
        } else if (format === 'csv') {
            downloadOriginalAsCSV();
        }
    } catch (error) {
        console.error('Error in downloadOriginalExcel:', error);
        alert('Error generating download: ' + error.message);
    }
}

function downloadOriginalAsExcel() {
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

function downloadOriginalAsPDF() {
    try {
        console.log('Starting Original PDF generation...');

        if (!sellTransactions) {
            console.error('No transaction data available');
            alert('No data available for PDF generation');
            return;
        }

        if (!window.jspdf || !window.jspdf.jsPDF) {
            console.error('jsPDF library not loaded');
            alert('PDF library not loaded. Please refresh the page and try again.');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('l', 'mm', 'a4');
        const year = window.year || new Date().getFullYear();

        // Title
        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.text(`Trading 212 Full Statement - ${year}`, 14, 20);

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(`Total Transactions: ${sellTransactions.length}`, 14, 30);

        // Create table data
        const tableData = sellTransactions.map(t => [
            formatDateTime(t.time),
            t.instrument,
            t.name,
            t.isin,
            t.instrumentType,
            t.currency,
            t.quantity.toFixed(6),
            t.pricePerShare.toFixed(2),
            t.fxRate.toFixed(4),
            t.totalSEK.toFixed(2),
            t.realisedPL.toFixed(2)
        ]);

        doc.autoTable({
            startY: 35,
            head: [['Time', 'Ticker', 'Name', 'ISIN', 'Type', 'Currency', 'Quantity', 'Price/Share', 'FX Rate', 'Total (SEK)', 'P/L (SEK)']],
            body: tableData,
            styles: { fontSize: 7 },
            headStyles: { fillColor: [63, 81, 181] },
            columnStyles: {
                6: { halign: 'right' },
                7: { halign: 'right' },
                8: { halign: 'right' },
                9: { halign: 'right' },
                10: { halign: 'right' }
            }
        });

        const filename = `${year}_statement.pdf`;
        doc.save(filename);

        console.log('Original PDF generated successfully');
        showNotification(`✅ Downloaded: ${filename}`);
    } catch (error) {
        console.error('Error generating Original PDF:', error);
        alert('Error generating PDF: ' + error.message);
    }
}

function downloadOriginalAsCSV() {
    try {
        console.log('Starting Original CSV generation...');

        if (!sellTransactions) {
            console.error('No transaction data available');
            alert('No data available for CSV generation');
            return;
        }

        if (typeof Papa === 'undefined') {
            console.error('PapaParse library not loaded');
            alert('CSV library not loaded. Please refresh the page and try again.');
            return;
        }

        const year = window.year || new Date().getFullYear();

        // Create CSV data
        const csvData = sellTransactions.map(t => ({
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
        }));

        const csvContent = Papa.unparse(csvData);

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `${year}_statement.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log('Original CSV generated successfully');
        showNotification(`✅ Downloaded: ${year}_statement.csv`);
    } catch (error) {
        console.error('Error generating Original CSV:', error);
        alert('Error generating CSV: ' + error.message);
    }
}

function resetUploadArea() {
    document.getElementById('uploadArea').innerHTML = `
        <div class="relative z-10">
            <div class="text-7xl mb-6">📁</div>
            <p class="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Drop your Trading 212 CSV here</p>
            <p class="text-base text-gray-500 font-medium">or click to browse your files</p>
        </div>
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
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.remove('translate-y-32', 'opacity-0');
    notification.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
        notification.classList.add('translate-y-32', 'opacity-0');
        notification.classList.remove('translate-y-0', 'opacity-100');
    }, 3000);
}
