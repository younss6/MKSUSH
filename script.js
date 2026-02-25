// Configuration des types de contrôle (stockée en localStorage)
const DEFAULT_CONTROL_TYPES = {
    'temp_frigo': { name: 'Température frigo', icon: '❄️', valueType: 'temperature' },
    'temp_cuisine': { name: 'Température cuisine', icon: '🍳', valueType: 'temperature' },
    'huile_friture': { name: 'Changement huile friture', icon: '🫒', valueType: 'boolean' },
    'nettoyage_cuisine': { name: 'Nettoyage cuisine', icon: '🧹', valueType: 'boolean' }
};

let controlTypes = JSON.parse(localStorage.getItem('controlTypes')) || DEFAULT_CONTROL_TYPES;
let currentDate = new Date();
let selectedDate = null;
let editingIndex = null;
let data = JSON.parse(localStorage.getItem('restaurantData')) || {};

function initApp() {
    renderCalendar();
    updateStats();
    updateTodayChecks();
    updateLegend();
    populateControlTypeSelect();
    setupEventListeners();
}

function setupEventListeners() {
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

    document.getElementById('settingsBtn').addEventListener('click', openSettings);

    document.getElementById('checkForm').addEventListener('submit', handleFormSubmit);

    document.getElementById('modal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });

    document.getElementById('settingsModal').addEventListener('click', function(e) {
        if (e.target === this) closeSettings();
    });
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
                const type = controlTypes[check.type];
                if (!type) return;
                
                let itemHTML = '<div class="day-item">';
                itemHTML += `<span class="day-icon">${type.icon}</span>`;
                itemHTML += `<span class="day-label">${type.name}</span>`;
                
                if (type.valueType === 'temperature') {
                    itemHTML += `<span class="day-value">${check.value}</span>`;
                } else if (type.valueType === 'boolean') {
                    itemHTML += `<span class="day-check">✓</span>`;
                } else {
                    itemHTML += `<span class="day-value">${check.value}</span>`;
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
    setCurrentTime();
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
    document.getElementById('checkTime').value = check.time || '';
    document.getElementById('checkNotes').value = check.notes || '';
    document.getElementById('deleteBtn').style.display = 'block';
    
    updateFormFields();
    openModal();
}

function updateFormFields() {
    const checkType = document.getElementById('checkType').value;
    const valueGroup = document.getElementById('valueGroup');
    const valueLabel = document.getElementById('valueLabel');
    const checkValue = document.getElementById('checkValue');
    
    if (!checkType || !controlTypes[checkType]) {
        valueGroup.style.display = 'none';
        return;
    }
    
    const type = controlTypes[checkType];
    
    if (type.valueType === 'temperature') {
        valueGroup.style.display = 'block';
        valueLabel.textContent = 'Température (°C)';
        checkValue.placeholder = 'Ex: 4°C';
    } else if (type.valueType === 'boolean') {
        valueGroup.style.display = 'none';
    } else {
        valueGroup.style.display = 'block';
        valueLabel.textContent = 'Valeur';
        checkValue.placeholder = 'Entrez une valeur...';
    }
}

function populateControlTypeSelect() {
    const select = document.getElementById('checkType');
    const options = ['<option value="">Sélectionner...</option>'];
    
    Object.entries(controlTypes).forEach(([key, type]) => {
        options.push(`<option value="${key}">${type.icon} ${type.name}</option>`);
    });
    
    select.innerHTML = options.join('');
}

function updateLegend() {
    const legend = document.getElementById('legend');
    const items = Object.entries(controlTypes).map(([key, type]) => {
        let description = type.name;
        if (type.valueType === 'boolean') {
            description += ' (✓ = effectué)';
        }
        return `<div><span>${type.icon} ${description}</span></div>`;
    });
    
    legend.innerHTML = items.join('');
}

function openModal() {
    document.getElementById('modal').classList.add('active');
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
    selectedDate = null;
    editingIndex = null;
}

function openSettings() {
    displayExistingTypes();
    document.getElementById('settingsModal').classList.add('active');
}

function closeSettings() {
    document.getElementById('settingsModal').classList.remove('active');
}

function displayExistingTypes() {
    const container = document.getElementById('existingTypes');
    const items = Object.entries(controlTypes).map(([key, type]) => {
        const valueTypeLabel = {
            'temperature': 'Température',
            'boolean': 'Oui/Non',
            'text': 'Texte'
        }[type.valueType] || type.valueType;
        
        return `
            <div class="existing-type">
                <div class="type-info">
                    <div class="type-icon">${type.icon}</div>
                    <div class="type-details">
                        <div class="type-name">${type.name}</div>
                        <div class="type-value">${valueTypeLabel}</div>
                    </div>
                </div>
                <div class="type-actions">
                    <button class="type-delete-btn" onclick="deleteControlType('${key}')">Supprimer</button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = items.join('');
}

function addNewControlType() {
    const name = document.getElementById('newTypeName').value.trim();
    const icon = document.getElementById('newTypeIcon').value.trim();
    const valueType = document.getElementById('newTypeValue').value;
    
    if (!name || !icon) {
        alert('Veuillez remplir le nom et l\'icône');
        return;
    }
    
    const id = name.toLowerCase().replace(/\s+/g, '_');
    
    controlTypes[id] = {
        name: name,
        icon: icon,
        valueType: valueType
    };
    
    localStorage.setItem('controlTypes', JSON.stringify(controlTypes));
    
    document.getElementById('newTypeName').value = '';
    document.getElementById('newTypeIcon').value = '';
    
    populateControlTypeSelect();
    updateLegend();
    displayExistingTypes();
    
    alert('Type de contrôle ajouté !');
}

function deleteControlType(id) {
    if (Object.keys(controlTypes).length <= 1) {
        alert('Vous devez avoir au moins un type de contrôle');
        return;
    }
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${controlTypes[id].name}" ?`)) {
        delete controlTypes[id];
        localStorage.setItem('controlTypes', JSON.stringify(controlTypes));
        populateControlTypeSelect();
        updateLegend();
        displayExistingTypes();
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!selectedDate) return;
    
    const checkType = document.getElementById('checkType').value;
    let checkValue = document.getElementById('checkValue').value;
    const checkObserver = document.getElementById('checkObserver').value;
    const checkTime = document.getElementById('checkTime').value;
    const checkNotes = document.getElementById('checkNotes').value;
    
    if (!checkType) {
        alert('Veuillez sélectionner un type de contrôle');
        return;
    }
    
    const type = controlTypes[checkType];
    if (type.valueType === 'boolean') {
        checkValue = 'OK';
    }
    
    if (!data[selectedDate]) {
        data[selectedDate] = [];
    }
    
    const newCheck = {
        type: checkType,
        value: checkValue,
        observer: checkObserver,
        time: checkTime,
        notes: checkNotes,
        timestamp: new Date().toISOString()
    };
    
    if (editingIndex !== null) {
        data[selectedDate][editingIndex] = newCheck;
    } else {
        data[selectedDate].push(newCheck);
    }
    
    localStorage.setItem('restaurantData', JSON.stringify(data));
    
    renderCalendar();
    updateStats();
    updateTodayChecks();
    closeModal();
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

function updateTodayChecks() {
    const today = formatDate(new Date());
    const todayChecks = document.getElementById('todayChecks');
    
    const doneTypes = data[today]?.map(c => c.type) || [];
    const allTypes = Object.keys(controlTypes);
    
    todayChecks.innerHTML = allTypes.map(type => {
        const isDone = doneTypes.includes(type);
        const typeInfo = controlTypes[type];
        return `
            <div class="check-item" style="${isDone ? 'background: #dcfce7;' : ''}">
                <input type="checkbox" id="check-${type}" ${isDone ? 'checked' : ''} disabled>
                <label for="check-${type}">${typeInfo.icon} ${typeInfo.name}</label>
            </div>
        `;
    }).join('');
}

function updateStats() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const stats = {};
    
    Object.keys(controlTypes).forEach(type => {
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
        const typeInfo = controlTypes[type];
        return `
            <div class="stat-card">
                <div class="stat-label">${typeInfo.icon} ${typeInfo.name}</div>
                <div class="stat-value">${counts.done}/${counts.total}</div>
                <div class="stat-percent">${percent}% complété</div>
            </div>
        `;
    }).join('');
}

function exportToXLSX() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const wsData = [['Date', 'Type de contrôle', 'Valeur', 'Heure', 'Observateur', 'Notes']];
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = formatDate(new Date(year, month, day));
        const dateObj = new Date(dateStr);
        const dateFormatted = dateObj.toLocaleDateString('fr-FR');
        
        if (data[dateStr]) {
            data[dateStr].forEach(check => {
                const typeInfo = controlTypes[check.type];
                wsData.push([
                    dateFormatted,
                    typeInfo?.name || check.type,
                    check.value || '',
                    check.time || '',
                    check.observer || '',
                    check.notes || ''
                ]);
            });
        }
    }
    
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Ajuster la largeur des colonnes
    const colWidths = [15, 25, 15, 12, 15, 25];
    ws['!cols'] = colWidths.map(width => ({ wch: width }));
    
    // Style du header (optionnel - nécessite SheetJS Pro)
    const wscols = [
        { wch: 15 },
        { wch: 25 },
        { wch: 15 },
        { wch: 12 },
        { wch: 15 },
        { wch: 25 }
    ];
    ws['!cols'] = wscols;
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Contrôles ${year}-${String(month + 1).padStart(2, '0')}`);
    
    XLSX.writeFile(wb, `restaurant-checks-${year}-${String(month + 1).padStart(2, '0')}.xlsx`);
}

function printStats() {
    window.print();
}

function setCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('checkTime').value = `${hours}:${minutes}`;
}

// Initialisation
document.addEventListener('DOMContentLoaded', initApp);
