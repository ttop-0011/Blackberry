// Permit to Work (PTW) System - JavaScript

class PTWTracker {
    constructor() {
        this.permits = JSON.parse(localStorage.getItem('ptwPermits')) || [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderPermits();
        this.updateStatistics();
    }

    setupEventListeners() {
        document.getElementById('ptwForm').addEventListener('submit', (e) => this.addPermit(e));
        document.getElementById('searchInput').addEventListener('input', () => this.filterPermits());
        document.getElementById('filterRiskLevel').addEventListener('change', () => this.filterPermits());
        document.getElementById('filterPTWStatus').addEventListener('change', () => this.filterPermits());
        document.getElementById('clearFilters').addEventListener('click', () => this.clearFilters());
    }

    addPermit(e) {
        e.preventDefault();

        // Get selected activities
        const activities = Array.from(document.querySelectorAll('input[name="activities"]:checked'))
            .map(cb => cb.value);

        const permit = {
            id: Date.now(),
            permitNumber: document.getElementById('permitNumber').value,
            department: document.getElementById('department').value,
            validityFrom: document.getElementById('validityFrom').value,
            validityTill: document.getElementById('validityTill').value,
            riskLevel: document.getElementById('riskLevel').value,
            activities: activities,
            location: document.getElementById('location').value,
            projectSite: document.getElementById('projectSite').value,
            holder: document.getElementById('holder').value,
            applicant: document.getElementById('applicant').value,
            authoriser1: document.getElementById('authoriser1').value,
            authoriser2: document.getElementById('authoriser2').value,
            ptwFormStatus: document.getElementById('ptwFormStatus').value,
            createdDate: new Date().toISOString().split('T')[0]
        };

        this.permits.push(permit);
        this.saveToLocalStorage();
        this.renderPermits();
        this.updateStatistics();
        document.getElementById('ptwForm').reset();
        alert('Permit to Work created successfully!');
    }

    deletePermit(id) {
        if (confirm('Are you sure you want to delete this permit?')) {
            this.permits = this.permits.filter(p => p.id !== id);
            this.saveToLocalStorage();
            this.renderPermits();
            this.updateStatistics();
        }
    }

    editPermit(id) {
        const permit = this.permits.find(p => p.id === id);
        if (permit) {
            document.getElementById('permitNumber').value = permit.permitNumber;
            document.getElementById('department').value = permit.department;
            document.getElementById('validityFrom').value = permit.validityFrom;
            document.getElementById('validityTill').value = permit.validityTill;
            document.getElementById('riskLevel').value = permit.riskLevel;
            document.getElementById('location').value = permit.location;
            document.getElementById('projectSite').value = permit.projectSite;
            document.getElementById('holder').value = permit.holder;
            document.getElementById('applicant').value = permit.applicant;
            document.getElementById('authoriser1').value = permit.authoriser1;
            document.getElementById('authoriser2').value = permit.authoriser2;
            document.getElementById('ptwFormStatus').value = permit.ptwFormStatus;

            // Check activities
            document.querySelectorAll('input[name="activities"]').forEach(cb => {
                cb.checked = permit.activities.includes(cb.value);
            });

            this.deletePermit(id);
            document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
        }
    }

    filterPermits() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const riskLevelFilter = document.getElementById('filterRiskLevel').value;
        const ptwStatusFilter = document.getElementById('filterPTWStatus').value;

        const filtered = this.permits.filter(permit => {
            const matchesSearch = permit.permitNumber.toLowerCase().includes(searchTerm) ||
                permit.location.toLowerCase().includes(searchTerm);
            const matchesRiskLevel = riskLevelFilter === '' || permit.riskLevel === riskLevelFilter;
            const matchesPTWStatus = ptwStatusFilter === '' || permit.ptwFormStatus === ptwStatusFilter;
            return matchesSearch && matchesRiskLevel && matchesPTWStatus;
        });

        this.renderPermits(filtered);
    }

    clearFilters() {
        document.getElementById('searchInput').value = '';
        document.getElementById('filterRiskLevel').value = '';
        document.getElementById('filterPTWStatus').value = '';
        this.renderPermits();
    }

    renderPermits(permitsToDisplay = this.permits) {
        const tbody = document.getElementById('ptwBody');
        tbody.innerHTML = '';

        if (permitsToDisplay.length === 0) {
            tbody.innerHTML = '<tr class="empty-state"><td colspan="14">No permits found. Create a new permit to work to get started.</td></tr>';
            return;
        }

        permitsToDisplay.forEach(permit => {
            const row = document.createElement('tr');
            const riskClass = `risk-${permit.riskLevel}`;
            const validityTill = new Date(permit.validityTill);
            const today = new Date();
            const isExpired = validityTill < today ? '⚠️ EXPIRED' : '';

            row.innerHTML = `
                <td><strong>${this.escapeHtml(permit.permitNumber)}</strong></td>
                <td>${this.capitalizeFirst(permit.department)}</td>
                <td>${this.formatDate(permit.validityFrom)}</td>
                <td>${this.formatDate(permit.validityTill)} ${isExpired}</td>
                <td><span class="risk-badge ${riskClass}">${this.capitalizeFirst(permit.riskLevel)}</span></td>
                <td>${permit.activities.map(a => this.capitalizeFirst(a)).join(', ') || 'N/A'}</td>
                <td>${this.escapeHtml(permit.location)}</td>
                <td>${this.escapeHtml(permit.projectSite)}</td>
                <td>${this.escapeHtml(permit.holder)}</td>
                <td>${this.escapeHtml(permit.applicant)}</td>
                <td>${this.escapeHtml(permit.authoriser1)}</td>
                <td>${this.escapeHtml(permit.authoriser2)}</td>
                <td><span class="form-status-badge ${permit.ptwFormStatus === 'done' ? 'status-done' : 'status-pending'}">${this.capitalizeFirst(permit.ptwFormStatus)}</span></td>
                <td>
                    <button class="btn-edit" onclick="tracker.editPermit(${permit.id})">Edit</button>
                    <button class="btn-danger" onclick="tracker.deletePermit(${permit.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    updateStatistics() {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

        const startOfYear = new Date(today.getFullYear(), 0, 1);
        const endOfYear = new Date(today.getFullYear() + 1, 0, 1);

        // Daily Statistics
        const dailyPermits = this.permits.filter(p => {
            const pDate = new Date(p.createdDate);
            return pDate >= startOfDay && pDate < endOfDay;
        });

        // Weekly Statistics
        const weeklyPermits = this.permits.filter(p => {
            const pDate = new Date(p.createdDate);
            return pDate >= startOfWeek && pDate < endOfWeek;
        });

        // Monthly Statistics
        const monthlyPermits = this.permits.filter(p => {
            const pDate = new Date(p.createdDate);
            return pDate >= startOfMonth && pDate < endOfMonth;
        });

        // Yearly Statistics
        const yearlyPermits = this.permits.filter(p => {
            const pDate = new Date(p.createdDate);
            return pDate >= startOfYear && pDate < endOfYear;
        });

        // Update total counts
        document.getElementById('dailyTotal').textContent = dailyPermits.length;
        document.getElementById('weeklyTotal').textContent = weeklyPermits.length;
        document.getElementById('monthlyTotal').textContent = monthlyPermits.length;
        document.getElementById('yearlyTotal').textContent = yearlyPermits.length;

        // Update daily department stats
        this.updateDepartmentStats(dailyPermits, 'dailyDepartmentStats');

        // Update weekly department stats
        this.updateDepartmentStats(weeklyPermits, 'weeklyDepartmentStats');

        // Update monthly department stats
        this.updateDepartmentStats(monthlyPermits, 'monthlyDepartmentStats');

        // Update yearly department stats
        this.updateDepartmentStats(yearlyPermits, 'yearlyDepartmentStats');

        // Risk Level Overview
        document.getElementById('totalPTW').textContent = this.permits.length;
        document.getElementById('lowRiskCount').textContent = this.permits.filter(p => p.riskLevel === 'low').length;
        document.getElementById('mediumRiskCount').textContent = this.permits.filter(p => p.riskLevel === 'medium').length;
        document.getElementById('highRiskCount').textContent = this.permits.filter(p => p.riskLevel === 'high').length;
        document.getElementById('criticalRiskCount').textContent = this.permits.filter(p => p.riskLevel === 'critical').length;
        document.getElementById('formSubmittedCount').textContent = this.permits.filter(p => p.ptwFormStatus === 'done').length;
    }

    updateDepartmentStats(permits, elementId) {
        const departments = {};

        permits.forEach(permit => {
            const dept = permit.department;
            departments[dept] = (departments[dept] || 0) + 1;
        });

        const container = document.getElementById(elementId);
        container.innerHTML = '';

        if (Object.keys(departments).length === 0) {
            container.innerHTML = '<p>No data available</p>';
            return;
        }

        Object.keys(departments).forEach(dept => {
            const stat = document.createElement('div');
            stat.className = 'stat-card';
            stat.innerHTML = `
                <h4>${this.capitalizeFirst(dept)}</h4>
                <p class="stat-value">${departments[dept]}</p>
            `;
            container.appendChild(stat);
        });
    }

    saveToLocalStorage() {
        localStorage.setItem('ptwPermits', JSON.stringify(this.permits));
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    capitalizeFirst(str) {
        return str.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the tracker
const tracker = new PTWTracker();
