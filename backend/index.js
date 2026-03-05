const express = require('express');
const cors = require('cors');
const nodemailer = require("nodemailer");
const mongoose = require('mongoose');

const app = express();

app.use(cors({
    origin: function (origin, callback) {
        return callback(null, true);
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
app.use(express.json());

const mongoURI = process.env.MONGO_URI || process.env.mongo_url;

let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    try {
        if (mongoose.connection.readyState === 1) {
            isConnected = true;
            return;
        }
        await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 });
        isConnected = true;
    } catch (err) {
        console.error("MongoDB Connection Error:", err.message);
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
        res.status(500).json({ status: "Backend Running", database: "Failed" });
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

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: data.user,
                pass: data.pass
            }
        });

        let successCount = 0;
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
                console.error("Failed for:", emaillist[i]);
            }
        }

        res.send({ success: true, sent: successCount, total: emaillist.length });
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
});

module.exports = app;

if (require.main === module) {
    app.listen(process.env.PORT || 3500);
}
