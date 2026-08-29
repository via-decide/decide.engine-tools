const { registerTool } = require('../shared/tool-storage');

function PricingCalculator() {
  this.calculateTotalCost = (quantity, unitPrice) => {
    if (typeof quantity !== 'number' || typeof unitPrice !== 'number') {
      throw new Error('Invalid input: both quantity and unit price must be numbers');
    }
    return quantity * unitPrice;
  };

  this.render = () => {
    const container = document.getElementById('pricing-calculator');
    if (!container) {
      throw new Error('Container element not found');
    }
    container.innerHTML = `
      <h2>Pricing Calculator</h2>
      <input type="number" id="quantity" placeholder="Quantity">
      <input type="number" id="unit_price" placeholder="Unit Price">
      <button onclick="calculate()">Calculate Total Cost</button>
      <p>Total Cost: <span id="total_cost"></span></p>
    `;

    const calculate = () => {
      const quantity = parseFloat(document.getElementById('quantity').value);
      const unitPrice = parseFloat(document.getElementById('unit_price').value);
      if (isNaN(quantity) || isNaN(unitPrice)) {
        throw new Error('Invalid input: both quantity and unit price must be valid numbers');
      }
      const totalCost = this.calculateTotalCost(quantity, unitPrice);
      document.getElementById('total_cost').innerText = totalCost.toFixed(2);
    };

    return calculate;
  };
}

registerTool(new PricingCalculator());