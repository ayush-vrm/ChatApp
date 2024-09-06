const User = require("../models/userModel");
const bcrypt = require("bcrypt");

// Login User
module.exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ 
        msg: "Incorrect Username or Password", 
        status: false });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        msg: "Incorrect Username or Password", 
        status: false });
    }

    const { password: _, ...userData } = user.toObject(); 
    return res.status(200).json({ 
      status: true, 
      user: userData });
  } 
  catch (error) {
    next(error);
  }
};

// Register User
module.exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(409).json({ 
        msg: "Username already used", 
        status: false });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(409).json({ 
        msg: "Email already used", 
        status: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, username, password: hashedPassword });
    
    const { password: _, ...userData } = user.toObject(); 
    return res.status(201).json({ status: true, user: userData });
  } catch (error) {
    next(error);
  }
};

// Get All Users (excluding the requesting user)
module.exports.getAllUsers = async (req, res, next) => {
  const { id } = req.params;

  try {
    const users = await User.find({ _id: { $ne: id } }).select("email username avatarImage _id");
    return res.status(200).json(users);
  } 
  catch (error) {
    next(error);
  }
};

// Set Avatar for User
module.exports.setAvatar = async (req, res, next) => {
  const { id } = req.params;
  const { image } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isAvatarImageSet: true, avatarImage: image },
      { new: true, 
        select: "isAvatarImageSet avatarImage" }
    );

    if (!updatedUser) {
      return res.status(404).json({ 
        msg: "User not found", 
        status: false });
    }

    return res.status(200).json({
      isSet: updatedUser.isAvatarImageSet,
      image: updatedUser.avatarImage,
    });
  } catch (error) {
    next(error);
  }
};

// Log Out User
module.exports.logOut = (req, res, next) => {
  const { id } = req.params;

  try {
    if (!id) return res.status(400).json({ 
      msg: "User ID is required" });

    onlineUsers.delete(id); 
    return res.status(200).send();
  } 
  catch (error) {
    next(error);
  }
};
