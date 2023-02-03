import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Author from "../models/Author";

const createAuthor = (req: Request, res: Response, next: NextFunction)=>{
    const {name} = req.body;

    const author = new Author({
        _id: new mongoose.Types.ObjectId(),
        name
    });
    return author.save().then(author => res.status(201).json({author})).catch(error => res.status(500).json({error}))
}

const readAuthor = (req: Request, res: Response, next: NextFunction) => {};

const readAllAuthor = (req: Request, res: Response, next: NextFunction) => {};

const UpdateAuthor = (req: Request, res: Response, next: NextFunction) => {};

const DeleteAuthor = (req: Request, res: Response, next: NextFunction) => {};