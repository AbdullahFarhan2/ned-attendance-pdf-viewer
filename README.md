# NED Attendance PDF Viewer

A Chrome extension for viewing NED University attendance PDFs directly in the browser, with an additional summary page showing missed classes and remaining allowable absences.

## Features

- View attendance PDFs in a browser tab without downloading them manually.
- See a summary of missed classes and remaining allowable absences.
- Navigate between the original PDF and the summary page.

## Installation

### Option 1: Install from the packaged extension

1. Open the repository's **Releases** section and download `ned-attendance-pdf-viewer.crx` if it is available there.
2. Open `chrome://extensions` in Google Chrome.
3. Enable **Developer mode**.
4. Try dragging the downloaded `.crx` file onto the Extensions page. Chrome may block manual installation of packaged extensions, depending on its policies. If blocked, use Option 2.

### Option 2: Install from source (recommended)

1. Download the repository using **Code → Download ZIP**.
2. Extract the ZIP file.
3. Open `chrome://extensions` in Google Chrome.
4. Enable **Developer mode**.
5. Click **Load unpacked**.
6. Select the extracted `ned-attendance-pdf-viewer` folder containing `manifest.json`.

## Usage

1. Sign in to the NED University portal in Chrome.
2. Open the page containing your attendance PDF link.
3. Click the extension icon.
4. Click the button to view your attendance PDF.

## Privacy and Security

This extension does not ask you to enter your NED user ID or password. It uses your existing authenticated NED portal session in Chrome to access and display your attendance PDF.

Unlike third-party websites that ask you to submit your university credentials, this extension is designed to use your existing login session rather than collect your login credentials.

As with any extension, review the source code before installing it. The extension needs access to the N