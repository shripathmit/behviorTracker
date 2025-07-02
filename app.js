// Behavior Tracking Application
class BehaviorTracker {
    constructor() {
        this.currentStudent = null;
        this.selectedBehavior = null;
        this.selectedTimeSlot = null;
        this.currentDate = new Date().toISOString().split('T')[0];
        
        // Behavior categories with data from application_data_json
        this.behaviorCategories = {
            positive: [
                {name: "On-task", color: "#4CAF50", icon: "✓"},
                {name: "Following directions", color: "#2196F3", icon: "👂"},
                {name: "Appropriate social interaction", color: "#FF9800", icon: "🤝"},
                {name: "Compliant", color: "#9C27B0", icon: "👍"},
                {name: "Self-advocacy", color: "#00BCD4", icon: "🗣️"},
                {name: "Problem-solving", color: "#8BC34A", icon: "💡"}
            ],
            challenging: [
                {name: "Verbal outburst", color: "#F44336", icon: "🗯️"},
                {name: "Physical aggression", color: "#E91E63", icon: "✋"},
                {name: "Non-compliance", color: "#FF5722", icon: "❌"},
                {name: "Off-task", color: "#795548", icon: "👀"},
                {name: "Disruption", color: "#607D8B", icon: "⚠️"},
                {name: "Inappropriate social behavior", color: "#9E9E9E", icon: "🚫"}
            ]
        };
        
        // Time slots from 7:30 AM to 3:30 PM
        this.timeSlots = [
            "7:30", "7:45", "8:00", "8:15", "8:30", "8:45", "9:00", "9:15", "9:30", "9:45",
            "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45",
            "12:00", "12:15", "12:30", "12:45", "1:00", "1:15", "1:30", "1:45",
            "2:00", "2:15", "2:30", "2:45", "3:00", "3:15", "3:30"
        ];
        
        this.init();
    }
    
    init() {
        this.loadInitialData();
        this.setupEventListeners();
        this.updateCurrentDate();
        this.renderDashboard();
        this.populateSelects();
        this.renderBehaviorButtons();
        this.renderTimeGrid();
        this.setupThemeToggle();
        
        // Set default tracking date to today
        document.getElementById('tracking-date').value = this.currentDate;
        document.getElementById('analytics-date').value = this.currentDate;
        document.getElementById('report-start-date').value = this.currentDate;
        document.getElementById('report-end-date').value = this.currentDate;
    }
    
    loadInitialData() {
        // Load sample data if no data exists
        const students = this.getStudents();
        if (students.length === 0) {
            const sampleStudents = [
                {id: "1", name: "Alex Johnson", grade: "3rd", dateAdded: "2025-01-15"},
                {id: "2", name: "Maya Chen", grade: "4th", dateAdded: "2025-01-20"}
            ];
            localStorage.setItem('behaviorTracker_students', JSON.stringify(sampleStudents));
            
            // Add sample behavior record
            const sampleRecord = {
                studentId: "1",
                date: "2025-06-28",
                timeSlot: "8:00",
                behaviorType: "positive",
                behaviorCategory: "On-task",
                notes: "Completing math worksheet independently",
                timestamp: "2025-06-28T08:00:00Z"
            };
            localStorage.setItem('behaviorTracker_records', JSON.stringify([sampleRecord]));
        }
    }
    
    setupEventListeners() {
        // Tab navigation (if present)
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Scan button
        const scanBtn = document.getElementById('scan-button');
        if (scanBtn) {
            scanBtn.addEventListener('click', () => {
                this.switchTab('tracking');
            });
        }
        
        // Student management
        document.getElementById('add-student-btn').addEventListener('click', () => {
            this.openStudentModal();
        });
        
        document.getElementById('modal-close').addEventListener('click', () => {
            this.closeModal('student-modal');
        });
        
        document.getElementById('modal-cancel').addEventListener('click', () => {
            this.closeModal('student-modal');
        });
        
        document.getElementById('modal-save').addEventListener('click', () => {
            this.saveStudent();
        });
        
        // Tracking interface
        document.getElementById('student-select').addEventListener('change', (e) => {
            this.currentStudent = e.target.value;
            this.updateTimeGrid();
        });
        
        document.getElementById('tracking-date').addEventListener('change', (e) => {
            this.currentDate = e.target.value;
            this.updateTimeGrid();
        });
        
        // Behavior entry
        document.getElementById('cancel-entry').addEventListener('click', () => {
            this.cancelBehaviorEntry();
        });
        
        document.getElementById('save-entry').addEventListener('click', () => {
            this.saveBehaviorEntry();
        });
        
        // Analytics
        document.getElementById('analytics-student-select').addEventListener('change', (e) => {
            this.updateAnalytics(e.target.value);
        });
        
        document.getElementById('analytics-date').addEventListener('change', (e) => {
            this.updateAnalytics(document.getElementById('analytics-student-select').value, e.target.value);
        });
        
        // Reports
        document.getElementById('reports-student-select').addEventListener('change', () => {
            this.updateReportPreview();
        });
        
        document.getElementById('report-start-date').addEventListener('change', () => {
            this.updateReportPreview();
        });
        
        document.getElementById('report-end-date').addEventListener('change', () => {
            this.updateReportPreview();
        });
        
        document.getElementById('export-word').addEventListener('click', () => {
            this.exportToWord();
        });
        
        document.getElementById('export-excel').addEventListener('click', () => {
            this.exportToExcel();
        });
        
        // Confirmation modal
        document.getElementById('confirm-cancel').addEventListener('click', () => {
            this.closeModal('confirm-modal');
        });
        
        document.getElementById('confirm-ok').addEventListener('click', () => {
            if (this.confirmCallback) {
                this.confirmCallback();
            }
            this.closeModal('confirm-modal');
        });
        
        // Form validation
        document.getElementById('student-name').addEventListener('input', () => {
            this.validateStudentName();
        });
        
        // Modal backdrop clicks
        document.getElementById('student-modal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeModal('student-modal');
            }
        });
        
        document.getElementById('confirm-modal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeModal('confirm-modal');
            }
        });
    }
    
    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const currentTheme = localStorage.getItem('theme') || 'light';
        
        document.documentElement.setAttribute('data-color-scheme', currentTheme);
        themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
        
        themeToggle.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-color-scheme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-color-scheme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        });
    }
    
    updateCurrentDate() {
        const now = new Date();
        const options = { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        };
        document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', options);
    }
    
    // Data Management
    getStudents() {
        return JSON.parse(localStorage.getItem('behaviorTracker_students') || '[]');
    }
    
    saveStudents(students) {
        localStorage.setItem('behaviorTracker_students', JSON.stringify(students));
    }
    
    getBehaviorRecords() {
        return JSON.parse(localStorage.getItem('behaviorTracker_records') || '[]');
    }
    
    saveBehaviorRecords(records) {
        localStorage.setItem('behaviorTracker_records', JSON.stringify(records));
    }
    
    // Tab Management
    switchTab(tabName) {
        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        const navTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (navTab) {
            navTab.classList.add('active');
        }
        
        // Show active content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        // Load tab-specific data
        if (tabName === 'analytics') {
            this.updateAnalytics();
        } else if (tabName === 'reports') {
            this.updateReportPreview();
        }
    }
    
    // Student Management
    openStudentModal(student = null) {
        const modal = document.getElementById('student-modal');
        const title = document.getElementById('modal-title');
        const nameInput = document.getElementById('student-name');
        const gradeSelect = document.getElementById('student-grade');
        
        if (student) {
            title.textContent = 'Edit Student';
            nameInput.value = student.name;
            gradeSelect.value = student.grade;
            this.editingStudent = student;
        } else {
            title.textContent = 'Add Student';
            nameInput.value = '';
            gradeSelect.value = '';
            this.editingStudent = null;
        }
        
        modal.classList.add('show');
        nameInput.focus();
    }
    
    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('show');
        this.clearValidationErrors();
    }
    
    validateStudentName() {
        const nameInput = document.getElementById('student-name');
        const errorDiv = document.getElementById('name-error');
        const name = nameInput.value.trim();
        
        if (!name) {
            errorDiv.textContent = 'Student name is required';
            errorDiv.classList.add('show');
            return false;
        }
        
        const students = this.getStudents();
        const existingStudent = students.find(s => 
            s.name.toLowerCase() === name.toLowerCase() && 
            (!this.editingStudent || s.id !== this.editingStudent.id)
        );
        
        if (existingStudent) {
            errorDiv.textContent = 'A student with this name already exists';
            errorDiv.classList.add('show');
            return false;
        }
        
        errorDiv.classList.remove('show');
        return true;
    }
    
    clearValidationErrors() {
        document.querySelectorAll('.error-message').forEach(error => {
            error.classList.remove('show');
        });
    }
    
    saveStudent() {
        if (!this.validateStudentName()) {
            return;
        }
        
        const name = document.getElementById('student-name').value.trim();
        const grade = document.getElementById('student-grade').value;
        const students = this.getStudents();
        
        if (this.editingStudent) {
            // Edit existing student
            const index = students.findIndex(s => s.id === this.editingStudent.id);
            if (index !== -1) {
                students[index] = { ...students[index], name, grade };
            }
        } else {
            // Add new student
            const newStudent = {
                id: Date.now().toString(),
                name,
                grade,
                dateAdded: new Date().toISOString().split('T')[0]
            };
            students.push(newStudent);
        }
        
        this.saveStudents(students);
        this.closeModal('student-modal');
        this.renderDashboard();
        this.populateSelects();
        this.showToast('Student saved successfully', 'success');
    }
    
    deleteStudent(studentId) {
        this.confirmAction('Are you sure you want to delete this student? All behavior records will also be deleted.', () => {
            const students = this.getStudents().filter(s => s.id !== studentId);
            const records = this.getBehaviorRecords().filter(r => r.studentId !== studentId);
            
            this.saveStudents(students);
            this.saveBehaviorRecords(records);
            this.renderDashboard();
            this.populateSelects();
            this.showToast('Student deleted successfully', 'success');
        });
    }
    
    // Dashboard
    renderDashboard() {
        const students = this.getStudents();
        const records = this.getBehaviorRecords();
        
        // Update student count
        document.getElementById('total-students').textContent = students.length;
        
        // Render student list
        const studentList = document.getElementById('student-list');
        if (students.length === 0) {
            studentList.innerHTML = '<p class="text-secondary text-center">No students added yet</p>';
        } else {
            studentList.innerHTML = students.map(student => `
                <div class="student-item">
                    <div class="student-info">
                        <h4>${student.name}</h4>
                        <div class="student-meta">Grade: ${student.grade || 'Not specified'} • Added: ${new Date(student.dateAdded).toLocaleDateString()}</div>
                    </div>
                    <div class="student-actions">
                        <button class="btn btn--sm btn--secondary" onclick="app.openStudentModal(${JSON.stringify(student).replace(/"/g, '&quot;')})">Edit</button>
                        <button class="btn btn--sm btn--outline" onclick="app.deleteStudent('${student.id}')">Delete</button>
                    </div>
                </div>
            `).join('');
        }
        
        // Render recent activity
        this.renderRecentActivity();
    }
    
    renderRecentActivity() {
        const records = this.getBehaviorRecords();
        const students = this.getStudents();
        const recentRecords = records
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 5);
        
        const activityDiv = document.getElementById('recent-activity');
        
        if (recentRecords.length === 0) {
            activityDiv.innerHTML = '<p class="text-secondary">No recent behavior records</p>';
        } else {
            activityDiv.innerHTML = recentRecords.map(record => {
                const student = students.find(s => s.id === record.studentId);
                const behavior = this.findBehavior(record.behaviorCategory);
                return `
                    <div class="activity-item">
                        <div>${student ? student.name : 'Unknown Student'} - ${record.behaviorCategory}</div>
                        <div class="activity-time">${new Date(record.timestamp).toLocaleString()}</div>
                    </div>
                `;
            }).join('');
        }
    }
    
    // Behavior Tracking
    populateSelects() {
        const students = this.getStudents();
        const selects = [
            'student-select',
            'analytics-student-select', 
            'reports-student-select'
        ];
        
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            const currentValue = select.value;
            
            select.innerHTML = '<option value="">Select a student</option>' +
                students.map(student => 
                    `<option value="${student.id}">${student.name}</option>`
                ).join('');
            
            // Restore selection if it still exists
            if (currentValue && students.find(s => s.id === currentValue)) {
                select.value = currentValue;
            }
        });
    }
    
    renderBehaviorButtons() {
        const positiveContainer = document.getElementById('positive-behaviors');
        const challengingContainer = document.getElementById('challenging-behaviors');
        
        positiveContainer.innerHTML = this.behaviorCategories.positive.map(behavior => `
            <button class="behavior-btn" data-behavior="${behavior.name}" data-type="positive" style="border-color: ${behavior.color}">
                <span class="behavior-icon">${behavior.icon}</span>
                <span>${behavior.name}</span>
            </button>
        `).join('');
        
        challengingContainer.innerHTML = this.behaviorCategories.challenging.map(behavior => `
            <button class="behavior-btn" data-behavior="${behavior.name}" data-type="challenging" style="border-color: ${behavior.color}">
                <span class="behavior-icon">${behavior.icon}</span>
                <span>${behavior.name}</span>
            </button>
        `).join('');
        
        // Add event listeners
        document.querySelectorAll('.behavior-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectBehavior(e.currentTarget);
            });
        });
    }
    
    renderTimeGrid() {
        const timeGrid = document.getElementById('time-grid');
        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        const currentMinute = currentTime.getMinutes();
        
        timeGrid.innerHTML = this.timeSlots.map(time => {
            const [hour, minute] = time.split(':').map(Number);
            const adjustedHour = hour < 7 ? hour + 12 : hour; // Handle PM times
            const isCurrentTime = Math.abs(adjustedHour - currentHour) === 0 && 
                                Math.abs(minute - currentMinute) < 15;
            
            return `
                <button class="time-slot ${isCurrentTime ? 'current-time' : ''}" 
                        data-time="${time}">
                    ${time}
                </button>
            `;
        }).join('');
        
        // Add event listeners
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.addEventListener('click', (e) => {
                this.selectTimeSlot(e.currentTarget);
            });
        });
        
        this.updateTimeGrid();
    }
    
    updateTimeGrid() {
        if (!this.currentStudent || !this.currentDate) {
            return;
        }
        
        const records = this.getBehaviorRecords().filter(r => 
            r.studentId === this.currentStudent && 
            r.date === this.currentDate
        );
        
        document.querySelectorAll('.time-slot').forEach(slot => {
            const time = slot.dataset.time;
            const hasRecord = records.find(r => r.timeSlot === time);
            
            slot.classList.remove('has-behavior');
            slot.querySelector('.behavior-indicator')?.remove();
            
            if (hasRecord) {
                slot.classList.add('has-behavior');
                const behavior = this.findBehavior(hasRecord.behaviorCategory);
                if (behavior) {
                    slot.style.backgroundColor = behavior.color;
                    slot.style.color = '#fff';
                }
            } else {
                slot.style.backgroundColor = '';
                slot.style.color = '';
            }
        });
    }
    
    selectBehavior(button) {
        // Clear previous selection
        document.querySelectorAll('.behavior-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Select current behavior
        button.classList.add('selected');
        this.selectedBehavior = {
            name: button.dataset.behavior,
            type: button.dataset.type
        };
        
        // If we have both behavior and time slot, show entry form
        if (this.selectedBehavior && this.selectedTimeSlot) {
            this.showBehaviorEntryForm();
        }
    }
    
    selectTimeSlot(slot) {
        if (!this.currentStudent) {
            this.showToast('Please select a student first', 'error');
            return;
        }
        
        // Clear previous selection
        document.querySelectorAll('.time-slot').forEach(s => {
            s.classList.remove('selected');
        });
        
        // Select current slot
        slot.classList.add('selected');
        this.selectedTimeSlot = slot.dataset.time;
        
        // If we have both behavior and time slot, show entry form
        if (this.selectedBehavior && this.selectedTimeSlot) {
            this.showBehaviorEntryForm();
        }
    }
    
    showBehaviorEntryForm() {
        const form = document.getElementById('behavior-entry-form');
        document.getElementById('selected-time-slot').textContent = this.selectedTimeSlot;
        document.getElementById('selected-behavior').textContent = this.selectedBehavior.name;
        document.getElementById('behavior-notes').value = '';
        
        form.style.display = 'block';
    }
    
    cancelBehaviorEntry() {
        document.getElementById('behavior-entry-form').style.display = 'none';
        this.clearSelections();
    }
    
    saveBehaviorEntry() {
        if (!this.currentStudent || !this.selectedBehavior || !this.selectedTimeSlot) {
            this.showToast('Missing required information', 'error');
            return;
        }
        
        const notes = document.getElementById('behavior-notes').value.trim();
        const records = this.getBehaviorRecords();
        
        // Remove existing record for this time slot
        const filteredRecords = records.filter(r => 
            !(r.studentId === this.currentStudent && 
              r.date === this.currentDate && 
              r.timeSlot === this.selectedTimeSlot)
        );
        
        // Add new record
        const newRecord = {
            id: Date.now().toString(),
            studentId: this.currentStudent,
            date: this.currentDate,
            timeSlot: this.selectedTimeSlot,
            behaviorType: this.selectedBehavior.type,
            behaviorCategory: this.selectedBehavior.name,
            notes: notes,
            timestamp: new Date().toISOString()
        };
        
        filteredRecords.push(newRecord);
        this.saveBehaviorRecords(filteredRecords);
        
        // Update UI
        this.updateTimeGrid();
        this.renderRecentActivity();
        this.cancelBehaviorEntry();
        this.showToast('Behavior recorded successfully', 'success');
    }
    
    clearSelections() {
        this.selectedBehavior = null;
        this.selectedTimeSlot = null;
        
        document.querySelectorAll('.behavior-btn, .time-slot').forEach(element => {
            element.classList.remove('selected');
        });
    }
    
    findBehavior(behaviorName) {
        return [...this.behaviorCategories.positive, ...this.behaviorCategories.challenging]
            .find(b => b.name === behaviorName);
    }
    
    // Analytics
    updateAnalytics(studentId = null, date = null) {
        const student = studentId || document.getElementById('analytics-student-select').value;
        const selectedDate = date || document.getElementById('analytics-date').value;
        
        if (!student) {
            this.clearCharts();
            return;
        }
        
        const records = this.getBehaviorRecords().filter(r => 
            r.studentId === student && 
            (!selectedDate || r.date === selectedDate)
        );
        
        this.renderDailyChart(records);
        this.renderPieChart(records);
        this.renderTrendChart(student);
    }
    
    renderDailyChart(records) {
        const ctx = document.getElementById('daily-chart').getContext('2d');
        
        if (this.dailyChart) {
            this.dailyChart.destroy();
        }
        
        const hourlyData = new Array(24).fill(0);
        records.forEach(record => {
            const [hour] = record.timeSlot.split(':').map(Number);
            const adjustedHour = hour < 7 ? hour + 12 : hour;
            hourlyData[adjustedHour]++;
        });
        
        this.dailyChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Array.from({length: 24}, (_, i) => `${i}:00`),
                datasets: [{
                    label: 'Behavior Records',
                    data: hourlyData,
                    backgroundColor: '#1FB8CD',
                    borderColor: '#1FB8CD',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }
    
    renderPieChart(records) {
        const ctx = document.getElementById('pie-chart').getContext('2d');
        
        if (this.pieChart) {
            this.pieChart.destroy();
        }
        
        const behaviorCounts = {};
        const behaviorColors = {};
        
        records.forEach(record => {
            behaviorCounts[record.behaviorCategory] = (behaviorCounts[record.behaviorCategory] || 0) + 1;
            const behavior = this.findBehavior(record.behaviorCategory);
            if (behavior) {
                behaviorColors[record.behaviorCategory] = behavior.color;
            }
        });
        
        const labels = Object.keys(behaviorCounts);
        const data = Object.values(behaviorCounts);
        const colors = labels.map(label => behaviorColors[label] || '#999');
        
        this.pieChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    renderTrendChart(studentId) {
        const ctx = document.getElementById('trend-chart').getContext('2d');
        
        if (this.trendChart) {
            this.trendChart.destroy();
        }
        
        const records = this.getBehaviorRecords().filter(r => r.studentId === studentId);
        const last7Days = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            last7Days.push(date.toISOString().split('T')[0]);
        }
        
        const positiveData = last7Days.map(date => 
            records.filter(r => r.date === date && r.behaviorType === 'positive').length
        );
        
        const challengingData = last7Days.map(date => 
            records.filter(r => r.date === date && r.behaviorType === 'challenging').length
        );
        
        this.trendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: last7Days.map(date => new Date(date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})),
                datasets: [
                    {
                        label: 'Positive Behaviors',
                        data: positiveData,
                        borderColor: '#4CAF50',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Challenging Behaviors',
                        data: challengingData,
                        borderColor: '#F44336',
                        backgroundColor: 'rgba(244, 67, 54, 0.1)',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }
    
    clearCharts() {
        [this.dailyChart, this.pieChart, this.trendChart].forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });
    }
    
    // Reports
    updateReportPreview() {
        const studentId = document.getElementById('reports-student-select').value;
        const startDate = document.getElementById('report-start-date').value;
        const endDate = document.getElementById('report-end-date').value;
        
        if (!studentId || !startDate || !endDate) {
            document.getElementById('report-content').innerHTML = 
                '<p class="text-secondary">Select a student and date range to generate a report preview</p>';
            return;
        }
        
        const students = this.getStudents();
        const student = students.find(s => s.id === studentId);
        const records = this.getBehaviorRecords().filter(r => 
            r.studentId === studentId && 
            r.date >= startDate && 
            r.date <= endDate
        );
        
        const behaviorSummary = {};
        records.forEach(record => {
            behaviorSummary[record.behaviorCategory] = (behaviorSummary[record.behaviorCategory] || 0) + 1;
        });
        
        const positiveCount = records.filter(r => r.behaviorType === 'positive').length;
        const challengingCount = records.filter(r => r.behaviorType === 'challenging').length;
        
        document.getElementById('report-content').innerHTML = `
            <div class="report-header">
                <h3>Behavior Report: ${student.name}</h3>
                <p><strong>Period:</strong> ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}</p>
                <p><strong>Grade:</strong> ${student.grade || 'Not specified'}</p>
            </div>
            
            <div class="report-summary">
                <h4>Summary</h4>
                <p><strong>Total Behaviors Recorded:</strong> ${records.length}</p>
                <p><strong>Positive Behaviors:</strong> ${positiveCount}</p>
                <p><strong>Challenging Behaviors:</strong> ${challengingCount}</p>
                <p><strong>Positive/Challenging Ratio:</strong> ${challengingCount > 0 ? (positiveCount / challengingCount).toFixed(2) : 'N/A'}</p>
            </div>
            
            <div class="behavior-breakdown">
                <h4>Behavior Breakdown</h4>
                ${Object.entries(behaviorSummary).map(([behavior, count]) => 
                    `<p><strong>${behavior}:</strong> ${count} occurrences</p>`
                ).join('')}
            </div>
        `;
    }
    
    exportToWord() {
        const studentId = document.getElementById('reports-student-select').value;
        if (!studentId) {
            this.showToast('Please select a student first', 'error');
            return;
        }
        
        this.showToast('Word export feature coming soon', 'info');
    }
    
    exportToExcel() {
        const studentId = document.getElementById('reports-student-select').value;
        const startDate = document.getElementById('report-start-date').value;
        const endDate = document.getElementById('report-end-date').value;
        
        if (!studentId || !startDate || !endDate) {
            this.showToast('Please select a student and date range', 'error');
            return;
        }
        
        const students = this.getStudents();
        const student = students.find(s => s.id === studentId);
        const records = this.getBehaviorRecords().filter(r => 
            r.studentId === studentId && 
            r.date >= startDate && 
            r.date <= endDate
        );
        
        const workbook = XLSX.utils.book_new();
        
        // Create data sheet
        const wsData = [
            ['Date', 'Time', 'Behavior Type', 'Behavior Category', 'Notes'],
            ...records.map(r => [r.date, r.timeSlot, r.behaviorType, r.behaviorCategory, r.notes || ''])
        ];
        
        const worksheet = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Behavior Data');
        
        // Create summary sheet
        const behaviorSummary = {};
        records.forEach(record => {
            behaviorSummary[record.behaviorCategory] = (behaviorSummary[record.behaviorCategory] || 0) + 1;
        });
        
        const summaryData = [
            ['Student Name', student.name],
            ['Report Period', `${startDate} to ${endDate}`],
            ['Total Records', records.length],
            ['Positive Behaviors', records.filter(r => r.behaviorType === 'positive').length],
            ['Challenging Behaviors', records.filter(r => r.behaviorType === 'challenging').length],
            [],
            ['Behavior', 'Count'],
            ...Object.entries(behaviorSummary)
        ];
        
        const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
        
        XLSX.writeFile(workbook, `behavior_report_${student.name.replace(/\s+/g, '_')}_${startDate}_to_${endDate}.xlsx`);
        this.showToast('Excel file downloaded successfully', 'success');
    }
    
    // Utility Methods
    confirmAction(message, callback) {
        document.getElementById('confirm-message').textContent = message;
        document.getElementById('confirm-modal').classList.add('show');
        this.confirmCallback = callback;
    }
    
    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const messageElement = document.getElementById('toast-message');
        
        messageElement.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new BehaviorTracker();
});