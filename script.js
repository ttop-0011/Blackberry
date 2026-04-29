// Permit Tracking System - JavaScript

class PermitTracker {
    constructor() {
        this.permits = JSON.parse(localStorage.getItem('permits')) || [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderPermits();
        this.updateStatistics();
    }

    setupEventListeners() {
        document.getElementById('permitForm').addEventListener('submit', (e) => this.addPermit(e));
        document.getElementById('searchInput').addEventListener('input', () => this.filterPermits());
        document.getElementById('filterStatus').addEventListener('change', () => this.filterPermits());
        document.getElementById('clearFilters').addEventListener('click', () => this.clearFilters());
    }

    addPermit(e) {
        e.preventDefault();

        const permit = {
            id: Date.now(),
            permitNumber: document.getElementById('permitNumber').value,
            projectName: document.getElementById('projectName').value,
            location: document.getElementById('location').value,
            permitType: document.getElementById('permitType').value,
            status: document.getElementById('status').value,
            issuedDate: document.getElementById('issuedDate').value,
            expirationDate: document.getElementById('expirationDate').value,
            contractor: document.getElementById('contractor').value,
        };

        this.permits.push(permit);
        this.saveToLocalStorage();
        this.renderPermits();
        this.updateStatistics();
        document.getElementById('permitForm').reset();
        alert('Permit added successfully!');
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
            document.getElementById('projectName').value = permit.projectName;
            document.getElementById('location').value = permit.location;
            document.getElementById('permitType').value = permit.permitType;
            document.getElementById('status').value = permit.status;
            document.getElementById('issuedDate').value = permit.issuedDate;
            document.getElementById('expirationDate').value = permit.expirationDate;
            document.getElementById('contractor').value = permit.contractor;

            this.deletePermit(id);
            document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
        }
    }

    filterPermits() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const statusFilter = document.getElementById('filterStatus').value;

        const filtered = this.permits.filter(permit => {
            const matchesSearch = permit.permitNumber.toLowerCase().includes(searchTerm) ||
                permit.projectName.toLowerCase().includes(searchTerm);
            const matchesStatus = statusFilter === '' || permit.status === statusFilter;
            return matchesSearch && matchesStatus;
        });

        this.renderPermits(filtered);
    }

    clearFilters() {
        document.getElementById('searchInput').value = '';
        document.getElementById('filterStatus').value = '';
        this.renderPermits();
    }

    renderPermits(permitsToDisplay = this.permits) {
        const tbody = document.getElementById('permitsBody');
        tbody.innerHTML = '';

        if (permitsToDisplay.length === 0) {
            tbody.innerHTML = '<tr class="empty-state"><td colspan="9">No permits found. Add a new permit to get started.</td></tr>';
            return;
        }

        permitsToDisplay.forEach(permit => {
            const row = document.createElement('tr');
            const statusClass = `status-${permit.status}`;
            const expirationDate = new Date(permit.expirationDate);
            const today = new Date();
            const isExpired = expirationDate < today ? '⚠️ EXPIRED' : '';

            row.innerHTML = `
                <td><strong>${this.escapeHtml(permit.permitNumber)}</strong></td>
                <td>${this.escapeHtml(permit.projectName)}</td>
                <td>${this.escapeHtml(permit.location)}</td>
                <td>${this.capitalizeFirst(permit.permitType)}</td>
                <td>
                    <span class="status-badge ${statusClass}">${this.capitalizeFirst(permit.status)}</span>
                    ${isExpired}
                </td>
                <td>${this.formatDate(permit.issuedDate)}</td>
                <td>${this.formatDate(permit.expirationDate)}</td>
                <td>${this.escapeHtml(permit.contractor)}</td>
                <td>
                    <button class="btn-edit" onclick="tracker.editPermit(${permit.id})">Edit</button>
                    <button class="btn-danger" onclick="tracker.deletePermit(${permit.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    updateStatistics() {
        const total = this.permits.length;
        const pending = this.permits.filter(p => p.status === 'pending').length;
        const approved = this.permits.filter(p => p.status === 'approved').length;
        const inProgress = this.permits.filter(p => p.status === 'in-progress').length;
        const completed = this.permits.filter(p => p.status === 'completed').length;
        const expired = this.permits.filter(p => new Date(p.expirationDate) < new Date()).length;

        document.getElementById('totalPermits').textContent = total;
        document.getElementById('pendingCount').textContent = pending;
        document.getElementById('approvedCount').textContent = approved;
        document.getElementById('inProgressCount').textContent = inProgress;
        document.getElementById('completedCount').textContent = completed;
        document.getElementById('expiredCount').textContent = expired;
    }

    saveToLocalStorage() {
        localStorage.setItem('permits', JSON.stringify(this.permits));
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
const tracker = new PermitTracker();
