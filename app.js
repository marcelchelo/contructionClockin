const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const mysql  = require('mysql')
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

//About route
app.get('/about', (req,res)=>{
    res.render('about');
})

// User login route
app.get('/users/login', (req, res)=>{
    res.render('users/login');
    console.log("At the login page")
})

//Add Business Form
app.get('/business/add', (req,res)=>{
    res.render('business/add');
})

//Edit Employee Form
app.get('/business/edit', (req,res)=>{
    res.render('business/edit');
})

//Confirmation. The form still has to be sent to database. 
app.post('/business', (req, res) => {
    let companyData = {businessName : req.body.businessName, 
                        email: req.body.email, 
                        industry: req.body.industry }
    let sql ='INSERT INTO company SET ?';
    let query = db.query(sql, companyData, (err,results)=>{
    if(err) throw err;
    console.log(results + ' were inserted');
                        });
   res.render('business/confirmation')
 



});

app.get('/workers', (req,res) =>{

    db.query('select * from worker',(err,rows,fields) =>{
        if(err) {
            console.log("Failed to query the workers tbale" + err)
        }
        res.json(rows)
    })    


//res.end()

})



const port =process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`Server started on port ${port}`);
});
