import { SummaryReport } from "../model/summary_report.js";

const fetchReportsBtn = document.querySelector("#fetch_reports_btn");
const reportsContainer = document.querySelector("#reports_container");

const USE_MOCK_DATA = true;
const REPORTS_PER_PAGE = 10;
const CACHE_EXPIRY_MS = 60 * 60 * 1000; // 1 hour
const CACHE_TIMESTAMP_KEY = "reports_cache_timestamp";

let allReports = [];
let filteredReports = [];
let currentPage = 1;
let filterHeliNumber = "";

const isCacheExpired = () => {
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    if (!timestamp) return true;
    return Date.now() - parseInt(timestamp) > CACHE_EXPIRY_MS;
};

const updateCacheTimestamp = () => {
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
};

const getUniqueHeliNumbers = () => {
    const heliNumbers = allReports.map(r => r.data.heliNumber);
    return [...new Set(heliNumbers)].sort();
};

const createFilterUI = () => {
    const existingFilter = document.querySelector("#filter_container");
    if (existingFilter) existingFilter.remove();

    const heliNumbers = getUniqueHeliNumbers();

    const filterContainer = document.createElement("div");
    filterContainer.id = "filter_container";
    filterContainer.className = "mb-3";
    filterContainer.innerHTML = `
        <div class="row g-2 align-items-center">
            <div class="col-auto">
                <label for="heli_filter" class="col-form-label">סינון לפי מסוק:</label>
            </div>
            <div class="col-auto">
                <select id="heli_filter" class="form-select form-select-sm">
                    <option value="">הכל</option>
                    ${heliNumbers.map(num => `<option value="${num}">${num}</option>`).join('')}
                </select>
            </div>
        </div>
    `;

    reportsContainer.parentElement.insertBefore(filterContainer, reportsContainer);

    document.querySelector("#heli_filter").addEventListener("change", (e) => {
        filterHeliNumber = e.target.value;
        currentPage = 1;
        applyFilters();
        displayReports();
    });
};

const applyFilters = () => {
    filteredReports = allReports.filter(report => {
        if (filterHeliNumber && report.data.heliNumber !== filterHeliNumber) {
            return false;
        }
        return true;
    });
};

const calculateStatistics = () => {
    const stats = {
        totalReports: filteredReports.length,
        totalMissiles: 0,
        missilesByType: {},
        missilesByResult: {},
        totalEw: 0,
        ewByType: {},
        totalCartridges: 0,
        cartridgesByType: {}
    };

    for (const row of filteredReports) {
        const { report } = row.data;

        // Missiles
        for (const missile of report.missiles) {
            stats.totalMissiles++;
            stats.missilesByType[missile.type] = (stats.missilesByType[missile.type] || 0) + 1;
            stats.missilesByResult[missile.result] = (stats.missilesByResult[missile.result] || 0) + 1;
        }

        // EW
        for (const ew of report.ews) {
            const qty = parseInt(ew.quantity) || 0;
            stats.totalEw += qty;
            stats.ewByType[ew.type] = (stats.ewByType[ew.type] || 0) + qty;
        }

        // Cartridges
        for (const cartridge of report.cartridges) {
            const qty = parseInt(cartridge.quantity) || 0;
            stats.totalCartridges += qty;
            stats.cartridgesByType[cartridge.type] = (stats.cartridgesByType[cartridge.type] || 0) + qty;
        }
    }

    return stats;
};

const createStatisticsCard = () => {
    if (!filterHeliNumber) return null;

    const stats = calculateStatistics();

    const card = document.createElement("div");
    card.className = "card mb-4 border-primary";
    card.id = "statistics_card";
    card.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";

    const missilesByTypeHtml = Object.entries(stats.missilesByType)
        .map(([type, count]) => `<span class="badge bg-secondary me-2 fs-6">${type}: ${count}</span>`)
        .join("");

    const missilesByResultHtml = Object.entries(stats.missilesByResult)
        .map(([result, count]) => `<span class="badge ${result === 'פגיעה' ? 'bg-success' : 'bg-danger'} me-2 fs-6">${result}: ${count}</span>`)
        .join("");

    const ewByTypeHtml = Object.entries(stats.ewByType)
        .map(([type, count]) => `<span class="badge bg-info me-2 fs-6">${type}: ${count}</span>`)
        .join("");

    const cartridgesByTypeHtml = Object.entries(stats.cartridgesByType)
        .map(([type, count]) => `<span class="badge bg-warning text-dark me-2 fs-6">${type}: ${count}</span>`)
        .join("");

    card.innerHTML = `
        <div class="card-header bg-primary text-white py-3">
            <h4 class="mb-0">סיכום מסוק ${filterHeliNumber}</h4>
        </div>
        <div class="card-body py-4" style="font-size: 1.1rem;">
            <div class="row">
                <div class="col-md-6 mb-3">
                    <div class="mb-2"><strong>סה"כ דוחות:</strong> <span class="fs-4">${stats.totalReports}</span></div>
                    <div class="mb-2"><strong>סה"כ טילים:</strong> <span class="fs-4">${stats.totalMissiles}</span></div>
                    <div class="mb-2">${missilesByTypeHtml}</div>
                    <div>${missilesByResultHtml}</div>
                </div>
                <div class="col-md-6 mb-3">
                    <div class="mb-2"><strong>סה"כ מוץ/נורים:</strong> <span class="fs-4">${stats.totalEw}</span></div>
                    <div class="mb-2">${ewByTypeHtml}</div>
                    <div class="mb-2"><strong>סה"כ פגזים:</strong> <span class="fs-4">${stats.totalCartridges}</span></div>
                    <div>${cartridgesByTypeHtml}</div>
                </div>
            </div>
        </div>
    `;

    return card;
};

const generateMockData = () => {
    const data = [];
    const heliNumbers = ["501", "502", "503", "504", "505"];
    const missileTypes = ["ספייק", "הלפייר", "פיגיון"];
    const results = ["פגיעה", "החטאה"];
    const ewTypes = ["מוץ", "נורים"];
    const stations = ["ימין", "שמאל"];

    for (let i = 0; i < 25; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        data.push({
            ts: date.toISOString(),
            data: {
                heliNumber: heliNumbers[i % heliNumbers.length],
                report: {
                    cartridges: [
                        { type: "30 מ״מ", quantity: Math.floor(Math.random() * 200) + 50 }
                    ],
                    ews: [
                        { type: ewTypes[i % 2], station: stations[i % 2], quantity: Math.floor(Math.random() * 8) + 2 }
                    ],
                    missiles: [
                        { type: missileTypes[i % 3], number: String(10000 + i), result: results[i % 2] },
                        { type: missileTypes[i % 3], number: String(10000 + i), result: results[i % 2] },
                    ]
                },
                note: i % 3 === 0 ? "הערה לדוגמה" : ""
            }
        });
    }
    return data;
};

const mockData = generateMockData();

fetchReportsBtn.addEventListener("click", () => fetchReports());

const enableLoading = () => {
    fetchReportsBtn.disabled = true;
    fetchReportsBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status"></span> טוען...`
};
const disableLoading = () => {
    fetchReportsBtn.style.display = "none";
    fetchReportsBtn.innerHTML = ``
}

const fetchReports = async () => {
    enableLoading();
    reportsContainer.innerHTML = "";

    try {
        let rows;

        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            rows = mockData;
        } else {
            // Check cache first
            const cachedReports = loadEncryptedReports();

            if (cachedReports && cachedReports.length > 0 && !isCacheExpired()) {
                console.log("fetchReports: Using cached data,", cachedReports.length, "reports");
                rows = cachedReports;
            } else {
                console.log("fetchReports: Cache empty or expired, calling /api/history...");
                const response = await fetch("/api/history");

                console.log("fetchReports: Response status:", response.status);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    console.error("fetchReports: API error response:", errorData);
                    throw new Error(errorData.details || errorData.error || `HTTP ${response.status}`);
                }

                rows = await response.json();
                console.log("fetchReports: Received", rows.length, "rows from API");

                // Save to cache
                saveEncryptedReport(rows);
                updateCacheTimestamp();
            }
        }

        allReports = rows;
        currentPage = 1;
        applyFilters();
        createFilterUI();
        displayReports();
        disableLoading();
    } catch (error) {
        console.error("fetchReports: Error:", error.message);
        reportsContainer.innerHTML = `
            <div class="alert alert-danger">
                <strong>שגיאה בטעינת הדוחות</strong>
                <br><small>${error.message}</small>
            </div>`;
        fetchReportsBtn.disabled = false;
        fetchReportsBtn.innerHTML = "טען דוחות";
    }
};

const displayReports = () => {
    reportsContainer.innerHTML = "";

    if (!filteredReports || filteredReports.length === 0) {
        reportsContainer.innerHTML = `<div class="alert alert-info">אין דוחות להצגה</div>`;
        return;
    }

    // Add statistics card if filtering by heli number
    const statsCard = createStatisticsCard();
    if (statsCard) {
        reportsContainer.appendChild(statsCard);
    }

    const totalPages = Math.ceil(filteredReports.length / REPORTS_PER_PAGE);
    const startIndex = (currentPage - 1) * REPORTS_PER_PAGE;
    const endIndex = startIndex + REPORTS_PER_PAGE;
    const pageReports = filteredReports.slice(startIndex, endIndex);

    for (const row of pageReports) {
        const { ts, data } = row;
        const report = new SummaryReport(
            data.report.cartridges,
            data.report.ews,
            data.report.missiles
        );

        const reportCard = createReportCard(data.heliNumber, report, data.note, ts);
        reportsContainer.appendChild(reportCard);
    }

    if (totalPages > 1) {
        const pagination = createPagination(totalPages);
        reportsContainer.appendChild(pagination);
    }
};

const createPagination = (totalPages) => {
    const nav = document.createElement("nav");
    nav.innerHTML = `
        <ul class="pagination justify-content-center">
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage - 1}">הקודם</a>
            </li>
            ${Array.from({ length: totalPages }, (_, i) => `
                <li class="page-item ${currentPage === i + 1 ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i + 1}">${i + 1}</a>
                </li>
            `).join('')}
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage + 1}">הבא</a>
            </li>
        </ul>
    `;

    nav.addEventListener("click", (e) => {
        e.preventDefault();
        const page = parseInt(e.target.dataset.page);
        if (page && page >= 1 && page <= totalPages) {
            currentPage = page;
            displayReports();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    return nav;
};

const createReportCard = (heliNumber, report, note, timestamp) => {
    const card = document.createElement("div");
    card.className = "card mb-2";

    const date = new Date(timestamp).toLocaleString("he-IL");

    let missilesHtml = report.missiles.map(m =>
        `<li>${m.type} #${m.number}${m.tube ? ` (צינור ${m.tube})` : ""} - ${m.result}</li>`
    ).join("");

    let ewsHtml = report.ews.map(e =>
        `<li>${e.type} ${e.station}: ${e.quantity}</li>`
    ).join("");

    let cartridgesHtml = report.cartridges.map(c =>
        `<li>${c.type}: ${c.quantity}</li>`
    ).join("");

    card.innerHTML = `
        <div class="card-header py-2 d-flex justify-content-between align-items-center">
            <strong>מסוק ${heliNumber}</strong>
            <small class="text-muted">${date}</small>
        </div>
        <div class="card-body py-2" style="font-size: 0.9rem;">
            <ul>${missilesHtml ? `<div><strong>טילים:</strong> ${missilesHtml}</div>` : ""}</ul>
            <ul>${ewsHtml ? `<div><strong>מוץ/נורים:</strong> ${ewsHtml}</div>` : ""}</ul>
            <ul>${cartridgesHtml ? `<div><strong>פגזים:</strong> ${cartridgesHtml}</div>` : ""}</ul>
            ${note ? `<div><strong>הערות:</strong> ${note}</div>` : ""}
        </div>
    `;

    return card;
};
