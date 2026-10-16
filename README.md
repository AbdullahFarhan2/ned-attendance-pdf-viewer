# NED Attendance PDF Viewer

A Chrome extension for viewing NED University attendance PDFs directly in the browser, with an additional summary page showing missed classes and remaining allowable absences.

## Features

- View attendance PDFs in a browser tab without downloading them manually.
- View a summary of missed classes and remaining allowable absences.
- Navigate between the original PDF and the summary page.

## Installation

1. Download this repository using **Code → Download ZIP**.
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

## Requirements

- Google Chrome
- Access to the NED University portal

## Disclaimer

This is an independent, student-made project and is not officially affiliated with or endorsed by NED University of Engineering and Technology.

### Privacy and Security

This extension does **not** ask you to enter or share your NED user ID or password. Instead, it accesses the attendance PDF through your existing, authenticated NED portal session in Chrome and displays it in the browser.

Unlike third-party websites that may ask you to enter your university credentials, this extension does not require you to submit your password to a separate service to retrieve your attendance data.

The extension is designed to use your existing login session rather than collect your login credentials. You should still review the source code before installing any extension, as with any software that accesses authenticated webpages.

You must already be logged in to the NED University portal to use the extension.