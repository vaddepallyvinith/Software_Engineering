const API_URL = "http://localhost:5200";

function showAddEmployee() {
    document.getElementById("addEmployeeArea").classList.remove("hidden");
    document.getElementById("listArea").innerHTML = "";
}

// Helper to get token
function getAuthHeaders() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return {
        "Content-Type": "application/json",
        "Authorization": user.token ? `Bearer ${user.token}` : ""
    };
}

async function loadEmployees() {
    document.getElementById("addEmployeeArea").classList.add("hidden");
    const res = await fetch(`${API_URL}/admin/employees`, { headers: getAuthHeaders() });
    const data = await res.json();

    const html = data.map(e => `
    <div class="list-item">
      <span>${e.name} (${e.role}) - ${e.zone} Zone</span>
      <span>${e.email}</span>
    </div>
  `).join("");

    document.getElementById("listArea").innerHTML = `<h3>Employees</h3>${html}`;
}

async function loadConsumers() {
    document.getElementById("addEmployeeArea").classList.add("hidden");
    const res = await fetch(`${API_URL}/api/users`, { headers: getAuthHeaders() });
    const data = await res.json();

    const html = data.map(u => `
    <div class="list-item">
      <span>${u.name} | ${u.serviceNo} | Due: INR ${u.totalDue}</span>
    </div>
  `).join("");

    document.getElementById("listArea").innerHTML = `<h3>Consumers</h3>${html}`;
}

async function registerEmployee() {
    const form = {
        name: document.getElementById("empName").value,
        email: document.getElementById("empEmail").value,
        password: document.getElementById("empPassword").value,
        mobile: document.getElementById("empMobile").value,
        zone: document.getElementById("empZone").value
    };

    try {
        const res = await fetch(`${API_URL}/admin/register-employee`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        });
        const data = await res.json();
        alert(data.message);
        if (res.ok) {
            document.getElementById("addEmployeeArea").classList.add("hidden");
            loadEmployees();
        }
    } catch (err) {
        alert(err);
    }
}
