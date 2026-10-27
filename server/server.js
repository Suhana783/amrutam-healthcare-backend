require("dotenv").config();
const app = require("./src/app");
const pool = require("./src/config/db");


const PORT = process.env.PORT || 5000;

async function startServer () {
    try {
        await pool.query("SELECT 1");
        console.log("PostgreSQL connected successfully");

        app.listen(PORT, () => {
            console.log(`Amrutam Healthcare API running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
}

startServer();