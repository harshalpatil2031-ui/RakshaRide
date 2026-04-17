const express = require("express");
const cors = require("cors");
const axios = require("axios");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

// 🔑 Gemini API key
const API_KEY = "Your api key";

// 📧 Email transporter using YOUR Gmail
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "your email",
        pass: "your password"
    }
});

// ================= CHAT ROUTE =================
app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
            {
                contents: [
                    {
                        parts: [
                            {
                                text:
                                    "You are an AI women safety assistant. Give short, clear, safety-focused advice. Help in emergencies, travel safety, panic situations, and provide calm guidance.\nUser: " +
                                    userMessage
                            }
                        ]
                    }
                ]
            }
        );

        const reply = response.data.candidates[0].content.parts[0].text;

        res.json({ reply });

    } catch (error) {
        console.log("CHAT ERROR:");
        console.log(error.response?.data || error.message);

        res.json({
            reply: "AI not responding."
        });
    }
});

// ================= START JOURNEY EMAIL ALERT =================
app.post("/start-alert", async (req, res) => {
    console.log("START ALERT ROUTE HIT");

    const { name, emergency, lat, lon } = req.body;

    const locationLink = `https://maps.google.com/?q=${lat},${lon}`;

    const message =
        `${name} has started the journey.\n\nLive Location:\n${locationLink}`;

    try {
        await transporter.sendMail({
            from: "harshalpatil.2031@gmail.com",
            to: emergency,
            subject: "🚀 Journey Started Alert",
            text: message
        });

        console.log("Start alert email sent successfully");
        res.json({ success: true });

    } catch (error) {
        console.log("Email error:", error.message);
        res.status(500).json({ error: "Email not sent" });
    }
});

// ================= PANIC ALERT =================
app.post("/panic-alert", async (req, res) => {
    const { name, emergency, lat, lon } = req.body;

    const locationLink = `https://maps.google.com/?q=${lat},${lon}`;

    const message =
        `🚨 EMERGENCY ALERT!\n\n${name} may be in danger.\n\nLive Location:\n${locationLink}`;

    try {
        await transporter.sendMail({
            from: "harshalpatil.2031@gmail.com",
            to: emergency,
            subject: "🚨 PANIC ALERT",
            text: message
        });

        res.json({ success: true });

    } catch (error) {
        console.log("Panic email error:", error.message);
        res.status(500).json({ error: "Failed to send panic alert" });
    }
});

// ================= END JOURNEY =================
app.post("/end-alert", async (req, res) => {
    const { name, emergency, lat, lon } = req.body;

    const locationLink = `https://maps.google.com/?q=${lat},${lon}`;

    const message =
        `${name} has safely ended the journey.\n\nFinal Location:\n${locationLink}`;

    try {
        await transporter.sendMail({
            from: "harshalpatil.2031@gmail.com",
            to: emergency,
            subject: "✅ Journey Ended Safely",
            text: message
        });

        res.json({ success: true });

    } catch (error) {
        console.log("End email error:", error.message);
        res.status(500).json({ error: "Failed to send end alert" });
    }
});

// ================= START SERVER =================
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
