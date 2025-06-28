# Behavior Tracker

The Behavior Tracker is a browser-based tool for recording and analyzing student behaviors in special education settings. It allows teachers to log behaviors in 15‑minute intervals, visualize trends, and export reports for documentation.

## Setup

1. Clone or download this repository.
2. Open `index.html` in a modern web browser. No server is required—the application runs entirely in the browser and stores data locally using `localStorage`.
3. (Optional) Install the Python requirements if you want to regenerate the example charts:
   ```bash
   pip install plotly
   ```

## Usage

1. **Add Students** – Use the **Add Student** button on the dashboard to create or edit student profiles.
2. **Track Behaviors** – On the **Tracking** tab, select a student and date. Choose a behavior and a time slot to record an entry. Notes can be added for context.
3. **View Analytics** – The **Analytics** tab displays bar, line, and pie charts summarizing the recorded data.
4. **Generate Reports** – On the **Reports** tab, select a student and date range to preview and export a Word or Excel report.

All information is stored locally in the browser. Export data regularly if you need a backup or want to move it to another device.

## File Overview

### HTML, CSS, and JavaScript

- **`index.html`** – The main web page containing the user interface. It defines tabs for the dashboard, tracking form, analytics view, and report generation.
- **`style.css`** – Styles the application, including responsive layouts, color themes, and the dark/light mode toggle.
- **`app.js`** – Implements all client-side logic. It manages local storage, renders students and behaviors, handles chart creation with Chart.js, and performs exports.

A zipped copy of these three files is provided as `behavior-tracker.zip` for convenient sharing.

### Python Chart Scripts

The repository also contains four Plotly scripts used to generate the sample images found in this project:

- **`chart_script.py`** – Creates a grouped bar chart (`behavior_tracking_chart.png`) comparing positive and challenging behaviors across the school day.
- **`chart_script_1.py`** – Generates a line chart (`weekly_behavior_trend.png`) showing positive behavior percentages over a school week.
- **`chart_script_2.py`** – Produces a pie chart (`behavior_distribution.png`) summarizing the distribution of behavior categories.
- **`chart_script_3.py`** – Builds a horizontal bar chart (`student_behavior_comparison.png`) comparing students' positive behavior rates.

Run any of these scripts with Python to recreate the corresponding image files.

---

For detailed teaching tips and advanced features, see **`teacher-guide.md`**.
