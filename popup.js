const viewPdfButton = document.getElementById("viewPdf");
const status = document.getElementById("status");

viewPdfButton.addEventListener("click", async () => {
    viewPdfButton.disabled = true;
    status.textContent = "Finding attendance PDF...";

    try {
        const tabs = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });

        const tab = tabs[0];

        if (!tab?.url?.startsWith("https://pl.neduet.edu.pk/")) {
            throw new Error("Please open the NED portal first.");
        }

        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                const links = Array.from(document.querySelectorAll("a"));

                const attendanceLink = links.find(link =>
                    link.href.includes("jsp_to_pdf_servlet") &&
                    link.href.includes("_attendancecard")
                );

                return attendanceLink?.href || null;
            }
        });

        const pdfUrl = results[0]?.result;

        if (!pdfUrl) {
            throw new Error("Attendance PDF link not found.");
        }

        const viewerUrl =
            chrome.runtime.getURL("pdf-viewer.html") +
            "?pdf=" +
            encodeURIComponent(pdfUrl);

        await chrome.tabs.create({
            url: viewerUrl
        });

        window.close();

    } catch (error) {
        console.error(error);
        status.textContent = error.message;
        viewPdfButton.disabled = false;
    }
});