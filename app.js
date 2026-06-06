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

function handleLogin(e) {
    e.preventDefault();
    alert('Login clicked!');
}