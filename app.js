const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path')

const app = express();


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
app.get('/',(req, res)=>{
    const title = 'Welcome'
    res.render('index',{
        title: title
    });
});

//About route
app.get('/about', (req,res)=>{
    res.render('about');
})

// User login route
app.get('/users/login', (req, res)=>{
    res.render('users/login');
})

//Add Employee Form
app.get('/employees/add', (req,res)=>{
    res.render('employees/add');
})

//Edit Employee Form
app.get('/employees/edit', (req,res)=>{
    res.render('employees/edit');
})

//Process Form
app.post('/employees', (req, res) => {
    let errors = [];

    if(!req.body.firstName){
        errors.push({text:'Please add First Name'});
    }
    if(!req.body.lastName){
        errors.push({text:'Please add Last Name'});
    }
    if(errors.length>0){
        res.render('employees/add', {
            errors: errors,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        });
    }else{
        res.render('passed');
    }
});


const port = 5000;

app.listen(port,()=>{
    console.log(`Server started on port ${port}`);
});