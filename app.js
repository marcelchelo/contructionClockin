const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');

const mysql  = require('mysql')

require('dotenv').config()
// const {ensureAuthenticated} = require('./helpers/auth')

const app = express();

const router = require("./routes/user")


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


  
const port =process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`Server started on port ${port}`);
});
