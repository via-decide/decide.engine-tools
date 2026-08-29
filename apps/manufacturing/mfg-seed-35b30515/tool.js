function calculateTotalCost(quantity, pricePerUnit) {
  if (typeof quantity !== 'number' || typeof pricePerUnit !== 'number') {
    throw new Error('Invalid input: both quantity and pricePerUnit must be numbers');
  }
  return quantity * pricePerUnit;
}

function generateReport(data) {
  if (!data || !data.quantity || !data.pricePerUnit) {
    throw new Error('Invalid data: missing required properties');
  }
  const totalCost = calculateTotalCost(data.quantity, data.pricePerUnit);
  // Generate report with total cost
  console.log(`Report generated: Total Cost - ${totalCost}`);
}