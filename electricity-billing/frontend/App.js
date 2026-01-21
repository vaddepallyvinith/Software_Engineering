 
const { useState } = React;

function App() {
  const [page, setPage] = useState("login");
  const [role, setRole] = useState("");
  const [zone, setZone] = useState("");
  const [serviceNo, setServiceNo] = useState("");
  const [userName, setUserName] = useState("");

  const [form, setForm] = useState({});
  const [billData, setBillData] = useState(null);

  const [adminData, setAdminData] = useState([]);
  const [adminBills, setAdminBills] = useState(null);
  const [selectedConsumer, setSelectedConsumer] = useState("");

  /* ================= LOGOUT ================= */
  function logout() {
    setPage("login");
    setRole("");
    setZone("");
    setServiceNo("");
    setUserName("");
    setForm({});
    setBillData(null);
    setAdminData([]);
    setAdminBills(null);
  }

  /* ================= LOGIN ================= */
  async function login() {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const d = await res.json();
    if (!res.ok) return alert(d.message);

    setRole(d.role);
    setZone(d.zone || "");
    setServiceNo(d.serviceNo || "");
    setUserName(d.name || "");
    setPage("dashboard");
  }

  /* ================= REGISTER ================= */
  async function registerConsumer() {
    const res = await fetch("http://localhost:5000/register-consumer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const d = await res.json();
    alert("Registered Successfully\nService No: " + d.serviceNo);
    setPage("login");
    setForm({});
  }

  /* ================= GENERATE BILL (EMPLOYEE) ================= */
  async function generateBill() {
    const res = await fetch("http://localhost:5000/generate-bill", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceNo: form.serviceNo,
        currentReading: Number(form.currentReading),
        employeeZone: zone
      })
    });
    const d = await res.json();
    alert(d.message);
  }

  /* ================= VIEW BILLS (CONSUMER) ================= */
  async function viewBills() {
    const res = await fetch(`http://localhost:5000/bills/${serviceNo}`);
    const d = await res.json();
    setBillData(d);
  }

  /* ================= PAY BILL ================= */
  async function payBill() {
    const res = await fetch("http://localhost:5000/pay-bill", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceNo,
        payAmount: Number(form.payAmount),
        paymentMode: form.paymentMode,
        transactionId:
          form.paymentMode === "UPI" ? form.transactionId : "CASH"
      })
    });

    const d = await res.json();
    alert("Remaining Due: ₹" + d.remainingDue);
    viewBills();
  }

  /* ================= ADMIN ================= */
  async function loadConsumers() {
    const res = await fetch("http://localhost:5000/admin/users");
    setAdminData(await res.json());
  }

  async function loadEmployees() {
    const res = await fetch("http://localhost:5000/admin/employees");
    setAdminData(await res.json());
  }

  async function viewAdminBills(serviceNo, name) {
    const res = await fetch(`http://localhost:5000/admin/bills/${serviceNo}`);
    const d = await res.json();
    if (!res.ok) return alert(d.message);

    setSelectedConsumer(`${name} (${serviceNo})`);
    setAdminBills(d.bills);
  }

  return React.createElement(
    "div",
    { className: "app" },

    /* ================= LOGIN ================= */
    page === "login" &&
      React.createElement("div", { className: "card" },
        React.createElement("h2", null, "Login"),
        React.createElement("input", {
          placeholder: "Email",
          onChange: e => setForm({ ...form, email: e.target.value })
        }),
        React.createElement("input", {
          placeholder: "Password",
          type: "password",
          onChange: e => setForm({ ...form, password: e.target.value })
        }),
        React.createElement("button", { onClick: login }, "Login"),
        React.createElement("button", { onClick: () => setPage("register") }, "Register Consumer")
      ),

    /* ================= REGISTER ================= */
    page === "register" &&
      React.createElement("div", { className: "card" },
        React.createElement("h2", null, "Consumer Registration"),
        ["name","mobile","email","address","pincode","password"].map(f =>
          React.createElement("input", {
            key: f,
            placeholder: f,
            onChange: e => setForm({ ...form, [f]: e.target.value })
          })
        ),
        React.createElement("select", {
          onChange: e => setForm({ ...form, category: e.target.value })
        },
          ["","household","commercial","industry"].map(c =>
            React.createElement("option", { key: c, value: c }, c || "Select Category")
          )
        ),
        React.createElement("select", {
          onChange: e => setForm({ ...form, zone: e.target.value })
        },
          ["","North","South","East","West"].map(z =>
            React.createElement("option", { key: z, value: z }, z || "Select Zone")
          )
        ),
        React.createElement("button", { onClick: registerConsumer }, "Register"),
        React.createElement("button", { onClick: () => setPage("login") }, "Back")
      ),

    /* ================= DASHBOARD ================= */
    page === "dashboard" &&
      React.createElement("div", null,

        /* -------- ADMIN -------- */
        role === "admin" &&
          React.createElement("div", { className: "card" },
            React.createElement("h3", null, "Admin Dashboard"),
            React.createElement("button", { onClick: loadConsumers }, "View Consumers"),
            React.createElement("button", { onClick: loadEmployees }, "View Employees"),

            adminData.map((u, i) =>
              React.createElement("div", { key: i, className: "list-item" },
                React.createElement("span", null,
                  `${u.name} | ${u.serviceNo} | Total Due: ₹${u.totalDue}`
                ),
                React.createElement("button", {
                  style: { marginLeft: "10px" },
                  onClick: () => viewAdminBills(u.serviceNo, u.name)
                }, "View Bills")
              )
            ),

            adminBills &&
              React.createElement("div", { className: "card", style: { marginTop: "20px" } },
                React.createElement("h3", null, "Bills of " + selectedConsumer),

                adminBills.map((b, i) =>
                  React.createElement("div", { key: i, className: "bill" },
                    React.createElement("p", null, "Service No: " + b.serviceNo),
                    React.createElement("p", null, "Previous Reading: " + b.prevReading),
                    React.createElement("p", null, "Current Reading: " + b.currentReading),
                    React.createElement("p", null, "Units: " + b.units),
                    React.createElement("p", null, "Bill Amount: ₹" + b.billAmount),
                    React.createElement("p", null, "Previous Due: ₹" + b.previousDue),
                    React.createElement("p", null, "Total Due: ₹" + b.totalAmount),
                    React.createElement("p", null, "Paid Amount: ₹" + b.paidAmount),
                    React.createElement("p",
                      { style: { fontWeight: "bold", color: "red" } },
                      "Remaining Due: ₹" + b.dueAmount
                    ),
                    React.createElement("p", null,
                      "Bill Date: " + new Date(b.billDate).toLocaleString()
                    ),
                    React.createElement("p", null,
                      "Due Date: " + new Date(b.dueDate).toLocaleDateString()
                    ),
                    React.createElement("hr")
                  )
                )
              ),

            React.createElement("button", { onClick: logout }, "Logout")
          ),

        /* -------- EMPLOYEE -------- */
        role === "employee" &&
          React.createElement("div", { className: "card" },
            React.createElement("h3", null, `Employee (${zone} Zone)`),
            React.createElement("input", {
              placeholder: "Service Number",
              onChange: e => setForm({ ...form, serviceNo: e.target.value })
            }),
            React.createElement("input", {
              placeholder: "Current Reading",
              type: "number",
              onChange: e => setForm({ ...form, currentReading: e.target.value })
            }),
            React.createElement("button", { onClick: generateBill }, "Generate Bill"),
            React.createElement("button", { onClick: logout }, "Logout")
          ),

        /* -------- CONSUMER -------- */
        role === "consumer" &&
          React.createElement("div", { className: "card" },
            React.createElement("h3", null, `Hi, ${userName}`),
            React.createElement("button", { onClick: viewBills }, "View Bills"),

            billData &&
              billData.bills.map((b, i) =>
                React.createElement("div", { key: i, className: "bill" },
                  React.createElement("p", null, "Service No: " + serviceNo),
                  React.createElement("p", null, "Previous Reading: " + b.prevReading),
                  React.createElement("p", null, "Current Reading: " + b.currentReading),
                  React.createElement("p", null, "Units: " + b.units),
                  React.createElement("p", null, "Bill Amount: ₹" + b.billAmount),
                  React.createElement("p", null, "Previous Due: ₹" + b.previousDue),
                  React.createElement("p", null, "Total Due: ₹" + b.totalAmount),
                  React.createElement("p", null, "Paid Amount: ₹" + b.paidAmount),
                  React.createElement("p",
                    { style: { fontWeight: "bold", fontStyle: "italic", color: "red" } },
                    "Remaining Due: ₹" + b.dueAmount
                  ),

                  i === 0 && b.status !== "PAID" &&
                    React.createElement("div", null,
                      React.createElement("input", {
                        placeholder: "Pay Amount",
                        type: "number",
                        onChange: e =>
                          setForm({ ...form, payAmount: e.target.value })
                      }),
                      React.createElement("select", {
                        onChange: e =>
                          setForm({ ...form, paymentMode: e.target.value })
                      },
                        React.createElement("option", { value: "" }, "Payment Mode"),
                        React.createElement("option", { value: "Cash" }, "Cash"),
                        React.createElement("option", { value: "UPI" }, "UPI")
                      ),
                      form.paymentMode === "UPI" &&
                        React.createElement("input", {
                          placeholder: "Transaction ID",
                          onChange: e =>
                            setForm({ ...form, transactionId: e.target.value })
                        }),
                      React.createElement("button", { onClick: payBill }, "Pay Bill")
                    ),
                  React.createElement("hr")
                )
              ),

            React.createElement("button", { onClick: logout }, "Logout")
          )
      )
  );
}

ReactDOM.render(
  React.createElement(App),
  document.getElementById("root")
);