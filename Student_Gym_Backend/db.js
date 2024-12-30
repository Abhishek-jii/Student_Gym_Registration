import pg from "pg"

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "student_gym",
  password: "<your pswd>",
  port: 5432,
})




export { db }
