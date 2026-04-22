import { User } from "../models/user.model.js";

const registerUser = async (req, res) => {
  try {
    console.log("Register request body:", req.body);
    const { username, email, password } = req.body;

    // basic validation
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }
    // check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // create new user
    const newUser = new User({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: password, // Password will be hashed by pre-save hook
      loggedIn: false,
    });
    await newUser.save();
    console.log("New user saved:", newUser);
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    console.log("Login request body:", req.body);
    //checking if the user exists
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(400).json({ message: "User not found" });
    }

    // Compare passwords
    console.log("Comparing password:", password, "with hash:", user.password);
    const isMatch = await user.comparePassword(password);
    console.log("Password match result:", isMatch);
    if (!isMatch) return res.status(400).json({ message: "Invalid Response" });

    res.status(200).json({
      message: "User Logged in",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const logoutUser = async (req, res) => {
  try {
    const {email} =req.body
    const user=await User.findOne({
      email
    });

    if(!user) return res.status(404).json({
      message:"User not found"
    });

    res.status(200).json({
      message:"Logout succesfull"
    })
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error", error
    })
  }
}

export { registerUser, loginUser, logoutUser };
