function loadLogin() {

    // hide landing page
    document.getElementById('landingPage').style.display = 'none';

    // load login form
    document.getElementById('app').innerHTML = `
        <div class="login-box">
            <h2>Islamia University of Bahawalpur</h2>
            <h3>Help Desk Login</h3>

            <form id="loginForm">
            <div class="form-group">
                <label for="registrationNo">Registration No*</label>
                <input type="text" id="registrationNo" name="registrationNo" autocomplete="off" 
                placeholder="e.g. F24BSCS1M0001" required/>
            </div>

            <div class="form-group">
                <label for="pwd">Password*</label>
                <input type="password" id="pwd" name="pwd" autocomplete="off" required/>
            </div>
                <div id="errorMsg"></div>

                <button type="submit" class="btn-login">Login</button>
                <button type="button" class="btn-back" onclick="loadHome()">Back to Home</button>
            </form>
        </div>
    `;

    // attach login handler
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
}

function loadHome() {
    document.getElementById('landingPage').style.display = 'block';
    document.getElementById('app').innerHTML = '';
}

async function handleLogin(e) {
    e.preventDefault();

    const registrationNo = document.getElementById('registrationNo').value;
    const pwd = document.getElementById('pwd').value;

    document.getElementById('errorMsg').innerHTML = 'Please wait...';

    try {
        const response = await fetch('http://localhost:3000/users');

        if (!response.ok) {
            document.getElementById('errorMsg').innerHTML = 'Server error!';
            return;
        }

        const users = await response.json();

        const user = users.find(u => u.rollNo === registrationNo && u.password === pwd);

        if (user) {
            localStorage.setItem('loggedUser', JSON.stringify(user));
            loadDashboard();
        } else {
            document.getElementById('errorMsg').innerHTML = 'Invalid Registration No or Password!';
        }

    } catch (error) {
        document.getElementById('errorMsg').innerHTML = 'Cannot connect to server!';
    }
}

function loadDashboard() {
    // get logged user from localStorage
    const user = JSON.parse(localStorage.getItem('loggedUser'));

    document.getElementById('app').innerHTML = `
        <div class="dashboard">
            
            <!-- Header -->
            <div class="dash-header">
                <h2>Islamia University of Bahawalpur</h2>
                <button class="btn-logout" onclick="loadHome()">Logout</button>
            </div>

            <!-- Welcome -->
            <div class="welcome-box">
                <h3>Welcome, ${user.name}! 👋</h3>
                <p>Roll No: ${user.rollNo}</p>
                <p>Department: ${user.department}</p>
                <p>Semester: ${user.semester}</p>
            </div>

            <!-- Submit Button -->
            <div class="dash-actions">
                <button class="btn-submit" onclick="loadSubmit()">+ Submit New Application</button>
            </div>

<!-- Filters -->
<div class="filters">
    <select id="filterType">
        <option value="all">All Types</option>
        <option value="degree">Degree Issuance</option>
        <option value="transcript">Transcript Request</option>
        <option value="leave">Leave Approval</option>
        <option value="fee">Fee Correction</option>
        <option value="hostel">Hostel Request</option>
        <option value="scholarship">Scholarship Request</option>
        <option value="bonafide">Bonafide Certificate</option>
        <option value="other">Other</option>
    </select>
</div>

            <!-- Applications Table -->
            <div class="table-container">
                <h3>My Submitted Applications</h3>
                <table id="ticketsTable">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Type</th>
                            <th>Subject</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="ticketsList">
                        <tr>
                            <td colspan="5">Loading...</td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    `;

    // load tickets after dashboard loads
    loadTickets(user.id);

    // filter event listeners
    document.getElementById('filterType').addEventListener('change', () => loadTickets(user.id));
}

async function loadTickets(userId) {
    try {
        const response = await fetch(`http://localhost:3000/tickets?userId=${userId}`);
        
        if (!response.ok) {
            document.getElementById('ticketsList').innerHTML = `
                <tr><td colspan="5">Server error!</td></tr>
            `;
            return;
        }

        const tickets = await response.json();

        // get filter value
        const filterType = document.getElementById('filterType').value;

        // filter tickets
        let filtered = tickets;
        if (filterType !== 'all') {
            filtered = tickets.filter(t => t.type === filterType);
        }

        // show tickets in table
        if (filtered.length === 0) {
            document.getElementById('ticketsList').innerHTML = `
                <tr><td colspan="5">No applications found!</td></tr>
            `;
            return;
        }

        let rows = '';
        filtered.forEach((ticket, index) => {
            rows += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${ticket.type}</td>
                    <td>${ticket.subject}</td>
                    <td>${ticket.date}</td>
                    <td>${ticket.status}</td>
                </tr>
            `;
        });

        document.getElementById('ticketsList').innerHTML = rows;

    } catch (error) {
        document.getElementById('ticketsList').innerHTML = `
            <tr><td colspan="5">Cannot connect to server!</td></tr>
        `;
    }
}