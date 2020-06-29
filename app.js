const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const flash = require('connect-flash');
//const session = require('express-session');
const bcrypt = require('bcryptjs');
//const passport = require('passport');
const mysql  = require('mysql')

require('dotenv').config()
// const {ensureAuthenticated} = require('./helpers/auth')

const app = express();

const router = require("./routes/user")


//Passport Config
//  require('./config/passport')(passport)

const db = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_SCHEMA
});



//Static folder
app.use(express.static(path.join(__dirname, 'public')))

//Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

//Body Parser Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

//Router must be used after body parser
app.use(router)

app.set('view engine', 'handlebars');

// //Express session middleware
// app.use(session({
//     secret: 'secret',
//     resave: true,
//     saveUninitialized: true
// }));

// //Passport middleware
// app.use(passport.initialize());
// app.use(passport.session());

app.use(flash());

//Global variables
app.use(function(req, res, next){
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        res.locals.error =req.flash('error');
        res.locals.user = req.user || null;
        next();
});



//New Account POST request
app.post('/user/newAccount',(req,res) => {
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
        let query = db.query(sql, (err,result)=>{
            if(err) throw err;
            if(result.length > 0){
                req.flash('error_msg', 'Email already in use');
                res.redirect('/user/createAccount');    
            }else{
                let accountData = { email : req.body.email,
                    password : req.body.password,
                    type : 'business' }
                    bcrypt.genSalt(10, (err, salt)=>{
                        bcrypt.hash(accountData.password, salt, (err, hash)=>{
                            if(err) throw err;
                            accountData.password = hash;
                            let sql = 'INSERT INTO user SET ?';
                            let query = db.query(sql, accountData, (err,results) => {
                            if (err) throw err;
                                });
                            req.flash('success_msg', 'User created');
                            res.render('business/confirmation')
                           // res.redirect('/user/createAccount')
                        });
        
                    });
            }
        });

        }

         
    });

    // //Login form POST  
    // app.post('/user/login', (req, res, next) => {
    //     passport.authenticate('local', {
    //         successRedirect: '/loginPage',
    //         failureRedirect: '/users/login',
    //         failureFlash: true
    //     })(req, res, next);
    // })
   

// // Login User Page
// app.get('/loginPage', ensureAuthenticated, (req, res)=>{
//     res.render('users/loginPage');
// })

//Logout User
app.get('/logout', (req, res)=>{
    req.logOut();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login')
})
   


const port =process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`Server started on port ${port}`);
});
