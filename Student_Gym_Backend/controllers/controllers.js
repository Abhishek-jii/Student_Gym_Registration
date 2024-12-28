import { asyncHandler } from "../utils/asyncHandler.js";
import { db } from "../db.js";
import Razorpay from "razorpay";

const instance = new Razorpay({
  key_id: "rzp_test_jtKaVZj6s7KqEZ"  ,
  key_secret: "h1tNtZc1fWGhJdDweiXf63UF",
});

export const registerUser = asyncHandler( async (req,res) => {
   
    const  {usn, name, address, email, number, password } = req.body;
    

    if( 
        [usn, name, address, email, number, password].some((field) => 
            field?.trim() === ""
        )
    ){
      
        throw new Error("Please fill all the deatails")
    }
    
    const query1 = "SELECT EXISTS ( SELECT 1 FROM students WHERE usn = $1)"
    const query2 = "SELECT EXISTS ( SELECT 1 FROM students WHERE email = $1)"
    const query3 = "SELECT EXISTS ( SELECT 1 FROM students WHERE number = $1)"

    const doesExist1 = await db.query(query1,[usn]) 
    const doesExist2 = await db.query(query2,[email])  
    const doesExist3 = await db.query(query3,[number])

    if(!doesExist1 )  throw new Error("Usn already exists")
    if(!doesExist2 )  throw new Error("Email already exists")
    if(!doesExist3 )  throw new Error("Number already exists")
    
    const encryptionKey = process.env.ENCRYPTION_KEY;

        
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
    
    if(!doesExist4) throw new Error("User not created")
    
    return res.status(200).json({
        usn, email,name,address,number,message: "User created successfully"
    })
    
})





export const loginuser = asyncHandler(async (req,res) => {
    const { usn, password} = req.body
    
    if([usn,password].some((field) => {
        field.trim()==""
    })){
        throw new Error("enter all credentials")
    }
    
    const query1 =" SELECT usn, name, address, email, number  FROM students WHERE usn = '$1'  AND password = crypt('$2', password);" 

    try {

        const login = await db.query(query1,[usn,password])
        
    }catch(err){
        console.log(err);
        throw new Error("Login unsuccessful")
    }

    return res.status(200).json(login.rows)

    
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


export const createRegistration = asyncHandler( async(req,res) => {
    const {student_id, batch_id, month, payment_status} = req.body

    if([batch_id, month, student_id].some((field)=> {
        field.trim() =""
    })){
        throw new Error("Enter all deatils")
    }

    if(payment_status == "False") throw new Error("plz pay first")

    

    const query1 = "Insert into Registrations (student_id, batch_id, month, payment_status) values($1,$2,$3,$4) "
    try{
        const registration = await db.query(query1,[student_id, batch_id, month, payment_status])
        return res.status(200).json(registration.rows)
    }catch(err){
        console.log(err)
        throw new Error("error creating batch")

    }   
    
})

export const createPayment = asyncHandler( async(req,res) => {
    const {payment_id,student_id, amount, batch_id, month} = req.body

    if([payment_id, student_id].some((field)=> {
        field.trim() =""
    })){
        throw new Error("ENter all deatils")
    }
    if(amount == NULL){
        throw new Error("ENter all deatils")
    }

    const query1 = "Insert into payments (payment_id,student_id, amount) values($1,$2,$3) "
    try{
        const payment = await db.query(query1,[payment_id,student_id, amount])
        createRegistration(student_id, batch_id,month,true)
    }catch(err){
        console.log(err)
        throw new Error("error creating batch")

    }   
    
})



export const getRegistrations = asyncHandler( async (req, res) => {
    const { start, end } = req.body;

    const query1 = " select usn, name, batch_id, month, payment_Status from students s join payments p on s.id=p.student_id join registrations r on s.id = r.student_id where r.month between $1 and $2 "

    try {
        const register = await db.query(query1,[start,end])
        return res.status(200).json(register.rows)
    }
    catch(err) {
        console.log(err)
        throw new Error("error while retrieving")
    }
})

export const getStudents = asyncHandler( async (req, res) => {
    

    const query1 = " select USN, NAME, EMAIL, number NUMBER from students"
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
    const query1 = " select USN,NAME,  EMAIL, NUMBER, patment_date, amount from students join payment on id=student_id where patment_date between $1 and $2"
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
    
  
    const options = {
      amount: Number(100000),
      currency: "INR",
    };
  
    const order = await instance.orders.create(options);
  
    res.status(201).json({
      order
    });
  });