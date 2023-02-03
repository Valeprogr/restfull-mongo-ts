import express  from "express";
import http from "http";
import mongoose from "mongoose";
import { config } from "./config/config";
import Logging from "./library/Loggin";
import authorRoutes from "./routes/Author";

const router = express();

//Qui ci connettiamo con Mongo

mongoose.connect(config.mongo.url, {retryWrites: true, w: 'majority'})
.then(()=>{
    Logging.info('connected to mongo');
    //Il server si avviera solo se mongo e connesso per quest chiamo qui la function
    StartServer();
})
.catch((error)=>{
    Logging.error('Unable to connect:');
    Logging.error(error);
});


//Qui connettiamo il server 
const StartServer = () =>{
router.use((req,res,next)=>{
    //Log the request
Logging.info(`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`)

res.on('finish', ()=>{
//Log the response
Logging.info(`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);
})
next();
});

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

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
router.use('/author', authorRoutes);


//HealthCheck
router.get('/ping', (req,res,next)=>{
    res.status(200).json({message: 'pong'});
})

//Error Handling
router.use((req,res,next)=>{
    const error = new Error('not found');
    Logging.error(error);

    return res.status(404).json({message: error.message})
});

http.createServer(router).listen(config.server.port, ()=> Logging.info(`Server is running on port ${config.server.port}.`))
}

