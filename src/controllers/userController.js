const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models");
const { generateToken } = require("../helpers/jwt");

exports.getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      error: false,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

exports.getUserByEmail = async (req, res) => {
  const userEmail = req.params.email;

  try {
    const user = await User.findOne({ where: { email: userEmail } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      error: false,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    return res.status(200).json({
      error: false,
      message: "User fetched successfully",
      user: {
        userId: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

exports.createUser = async (req, res) => {
  const { name, email, birthday, password } = req.body;

  try {
    const checkUser = await User.findOne({ where: { email: email } });

    if (checkUser) {
      return res
        .status(400)
        .json({ error: true, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const lowerCaseEmail = email.toLowerCase();

    const newUser = await User.create({
      name,
      email: lowerCaseEmail,
      birthday,
      password: hashedPassword,
    });

    return res.status(201).json({
      error: false,
      message: "User created",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: true, message: "Please provide old and new password" });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({
        error: true,
        message: "New password cannot be the same as old password",
      });
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ error: true, message: "Old password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await user.update({ password: hashedPassword });

    return res.status(200).json({
      error: false,
      message: "Successfully update the password",
    });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

exports.updateUser = async (req, res) => {
  const { name, email, birthday } = req.body;

  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    await user.update({
      name: name,
      email: email,
      birthday: birthday,
    });

    return res.status(200).json({
      error: false,
      message: "Successfully updated user data",
    });
  } catch (error) {
    console.error("Error updating user data:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = generateToken(user.id);

    return res.status(200).json({
      error: false,
      message: "Logged in successfully",
      loginResult: {
        user: user.id,
        name: user.name,
        token: token,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};
