const express = require('express');
const res = require('express/lib/response');
const mysql= require("mysql");
const Connection = require('mysql/lib/Connection');
const { DOUBLE } = require('mysql/lib/protocol/constants/types');
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

app.get("/logout",(req,res)=>{
  loginStatus=false;
  res.render("login")
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

app.get("/admission",(req,res)=>{
  if(!loginStatus){
    res.redirect("/")
  }
  else{
    res.render("admission")
  }
})

app.post("/admission",(req,res)=>{
  sname=req.body.name
  stu_id=req.body.stu_id
  contact=req.body.contact
  dob=req.body.dob
  aadhar=req.body.aadhar
  line1=req.body.line1
  line2=req.body.line2
  city=req.body.city
  state=req.body.state
  pincode=req.body.pincode
  connection.query(`INSERT INTO STUDENT VALUES ("${stu_id}","${sname}",${contact},"${dob}",${aadhar},"${line1}","${line2}","${city}","${state}",${pincode})`, function(err,result){
      if(err){
        console.log(err);
      }
      else{
        res.redirect("/home")
      }
  })
})


app.get("/viewtenant",async(req,res)=>{
  if(!loginStatus){
    res.redirect("/")
  }
  else{
    connection.query(`SELECT * FROM STUDENT`, function (err, result) {
        if (err) {
          console.log(err);
        }
        else {
          console.log(result[0].DOB);
          res.render("viewtenant", { dataa: result});
        }
      })
  }
})

app.post('/searchtenant',(req,res)=>{
  stu_id=req.body.stu_id
  connection.query(`SELECT * FROM STUDENT WHERE STU_ID=${stu_id}`,function(err,result){
    if(err){
      console.log(err);
    }
    else{
      res.render("viewtenant",{data:result})
    }
  })
})



app.get("/newstaff",(req,res)=>{
  if(!loginStatus){
    res.redirect("/")
  }
  else{
    res.render("newstaff")
  }
})

app.post("/newstaff",(req,res)=>{
  staff_name=req.body.staff_name
  staff_id=req.body.staff_id
  occupation=req.body.occupation
  contact=req.body.contact
  mgr_id=(req.body.mgr_id || "NULL")
  line1=req.body.line1
  line2=req.body.line2
  city=req.body.city
  state=req.body.state
  pincode=req.body.pincode

  connection.query(`INSERT INTO STAFF VALUES ("${staff_id}","${staff_name}","${occupation}",${contact},${mgr_id},"${line1}","${line2}","${city}","${state}",${pincode})`,function(err,result){
    if(err){
      console.log(err);
    }
    else{
      res.redirect("/home")
    }
})
})



app.get("/viewstaff",(req,res)=>{
  if(!loginStatus){
    res.redirect("/")
  }
  else{
    connection.query(`SELECT * FROM STAFF`,function(err,result){
      if(err){
        console.log(err);
      }
      else{
        res.render("viewstaff",{dataa:result})
      }
    })
  }
})

app.post('/searchstaff',(req,res)=>{
  staff_id=req.body.staff_id
  connection.query(`SELECT * FROM STAFF WHERE STAFF_ID=${staff_id}`,function(err,result){
    if(err){
      console.log(err);
    }
    else{
      res.render("viewstaff",{data:result[0]})
    }
  })
})



app.get("/addfood",(req,res)=>{
  if(!loginStatus){
    res.redirect("/")
  }
  else{
    res.render("addfood")
  }
})

app.post("/addfood",(req,res)=>{
  fid=req.body.fid
  fdesc=req.body.fdesc
  fname=req.body.fname
  fprice=req.body.fprice
  connection.query(`INSERT INTO FOOD_ITEMS VALUES (${fid},"${fdesc}","${fname}",${fprice})`,function(err,result){
    if(err){
      console.log(err);
    }
    else{
      res.redirect("/home")
    }
})
})

app.get("/adddues",(req,res)=>{
  if(!loginStatus){
    res.redirect("/")
  }
  else{
    res.render("adddues")
  }
})

app.post("/adddues",(req,res)=>{
  stu_id=req.body.stu_id
  rent=req.body.rent
  fbill=req.body.fbill
  deposit=req.body.deposit
  connection.query(`INSERT INTO PAYMENT (RENT,DEPOSIT,STU_ID) VALUES (${rent},${deposit},${stu_id})`,function(err,result){
    if(err){
      console.log(err);
    }
    else{
      connection.query(`CALL TOTAL_DUE(${stu_id})`)
      res.render("adddues")
    }
  })
})

app.get("/viewpayment",(req,res)=>{
  connection.query(`CALL TOTAL_DUE(${stu_id})`)
  if(!loginStatus){
    res.redirect("/")
  }
  else{
    connection.query(`SELECT * FROM PAYMENT`,function(err,result){
      if(err){
        console.log(err);
      }
      else{
        res.render("viewpayment",{data:result[0]})
      }
    })
    
  }
})

app.get("/makepayment",(req,res)=>{
  if(!loginStatus){
    res.redirect("/")
  }
  else{
    res.render("makepayment")
  }
})

app.post("/makepayment",(req,res)=>{
  stu_id=req.body.stu_id;
  amt=req.body.amt
  connection.query(`UPDATE PAYMENT SET TOTAL_DUE=TOTAL_DUE-${amt} WHERE STU_ID=${stu_id}`,function(err,result){
    if(err){
      console.log(err);
    }
    else{
      res.render("makepayment")
    }
  })

})

app.get("/roomassign",(req,res)=>{
  if(!loginStatus){
    res.redirect("/")
  }
  else{
    res.render("roomassign")
  }
})

app.post("/roomassign",(req,res)=>{
  stu_id=req.body.stu_id;
  rno=req.body.roomno;
  connection.query(`INSERT INTO OCCUPIED_BY VALUES (${rno},${stu_id}`,function(err,result){
    if(err){
      console.log(err);
    }
    else{
      res.render("roomassign")
    }
  })
})

app.get("viewroom",(req,res)=>{
  if(!loginStatus){
    res.redirect("/")
  }
  else{
    connection.query(`SELECT S.STU_NAME,S.CONTACT,S.ROOM_ID FROM STUDENT S,OCCUPIED_BY O WHERE S.STU_ID=O.STU_ID `,function(err,result){
      if(err){
        console.log(err);
      }
      else{
        res.render("viewpayment",{data:result[0]})
      }
    })
    
  }
})


app.get("/foodentry",(req,res)=>{
  if(!loginStatus){
    res.redirect("/")
  }
  else{
    res.render("foodentry")
  }
})

app.post("/foodentry",(req,res)=>{
  stu_id=req.body.stu_id
  f_id=req.body.f_id
  connection.query(`INSERT INTO EATS VALUES (${f_id},${stu_id}`,function(err,result){
    if(err){
      console.log(err);
    }
    else{
      res.render("foodentry")
    }
  })
})







app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})