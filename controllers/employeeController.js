
const express = require('express');
var session = require('express-session')
const path = require("path");

let new_date = new Date();
var router = express.Router();
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');
const Register = mongoose.model('Register');
const Detail = mongoose.model('Detail')
const multer = require("multer");
const bodyParser = require("body-parser");
var moment = require('moment');
const auth = require("../middleware/auth");
const { request } = require('express');


const redirectlogin = (req, res, next)=>{
    if(!req.session.useremail){
        res.redirect('/login')
    }else{
        next()
    }
}
const redirectdata = (req, res, next)=>{
    if(!req.session.useremail){
        res.redirect('/secret')
    }else{
        next()
    }
}
const storage = multer.diskStorage({
    destination:function(request,file, callback){
        callback(null, './public/uploads/images');
    },
    filename:function(request,file,callback){
        callback(null, Date.now() + file.originalname)
    },
});

const upload = multer({
    storage:storage,
    limits:{
        fieldSize:1024*1024*3
    },
});

router.get('/employee', (req, res) => {
    res.render("employee/addOrEdit", {
        viewTitle: "Insert Employee"
    });
});


router.get('/jobdetails', (req, res) => {
    res.render("employee/jobdetails", {
        viewTitle: "Job Details"
    });
});



router.get('/employerdetails', (req, res) => {
    res.render("employee/details", {
        viewTitle: "Insert Details"
    });
});

router.post("/employerdetails", upload.single("image"), async(req, res) =>{
    console.log(request.file);
    try{
        const password= req.body.password;
        const cpassword= req.body.confirmpassword;
        
            if(password==cpassword){
                const detailsEmployee = new Detail({ 
                    name:req.body.name,
                    technology:req.body.technology,
                    company:req.body.company,
                    skills:req.body.skills,
                    email:req.body.email,
                    projects:req.body.projects,
                    password:password,
                    confirmpassword: cpassword,
                    phone:req.body.phone,
                    personal:req.body.personal,
                    img:req.file.filename,
                           
                    

                    }) 
                  
                  console.log("the success part" + detailsEmployee);


              
                 
               
                    const r =await detailsEmployee.save();

                    console.log("the register" + r);

                    res.status(201).render("employee/employerlogin");
                
                }else{
                res.send("password not matching");
            }
        }
catch(error){

res.status(400).send(error);
console.log(error);
        }
    
})
router.get('/employerlogin', (req,res)=>{


        res.render("employee/employerlogin",{
       viewTitle: "Login Page"
        });
    });

router.post("/employerlogin", async(req, res) =>{
  
    try{
        const email= req.body.email;
        const password= req.body.password;
        const useremail = await Detail.findOne({email:email});
        if(useremail){
            req.session.useremail= useremail.email
            if(useremail.password === password){
                res.status(201).redirect('/employee/res') 
                console.log(error);
        
        
        
            }
              //  return res.redirect("employee/list")                
                            }
       
             const token = await useremail.genrateAuthToken();
       
            res.cookie("jwt", token, {
         expires:new Date(Date.now() + 990000),
                             //httpOnly:true,
                              //  secure: true
                                 });
    
        if(useremail.password === password){
            res.status(201).send(`Welcome`);
            console.log("login done" + useremail);



        }else{
            res.send("password are not matching");
        }
           
        }



catch(error){
res.status(400).send(error);
console.log(error);
        }
    
})












   router.post("/logout", (req, res) =>{
       req.session.destroy((err)=>{
           if(err) throw err;
           res.redirect('employee/login');
       });



        });
        router.post("/logoutemp", (req, res) =>{
            req.session.destroy((err)=>{
                if(err) throw err;
                res.redirect('employee/employerlogin');
            });
     
     
     
             });

router.get('/register', (req,res)=>{
    res.render("employee/register",{
   viewTitle: "Register Page"
    });
});
router.post("/register", upload.single("image"), async(req, res) =>{
    console.log(request.file);
    try{
        const password= req.body.password;
        const cpassword= req.body.confirmpassword;
        
            if(password==cpassword){
                const registerEmployee = new Register({ 
                    name:req.body.name,
                    headline:req.body.headline,
                    age:req.body.age,
                    skills:req.body.skills,
                    email:req.body.email,
                    projects:req.body.projects,
                    password:password,
                    summary:req.body.summary,
                    confirmpassword: cpassword,
                    salary: req.body.salary,
                    esalary:req.body.esalary,
                    phone:req.body.phone,
                    personal:req.body.personal,
                    img:req.file.filename,
                           
                    

                    }) 
                  
                  console.log("the success part" + registerEmployee);


                const token = await registerEmployee.genrateAuthToken();
                 console.log("the token" + token);
                 
                 res.cookie("jwt", token, {
                expires:new Date(Date.now() + 90000)

                //httpOnly:true
                 });
                    const registered =await registerEmployee.save();

                    console.log("the register" + registered);

                    res.status(201). render("employee/login");
                
                }else{
                res.send("password not matching");
            }
        }
catch(error){

res.status(400).send(error);
console.log(error);
        }
    
})
    router.get('/login', (req,res)=>{
    console.log(req.session)

        res.render("employee/login",{
       viewTitle: "Login Page"
        });
    });

    router.post("/login", async(req, res) =>{
  
        try{
            const email= req.body.email;
            const password= req.body.password;
            const useremail = await Register.findOne({email:email});
            if(useremail){
                req.session.useremail= useremail.email
                if(useremail.password === password){
                    res.status(201).send(`
                    
                    <script src='https://kit.fontawesome.com/a076d05399.js' crossorigin='anonymous'></script>
                    
                    
                    
                    
                    
                    
                    
                    <style>
                    .navbar-nav{
                         margin-left: 300px;
                         padding-top:10px;
               
              }
              .navbar .navbar-nav .nav-link {
                color: #2c2b2b;
                font-size: 1.0em;
                position: relative;
              }
              .navbar .navbar-nav .nav-link:hover {
                color: #175bda;
              }
              .navbar .navbar-nav .nav-link::after {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
             
                background-color: #175bda;
                color: transparent;
                width: 0%;
                content: '.';
                height: 3px;
              }
              .navbar .navbar-nav .nav-link:hover::after {
                width: 100%;
              }
              .container-fluid .active a::after {
                border-bottom: 5px solid #5bc0eb;
                bottom: -10px;
                content: " ";
                left: 0;
                position: absolute;
                right: 0;
              }
                   
                body{
                 margin-top: -10px;
                }
              
                 </style>
                    <nav class="navbar navbar-expand-lg navbar-light bg-light">
                    <div class="container-fluid">
                      <a class="navbar-brand" href="/singlelist">
                      &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp <img src="../uploads/images/1622872777826121697537_3450097495036305_7120396389118043217_n.jpg" class="rounded-circle"
                      style="width:70px; height:40px;"
                      />
                  
                      <br>
                    
                   Welcome: ${useremail.name}
                      </a>
                      </div>
                      
                      
                      <button
                        class="navbar-toggler"
                        type="button"
                        data-mdb-toggle="collapse"
                        data-mdb-target="#navbarNavAltMarkup"
                        aria-controls="navbarNavAltMarkup"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                      >
                        <i class="fas fa-bars"></i>
                      </button>
                      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div class="navbar-nav">
                          <a class="nav-link active" aria-current="page" href="/singlelist">Jobs</a>
                          <a class="nav-link" href="#">Recuriters</a>
                          <a class="nav-link" href="#">Services</a>
                          <a class="nav-link" href="#">About</a
                          >
                        <!-- Left links -->
                     
                        <div style="margin-left:480px;">
                        
                        
                        <form action ="/logout" method="POST"><button class="btn btn-danger" style="width:100px"; > Logout<i class="fas fa-sign-out-alt"></i></span></button>

                             
                      </div>
                      </div>
                      <!-- Collapsible wrapper -->
                    </div>
                    <!-- Container wrapper -->
                  </nav>
                    
                    
                    
                   
                    
                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
                    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
                    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
                        
                    <br>
                    
               
                    <div class="container">
                    <div class="row">
                    <div class="col-lg-1">
                    </div>
               
                 <div class="col-lg-10">
                    <div class="card bg-primary" style="background-color:#283e56"; background-color:"Tomato"; >
                     
                      <div class="card-body">
                    
                        <h4 class="card-title" style="color:#ffffff";>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp${useremail.name}</h4>
                      
                        <p class="card-text">
                        <div class="row">
                        <div class="col-lg-6">
                        <h6 class="card-title" style="color:#ffffff";>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<img src="/images/lapi.png" style="color:#ffffff"; width="22" height="20" style="margin-bottom:5px;"/>&nbsp&nbsp&nbsp&nbsp&nbsp${useremail.skills}</h6>
                        </div>
                        <div class="col-lg-6">
                        
                        <h6 class="card-title" style="color:#ffffff";>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<img src="/images/mobile.jpg" style="color:#ffffff"; width="22" height="20" style="margin-bottom:5px;"/></i>&nbsp&nbsp&nbsp&nbsp&nbsp${useremail.phone}</p></h6>
                        </div>
                        <div class="col-lg-6">
                        <h6 class="card-title" style="color:#ffffff";>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<img src="/images/brief.jpg" style="color:#ffffff"; width="22" height="20" style="margin-bottom:5px;"/>&nbsp&nbsp&nbsp&nbsp&nbsp${useremail.age}</h6>
                        </div>
                        <div class="col-lg-6">
                        
                        <h6 class="card-title" style="color:#ffffff";>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<img src="/images/email.jpg" style="color:#ffffff"; width="22" height="20" style="margin-bottom:5px;"/>&nbsp&nbsp&nbsp&nbsp&nbsp${useremail.email}</h6>
                        </div>
                        <div class="col-lg-1"></div>
                        <div class="col-lg-5">
                        <h6 class="card-title" style="color:#ffffff";>Cureent Salary&nbsp&nbsp<i class="fas fa-rupee-sign"></i>&nbsp&nbsp
                        
                        
                        
                        ${useremail.salary}</h6>
                        </div>
                        <div class="col-lg-6">
                        
                        <h6 class="card-title" style="color:#ffffff";>Expected Salary&nbsp&nbsp<i class="fas fa-rupee-sign"></i>&nbsp&nbsp${useremail.esalary}</h6>
                        </div> </div>
                       
                      </div>
                      
                    </div>
                    <br>
                  <div class="row">
                    <div class="col-lg-3">
                    <div class="card">
                     
                    <div class="card-body">
                      <h4 class="card-title">Quick Links</h4>
                      <hr>
                      <br>
                      <p class="card-text"> 
                      Resume</p>
                      <p class="card-text"> 
                      Resume Headline</p>
                      <p class="card-text"> 
                      Skills</p>
                      <p class="card-text"> 
                      Experiance</p>
                      <p class="card-text"> 
                      Projects</p>
                      <p class="card-text"> 
                       Expected Salary</p>
                       <p class="card-text"> 
                       Personal Details</p>
                       <p class="card-text"> 
                       Carrer Profile</p>
                    </div>
                    
                  </div>
                    </div>
                    <br>
                    <br>
                    <div class="col-lg-9">
                  <br>
                  <br> 
                     <center>
                    <div class="form-check">
                    
                    <input type="hidden" class="filter-option form-check-input filled-in" id="Bangalore" onclick="redirect()"  value ="true"  style="margin-top:-40px;"/>
                    <div onclick="redirect()">
                    <i class="fas fa-download fa-lg">&nbsp&nbsp&nbsp&nbsp&nbsp</i>Download Resume
           
                 
                   </div>
                   <br>
                 
                   <div class="card">
                   <div class="card-body">
                   ${useremail.headline}  
               
                   </div> </div>  <br>
                   <div class="card">
                   <div class="card-body">
                   ${useremail.skills}
                   
                   </div> </div>  <br>
                   <div class="card">
                   <div class="card-body">
                   ${useremail.age}
                
                   </div> </div>   <br>
                   <div class="card">
                   <div class="card-body">
                   ${useremail.projects}
                 
                   </div> </div>
                   <br>
                 
                   <br>
                   <div class="card">
                   <div class="card-body">
                   ${useremail.esalary}
                 
                   </div> </div>
                   <br>
                   <div class="card">
                   <div class="card-body">
                   ${useremail.personal}
                 
                   </div> </div>
                   </center>
               
                 


                    
                  </div>
                    </div>
                    </div>
                    <br>
                    <br>
                    
                   </div>
                   </center>
                  </div>
                  </div>

                   <center>
                  <script>
                   function redirect()
                   {
                      if(document.getElementById("Bangalore"))
                           window.location.href = "../uploads/images/${useremail.img}";
                      
                           
                   }
                   </script>
                  
        
              
     </center>
 
   
    


                    
                    `);
                    console.log("login done" + useremail);
        
        
        
                }
                  //  return res.redirect("employee/list")                
                                }
            const token = await useremail.genrateAuthToken();
       
            res.cookie("jwt", token, {
                expires:new Date(Date.now() + 990000),
             //httpOnly:true,
              //  secure: true
                 });
        
            if(useremail.password === password){
                res.status(201).send(` Welcome: ${useremail.name}
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
                <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
                <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>  
               <center><a class="btn btn-secondary" href="/addOrEdit"><i class="fa fa-plus"></i> Create New</a>
       
        <a class="btn btn-secondary" href="/list"><i class="fa fa-list-alt"></i> View Employee List</a>
 </center>

















 
                
                `);
                console.log("login done" + useremail);
    
    
    
            }else{
                res.send("password are not matching");
            }
               
            }



    catch(error){
    res.status(400).send(error);
    console.log("the error page");
            }
        
    })
    
    


router.post('/',(req, res) => {
  
   
    if (req.body._id == '')

        insertRecord(req, res);
        
        else
        updateRecord(req, res);
        console.log(req.file);
});




function insertRecord(req, res) {
    var employee = new Employee();
    employee.fullName = req.body.fullName;
    employee.email = req.body.email;
    employee.company = req.body.company;
    employee.experinace = req.body.experinace;
    employee.salary = req.body.salary;
    employee.location = req.body.location;
    employee.mobile = req.body.mobile;
    employee.city = req.body.city;
    employee.time = req.body.time;
    employee.comment = req.body.comment;
    employee.longcomment = req.body.longcomment;
    employee.time = req.body.time;
    employee.createdAt=req.body.time;

    employee.save((err, doc) => {
       
    
        if (!err)
        res.status(201).send(` 
        <style>

body{
  font-family: 'Nunito', sans-serif;
  padding: 10px;
  

  
}
.a{
    font-size: 14px;
}
.card{
    border-radius: 4px;
     
    background: #fff;
    box-shadow: 0 6px 10px rgba(0,0,0,.08), 0 0 6px rgba(0,0,0,.05);
     
  padding: 14px 80px 18px 36px;
  
}

.card:hover{
     transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(0,0,0,.12), 0 4px 8px rgba(0,0,0,.06);
}
.navbar-nav{
    margin-left: 400px;
    padding-top:10px;

}
.navbar .navbar-nav .nav-link {
color: #2c2b2b;
font-size: 1.0em;
position: relative;
}
.navbar .navbar-nav .nav-link:hover {
color: #175bda;
}
.dropdown {
    position: relative;
    display: inline-block;
  }
  
  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #f1f1f1;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
  }
  
  .dropdown-content a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
  }
  
  .dropdown-content a:hover {background-color: #ddd;}
  
  .dropdown:hover .dropdown-content {display: block;}
  
  .dropdown:hover .dropbtn {background-color: #257bcc;}
</style>

        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
        <meta name='viewport' content='width=device-width, initial-scale=1'>
        <script src='https://kit.fontawesome.com/a076d05399.js' crossorigin='anonymous'></script>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
          <a class="navbar-brand" href="/singlelist">
            <img
              src="/images/login.png"
              height="50"
              alt=""
              loading="lazy"
            />
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-mdb-toggle="collapse"
            data-mdb-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i class="fas fa-bars"></i>
          </button>
          <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav">
              <a class="nav-link active" aria-current="page" href="#">Jobs</a>
              <a class="nav-link" href="#">Recuriters</a>
              <a class="nav-link" href="#">Services</a>
              <a class="nav-link" href="#">About</a
              >
            <!-- Left links -->
          
            <div style="margin-left:220px;"></div>
              <a class="btn btn-secondary" href="/addOrEdit"><i class="fa fa-plus"></i> Create New JOB</a> 
       
       
              <a
                class="btn px-3"
                href=""
                role="button"
                > <i class="fas fa-bell"></i>
               </a>
          </div>
      
          </div>
            <div style="margin-left:40px;"></div>
      <div class="dropdown">
        <button class="dropbtn">Login</button>
        <div class="dropdown-content">
          <a href="/login">Candidate Login</a>
          <a href="/employerlogin">Employer Login</a>
        
        </div>
      </div>
      &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
      <div class="dropdown">
        <button class="dropbtn">Sign Up</button>
        <div class="dropdown-content">
          <a href="/register">Candidate SignUp</a>
          <a href="/employerdetails">Employer SignUp</a>
         
        </div>
      </div>
      
      <div style="margin-left:50px;"></div>
          <!-- Collapsible wrapper -->
        </div>
        <!-- Container wrapper -->
      </nav>
       
       
       
       <br/>
        <div class="col-md-6 offset-md-3">
        <div class="card">
        <div class="card-body">
          <h5 class="card-title" style="line-height: 0.6">${doc.fullName }</h5>
      
          <p class="card-text" style="color:black">${doc.company}</p>
          <div class="a">
          <a href="#" style="color:black" class="card-link"><i style = "color:rgb(93, 92, 92);" class="fas fa-briefcase fa-md" aria-hidden="true">&nbsp;</i></i>${doc.experinace}</a>
          <a href="#" style="color:black" class="card-link"><i style = "color:rgb(88, 86, 86);" class="fas fa-rupee-sign fa-md" aria-hidden="true">&nbsp;</i>${doc.salary}</a>
          <a href="#" style="color:black" class="card-link"><i style = "color:rgb(92, 89, 89);" class="fas fa-mobile fa-md" aria-hidden="true">&nbsp;</i>${doc.mobile}</a>
          
          <a href="#" style="color:black" style="color:black" class="card-link"><i style = "color:rgb(71, 69, 69);" class="fas fa-map-marker-alt fa-md" aria-hidden="true">&nbsp;</i>${doc.location}</a>
          <br>
      
          <i style = "color:black;" class="far fa-file-alt fa-md" aria-hidden="true">&nbsp;&nbsp;</i>${doc.comment}
          <br><br>
          <i style = "color:black;" class="far fa-file-alt fa-md" aria-hidden="true">&nbsp;&nbsp;</i>${doc.longcomment}   <br> 
          
        </div></div>
      
        </div>
        
      </div> <br><br>
      <table class="table table-striped table-bordered">
    <thead>
        <tr>
            <th>Job Name</th>
            <th>Email</th>
             <th>company</th>
              <th>Experinace</th>
            <th>Mobile</th>
           
            <th>Job Location</th>
            <th>Salary</th>
            <th></th>
            
        </tr>
    </thead>
    <tbody>
     
        <div>
        <tr>
            <td>${doc.fullName}</td>
            <td>${doc.email}</td>
            <td>${doc.company}</td>
            <td>${doc.experinace}</td>
            <td>${doc.mobile}</td>
        
            <td>${doc.location}</td>
             <td>${doc.salary}</td>
             <td>
       
             <a href="${doc._id}"><i class="fas fa-edit fa-lg" aria-hidden="true"></i></a>
             <a href="/delete/${doc._id}" onclick="return confirm('Are you sure to delete this record ?');"><i class="fa fa-trash fa-lg" aria-hidden="true"></i></a>
         </td>
         
             
            
            
        </tr>
        </table>
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      `
            );
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("employee/addOrEdit", {
                    viewTitle: "Insert Employee",
                    employee: req.body
                });
            }
        
            
            else
            res.render("employee/index")
        }
       
    });
}
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
router.get('/singlelist', (req, res) => {
      
    

    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Employee.find(({comment: regex} || {location: "delhi"}), (err, docs, a ,createdAt) => {
           
        
        
           
            var noMatch;

            if(docs.length<1){
                noMatch="No Match Found";

            }  
         
            if (!err) {
                res.render("employee/secret", {
                  
                
                    secret: docs,
                   noMatch:noMatch,
                      
                   
                });
                console.log(new_date.toLocaleDateString('EU'));
                   
            }
            else {
                res.render("employee/index")
            }
        }).sort({'_id':-1})



        
    }else{

        Employee.find((err, docs, a ,createdAt) => {
      
            if (!err) {
                res.render("employee/secret", {
                   
                
                    secret: docs,
                   
                      
                   
                });
                console.log(new_date.toLocaleDateString('EU'));
                   
            }
            else {
                res.render("employee/index")
            }
        }).sort({'_id':-1})


    }
    
});



router.get('/singlelist', (req,res)=>{
   
    res.render("employee/secret",{
        viewTitle: "secret Page"
    });
});

router.get('/resumesearch', (req, res) => {
  
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Register.find({skills: regex},(err, docs, a ,createdAt) => {
            var noMatch;
            if(docs.length<1){
                noMatch="No Match Found";

            }
            if (!err) {
                res.render("employee/resume", {
                  
                
                    resume: docs,
                   noMatch:noMatch,
                      
                   
                });
                console.log(new_date.toLocaleDateString('EU'));
                   
            }
            else {
                res.render("employee/index")
            }
        }).sort({'_id':-1})
    }else{

        Register.find((err, docs, a ,createdAt) => {
      
            if (!err) {
                res.render("employee/resume", {
                   
                
                    resume: docs,
                   
                      
                   
                });
                console.log(new_date.toLocaleDateString('EU'));
                   
            }
            else {
                res.render("employee/index")
            }
        }).sort({'_id':-1})


    }
    
});



router.get('/resumesearch',(req,res)=>{
   
    res.render("employee/resume",{
        viewTitle: "resume Page"
    });
});



















router.post("/uploads/images/:img", async (req, res) => {
    const files=(["/uploads/images/:img" + req.params.img]);
    if (!err) {
        res.render("employee/resume", {
           
        
            resume: files,
           
              
           
        
  
});
}
  
      res.download(resume);
  });


function updateRecord(req, res) {
    Employee.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.send(` 
        <style>

body{
  font-family: 'Nunito', sans-serif;
  padding: 10px;
  

  
}
.a{
    font-size: 14px;
}
.card{
    border-radius: 4px;
     
    background: #fff;
    box-shadow: 0 6px 10px rgba(0,0,0,.08), 0 0 6px rgba(0,0,0,.05);
     
  padding: 14px 80px 18px 36px;
  
}

.card:hover{
     transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(0,0,0,.12), 0 4px 8px rgba(0,0,0,.06);
}


</style>

        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
        <meta name='viewport' content='width=device-width, initial-scale=1'>
        <script src='https://kit.fontawesome.com/a076d05399.js' crossorigin='anonymous'></script>
        <div class="col-md-6 offset-md-3">
        <div class="card">
        <div class="card-body">
          <h5 class="card-title" style="line-height: 0.6">${doc.fullName}</h5>
      
          <p class="card-text" style="color:black">${doc.company}</p>
          <div class="a">
          <a href="#" style="color:black" class="card-link"><i style = "color:rgb(93, 92, 92);" class="fas fa-briefcase fa-md" aria-hidden="true">&nbsp;</i></i>${doc.experinace}</a>
          <a href="#" style="color:black" class="card-link"><i style = "color:rgb(88, 86, 86);" class="fas fa-rupee-sign fa-md" aria-hidden="true">&nbsp;</i>${doc.salary}</a>
          <a href="#" style="color:black" class="card-link"><i style = "color:rgb(92, 89, 89);" class="fas fa-mobile fa-md" aria-hidden="true">&nbsp;</i>${doc.mobile}</a>
          
          <a href="#" style="color:black" style="color:black" class="card-link"><i style = "color:rgb(71, 69, 69);" class="fas fa-map-marker-alt fa-md" aria-hidden="true">&nbsp;</i>${doc.location}</a>
          <br>
      
          <i style = "color:black;" class="far fa-file-alt fa-md" aria-hidden="true">&nbsp;&nbsp;</i>${doc.comment}
        
        </div></div>
      
        </div>
        
      </div>
      <table class="table table-striped table-bordered">
    <thead>
        <tr>
            <th>Job Name</th>
            <th>Email</th>
             <th>company</th>
              <th>Experinace</th>
            <th>Mobile</th>
            <th>City</th>
            <th>Job Location</th>
            <th>Salary</th>
            <th></th>
            
        </tr>
    </thead>
    <tbody>
     
        <div>
        <tr>
            <td>${doc.fullName}</td>
            <td>${doc.email}</td>
            <td>${doc.company}</td>
            <td>${doc.experinace}</td>
            <td>${doc.mobile}</td>
            <td>${doc.city}</td>
            <td>${doc.location}</td>
             <td>${doc.salary}</td>
             <td>
       
             <a href="${doc._id}"><i class="fas fa-edit fa-lg" aria-hidden="true"></i></a>
             <a href="/delete/${doc._id}" onclick="return confirm('Are you sure to delete this record ?');"><i class="fa fa-trash fa-lg" aria-hidden="true"></i></a>
         </td>
         
        
            
            
        </tr>
        </table>
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      `
            ); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("employee/addOrEdit", {
                    viewTitle: 'Update Employee',
                    employee: req.body
                });
            }
            else
            res.render("employee/index")
        }
    });
}


router.get('/list', redirectlogin, (req, res) => {
    Employee.find((err, docs) => {
        if (!err) {
            { sort: { _id: -1 } }
            res.render("employee/list", {
                list: docs
            });
        }
        else {
            res.render("employee/index")
        }
    }).sort({'_id':-1});
});



router.get('/banglore',  (req, res) => {

    Employee.find({location: ["banglore"]},(err, docs) => {
        if (!err) {
            { sort: { _id: -1 } }
            res.render("employee/secret", {
                secret: docs,
                

            });
        }
        else {
            res.render("employee/index")
        }
    }).sort({'_id':-1});


});
router.get('/delhi',  (req, res) => {
    
    Employee.find({location: ["delhi"]},(err, docs) => {
        if (!err) {
            { sort: { _id: -1 } }
            res.render("employee/secret", {
                secret: docs
            });
        }
        else {
            res.render("employee/index")
        }
    }).sort({'_id':-1});

});
router.get('/gurugram',  (req, res) => {
    
    Employee.find({location: ["gurgaon"]},(err, docs) => {
        if (!err) {
            { sort: { _id: -1 } }
            res.render("employee/secret", {
                secret: docs
            });
        }
        else {
            res.render("employee/index")
        }
    }).sort({'_id':-1});

});

router.get('/noida',  (req, res) => {
    
    Employee.find({location: ["noida"]},(err, docs) => {
        if (!err) {
            { sort: { _id: -1 } }
            res.render("employee/secret", {
                secret: docs
            });
        }
        else {
            res.render("employee/index")
        }
    }).sort({'_id':-1});

});



router.get('/', (req, res) => {
  
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Employee.find({"name": regex},(err, docs, a ,createdAt) => {
      
            if (!err) {
                res.render("employee/secret", {
                   
                
                    secret: docs,
                   
                      
                   
                });
                console.log(new_date.toLocaleDateString('EU'));
                   
            }
            else {
                res.render("employee/index")
            }
        }).sort({'_id':-1})
    }else{

        Employee.find((err, docs, a ,createdAt) => {
      
            if (!err) {
                res.render("employee/secret", {
                   
                
                    secret: docs,
                   
                      
                   
                });
                console.log(new_date.toLocaleDateString('EU'));
                   
            }
            else {
                res.render("employee/index")
            }
        }).sort({'_id':-1})


    }
    
});




router.get('/', (req,res,a)=>{
 
    res.render("employee/secret",{
      
        viewTitle: "secret Page",
        a : moment([2007, 0, 28]),
    });
});


router.get('/res', (req, res) => {
  
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Register.find({"name": regex},(err, docs, a ,createdAt) => {
      
            if (!err) {
                res.render("employee/resume", {
                   
                
                    resume: docs,
                   
                      
                   
                });
                console.log(new_date.toLocaleDateString('EU'));
                   
            }
            else {
                res.render("employee/index")
            }
        }).sort({'_id':-1})
    }else{

        Register.find((err, docs, a ,createdAt) => {
      
            if (!err) {
                res.render("employee/resume", {
                   
                
                    resume: docs,
                   
                      
                   
                });
                console.log(new_date.toLocaleDateString('EU'));
                   
            }
            else {
                res.render("employee/index")
            }
        }).sort({'_id':-1})


    }
    
});


router.get('/res', (req,res,a)=>{
 
    res.render("employee/resume",{
      
        viewTitle: "resume Page",
        a : moment([2007, 0, 28]),
    });
});





function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Employee.findById(req.params.id, (err, doc) => {
        if (!err) {
           
            res.render("employee/addOrEdit", {
                viewTitle: "Update Employee",
                employee: doc
            });
        }
        else {
            res.render("employee/addOrEdit")
        }
    });
});
router.get('/del/:id', (req, res) => {
    Employee.findById(req.params.id, (err, doc) => {
        if (!err) {
           
            res.render("employee/jobdetails", {
                viewTitle: "",
                employee: doc
            });
        }
        else {
            res.render("employee/secret")
        }
    });
});
router.get('/:id', redirectlogin, (req, res) => {
    Register.findById(req.params.id, (err, doc) => {
        if (!err) {
           
            res.render("employee/register", {
                viewTitle: "Update Employee",
                register: doc
            });
        }
        else {
            res.render("employee/addOrEdit")
        }
    });
});

router.get('/delete/:id',(req, res) => {
    Employee.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.render("employee/index")
        }
        else {  res.render("employee/index") }
    });
});



module.exports = router;