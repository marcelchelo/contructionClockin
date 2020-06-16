const LocalStrategy = require('passport-local').Strategy;
const mysql  = require('mysql');
const bcrypt = require('bcryptjs');

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

module.exports = function(passport){
    passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done)=>{
        let sql =`SELECT * FROM  user WHERE email = '${email}'`;
        let query = db.query(sql, (err,result)=>{
            //console.log(JSON.parse(JSON.stringify(result[0].email)));
            //console.log(JSON.parse(JSON.stringify(result[0].password)));
            if(err) throw err;
            //Match user
            if(result.length === 0){
                return done(null, false, {message: "No User Found"});
            }
            //Match password
            bcrypt.compare(password, JSON.parse(JSON.stringify(result[0].password)), (err, isMatch) =>{
                 if(err) throw err;
                 if(isMatch){
                        return done(null, JSON.stringify(result));
                 }else{
                     return done(null, false, {message: "Password Incorrect"});

                 }
            })
            passport.serializeUser(function(user, done) {
                done(null, JSON.parse(JSON.stringify(result[0].iduser)));
              });
               
              passport.deserializeUser(function(id, done) {
               
                  done(err, JSON.stringify(result));
                
            });
        });
    }));

    
}