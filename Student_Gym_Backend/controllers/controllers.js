import { asyncHandler } from "../utils/asyncHandler.js";
import { db } from "../db.js";
import Razorpay from "razorpay";
import jwt from "jsonwebtoken";



const instance = new Razorpay({
  key_id: "rzp_test_wz5xalOCmIbO44"  ,
  key_secret: "uoyzs2FftVebQd4SN7OfDIJp",
});

export const encryptionKey = "process.env.ENCRYPTION_KEY";

export const registerUser = asyncHandler( async (req,res) => {
   
    const  {usn, name, address, email, number, password } = req.body;

    if( 
        [usn, name, address, email, number, password].some((field) => 
            field?.trim() === ""
        )
    ){
        console.log("err")
        throw new Error("Please fill all the deatails")
    }
    
    const query1 = "SELECT EXISTS ( SELECT 1 FROM students WHERE usn = $1)"
    const query2 = "SELECT EXISTS ( SELECT 1 FROM students WHERE email = $1)"
    const query3 = "SELECT EXISTS ( SELECT 1 FROM students WHERE number = $1)"

    const doesExist1 = await db.query(query1,[usn]) 
    const doesExist2 = await db.query(query2,[email])  
    const doesExist3 = await db.query(query3,[number])

    if(!doesExist1 ) { console.log("err1"); throw new Error("Usn already exists")}
    if(!doesExist2 ) { console.log("err1");throw new Error("Email already exists")}
    if(!doesExist3 )  {console.log("err1");throw new Error("Number already exists")}


    

        
    const query4 = `
            INSERT INTO Students (usn, name, address, email, number, password)
            VALUES (
              $1,
              pgp_sym_encrypt($2, $6), 
              pgp_sym_encrypt($3, $6), 
              pgp_sym_encrypt($4, $6),
              pgp_sym_encrypt($5, $6),
              crypt($7, gen_salt('bf')) 
            )
          `;
      
    await db.query(query4,[usn, name, address, email, number, encryptionKey, password])      

    const doesExist4 = await db.query(query1,[usn])
    
    if(!doesExist4){console.log(doesExist1); throw new Error("User not created")}
    
    return res.status(200).json({
        usn, email,name,address,number,message: "User created successfully"
    })
    
})





export const loginuser = asyncHandler(async (req,res) => {
    const { usn, password} = req.body


    console.log(req.body)
    
    if([usn,password].some((field) => {
        field.trim()==""
    })){
        throw new Error("enter all credentials")
    }
    
    const query2 = "select 1 from admins where pgp_sym_decrypt(username,$3) = $1 and password = crypt($2, password);"

    const query1 ="SELECT usn, pgp_sym_decrypt(address,$3) as address, pgp_sym_decrypt(email,$3) as email, pgp_sym_decrypt(number,$3) as number, pgp_sym_decrypt(name,$3) as name  FROM students WHERE usn = $1  AND password = crypt($2, password);" 


        console.log("sdfa")
        const adminlogin = await db.query(query2, [usn,password,encryptionKey])
        console.log(adminlogin)
        if(adminlogin.rowCount>0)
        {
            const accesstoken =await jwt.sign(
                {
                    role:'admin',
                    usn: 'gym_manager',
                    email:'admin@gmail.com',
                    name: 'admin',
        
                },
                "gdfasKGWEHVHJVhrvfargwnebrvgblHVHJVHSJ",
                {
                    expiresIn:"10d"
                }
            )
            console.log(adminlogin.rows)
            const options = {
                        httpOnly:true,
                        secure: true
            }
        
            console.log("admin login")
            return res.status(200).cookie("accesstoken",accesstoken, options).json({message:"admin"})
        }

    


    try {
        console.log("first")
        const login = await db.query(query1,[usn,password,encryptionKey])
        console.log("second")

        const accesstoken = jwt.sign(
                    {
                        role:"user",
                        usn: usn,
                        email:login.rows[0].email,
                        name: login.rows[0].name,
            
                    },
                    "gdfasKGWEHVHJVhrvfargwnebrvgblHVHJVHSJ",
                    {
                        expiresIn:"10d"
                    }
                )
        console.log("third")
        const options = {
                    httpOnly:true,
                    secure: true
        }
            
                
        return res.status(200).cookie("accesstoken",accesstoken, options).json({message:"user"})
    }catch(err){
        console.log(err);
        throw new Error("Login unsuccessful")
    }
    
})


export const createBatch = asyncHandler( async (req,res) => {
    const {batch_name, timing} =req.body
    
    if([batch_name,timing].some((field)=> {
        field.trim() =""
    })){
        throw new Error("ENter all deatils")
    }

    const query1 = "Insert into batches (batch_name, timing) values($1,$2) "
    try{
        const batch = await db.query(query1,[batch_name, timing])
        return res.status(200).json(batch.rows)
    }catch(err){
        console.log(err)
        throw new Error("error creating batch")
    }

})


export const createRegistration = asyncHandler( async(req,res) => {console.log('registration')
    const { batch_id, month} = req.body

    const student_id = req.user 

    console.log("register")
    if([batch_id, month, student_id].some((field)=> {
        field.trim() ==""
    })){
        console.log("err")
        throw new Error("Enter all deatils")
    }

    console.log("register",student_id, batch_id, month)
    

    const query1 = "Insert into Registrations (student_id, batch_id, month) values($1,$2,$3) "
    try{
        const registration = await db.query(query1,[student_id, batch_id, month])
        console.log("registration")
        return res.status(200).json(registration.rows)
    }catch(err){
        console.log("err",err)
        throw new Error("error creating batch")

    }
    
})

export const createPayment = asyncHandler( async(req,res) => {
    console.log('payment')
    const {payment_id, amount, batch_id, month} = req.body

    console.log(req.body)
    
   

    const query1 = "Insert into payments (payment_id,student_id, amount) values($1,$2,$3) "
    try{
        const payment = await db.query(query1,[payment_id,req.user, amount])
        
        console.log("success")
        
        return res.status(200).json({message:"success"})

    }catch(err){
        console.log(err)
        throw new Error("error creating batch")

    }   
    
})



export const getRegistrations = asyncHandler( async (req, res) => {
    const { start, end } = req.body;
    console.log(req.body)
    const query1 = " select s.usn, pgp_sym_decrypt(s.name, $3)as name, b.batch_name, r.month, r.payment_Status from students s join registrations r on s.usn = r.student_id join batches b on r.batch_id=b.id where r.month between $1 and $2 "

    try {
        const register = await db.query(query1,[start,end,encryptionKey])
        return res.status(200).json(register.rows)
    }
    catch(err) {
        console.log(err)
        throw new Error("error while retrieving")
    }
})

export const getStudents = asyncHandler( async (req, res) => {
    

    const query1 = " SELECT usn, pgp_sym_decrypt(address,$3) as address, pgp_sym_decrypt(email,$3) as email, pgp_sym_decrypt(number,$3) as number, pgp_sym_decrypt(name,$3) as name from students"
    try {
        const student = await db.query(query1)
        return res.status(200).json(student.rows)
    }
    catch(err) {
        console.log(err)
        throw new Error("error while retrieving")
    }
})


export const getBatches = asyncHandler( async (req, res) => {
    

    const query1 = " select * from batches"
    try {
        const batch = await db.query(query1)
        return res.status(200).json(batch.rows)
    }
    catch(err) {
        console.log(err)
        throw new Error("error while retrieving")
    }
})

export const getPayments = asyncHandler( async (req, res) => {
    
    const { start, end} = req.body
    const query1 = " select USN, pgp_sym_decrypt(NAME,$3) as name, pgp_sym_decrypt(email,$3) as EMAIL, pgp_sym_decrypt(email,$3) as NUMBER, patment_date, amount from students join payment on id=student_id where patment_date between $1 and $2"
    try {
        const payment = await db.query(query1,[start, end])
        return res.status(200).json(payment.rows)
    }
    catch(err) {
        console.log(err)
        throw new Error("error while retrieving")
    }
})


export const checkout = asyncHandler(async (req, res) => {
    
  console.log("checkout")
    const options = {
      amount: Number(1000),
      currency: "INR",
    };
    try {
        const order = await instance.orders.create(options);
  
    res.status(201).json({
      order
    });
    } catch (error) {
        console.log(error)
    }
    
  });
