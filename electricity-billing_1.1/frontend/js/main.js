const API_URL = "http://localhost:5200";

// Helper to get token
function getAuthHeaders() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return {
        "Content-Type": "application/json",
        "Authorization": user.token ? `Bearer ${user.token}` : ""
    };
}

function showRegister() {
    document.getElementById("loginArea").classList.add("hidden");
    document.getElementById("registerArea").classList.remove("hidden");
}

function showLogin() {
    document.getElementById("registerArea").classList.add("hidden");
    document.getElementById("loginArea").classList.remove("hidden");
}

async function handleLogin() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const role = document.getElementById("loginRole").value;

    if (!role) {
        alert("Please select a role");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, role })
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        // Save user info in localStorage (Senior Dev Standard)
        localStorage.setItem("user", JSON.stringify(data));

        // Redirect based on role
        if (data.role === "admin") window.location.href = "admin_dashboard.html";
        else if (data.role === "employee") window.location.href = "employee_dashboard.html";
        else window.location.href = "user_dashboard.html";

    } catch (err) {
        alert(err.message);
    }
}

async function handleRegister() {
    const form = {
        name: document.getElementById("regName").value,
        mobile: document.getElementById("regMobile").value,
        email: document.getElementById("regEmail").value,
        address: document.getElementById("regAddress").value,
        pincode: document.getElementById("regPincode").value,
        password: document.getElementById("regPassword").value,
        category: document.getElementById("regCategory").value,
        zone: document.getElementById("regZone").value
    };

    try {
        const res = await fetch(`${API_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        alert(`Registered! Service No: ${data.serviceNo}`);
        showLogin();

    } catch (err) {
        alert(err.message);
    }
}
