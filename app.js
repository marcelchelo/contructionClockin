const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const mysql  = require('mysql')


const app = express();


const db = mysql.createConnection({
    host     : 'signinsheet.cqux98yjiyd6.us-east-1.rds.amazonaws.com',
    user     : 'marcelo',
    password : 'Gh1$1995',
    database : 'SignInSheet'
});

//connect DB
db.connect((err) => {
    if(err){
        console.log("Couldnt reach DB")
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
    
    
   //res.send('Check your email for verification code.');
   res.render('business/confirmation')
 



});



const port = 3000;

app.listen(port,()=>{
    console.log(`Server started on port ${port}`);
});
