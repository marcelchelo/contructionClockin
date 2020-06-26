//will contain all of user related routes.  EX.  Login, Sign UP,
const express =require('express')
const router = express.Router()
const mysql = require('mysql')
require('dotenv').config()

const pool = mysql.createPool({
    
    connectionLimit : 50, //number of connections that can run on parallel. 
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    password        : process.env.DB_PASS,
    database        : process.env.DB_SCHEMA
})


//If we move database credentials to another file databasa.js   and store methods there to run queries this would be the code.
//we need new, not sure why will figure it out later.  If we remove it wont work. 
//const myDatabase = new require('./database')

//connect DB test
//myDatabase.Connect;


//USERTS API
router.get("/users", (req,res) =>{

    pool.query('select email from user',(err,rows,fields) =>{
        if(err) {
            console.log("Failed to query the user table" + err)
        }
        res.json(rows)
    })    

})



// User login route
router.get('/users/login', (req, res)=>{
    console.log('log in page')
    res.render('users/login');
})


module.exports =router