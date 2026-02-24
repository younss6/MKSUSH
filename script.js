const CONTROL_TYPES = {
    'temp_frigo': 'Température frigo',
    'temp_cuisine': 'Température cuisine',
    'huile_friture': 'Changement huile friture',
    'nettoyage_cuisine': 'Nettoyage cuisine'
};

let currentDate = new Date();
let selectedDate = null;
let editingIndex = null;
let data = JSON.parse(localStorage.getItem('restaurantData')) || {};

function initCalendar() {
    renderCalendar();
    updateStats();
    updateTodayChecks();
}

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    
    const firstDayOfWeek = (firstDay.getDay() + 6) % 7;
    const totalCells = Math.ceil((firstDayOfWeek + lastDay.getDate()) / 7) * 7;
    
    document.getElementById('monthYear').textContent = 
        firstDay.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    
    const calendarHTML = [];
    let cellCount = 0;
    
    // Jours du mois précédent
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const day = prevLastDay.getDate() - i;
        calendarHTML.push(`<div class="day other-month">${day}</div>`);
        cellCount++;
    }
    
    // Jours du mois actuel
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dateStr = formatDate(new Date(year, month, day));
        const isToday = dateStr === formatDate(new Date());
        const dayData = data[dateStr];
        const dayClass = ['day'];
        
        if (isToday) dayClass.push('today');
        
        let dayHTML = `<div class="day-number">${day}</div>`;
        
        if (dayData && dayData.length > 0) {
            dayHTML += '<div class="day-content">';
            
            dayData.forEach((check, index) => {
                const type = check.type;
                let itemHTML = '<div class="day-item">';
                
                if (type === 'temp_frigo') {
                    itemHTML += `<span class="day-icon">❄️</span><span class="day-label">Frigo</span><span class="day-value">${check.value}</span>`;
                } else if (type === 'temp_cuisine') {
                    itemHTML += `<span class="day-icon">🍳</span><span class="day-label">Cuisine</span><span class="day-value">${check.value}</span>`;
                } else if (type === 'huile_friture') {
                    itemHTML += `<span class="day-icon">🫒</span><span class="day-label">Huile</span><span class="day-check">✓</span>`;
                } else if (type === 'nettoyage_cuisine') {
                    itemHTML += `<span class="day-icon">🧹</span><span class="day-label">Nettoyage</span><span class="day-check">✓</span>`;
                }
                
                itemHTML += `<div class="day-actions">
                    <button class="day-action-btn edit" onclick="event.stopPropagation(); editCheck('${dateStr}', ${index})" title="Modifier">✎</button>
                    <button class="day-action-btn delete" onclick="event.stopPropagation(); quickDeleteCheck('${dateStr}', ${index})" title="Supprimer">🗑</button>
                </div>`;
                
                itemHTML += '</div>';
                dayHTML += itemHTML;
            });
            
            dayHTML += '</div>';
        }
        
        calendarHTML.push(
            `<div class="${dayClass.join(' ')}" onclick="selectDay('${dateStr}')">${dayHTML}</div>`
        );
        cellCount++;
    }
    
    // Jours du mois suivant
    for (let day = 1; cellCount < totalCells; day++, cellCount++) {
        calendarHTML.push(`<div class="day other-month">${day}</div>`);
    }
    
    document.getElementById('calendar').innerHTML = calendarHTML.join('');
}

function updateFormFields() {
    const checkType = document.getElementById('checkType').value;
    const valueGroup = document.getElementById('valueGroup');
    const valueLabel = document.getElementById('valueLabel');
    
    if (checkType === 'temp_frigo' || checkType === 'temp_cuisine') {
        valueGroup.style.display = 'block';
        valueLabel.textContent = 'Température (°C)';
    } else {
        valueGroup.style.display = 'none';
    }
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function selectDay(dateStr) {
    selectedDate = dateStr;
    editingIndex = null;
    const date = new Date(dateStr);
    document.getElementById('modalTitle').textContent = 
        `Contrôles du ${date.toLocaleDateString('fr-FR')}`;
    document.getElementById('checkForm').reset();
    document.getElementById('deleteBtn').style.display = 'none';
    openModal();
}

function editCheck(dateStr, index) {
    selectedDate = dateStr;
    editingIndex = index;
    const check = data[dateStr][index];
    const date = new Date(dateStr);
    
    document.getElementById('modalTitle').textContent = 
        `Modifier contrôle du ${date.toLocaleDateString('fr-FR')}`;
    document.getElementById('checkType').value = check.type;
    document.getElementById('checkValue').value = check.value || '';
    document.getElementById('checkObserver').value = check.observer || '';
    document.getElementById('checkNotes').value = check.notes || '';
    document.getElementById('deleteBtn').style.display = 'block';
    
    updateFormFields();
    openModal();
}

function openModal() {
    document.getElementById('modal').classList.add('active');
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
    selectedDate = null;
    editingIndex = null;
}

function deleteCheck() {
    if (selectedDate && editingIndex !== null) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce contrôle ?')) {
            data[selectedDate].splice(editingIndex, 1);
            
            if (data[selectedDate].length === 0) {
                delete data[selectedDate];
            }
            
            localStorage.setItem('restaurantData', JSON.stringify(data));
            
            renderCalendar();
            updateStats();
            updateTodayChecks();
            closeModal();
        }
    }
}

function quickDeleteCheck(dateStr, index) {
    if (confirm('Supprimer ce contrôle ?')) {
        data[dateStr].splice(index, 1);
        
        if (data[dateStr].length === 0) {
            delete data[dateStr];
        }
        
        localStorage.setItem('restaurantData', JSON.stringify(data));
        
        renderCalendar();
        updateStats();
        updateTodayChecks();
    }
}

document.getElementById('checkForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!selectedDate) return;
    
    const checkType = document.getElementById('checkType').value;
    let checkValue = document.getElementById('checkValue').value;
    const checkObserver = document.getElementById('checkObserver').value;
    const checkNotes = document.getElementById('checkNotes').value;
    
    if (!checkType) {
        alert('Veuillez sélectionner un type de contrôle');
        return;
    }
    
    // Pour les types sans valeur (huile, nettoyage), mettre une valeur par défaut
    if (checkType === 'huile_friture' || checkType === 'nettoyage_cuisine') {
        checkValue = 'OK';
    }
    
    if (!data[selectedDate]) {
        data[selectedDate] = [];
    }
    
    const newCheck = {
        type: checkType,
        value: checkValue,
        observer: checkObserver,
        notes: checkNotes,
        timestamp: new Date().toISOString()
    };
    
    if (editingIndex !== null) {
        // Modification d'un contrôle existant
        data[selectedDate][editingIndex] = newCheck;
    } else {
        // Ajout d'un nouveau contrôle
        data[selectedDate].push(newCheck);
    }
    
    localStorage.setItem('restaurantData', JSON.stringify(data));
    
    renderCalendar();
    updateStats();
    updateTodayChecks();
    closeModal();
});

function updateTodayChecks() {
    const today = formatDate(new Date());
    const todayChecks = document.getElementById('todayChecks');
    
    const doneTypes = data[today]?.map(c => c.type) || [];
    const allTypes = Object.keys(CONTROL_TYPES);
    
    todayChecks.innerHTML = allTypes.map(type => {
        const isDone = doneTypes.includes(type);
        return `
            <div class="check-item" style="${isDone ? 'background: #dcfce7;' : ''}">
                <input type="checkbox" id="check-${type}" ${isDone ? 'checked' : ''} disabled>
                <label for="check-${type}">${CONTROL_TYPES[type]}</label>
            </div>
        `;
    }).join('');
}

function updateStats() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const stats = {};
    
    Object.keys(CONTROL_TYPES).forEach(type => {
        stats[type] = { done: 0, total: daysInMonth };
    });
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = formatDate(new Date(year, month, day));
        if (data[dateStr]) {
            data[dateStr].forEach(check => {
                if (stats[check.type]) {
                    stats[check.type].done++;
                }
            });
        }
    }
    
    const statsGrid = document.getElementById('statsGrid');
    statsGrid.innerHTML = Object.entries(stats).map(([type, counts]) => {
        const percent = Math.round((counts.done / counts.total) * 100);
        return `
            <div class="stat-card">
                <div class="stat-label">${CONTROL_TYPES[type]}</div>
                <div class="stat-value">${counts.done}/${counts.total}</div>
                <div class="stat-percent">${percent}% complété</div>
            </div>
        `;
    }).join('');
}

document.getElementById('prevMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
    updateStats();
});

document.getElementById('nextMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
    updateStats();
});

document.getElementById('todayBtn').addEventListener('click', () => {
    currentDate = new Date();
    renderCalendar();
    updateStats();
});

function exportToCSV() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let csv = 'Date,Type de contrôle,Valeur,Observateur,Notes\n';
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = formatDate(new Date(year, month, day));
        if (data[dateStr]) {
            data[dateStr].forEach(check => {
                const date = new Date(dateStr).toLocaleDateString('fr-FR');
                csv += `"${date}","${CONTROL_TYPES[check.type]}","${check.value}","${check.observer}","${check.notes}"\n`;
            });
        }
    }
    
    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    link.download = `restaurant-checks-${year}-${String(month + 1).padStart(2, '0')}.csv`;
    link.click();
}

function printStats() {
    window.print();
}

document.getElementById('modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Initialisation au chargement de la page
initCalendar();
