# Bulk Mailer 📧

A powerful and efficient bulk email automation tool built with the MERN stack. This application allows users to upload recipient lists (CSV/XLSX), compose messages with custom subjects, and send them all at once using a secure backend.

## ✨ Features
- **File Upload**: Support for CSV and XLSX recipient lists.
- **Dynamic Subject & Body**: Customize your emails easily.
- **Glassmorphic UI**: Premium, modern, and responsive design.
- **Live Preview**: See your email before sending.
- **Backend Automation**: Securely handles mail sending via Nodemailer with Google App Passwords.

## 🚀 Getting Started

### Backend Setup
1. Navigate to the `backend` folder.
2. Create a `.env` file with:
   ```env
   PORT=3500
   MONGO_URI=your_mongodb_uri
   ```
3. Install dependencies: `npm install`
4. Start the server: `node index.js`

### Frontend Setup
1. Navigate to `frontend/mail`.
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`

## ⚡ Current Limitation
The system currently uses a single preconfigured sender email account for sending emails. In future versions, this can be extended to allow multiple sender accounts or dynamic SMTP configuration for better flexibility.

---

This project helped me gain hands-on experience in email automation, backend API development, and bulk data processing.

Looking forward to building more scalable solutions!
