import validator from "validator";
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

dotenv.config();

const key = process.env.JWT_SECRET

const userRegister = async (req, res) => {
  try {
    const { username, fullName, email, password } = req.body;
    const verificationToken = uuidv4();

    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Please enter a valid email address" });
    }

    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ message: "Password must include symbols and numbers" });
    }

    if (username.length < 3) {
        return res.status(400).json({ message: "Username must be at least three characters" });
    }

    if (fullName.length < 3) {
        return res.status(400).json({ message: "Fullname should contain three characters minimum" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username,
        fullName,
        email,
        password: hashedPassword,
        verificationToken,
        is_verify: false,
      },
    });

    await sendEmail(email, verificationToken);

    return res.status(201).json({ message: "User registered. Please verify your email." });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "No user found with this email. Please register first." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password. Please try again." });
    }

    if (!user.is_verify) {
      return res.status(400).json({ message: "Email not verified. Please check your inbox." });
    }

    const token = jwt.sign({ id: user.id }, key, { expiresIn: '3d' });

    const { password: _, ...userData } = user;

    return res.status(200).json({ userData, token });
    }catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const verificationEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { 
        verificationToken: null ,
        is_verify: true,
      },
    });

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

    async function sendEmail(email, token) {
        try {
            const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
    });

    const verificationLink = `http://localhost:4000/api/user/verify/${token}`;

    await transporter.sendMail({
      to: email,
      from: process.env.EMAIL_USER,
      subject: 'Verify Your Video Belajar Account',
      text: `Hi there!\n\nThank you for signing up at Video Belajar.\nPlease verify your account by clicking the link below:\n${verificationLink}`,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

export {
    userRegister,
    userLogin,
    verificationEmail,
}