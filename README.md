# SmartCanteen: Intelligent Food Waste Management System

A college environmental project. SmartCanteen helps canteen staff record food waste, plan tomorrow's quantities and manage surplus food. It is built with plain HTML, CSS and JavaScript. There is no backend, and data is saved in the browser using localStorage.

Tagline: *Prepare Smarter. Waste Less. Feed More.*

## Problem

A canteen cooks for a crowd it cannot predict. Overproduction wastes food, money, water and energy, and under-production leaves students without a meal. Leftovers are rarely recorded, so the same mistakes repeat every day.

## Features

| Page | File | What it does |
|---|---|---|
| Home | `index.html` | Project introduction and link to the dashboard |
| Dashboard | `dashboard.html` | Daily cards, 7-day waste chart, high-waste items, smart alerts, environmental impact |
| Daily Entry | `daily-entry.html` | Add, edit and delete entries; leftover and waste % are calculated automatically |
| Demand Prediction | `prediction.html` | Demo forecast of tomorrow's students and quantity to prepare, with the working shown |
| Analytics | `analytics.html` | Weekly trend, most wasted items, waste % per item, sustainability score, generated insights |
| Surplus Food | `surplus.html` | Status tracking (Available, Donated, Composted, Disposed) and redistribution summary |

All pages share the same data, so an entry made on Daily Entry updates every other page.

## Project structure

```
smartcanteen/
├── index.html
├── dashboard.html
├── daily-entry.html
├── prediction.html
├── analytics.html
├── surplus.html
├── README.md
├── css/style.css
└── js/
    ├── app.js          shared data, calculations, sidebar
    ├── dashboard.js
    ├── entry.js
    ├── prediction.js
    ├── analytics.js
    └── surplus.js
```

## How to run

1. Download and unzip the project. Keep the `css` and `js` folders next to the HTML files.
2. Double-click `index.html` to open it in Chrome (or any modern browser).
3. Click **Open Dashboard**.

No installation or server is needed.

## How to publish on GitHub Pages

1. Create a public repository named `smartcanteen` on GitHub.
2. Upload the contents of the project folder, including `css` and `js`.
3. Go to **Settings > Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
4. After 1 to 2 minutes the site is live at `https://<your-username>.github.io/smartcanteen/`.

## Data and storage

- On first launch, 10 days of sample data are created so the pages are not empty.
- Data is stored in the browser under the keys `sc_entries` and `sc_status`. It survives page refreshes but is specific to each browser and device.
- **Reset sample data** (bottom of the sidebar) deletes all entries and restores the samples.

## How the calculations work

- **Leftover** = Prepared − Served
- **Waste %** = Leftover ÷ Prepared × 100
- **Sustainability score** = 100 − 4 × (7-day waste %), minimum 0
- **Demand prediction (demo, not machine learning)**
  - Predicted students = 0.3 × average of all days + 0.7 × average of the last 3 days
  - Kg per student = total kg served ÷ total students
  - Recommended quantity = Predicted students × kg per student × 1.05 (5% safety buffer)
- **Environmental impact (estimates)** assumes a 15% waste rate before the system, 300 litres of water and 2.5 kg CO2e per kg of food wasted. These are illustrative values, not measurements.

## Limitations

- The prediction is a simple weighted average. It does not account for weekdays, exams, holidays or weather.
- Sample data and impact figures are for demonstration only.
- There are no user accounts, so anyone with access to the browser can edit the data.
- Data is not shared between devices.

## Possible future work

- Weekday-aware prediction and menu-level forecasting
- Shared database so multiple staff can use the system
- Partner list of NGOs for surplus pickup
- Export of reports as CSV or PDF

## Technology

HTML5, CSS3 and vanilla JavaScript. No frameworks, libraries or backend.
