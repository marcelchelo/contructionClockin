//will contain all of user related routes.  EX.  Login, Sign UP, Sign Out
//Add New Employees


const express =require('express')
const router = express.Router()
const bodyParser = require('body-parser');
const mysql = require('mysql')
const randomize = require('randomatic')
const passport = require('passport');
const session = require('express-session');



require('dotenv').config()

const {ensureAuthenticated} = require('../helpers/auth')



const pool = mysql.createPool({
    
    connectionLimit : 50, //number of connections that can run on parallel. 
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    password        : process.env.DB_PASS,
    database        : process.env.DB_SCHEMA
})



//If we move database credentials to another file databasa.js   and store methods there to run queries this would be the code.
//const myDatabase = new require('./database')      //   NEW, makes it an object  If we remove it wont work. 

//connect DB test  using above code
//myDatabase.Connect;

//Passport Config
require('../config/passport')(passport)   //..  To got up a level in directory



//Express session middleware
router.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//Passport middleware
router.use(passport.initialize());
router.use(passport.session());






//Index route
router.get('/',(req, res)=> {
    const WelcomeMessage = 'Welcome'
    res.render('index',{
        message: WelcomeMessage
    });
});

//USERTS API-- Shows users  ## For testing will be removed. 
router.get("/users", (req,res) =>{

    pool.query('select email from user',(err,rows,fields) =>{
        if(err) {
            console.log("Failed to query the user table" + err)
        }
        res.json(rows)
    })    

})




//Create Account form
router.get('/user/createAccount', (req,res)=>{
    res.render('users/createUser');
})




//Add Business Form
router.get('/user/newBusiness', (req,res)=>{
    console.log("Tell us about your business page")
    res.render('business/add');
})

//Confirmation. The form still has to be sent to database. 
router.post('/user/AddBusiness', (req, res) => {

    let code = randomize('A0',5);

    let companyData = { companyCode : code,
                        businessName : req.body.businessName, 
                        industry: req.body.industry, 
                        idUser : '33',
                           
                    }
    let sql ='INSERT INTO company SET ?';
    let query = pool.query(sql, companyData, (err,results)=>{
        if(err) throw err;
        console.log(results + 'were inserted');
                        });


   res.render('business/confirmation')
 
});



// User login FORM
router.get('/users/login', (req, res)=>{
    console.log('At the log in page')
    res.render('users/login');
})

//Login form POST  
router.post('/user/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/loginPage',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
})



// Login User Page
router.get('/loginPage', ensureAuthenticated, (req, res)=>{
    res.render('users/loginPage');
})

module.exports =router