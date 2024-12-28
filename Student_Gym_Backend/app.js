import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"
import { Router } from 'express';
import { createBatch, createPayment, createRegistration, getBatches, getPayments, getRegistrations, loginuser, registerUser } from "./controllers/controllers.js";



const app = express()


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));


//middlerware
app.use(express.json({limit: "1000kb"}));
app.use(express.urlencoded({ extended: true, limit: "1000kb" }));
app.use(express.static("public"));
app.use(cookieParser());

const router = Router();


router.post("/api/registeruser",registerUser)
router.post("/api/loginuser",loginuser)
router.post("/api/createRegistration",createRegistration)
router.post("/api/createPayment",createPayment)
router.post("/api/createBatch",createBatch)
router.post("/api/getRegistrations",getRegistrations)
router.get("/api/getStudents")
router.get("/api/getBatches", getBatches)
router.post("/api/getPayments",getPayments)
router.get("/api/checkout")


export {app}