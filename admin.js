// Check admin login on page load
window.onload = function() {
    const admin = localStorage.getItem('loggedAdmin');
    if (admin) {
        showAdminPanel();
    }
    document.getElementById('adminLoginForm').onsubmit = handleAdminLogin;
}

async function handleAdminLogin(e) {
    e.preventDefault();

    const rollNo = document.getElementById('adminRollNo').value.trim();
    const pwd = document.getElementById('adminPwd').value.trim();

    if (!rollNo || !pwd) {
        document.getElementById('adminErrorMsg').innerHTML = 'Please fill all fields!';
        return;
    }

    document.getElementById('adminErrorMsg').innerHTML = 'Please wait...';

    try {
        const response = await fetch('http://localhost:3000/users');
        if (!response.ok) {
            document.getElementById('adminErrorMsg').innerHTML = 'Server error!';
            return;
        }

        const users = await response.json();
        const admin = users.find(u => u.rollNo === rollNo && u.password === pwd && u.role === 'admin');

        if (admin) {
            localStorage.setItem('loggedAdmin', JSON.stringify(admin));
            showAdminPanel();
        } else {
            document.getElementById('adminErrorMsg').innerHTML = 'Invalid credentials or not an admin!';
        }

    } catch (error) {
        document.getElementById('adminErrorMsg').innerHTML = 'Cannot connect to server!';
    }
}

function showAdminPanel() {
    document.getElementById('adminLoginSection').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    loadAdminTickets();

    document.getElementById('searchBox').addEventListener('input', loadAdminTickets);
    document.getElementById('adminFilterStatus').addEventListener('change', loadAdminTickets);
    document.getElementById('adminFilterType').addEventListener('change', loadAdminTickets);
}

function adminLogout() {
    localStorage.removeItem('loggedAdmin');
    document.getElementById('adminLoginSection').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
}

async function loadAdminTickets() {
    try {
        const response = await fetch('http://localhost:3000/tickets');
        if (!response.ok) {
            document.getElementById('adminTicketsList').innerHTML = '<p class="error-msg">Server error!</p>';
            return;
        }

        const tickets = await response.json();

        // update statistics
        document.getElementById('totalCount').innerHTML = tickets.length;
        document.getElementById('pendingCount').innerHTML = tickets.filter(t => t.status === 'pending').length;
        document.getElementById('resolvedCount').innerHTML = tickets.filter(t => t.status === 'resolved').length;
        document.getElementById('rejectedCount').innerHTML = tickets.filter(t => t.status === 'rejected').length;

        // get filter values
        const search = document.getElementById('searchBox').value.toLowerCase();
        const filterStatus = document.getElementById('adminFilterStatus').value;
        const filterType = document.getElementById('adminFilterType').value;

        // apply filters
        let filtered = tickets;

        if (search) {
            filtered = filtered.filter(t =>
                t.studentName.toLowerCase().includes(search) ||
                t.rollNo.toLowerCase().includes(search)
            );
        }
        if (filterStatus !== 'all') {
            filtered = filtered.filter(t => t.status === filterStatus);
        }
        if (filterType !== 'all') {
            filtered = filtered.filter(t => t.type === filterType);
        }

        if (filtered.length === 0) {
            document.getElementById('adminTicketsList').innerHTML = '<p class="no-tickets">No applications found!</p>';
            return;
        }

        const typeLabels = {
            degree: 'Degree Issuance',
            transcript: 'Transcript Request',
            leave: 'Leave Approval',
            fee: 'Fee Correction',
            hostel: 'Hostel Request',
            scholarship: 'Scholarship Request',
            bonafide: 'Bonafide Certificate',
            other: 'Other'
        };

        let cards = '';
        filtered.forEach((ticket) => {

            let badgeClass = '';
            let statusIcon = '';
            if (ticket.status === 'pending') {
                badgeClass = 'badge-pending';
                statusIcon = '🟡';
            } else if (ticket.status === 'resolved') {
                badgeClass = 'badge-resolved';
                statusIcon = '🟢';
            } else if (ticket.status === 'rejected') {
                badgeClass = 'badge-rejected';
                statusIcon = '🔴';
            }

            const typeLabel = typeLabels[ticket.type] || ticket.type;

            cards += `
                <div class="ticket-card" id="ticket-${ticket.id}">
                    <div class="ticket-card-header">
                        <span class="ticket-type">📄 ${typeLabel}</span>
                        <span class="ticket-badge ${badgeClass}">${statusIcon} ${ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}</span>
                    </div>
                    <div class="ticket-card-body">
                        <p><strong>Student:</strong> ${ticket.studentName}</p>
                        <p><strong>Roll No:</strong> ${ticket.rollNo}</p>
                        <p><strong>Department:</strong> ${ticket.department}</p>
                        <p><strong>Semester:</strong> ${ticket.semester}</p>
                        <p class="ticket-subject"><strong>Subject:</strong> ${ticket.subject}</p>
                        <p class="ticket-desc"><strong>Description:</strong> ${ticket.description}</p>
                    </div>
                    <div class="admin-note-box">
                        <input type="text" id="note-${ticket.id}" placeholder="Write admin note..." value="${ticket.adminNote || ''}"/>
                        <button class="btn-save" onclick="saveNote('${ticket.id}')">Save Note</button>
                    </div>
                    <div class="ticket-actions">
                        <button class="btn-approve" onclick="updateStatus('${ticket.id}', 'resolved')">✅ Approve</button>
                        <button class="btn-reject" onclick="updateStatus('${ticket.id}', 'rejected')">❌ Reject</button>
                        <button class="btn-delete" onclick="deleteTicket('${ticket.id}')">🗑 Delete</button>
                    </div>
                </div>
            `;
        });

        document.getElementById('adminTicketsList').innerHTML = cards;

    } catch (error) {
        document.getElementById('adminTicketsList').innerHTML = '<p class="error-msg">Cannot connect to server!</p>';
    }
}

async function updateStatus(id, status) {
    try {
        const response = await fetch(`http://localhost:3000/tickets/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: status })
        });

        if (!response.ok) {
            alert('Failed to update status!');
            return;
        }

        loadAdminTickets();

    } catch (error) {
        alert('Cannot connect to server!');
    }
}

async function saveNote(id) {
    const note = document.getElementById(`note-${id}`).value.trim();

    try {
        const response = await fetch(`http://localhost:3000/tickets/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ adminNote: note })
        });

        if (!response.ok) {
            alert('Failed to save note!');
            return;
        }

        alert('Note saved successfully!');

    } catch (error) {
        alert('Cannot connect to server!');
    }
}

async function deleteTicket(id) {
    if (!confirm('Are you sure you want to delete this application?')) return;

    try {
        const response = await fetch(`http://localhost:3000/tickets/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            alert('Failed to delete!');
            return;
        }

        loadAdminTickets();

    } catch (error) {
        alert('Cannot connect to server!');
    }
}