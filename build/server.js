"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config/config");
const Loggin_1 = __importDefault(require("./library/Loggin"));
const Author_1 = __importDefault(require("./routes/Author"));
const Book_1 = __importDefault(require("./routes/Book"));
const router = (0, express_1.default)();
//Qui ci connettiamo con Mongo
mongoose_1.default.connect(config_1.config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
    Loggin_1.default.info('connected to mongo');
    //Il server si avviera solo se mongo e connesso per quest chiamo qui la function
    StartServer();
})
    .catch((error) => {
    Loggin_1.default.error('Unable to connect:');
    Loggin_1.default.error(error);
});
//Qui connettiamo il server 
const StartServer = () => {
    router.use((req, res, next) => {
        //Log the request
        Loggin_1.default.info(`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
        res.on('finish', () => {
            //Log the response
            Loggin_1.default.info(`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);
        });
        next();
    });
    router.use(express_1.default.urlencoded({ extended: true }));
    router.use(express_1.default.json());
    //regole del mio API 
    router.use((req, res, next) => {
        //The request can come from anywhere *
        //Se vuoi renderlo piu privatopuoi mettere una lista di API or trusted sources
        res.header('Access-Control-Allow-Origin', '*');
        //What headers are allowed to use inside the project
        res.header('Access-Control-Allow-Headers', 'ORIGIN, X-Requested-Width, Content-Type, Accept, Authorization');
        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT,POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }
        next();
    });
    //Routes
    router.use('/authors', Author_1.default);
    router.use('/books', Book_1.default);
    //HealthCheck
    router.get('/ping', (req, res, next) => {
        res.status(200).json({ message: 'pong' });
    });
    //Error Handling
    router.use((req, res, next) => {
        const error = new Error('not found');
        Loggin_1.default.error(error);
        return res.status(404).json({ message: error.message });
    });
    http_1.default.createServer(router).listen(config_1.config.server.port, () => Loggin_1.default.info(`Server is running on port ${config_1.config.server.port}.`));
};
