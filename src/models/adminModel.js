import { db } from "../config/db.js";

export async function getWebsiteSetting() {
  const [rows] = await db.query('SELECT * FROM website_settings LIMIT 1');
  return rows[0];
}

export async function UpdateWebsiteSetting(data) {
  const { website_link, name, email, title, year, referral_commission } = data;

  await db.query(
    `UPDATE website_settings SET
      website_link = ?, name = ?, email = ?, title = ?, year = ?, referral_commission = ?
     WHERE id = 1`,
    [website_link, name, email, title, year, referral_commission]
  );

  // You can return something if needed
  return { message: 'Settings updated successfully' };
}
