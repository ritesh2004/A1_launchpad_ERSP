import express from "express";
import router from "./routes/index.js";
import { configDotenv } from "dotenv";
import cors from "cors";
import { HTTP_STATUS_CODES } from "./utils/httpStatus.js";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";

configDotenv();

connectDB()
  .then(() => console.log("Database connected successfully"))
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit the process if database connection fails
  });

const app = express();

// app.options("*", cors()); // Preflight request handling
// Handle preflight OPTIONS requests first
app.use((req, res, next) => {
    // Set CORS headers for all requests
    const origin = req.headers.origin;
    const allowedOrigins = [
        process.env.CORS_ORIGIN || "http://localhost:3000",
        /^https:\/\/.*\.devtunnels\.ms$/,
        /^https:\/\/.*\.github\.dev$/,
        /^https:\/\/.*\.githubpreview\.dev$/,
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ];
    
    const isAllowed = allowedOrigins.some(allowed => {
        if (typeof allowed === 'string') {
            return allowed === origin;
        } else {
            return allowed.test(origin);
        }
    });
    
    if (isAllowed) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization,Cache-Control,Pragma');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});
// CORS configuration for VS Code dev tunnels
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            process.env.CORS_ORIGIN || "http://localhost:3000",
            "https://swsb1703-5173.inc1.devtunnels.ms", // Your specific frontend URL
            "http://localhost:3000",
            "http://127.0.0.1:3000"
        ];
        
        // Check if origin matches any allowed origins or patterns
        const isAllowed = allowedOrigins.includes(origin) || 
                         /^https:\/\/.*\.devtunnels\.ms$/.test(origin) ||
                         /^https:\/\/.*\.github\.dev$/.test(origin);
        
        if (isAllowed) {
            callback(null, true);
        } else {
            console.log('Blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
        "Content-Type", 
        "Authorization", 
        "X-Requested-With",
        "Accept",
        "Origin",
        "Cache-Control",
        "Pragma",
        "Content-Length"
    ],
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.options("*", cors());

// Add logging for debugging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
    next();
});

app.use("/api/v1", router);



export default app;
