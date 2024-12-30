import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"
import { Router } from 'express';
import { checkout, createBatch, createPayment, createRegistration, getBatches, getPayments, getRegistrations, getStudents, loginuser, registerUser } from "./controllers/controllers.js";
import { isAdmin, isUser } from "./middlewares/middleware.js";



const app = express()


app.use(cors());


//middlerware
app.use(express.json({limit: "1000kb"}));
app.use(express.urlencoded({ extended: true, limit: "1000kb" }));
app.use(express.static("public"));
app.use(cookieParser());


const router = Router();


app.post("/api/registeruser",registerUser)
app.post("/api/loginuser",loginuser)
app.post("/api/createPayment",isUser,createPayment)
app.post("/api/createRegistration",isUser,createRegistration)
app.post("/api/createBatch",createBatch)
app.post("/api/getRegistrations",isAdmin,getRegistrations)
app.get("/api/getStudents",isAdmin, getStudents)
app.get("/api/getBatches", getBatches)
app.post("/api/getPayments",isAdmin,getPayments)
app.post("/api/checkout",isUser, checkout)


export {app}