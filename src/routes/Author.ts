import express from "express";
import { Schema } from "mongoose";
import controllers from '../controllers/Author';
import { Schemas, ValidateSchema } from "../middleware/ValidateSchema";

const router = express.Router();

router.post('/create', ValidateSchema(Schemas.author.create), controllers.createAuthor);
router.get('/get/:authorId', controllers.readAuthor);
router.get('/get/', controllers.readAll);
router.patch('/update/:authorId', ValidateSchema(Schemas.author.update), controllers.updateAuthor);
router.delete('/delete/:authorId', controllers.deleteAuthor);


export = router;