const API_URL = "http://localhost:5200";
const user = JSON.parse(localStorage.getItem("user") || "{}");

if (user.role !== "employee") window.location.href = "index.html";
document.getElementById("zoneInfo").innerText = `Zone: ${user.zone}`;

async function generateBill() {
    const serviceNo = document.getElementById("serviceNo").value;
    const currentReading = document.getElementById("currentReading").value;

    try {
        const res = await fetch(`${API_URL}/api/bills/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(() => { // Inline helper or use global
                    const u = JSON.parse(localStorage.getItem("user") || "{}");
                    return u.token ? { "Authorization": `Bearer ${u.token}` } : {};
                })()
            },
            body: JSON.stringify({
                serviceNo,
                currentReading,
                employeeZone: user.zone
            })
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        const b = data.bill;
        const c = data.consumer;

        const receiptHtml = `
        <p><strong>Consumer:</strong> ${c.name}</p>
        <p><strong>Service No:</strong> ${c.serviceNo}</p>
        <p><strong>Address:</strong> ${c.address}</p>
        <p><strong>Category:</strong> ${c.category}</p>
        <hr>
        <p>Previous Reading: ${b.prevReading}</p>
        <p>Current Reading: ${b.currentReading}</p>
        <p>Units Consumed: ${b.units}</p>
        <p><strong>Bill Amount: INR ${b.billAmount}</strong></p>
        <p>Fine: INR ${b.fineAmount}</p>
        <p>Arrears: INR ${b.previousDue}</p>
        <h4 style="color:red">Total Due: INR ${b.totalAmount}</h4>
        <p>Due Date: ${new Date(b.dueDate).toLocaleDateString()}</p>
    `;

        document.getElementById("receiptContent").innerHTML = receiptHtml;
        document.getElementById("receiptArea").classList.remove("hidden");

    } catch (err) {
        alert(err.message || err);
    }
}
