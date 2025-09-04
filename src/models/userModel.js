import { db } from "../config/db.js";

export async function insertUser(userData) {
  const query = `
    INSERT INTO users (
      first_name, last_name, email, gender, dob,
      phone_number, home_address, city, state,
      country, profile_pic, password, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    userData.first_name,
    userData.last_name,
    userData.email,
    userData.gender,
    userData.dob,
    userData.phone_number,
    userData.home_address,
    userData.city,
    userData.state,
    userData.country,
    userData.profile_pic || null,
    userData.password,
    "active",
  ];

  const [result] = await db.execute(query, values);
  return result;
}

export async function findUserByEmail(email) {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
}

// Route to get all users
export async function getAllUsers() {
  const [rows] = await db.query("SELECT * FROM users");
  return rows;
}

export async function getAUser(id) {
    const [rows] = await db.query(`
        SELECT * 
        from users
        WHERE id = ?
        `, [id]);
    return rows[0];
}

export async function updateUser(id, data) {
  // Build the query dynamically based on what fields are being updated
  const fields = Object.keys(data)
    .map((key) => `${key} = ?`)
    .join(", ");

  const values = Object.values(data);

  const query = `UPDATE users SET ${fields} WHERE id = ?`;

  // Execute query
  const [result] = await db.query(query, [...values, id]);

  if (result.affectedRows === 0) {
    throw new Error("User not found or no changes made");
  }

  // Return updated user
  return await getAUser(id);
}

export async function deleteAUser(id) {
  const [result] = await db.query(
    "DELETE FROM users WHERE id = ?",
    [id]
  );
  return result;
}
