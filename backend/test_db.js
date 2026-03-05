const mongoose = require('mongoose');

const mongo_url = "mongodb+srv://sharan_ya:sharan@cluster0.90ocn2c.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0";

console.log("Connecting to MongoDB...");

mongoose.connect(mongo_url, { serverSelectionTimeoutMS: 5000 })
    .then(async () => {
        console.log("Successfully connected to MongoDB.");

        const credentialSchema = new mongoose.Schema({
            user: String,
            pass: String
        });
        const credential = mongoose.model("credential", credentialSchema, "bulkmail");

        try {
            const data = await credential.find();
            console.log(`Found ${data.length} credential documents.`);
            if (data.length > 0) {
                console.log("Credential 0 User:", data[0].user);
                console.log("Credential 0 Pass Length:", data[0].pass ? data[0].pass.length : 0);

                if (data[0].pass && !data[0].pass.includes(' ')) {
                    console.log("Pass seems to be a single string (good).");
                } else {
                    console.log("WARNING: Password might contain spaces or be improperly formatted.");
                }
            } else {
                console.log("CRITICAL: No documents found in 'bulkmail' collection of 'passkey' database.");
            }
        } catch (err) {
            console.error("Error fetching credentials:", err.message);
        } finally {
            mongoose.disconnect();
            console.log("Disconnected from MongoDB.");
        }
    })
    .catch(err => {
        console.error("Connection Failed:", err.message);
        process.exit(1);
    });
