require('dotenv').config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Nodemailer Transport Configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Order API Route
app.post("/order", (req, res) => {
    const { name, email, service } = req.body;

    if (!name || !email || !service) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,  // Email will be sent using the company email
        to: process.env.EMAIL_USER,    // Receiving email is the company email
        replyTo: email,  // This allows the company to reply directly to the user
        subject: `New Service Order - ${service}`,
        text: `New Order Received!\n\nService: ${service}\nName: ${name}\nEmail: ${email}\n\nPlease follow up with the customer.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
            return res.status(500).json({ success: false, message: "Email sending failed" });
        }
        console.log("Email sent:", info.response);
        res.json({ success: true, message: "Order placed successfully!" });
    });
});
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/services', (req, res) => {
    res.sendFile(__dirname + '/services.html');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
