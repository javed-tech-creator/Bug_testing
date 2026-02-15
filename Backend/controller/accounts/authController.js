import jwt from "jsonwebtoken";
import Accountauth from "../../models/accounts/user.js";

const genToken = (id) => jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: "7d" });

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await Accountauth.create({ name, email, password });

    res.json({
      user: { id: user._id, email: user.email },
      token: genToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Accountauth.findOne({ email });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await user.matchPassword(password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    // ✅ Send proper response
    res.json({
      message:"login succesfully",
      user: { id: user._id, email: user.email, name: user.name, role: user.role ,password:user.password},
      token: genToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};