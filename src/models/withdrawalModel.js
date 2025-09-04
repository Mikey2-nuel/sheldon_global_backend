import { db } from "../config/db.js";

// Create a new withdrawal
export async function createWithdrawal(data) {
  const query = `
    INSERT INTO withdrawals (
      user_id, currency, amount, wallet, status
    ) VALUES (?, ?, ?, ?, ?)
  `;
  const values = [
    data.user_id,
    data.currency,
    data.amount,
    data.wallet,
    data.status || 'pending'
  ];
  const [result] = await db.execute(query, values);
  return result;
}

// Get all withdrawals
// export async function getAllWithdrawals() {
//   const [rows] = await db.query(`
//     SELECT w.*, u.first_name, u.last_name, u.email
//     FROM withdrawals w
//     JOIN users u ON w.user_id = u.id
//     ORDER BY w.created_at DESC
//   `);
//   return rows;
// }

// Get withdrawals by user
export async function getWithdrawalsByUser(userId) {
  const [rows] = await db.query(`
    SELECT * FROM withdrawals
    WHERE user_id = ?
    ORDER BY created_at DESC
  `, [userId]);
  return rows;
}

// Update withdrawal status
export async function updateWithdrawalStatus(id, status) {
  const [result] = await db.query(`
    UPDATE withdrawals SET status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [status, id]);
  return result;
}
