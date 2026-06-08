function loadLogin() {
    document.getElementById('landingPage').style.display = 'none';
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
    document.getElementById('landingPage').style.display = 'none';
    const user = JSON.parse(localStorage.getItem('loggedUser'));

    document.getElementById('app').innerHTML = `
        <div class="dashboard">
            
            <div class="dash-header">
                <h2>Islamia University of Bahawalpur</h2>
                <button class="btn-logout" onclick="localStorage.removeItem('loggedUser'); loadHome();">Logout</button>
            </div>

            <div class="welcome-box">
                <h3>Welcome, ${user.name}! 👋</h3>
                <p>Roll No: ${user.rollNo}</p>
                <p>Department: ${user.department}</p>
                <p>Semester: ${user.semester}</p>
            </div>

            <div class="dash-actions">
                <button class="btn-submit" onclick="loadSubmit()">+ Submit New Application</button>
            </div>

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

            <div class="tickets-container">
                <h3>My Submitted Applications</h3>
                <div id="ticketsList">
                    <p>Loading...</p>
                </div>
            </div>

        </div>
    `;

    loadTickets(user.id);
    document.getElementById('filterType').addEventListener('change', () => loadTickets(user.id));
}

async function loadTickets(userId) {
    try {
        const response = await fetch(`http://localhost:3000/tickets`);

        if (!response.ok) {
            document.getElementById('ticketsList').innerHTML = `<p class="error-msg">Server error!</p>`;
            return;
        }

        const tickets = await response.json();

        // filter by userId manually
        let filtered = tickets.filter(t => t.userId === userId);

        // filter by type
        const filterType = document.getElementById('filterType').value;
        if (filterType !== 'all') {
            filtered = filtered.filter(t => t.type === filterType);
        }

        if (filtered.length === 0) {
            document.getElementById('ticketsList').innerHTML = `<p class="no-tickets">No applications found!</p>`;
            return;
        }

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
            const typeLabel = typeLabels[ticket.type] || ticket.type;

            cards += `
                <div class="ticket-card">
                    <div class="ticket-card-header">
                        <span class="ticket-type">📄 ${typeLabel}</span>
                        <span class="ticket-badge ${badgeClass}">${statusIcon} ${ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}</span>
                    </div>
                    <div class="ticket-card-body">
                        <p class="ticket-subject"><strong>Subject:</strong> ${ticket.subject}</p>
                        <p class="ticket-desc"><strong>Description:</strong> ${ticket.description}</p>
                    </div>
                </div>
            `;
        });

        document.getElementById('ticketsList').innerHTML = cards;

    } catch (error) {
        document.getElementById('ticketsList').innerHTML = `<p class="error-msg">Cannot connect to server!</p>`;
    }
}

function loadSubmit() {
    document.getElementById('app').innerHTML = `
        <div class="dashboard">

            <div class="dash-header">
                <h2>Islamia University of Bahawalpur</h2>
                <button class="btn-logout" onclick="loadDashboard()">Back to Dashboard</button>
            </div>

            <div class="form-container">
                <h3>Submit New Application</h3>

                <form id="submitForm">
                    <div class="form-group">
                        <label for="appType">Application Type*</label>
                        <select id="appType" name="appType" required>
                            <option value="">Select Type</option>
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

                    <div class="form-group">
                        <label for="subject">Subject*</label>
                        <input type="text" id="subject" name="subject" 
                        autocomplete="off" placeholder="e.g. Request for Degree Certificate" required/>
                    </div>

                    <div class="form-group">
                        <label for="description">Description*</label>
                        <textarea id="description" name="description" 
                        rows="6" placeholder="Write your application here" required></textarea>
                    </div>

                    <div id="submitError" style="color:red; font-size:13px;"></div>
                    <div id="submitSuccess" style="color:green; font-size:13px;"></div>

                    <div class="form-buttons">
                        <button type="submit" class="btn-submit">Submit Application</button>
                        <button type="button" class="btn-back" onclick="loadDashboard()">Cancel</button>
                    </div>

                </form>
            </div>

            <div class="format-container">
                <h3>Application Format Guide</h3>

                <div class="format-box">
                    <h4>1. Degree Issuance</h4>
                    <p>To,<br>The Controller of Examinations,<br>Islamia University of Bahawalpur<br><br>
                    Subject: Application for Degree Issuance<br><br>
                    Respected Sir/Madam,<br>
                    I am [Your Name], student of [Department], Semester [X], Roll No [XXXX].
                    I request you to please issue my degree certificate.<br><br>
                    Thanking you,<br>Your Name<br>Roll No</p>
                </div>

                <div class="format-box">
                    <h4>2. Transcript Request</h4>
                    <p>To,<br>The Controller of Examinations,<br>Islamia University of Bahawalpur<br><br>
                    Subject: Application for Transcript<br><br>
                    Respected Sir/Madam,<br>
                    I am [Your Name], Roll No [XXXX].
                    I request you to please provide my official transcript.<br><br>
                    Thanking you,<br>Your Name<br>Roll No</p>
                </div>

                <div class="format-box">
                    <h4>3. Leave Approval</h4>
                    <p>To,<br>The Head of Department,<br>Islamia University of Bahawalpur<br><br>
                    Subject: Application for Leave<br><br>
                    Respected Sir/Madam,<br>
                    I am [Your Name], Roll No [XXXX].
                    I request you to please grant me leave from [Start Date] to [End Date] due to [Reason].<br><br>
                    Thanking you,<br>Your Name<br>Roll No</p>
                </div>

                <div class="format-box">
                    <h4>4. Fee Correction</h4>
                    <p>To,<br>The Treasurer,<br>Islamia University of Bahawalpur<br><br>
                    Subject: Application for Fee Correction<br><br>
                    Respected Sir/Madam,<br>
                    I am [Your Name], Roll No [XXXX].
                    I request you to please correct my fee challan.<br><br>
                    Thanking you,<br>Your Name<br>Roll No</p>
                </div>

                <div class="format-box">
                    <h4>5. Hostel Request</h4>
                    <p>To,<br>The Hostel Warden,<br>Islamia University of Bahawalpur<br><br>
                    Subject: Application for Hostel Accommodation<br><br>
                    Respected Sir/Madam,<br>
                    I am [Your Name], Roll No [XXXX].
                    I request you to please allocate me a hostel room.<br><br>
                    Thanking you,<br>Your Name<br>Roll No</p>
                </div>

                <div class="format-box">
                    <h4>6. Scholarship Request</h4>
                    <p>To,<br>The Scholarship Committee,<br>Islamia University of Bahawalpur<br><br>
                    Subject: Application for Scholarship<br><br>
                    Respected Sir/Madam,<br>
                    I am [Your Name], Roll No [XXXX].
                    I request you to please consider me for the scholarship program.<br><br>
                    Thanking you,<br>Your Name<br>Roll No</p>
                </div>

                <div class="format-box">
                    <h4>7. Bonafide Certificate</h4>
                    <p>To,<br>The Registrar,<br>Islamia University of Bahawalpur<br><br>
                    Subject: Application for Bonafide Certificate<br><br>
                    Respected Sir/Madam,<br>
                    I am [Your Name], Roll No [XXXX].
                    I request you to please issue my bonafide certificate for [Purpose].<br><br>
                    Thanking you,<br>Your Name<br>Roll No</p>
                </div>

                <div class="format-box">
                    <h4>8. Other</h4>
                    <p>To,<br>The Concerned Authority,<br>Islamia University of Bahawalpur<br><br>
                    Subject: [Write Your Subject]<br><br>
                    Respected Sir/Madam,<br>
                    I am [Your Name], Roll No [XXXX].
                    I request you to please [Write Your Request].<br><br>
                    Thanking you,<br>Your Name<br>Roll No</p>
                </div>

            </div>
        </div>
    `;

    document.getElementById('submitForm').addEventListener('submit', handleSubmit);
}

async function handleSubmit(e) {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('loggedUser'));

    const appType = document.getElementById('appType').value;
    const subject = document.getElementById('subject').value;
    const description = document.getElementById('description').value;

    if (!appType) {
        document.getElementById('submitError').innerHTML = 'Please select application type!';
        return;
    }
    if (subject.trim() === '') {
        document.getElementById('submitError').innerHTML = 'Please enter subject!';
        return;
    }
    if (description.trim() === '') {
        document.getElementById('submitError').innerHTML = 'Please enter description!';
        return;
    }

    const ticket = {
        userId: user.id,
        studentName: user.name,
        rollNo: user.rollNo,
        department: user.department,
        type: appType,
        subject: subject,
        description: description,
        status: 'pending'
    }

    try {
        const response = await fetch('http://localhost:3000/tickets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ticket)
        });

        if (!response.ok) {
            document.getElementById('submitError').innerHTML = 'Server error! Try again.';
            return;
        }

        document.getElementById('submitSuccess').innerHTML = 'Application submitted successfully!';

        loadDashboard();

    } catch (error) {
        document.getElementById('submitError').innerHTML = 'Cannot connect to server!';
    }
}