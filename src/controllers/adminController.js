import {
  getWebsiteSetting,
  UpdateWebsiteSetting,
} from "../models/adminModel.js";

// export async function signInAdmin(req, res) {
//   const { email, password } = req.body;
//   const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

//   if (rows.length === 0) return res.status(401).json({ error: "Invalid credentials" });

//   const user = rows[0];
//   const isMatch = await bcrypt.compare(password, user.password);

//   if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

//   // You can generate a token here if using JWT
//   if (user.role === "admin") {
//     return res.json({ message: "Admin login successful", redirect: "/admin-dashboard" });
//   } else {
//     return res.json({ message: "User login successful", redirect: "/user-dashboard" });
//   }
// };

//@desc Get all users
//@route GET /users
export async function fetchAllWebsiteSetting(req, res) {
  try {
    const website_settings = await getWebsiteSetting();
    res.json(website_settings);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export const editWebsiteSetting = async (req, res) => {
  try {
    const data = req.body;

    const updatedSetting = await UpdateWebsiteSetting(data);

    return res.status(200).json({
      message: "Setting updated successfully",
      setting: updatedSetting,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error updating setting",
      error: err.message,
    });
  }
};
