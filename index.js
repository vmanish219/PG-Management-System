const express = require('express')
const mysql= require("mysql");
const Connection = require('mysql/lib/Connection');
const app = express()
const port = 3000
app.set("view engine","ejs");
app.use(express.urlencoded({ extended: true }));

//************************** */ DB Connection *********************/
var connection = mysql.createConnection({
  host     : 'projectdb.cts3foifmysr.ap-south-1.rds.amazonaws.com',
  user     : 'admin',
  password : 'manish123',
  database : 'PROJECT'
});
 
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected as id ' + connection.threadId);
});

//**************************************************************** */

 loginStatus=false;

app.get('/', (req, res) => {
  if(!loginStatus){
    res.render("login")
  }
  else{
    res.render("/home")
  }
})

app.post("/", (req,res)=>{
  username=req.body.username
  password=req.body.password
  connection.query(`SELECT PASSWORD FROM OWNER WHERE USERNAME="${username}"`,function(error,results){
    if(error || results[0]==undefined){
      console.log(error);
      res.redirect("/")
    }
    else{
      console.log(results[0].PASSWORD);
      if(results[0].PASSWORD==password){
        loginStatus=true
        res.redirect("/home")
      }
      
    }
  })
})

app.get("/home",(req,res)=>{
  if(!loginStatus){
    res.redirect("/")
  }
  else{
    res.render("home")
  }
  
})

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})