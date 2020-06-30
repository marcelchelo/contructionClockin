//will contain all of user related routes.  EX.  Login, Sign UP, Sign Out, create user too. 
//Add New Employees

const express =require('express')
const router = express.Router()
//const bodyParser = require('body-parser');
//const exphbs = require('express-handlebars');
const mysql = require('mysql')
const randomize = require('randomatic')
const passport = require('passport');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');


require('dotenv').config()

const {ensureAuthenticated} = require('../helpers/auth')



const pool = mysql.createPool({
    
    connectionLimit : 50,  //number of connections that can run on parallel. 
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



router.use(flash());

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

//i dont think this is needed,  what is it for ?
router.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error =req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//New Account POST request
router.post('/user/newAccount',(req,res) => {
    let errors = [];

    if(req.body.password != req.body.password2){
        errors.push({text: 'Password does not match'})
    }
    if(req.body.password.length < 4){
        errors.push({text: 'Password must be at least 4 characters'})
    }

    if(errors.length > 0){
        res.render('users/createUser', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    }else{
    
        //When email exists we do not get notified it does
        //when email exists and we try to sign up(1) No notification (2) We try new email, notification of email in use appears. Corresponding to first email. 

        let sql =`SELECT * FROM  user WHERE email = '${req.body.email}'`;
        let query = pool.query(sql, (err,result)=>{
            if(err) throw err;
            if(result.length > 0){
                req.flash('error_msg', 'Email already in use');
                res.render('users/createUser')
                //res.redirect('/user/createAccount');  USE render to display message   
            }else{
                let accountData = { email : req.body.email,
                    password : req.body.password,
                    type : req.body.accType }
                    bcrypt.genSalt(10, (err, salt)=>{
                        bcrypt.hash(accountData.password, salt, (err, hash)=>{
                            if(err) throw err;
                            accountData.password = hash;
                            let sql = 'INSERT INTO user SET ?';
                            let query = pool.query(sql, accountData, (err,results) => {
                            if (err) throw err;
                                });
                            req.flash('success_msg', 'User created');
                            //let code = randomize('A0',5);
                            res.render('business/confirmation')
                           
                        });
        
                    });
            }
        });

        }

         
});

  

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



//Logout User
router.get('/logout', (req, res)=>{
    req.logOut();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login')
})
   
module.exports =router