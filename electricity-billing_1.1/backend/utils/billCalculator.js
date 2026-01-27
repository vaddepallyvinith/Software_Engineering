function calculateBill(userCategory, units, lastBill) {
    // Tiered Rates
    // 0-50 units: 1.5
    // 51-100 units: 2.5
    // 101-150 units: 3.5
    // >150 units: 4.5

    let billAmount = 0;
    let remainingUnits = units;

    // Tier 1: First 50 units
    if (remainingUnits > 0) {
        let chunk = Math.min(remainingUnits, 50);
        billAmount += chunk * 1.5;
        remainingUnits -= chunk;
    }

    // Tier 2: Next 50 units
    if (remainingUnits > 0) {
        let chunk = Math.min(remainingUnits, 50);
        billAmount += chunk * 2.5;
        remainingUnits -= chunk;
    }

    // Tier 3: Next 50 units
    if (remainingUnits > 0) {
        let chunk = Math.min(remainingUnits, 50);
        billAmount += chunk * 3.5;
        remainingUnits -= chunk;
    }

    // Tier 4: Remaining units
    if (remainingUnits > 0) {
        billAmount += remainingUnits * 4.5;
    }

    // Minimum Charge Logic (if units are 0)
    if (units === 0) {
        billAmount = 25;
    }

    // Previous Dues & Fines Logic
    let previousDue = 0;
    let fineAmount = 0;

    if (lastBill && lastBill.dueAmount > 0) {
        previousDue = lastBill.dueAmount;
        fineAmount = 150; // Fixed User Requirement Fine
    }

    const totalAmount = billAmount + previousDue + fineAmount;

    return { billAmount, previousDue, fineAmount, totalAmount };
}

module.exports = { calculateBill };
