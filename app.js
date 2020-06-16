const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const mysql  = require('mysql');
const codeGen =require("random-code-gen")



require('dotenv').config()


const app = express();


const db = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_SCHEMA
});

//connect DB
db.connect((err) => {
    if(err){
        throw err;
    }
    console.log("MSQL connected")
})


//Static folder
app.use(express.static(path.join(__dirname, 'public')))

//Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

//Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.set('view engine', 'handlebars');


//Index route
app.get('/',(req, res)=> {
    const WelcomeMessage = 'Welcome'
    res.render('index',{
        message: WelcomeMessage
    });
});

//Create Account form
app.get('/create_Account', (req,res)=>{
    res.render('users/createUser');
})

// User login route
app.get('/users/login', (req, res)=>{
    res.render('users/login');
    console.log("At the login page")
})

//Add Business Form
app.get('/business/new', (req,res)=>{
    res.render('business/add');
})

//Confirmation. The form still has to be sent to database. 
app.post('/business', (req, res) => {

let code = codeGen.random(5);


    let companyData = { companyCode : code,
                        businessName : req.body.businessName, 
                        email: req.body.email, 
                        industry: req.body.industry, 
                        idUser : '1',
                           
                    }
    let sql ='INSERT INTO company SET ?';
    let query = db.query(sql, companyData, (err,results)=>{
        if(err) throw err;
        console.log(results + 'were inserted');
                        });
   res.render('business/confirmation')
 
});


//New Account POST request
app.post('/newAccount',(req,res) => {
        let accountData = { email : req.body.email,
                        password : req.body.password,
                        type : req.body.accType }

        let sql = 'INSERT INTO user SET ?';
        let query = db.query(sql, accountData, (err,results) => {
            if (err) throw err;
            console.log(results + 'were inserted');
                        });

    res.send("registered")
    });

//USERTS API
app.get("/users", (req,res) =>{

    db.query('select email from user',(err,rows,fields) =>{
        if(err) {
            console.log("Failed to query the user table" + err)
        }
        res.json(rows)
    })    


//res.end()

})

const port =process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`Server started on port ${port}`);
});
