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
app.get('/business/add', (req,res)=>{
    res.render('business/add');
})

//Edit Employee Form
app.get('/business/edit', (req,res)=>{
    res.render('business/edit');
})

//Process Form
app.post('/business', (req, res) => {
    let errors = [];

    if(!req.body.firstName){
        errors.push({text:'Please add First Name'});
    }
    if(!req.body.lastName){
        errors.push({text:'Please add Last Name'});
    }
    if(errors.length>0){
        res.render('business/add', {
            errors: errors,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        });
    }else{
        res.send('Thank You');
    }
});


const port = 3000;

app.listen(port,()=>{
    console.log(`Server started on port ${port}`);
});