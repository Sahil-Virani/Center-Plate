import rateLimit from 'express-rate-limit';

// Rate limiting configuration
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests from this IP, please try again later.' },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// CORS configuration for React Native
export const corsOptions = {
    origin: true, // Allow all origins since React Native apps can come from any IP/domain
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400 // 24 hours
};

// Security headers configuration
export const securityHeaders = {
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https:", "wss:"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
            sandbox: ['allow-forms', 'allow-scripts', 'allow-same-origin']
        }
    },
    crossOriginEmbedderPolicy: false, // Disable for React Native compatibility
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin resources
    crossOriginOpenerPolicy: { policy: "unsafe-none" }, // Allow popups if needed
    referrerPolicy: { policy: "no-referrer-when-downgrade" },
    strictTransportSecurity: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    },
    xssFilter: true,
    noSniff: true,
    frameguard: { action: "deny" }
}; 