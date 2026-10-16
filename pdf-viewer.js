import * as pdfjsLib from "./pdfjs/pdf.min.mjs";

const params = new URLSearchParams(window.location.search);
const pdfUrl = params.get("pdf");

const canvas = document.getElementById("pdfCanvas");
const ctx = canvas.getContext("2d");

const pageInfo = document.getElementById("pageInfo");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const zoomInButton = document.getElementById("zoomIn");
const zoomOutButton = document.getElementById("zoomOut");

let pdf = null;
let pageNumber = 1;
let scale = 1.5;

pdfjsLib.GlobalWorkerOptions.workerSrc =
    chrome.runtime.getURL("pdfjs/pdf.worker.min.mjs");

async function loadPDF() {
    if (!pdfUrl) {
        pageInfo.textContent = "PDF not found";
        return;
    }

    try {
        pageInfo.textContent = "Loading PDF...";

        const response = await fetch(pdfUrl, {
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error(`PDF request failed (${response.status})`);
        }

        const pdfData = await response.arrayBuffer();

    pdf = await pdfjsLib.getDocument({
        data: pdfData
    }).promise;

    await calculateLeaves();
    await renderPage();

    } catch (error) {
        console.error("PDF viewer error:", error?.message, error);
        pageInfo.textContent = "Failed to load PDF";
    }
}

async function renderPage() {
    const summaryPageNumber = pdf.numPages + 1;

    if (pageNumber === summaryPageNumber) {
        canvas.style.display = "none";
        document.getElementById("summaryPage").hidden = false;
        pageInfo.textContent = `Page ${pageNumber} / ${summaryPageNumber}`;
    } else {
        canvas.style.display = "block";
        document.getElementById("summaryPage").hidden = true;

        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
            canvasContext: ctx,
            viewport
        }).promise;

        pageInfo.textContent = `Page ${pageNumber} / ${summaryPageNumber}`;
    }

        prevButton.disabled = pageNumber <= 1;
        nextButton.disabled = pageNumber >= summaryPageNumber;

        zoomInButton.disabled = pageNumber === summaryPageNumber;
        zoomOutButton.disabled = pageNumber === summaryPageNumber;
}

prevButton.addEventListener("click", async () => {
    if (pageNumber > 1) {
        pageNumber--;
        await renderPage();
    }
});

nextButton.addEventListener("click", async () => {
    if (pageNumber < pdf.numPages + 1) {
        pageNumber++;
        await renderPage();
    }
});

zoomInButton.addEventListener("click", async () => {
    scale += 0.25;
    await renderPage();
});

zoomOutButton.addEventListener("click", async () => {
    if (scale > 0.5) {
        scale -= 0.25;
        await renderPage();
    }
});

loadPDF();

async function calculateLeaves() {
    const page = await pdf.getPage(1);
    const content = await page.getTextContent();
    const rows = {};

    for (const item of content.items) {
        const text = item.str.trim();
        if (!text) continue;

        const y = Math.round(item.transform[5]);

        if (!rows[y]) rows[y] = [];

        rows[y].push({
            x: item.transform[4],
            text
        });
    }

    // Find the attendance column headers dynamically
    const headerRow = Object.values(rows).find(row =>
        row.filter(item => item.text === "Present").length >= 2 &&
        row.filter(item => item.text === "Held").length >= 2
    );

    if (!headerRow) {
        document.getElementById("leaveStatus").textContent =
            "Could not identify PDF columns.";
        return;
    }

    const headers = headerRow
        .filter(item => ["Present", "Held"].includes(item.text))
        .sort((a, b) => a.x - b.x);

    const courses = [];

    for (const row of Object.values(rows)) {
        const code = row.find(item =>
            /^[A-Z]{2}-\d{3}/.test(item.text)
        );

        const credit = row.find(item =>
            /^\d+\s*Th\s*\+\s*\d+\s*Pr$/.test(item.text)
        );

        if (!code || !credit) continue;

        const values = row.filter(item =>
            /^\d+$/.test(item.text) || item.text === "-"
        );

        const attendance = headers.map(header => {
            const nearest = values.reduce((best, item) =>
                Math.abs(item.x - header.x) <
                Math.abs(best.x - header.x) ? item : best
            );

            return nearest.text === "-" ? 0 : Number(nearest.text);
        });

        const missed =
            Math.max(0, attendance[1] - attendance[0]) +
            Math.max(0, attendance[3] - attendance[2]);

        const creditHours = [...credit.text.matchAll(/\d+/g)]
            .reduce((sum, match) => sum + Number(match[0]), 0);

        const allowed = Math.floor(creditHours * 15 * 0.25);

        courses.push({
            code: code.text,
            missed,
            remaining: Math.max(0, allowed - missed)
        });
    }

    const table = document.getElementById("leaveTable");

    if (!courses.length) {
        document.getElementById("leaveStatus").textContent =
            "Could not read attendance data from this PDF.";
        return;
    }

    document.getElementById("leaveStatus").textContent =
        "Estimates based on 15 weeks and a 75% attendance requirement.";

    table.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Course</th>
                    <th>Classes Missed</th>
                    <th>More You Can Miss</th>
                </tr>
            </thead>
            <tbody>
                ${courses.map(course => `
                    <tr>
                        <td>${course.code}</td>
                        <td>${course.missed}</td>
                        <td>${course.remaining}</td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;
}