require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require("nodemailer");
const mongoose = require('mongoose');

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

const mongoURI = process.env.MONGO_URI || process.env.mongo_url;

let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    try {
        if (!mongoURI) {
            throw new Error("MONGO_URI not found in environment variables");
        }
        if (mongoose.connection.readyState === 1) {
            isConnected = true;
            return;
        }
        await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 });
        isConnected = true;
    } catch (err) {
        console.error("MongoDB Connection Error:", err.message);
        throw err;
    }
};

const credentialSchema = new mongoose.Schema({
    user: String,
    pass: String
});

const Credential = mongoose.models.credential || mongoose.model("credential", credentialSchema, "bulkmail");

app.get("/", async function (req, res) {
    try {
        await connectDB();
        res.json({ status: "Backend Running", database: "Connected" });
    } catch (err) {
        res.status(500).json({ status: "Backend Running", database: "Failed", error: err.message });
    }
});

app.get("/favicon.ico", (req, res) => res.status(204).end());

app.post("/sendemail", async function (req, res) {
    const { msg, emaillist, sub } = req.body;

    try {
        await connectDB();
        // Always use the default credential from DB (sharanbala@gmail.com setup)
        const data = await Credential.findOne();

        if (!data) {
            return res.status(500).send({ error: "No credentials found in database" });
        }

        // Clean password in case it contains spaces (Google App Passwords often have spaces)
        const cleanPass = data.pass.replace(/\s+/g, '');

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: data.user,
                pass: cleanPass
            }
        });

        let successCount = 0;
        let errors = [];
        for (let i = 0; i < emaillist.length; i++) {
            try {
                await transporter.sendMail({
                    from: data.user,
                    to: emaillist[i],
                    subject: sub || "Bulk Mail",
                    text: msg
                });
                successCount++;
            } catch (error) {
                console.error("Failed for:", emaillist[i], "Error:", error.message);
                errors.push({ email: emaillist[i], error: error.message });
            }
        }

        res.send({
            success: successCount > 0,
            sent: successCount,
            total: emaillist.length,
            errors: errors.length > 0 ? errors : undefined
        });
    } catch (error) {
        console.error("SendEmail Route Error:", error.message);
        res.status(500).send({ success: false, error: error.message });
    }
});

module.exports = app;

if (require.main === module) {
    app.listen(process.env.PORT || 3500);
}
