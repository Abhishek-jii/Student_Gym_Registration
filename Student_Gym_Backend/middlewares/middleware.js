import jwt from "jsonwebtoken";
import { db } from "../db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { encryptionKey } from "../controllers/controllers.js";





export const isUser = asyncHandler(async (req, _, next) => {
    try {
        console.log("req.cookies",req.cookies)
        const token = req.cookies?.accesstoken
        
        if(!token) {
            throw new ApiError(401,"Unauthorized token")
        }
        console.log("12")
        const decodedToken = jwt.verify(token,"gdfasKGWEHVHJVhrvfargwnebrvgblHVHJVHSJ")
        console.log("decodedToken",decodedToken)
        if(decodedToken.role == "user"){
            console.log("ok user")
        }
        else {
            throw new Error("invalid user login")
        }
        req.user = decodedToken.usn

        
        

        next()

    } catch (error) {
        throw new Error("Invalid access to token", error)
    }

})


export const isAdmin = asyncHandler(async(req, _, next) => {
    try {
        console.log("req.cookies",req.cookies)
        const token = req.cookies?.accesstoken
        // maybe put await in jwt
        const decodedToken = await jwt.verify(token,"gdfasKGWEHVHJVhrvfargwnebrvgblHVHJVHSJ" )
        console.log("decodedToken",decodedToken,"     ",decodedToken.usn)
        if(decodedToken.usn == "gym_manager")
        {
            console.log("ok")
        }
        else {
            throw new Error("Invalid admin login")
        }
        req.role="admin"

        
        

        next()

    } catch (error) {
        throw new Error("Invalid access to token")
    }

})



