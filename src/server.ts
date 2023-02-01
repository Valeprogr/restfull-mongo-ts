import express  from "express";
import http from "http";
import mongoose from "mongoose";
import { config } from "./config/config";
import Logging from "./library/Loggin";

const router = express();

//Qui ci connettiamo con Mongo

mongoose.connect(config.mongo.url, {retryWrites: true, w: 'majority'})
.then(()=>{
    Logging.info('connected');
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
})
}

router.use(express.urlencoded({ extended: true}));
router.use(express.json());