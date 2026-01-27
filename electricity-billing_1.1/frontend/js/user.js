const API_URL = "http://localhost:5200";
const user = JSON.parse(localStorage.getItem("user") || "{}"); // Use localStorage

if (!user.token) window.location.href = "index.html";

async function loadBills() {
  const res = await fetch(`${API_URL}/api/bills/my-bills`, {
    headers: { "Authorization": `Bearer ${user.token}` }
  });
  const data = await res.json();
  const bills = data.bills || []; // Response structure: { user, bills }

  const html = bills.map(b => `
    <div class="bill">
      <p><strong>Date:</strong> ${new Date(b.billDate).toLocaleDateString()}</p>
      <p>Prev: ${b.prevReading} | Curr: ${b.currentReading} | Units: ${b.units}</p>
      <p>Bill: INR ${b.billAmount} | Fine: INR ${b.fineAmount} | Total: INR ${b.totalAmount}</p>
      <p style="color: ${b.dueAmount > 0 ? "red" : "green"}; font-weight: bold">
        Due: INR ${b.dueAmount} (${b.status})
      </p>
      <button onclick='viewBill(${JSON.stringify(b)}, ${JSON.stringify(user)})' style="background-color: #2f3e46; color: white; padding: 5px 10px; border: none; cursor: pointer; border-radius: 4px;">View Receipt</button>
      ${b.status !== "Paid" ? `
        <div style="margin-top: 10px; padding: 10px; background: #f9f9f9;">
            <input type="text" id="tid-${b._id}" placeholder="Transaction ID" style="padding: 5px; margin-right: 5px;">
            <input type="number" id="amt-${b._id}" placeholder="Amount" value="${b.dueAmount}" style="padding: 5px; width: 100px; margin-right: 5px;">
            <button onclick="payBill('${b._id}')">Pay</button>
        </div>
      ` : ""}
      <hr>
    </div>
  `).join("");

  const profileHtml = `
      <h3>Hi, ${user.name}</h3>
      <div style="background: #e3f2fd; padding: 10px; border-radius: 5px; margin-bottom: 10px;">
          <p><strong>Service No:</strong> ${user.serviceNo}</p>
          <p><strong>Zone:</strong> ${user.zone || '-'}</p>
          <p><strong>Role:</strong> ${user.role}</p>
      </div>
  `;

  document.getElementById("billArea").innerHTML = profileHtml + html;
}

async function payBill(billId) {
  const transactionId = document.getElementById(`tid-${billId}`).value;
  const amount = document.getElementById(`amt-${billId}`).value;

  if (!transactionId || !amount) {
    alert("Please enter Transaction ID and Amount");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/pay-bill`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`
      },
      body: JSON.stringify({ billId, payAmount: amount, transactionId })
    });
    const d = await res.json();
    alert(d.message);
    loadBills(); // Refresh
  } catch (err) {
    alert(err);
  }
}

function viewBill(billData, userDetails) {
  billData.userDetails = userDetails;
  sessionStorage.setItem("currentBill", JSON.stringify(billData)); // Bill template specific cache
  window.location.href = "bill_template.html";
}

loadBills();
