// Load environment variables before application modules use them
import "dotenv/config";
import connectDB from "./config/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

const startServer = async () =>
{
    try
    {
        // Wait for database connection
        await connectDB();

        // Start Express server only after DB connection
        app.listen(PORT, () =>
        {
            console.log(`Server is running on Port ${PORT}`);
        });
    }
    catch (error)
    {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();