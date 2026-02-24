* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary: #1f2937;
    --secondary: #374151;
    --accent: #ef4444;
    --success: #10b981;
    --warning: #f59e0b;
    --bg-light: #f9fafb;
    --text-dark: #111827;
    --border: #e5e7eb;
    --shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
    background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
    color: var(--text-dark);
    min-height: 100vh;
    padding: 20px;
}

.container {
    max-width: 1400px;
    margin: 0 auto;
}

header {
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: var(--shadow);
    margin-bottom: 30px;
    border-left: 5px solid var(--accent);
}

header h1 {
    font-size: 28px;
    margin-bottom: 8px;
    font-weight: 700;
}

header p {
    color: #6b7280;
    font-size: 14px;
}

.main-grid {
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 30px;
    margin-bottom: 30px;
}

.calendar-wrapper {
    background: white;
    border-radius: 12px;
    box-shadow: var(--shadow);
    padding: 30px;
}

.calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

.calendar-nav {
    display: flex;
    gap: 15px;
}

.calendar-nav button {
    background: var(--primary);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: background 0.3s;
}

.calendar-nav button:hover {
    background: var(--secondary);
}

.month-year {
    font-size: 20px;
    font-weight: 700;
    min-width: 200px;
    text-align: center;
}

.weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 12px;
    margin-bottom: 12px;
}

.weekday {
    text-align: center;
    font-weight: 600;
    color: var(--secondary);
    font-size: 12px;
    text-transform: uppercase;
    padding: 10px 0;
    letter-spacing: 0.5px;
}

.days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 12px;
}

.day {
    aspect-ratio: auto;
    min-height: 120px;
    border: 2px solid var(--border);
    border-radius: 8px;
    padding: 10px;
    cursor: pointer;
    position: relative;
    background: white;
    transition: all 0.2s;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
}

.day:hover {
    border-color: var(--accent);
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.1);
}

.day.other-month {
    color: #d1d5db;
    background: #f3f4f6;
    cursor: default;
}

.day.other-month:hover {
    border-color: var(--border);
    box-shadow: none;
}

.day.checked {
    background: var(--success);
    color: white;
    border-color: var(--success);
    position: relative;
}

.day.checked::after {
    content: '✓';
    position: absolute;
    top: 5px;
    right: 5px;
    font-size: 12px;
}

.day.today {
    border: 2px solid var(--accent);
    background: #fef2f2;
}

.day.today.checked {
    background: var(--success);
}

.day-number {
    font-size: 16px;
}

.day-content {
    width: 100%;
    font-size: 11px;
    line-height: 1.3;
    margin-top: 5px;
}

.day-item {
    display: flex;
    align-items: center;
    margin-bottom: 3px;
    gap: 4px;
    padding: 2px 4px;
    border-radius: 4px;
    transition: all 0.2s;
}

.day-item:hover {
    background: rgba(239, 68, 68, 0.1);
    transform: scale(1.05);
}

.day-icon {
    font-size: 12px;
    min-width: 14px;
}

.day-label {
    color: var(--secondary);
    font-weight: 500;
    flex: 1;
    text-align: left;
}

.day-value {
    color: var(--accent);
    font-weight: 700;
    font-size: 10px;
}

.day-check {
    color: var(--success);
    font-weight: 700;
}

.day-actions {
    display: flex;
    gap: 4px;
    opacity: 0;
    transition: opacity 0.2s;
}

.day-item:hover .day-actions {
    opacity: 1;
}

.day-action-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 12px;
    padding: 0 2px;
    transition: all 0.2s;
}

.day-action-btn:hover {
    transform: scale(1.3);
}

.day-action-btn.edit {
    color: #3b82f6;
}

.day-action-btn.delete {
    color: var(--accent);
}

.sidebar {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.card {
    background: white;
    border-radius: 12px;
    box-shadow: var(--shadow);
    padding: 20px;
}

.card h3 {
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 15px;
    color: var(--secondary);
}

.check-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.check-item {
    display: flex;
    align-items: center;
    padding: 12px;
    background: var(--bg-light);
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s;
    position: relative;
}

.check-item:hover {
    background: #e5e7eb;
}

.check-item input {
    accent-color: var(--success);
    width: 18px;
    height: 18px;
    margin-right: 12px;
    cursor: pointer;
}

.check-item label {
    cursor: pointer;
    flex: 1;
    font-size: 14px;
}

.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    align-items: center;
    justify-content: center;
}

.modal.active {
    display: flex;
}

.modal-content {
    background: white;
    border-radius: 12px;
    padding: 30px;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-content h2 {
    margin-bottom: 20px;
    font-size: 20px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    font-size: 14px;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid var(--border);
    border-radius: 6px;
    font-size: 14px;
    font-family: inherit;
}

.form-group textarea {
    resize: vertical;
    min-height: 80px;
}

.form-actions {
    display: flex;
    gap: 12px;
    margin-top: 25px;
}

.btn {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;
}

.btn-primary {
    background: var(--accent);
    color: white;
}

.btn-primary:hover {
    background: #dc2626;
}

.btn-secondary {
    background: var(--border);
    color: var(--text-dark);
}

.btn-secondary:hover {
    background: #d1d5db;
}

.stats-section {
    background: white;
    border-radius: 12px;
    box-shadow: var(--shadow);
    padding: 30px;
    margin-bottom: 30px;
}

.stats-section h2 {
    font-size: 20px;
    margin-bottom: 25px;
    font-weight: 700;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
}

.stat-card {
    background: var(--bg-light);
    padding: 20px;
    border-radius: 8px;
    border-left: 4px solid var(--accent);
}

.stat-label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--secondary);
    margin-bottom: 8px;
    font-weight: 600;
}

.stat-value {
    font-size: 28px;
    font-weight: 700;
    color: var(--text-dark);
}

.stat-percent {
    font-size: 12px;
    color: #6b7280;
    margin-top: 8px;
}

.export-section {
    display: flex;
    gap: 12px;
    margin-top: 20px;
}

.btn-export {
    flex: 1;
    padding: 12px;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: background 0.2s;
}

.btn-export:hover {
    background: var(--secondary);
}

.empty-state {
    text-align: center;
    color: #9ca3af;
    padding: 30px;
}

.empty-state p {
    font-size: 14px;
}

@media (max-width: 1024px) {
    .main-grid {
        grid-template-columns: 1fr;
    }

    .sidebar {
        flex-direction: row;
    }
}

@media (max-width: 768px) {
    header {
        padding: 20px;
    }

    header h1 {
        font-size: 22px;
    }

    .calendar-wrapper {
        padding: 20px;
    }

    .sidebar {
        flex-direction: column;
    }

    .stats-grid {
        grid-template-columns: 1fr;
    }
}
