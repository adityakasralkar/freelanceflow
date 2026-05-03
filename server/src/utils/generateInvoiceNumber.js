const { query } = require('../config/db');

async function generateInvoiceNumber() {
  const result = await query(
    `SELECT invoice_number FROM invoices
     WHERE invoice_number ~ '^INV-[0-9]+$'
     ORDER BY CAST(SUBSTRING(invoice_number FROM 5) AS INTEGER) DESC
     LIMIT 1`
  );

  let nextNum = 1;
  if (result.rows.length > 0) {
    const last = result.rows[0].invoice_number;
    const numericPart = parseInt(last.split('-')[1], 10);
    nextNum = numericPart + 1;
  }

  return `INV-${String(nextNum).padStart(3, '0')}`;
}

module.exports = generateInvoiceNumber;
