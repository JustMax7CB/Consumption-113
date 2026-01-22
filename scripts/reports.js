import { SummaryReport } from "../model/summary_report.js";

const fetchReportsBtn = document.querySelector("#fetch_reports_btn");
const reportsContainer = document.querySelector("#reports_container");

const USE_MOCK_DATA = false;
const REPORTS_PER_PAGE = 10;

let allReports = [];
let currentPage = 1;

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
                        { type: missileTypes[i % 3], number: String(10000 + i), result: results[i % 2] }
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

const fetchReports = async () => {
    fetchReportsBtn.disabled = true;
    fetchReportsBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status"></span> טוען...`;
    reportsContainer.innerHTML = "";

    try {
        let rows;

        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            rows = mockData;
        } else {
            console.log("fetchReports: Calling /api/history...");
            const response = await fetch("/api/history");

            console.log("fetchReports: Response status:", response.status);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("fetchReports: API error response:", errorData);
                throw new Error(errorData.details || errorData.error || `HTTP ${response.status}`);
            }

            rows = await response.json();
            console.log("fetchReports: Received", rows.length, "rows");
        }

        allReports = rows;
        currentPage = 1;
        displayReports();
        fetchReportsBtn.style.display = "none";
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

    if (!allReports || allReports.length === 0) {
        reportsContainer.innerHTML = `<div class="alert alert-info">אין דוחות להצגה</div>`;
        return;
    }

    const totalPages = Math.ceil(allReports.length / REPORTS_PER_PAGE);
    const startIndex = (currentPage - 1) * REPORTS_PER_PAGE;
    const endIndex = startIndex + REPORTS_PER_PAGE;
    const pageReports = allReports.slice(startIndex, endIndex);

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
        `${m.type} #${m.number}${m.tube ? ` (צינור ${m.tube})` : ""} - ${m.result}`
    ).join(", ");

    let ewsHtml = report.ews.map(e =>
        `${e.type} ${e.station}: ${e.quantity}`
    ).join(", ");

    let cartridgesHtml = report.cartridges.map(c =>
        `${c.type}: ${c.quantity}`
    ).join(", ");

    card.innerHTML = `
        <div class="card-header py-2 d-flex justify-content-between align-items-center">
            <strong>מסוק ${heliNumber}</strong>
            <small class="text-muted">${date}</small>
        </div>
        <div class="card-body py-2" style="font-size: 0.9rem;">
            ${missilesHtml ? `<div><strong>טילים:</strong> ${missilesHtml}</div>` : ""}
            ${ewsHtml ? `<div><strong>מוץ/נורים:</strong> ${ewsHtml}</div>` : ""}
            ${cartridgesHtml ? `<div><strong>פגזים:</strong> ${cartridgesHtml}</div>` : ""}
            ${note ? `<div><strong>הערות:</strong> ${note}</div>` : ""}
        </div>
    `;

    return card;
};
