require('dotenv').config();
const path = require('path');
const express = require('express');
const { json } = require('body-parser');
const cparser = require('cookie-parser');
const cors = require('cors');
const db = require('./controllers/db').pool;
const crypto = require('crypto');
const {check,validationResult} = require('express-validator');
const bodyParser = require('body-parser');
// mail service
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const SMTPTransport = require('nodemailer/lib/smtp-transport');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');
const parser = require('cheerio');
const cookieParser = require('cookie-parser');

app=express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cparser());

app.post('/api/v1/getuser/:userid',(req,res)=>{
    const userid = req.params.userid;
    db.query("SELECT * FROM candidates WHERE username='"+userid+"';",(err,data)=>{
        res.json({
            userid:userid,
            res_data:data
        });
    });
   
});

app.post('/api/v1/searchuser/:field/:userdata',(req,res)=>{
    const userid = req.params.userdata;
    const field = req.params.field;

    db.query("SELECT * FROM candidates WHERE "+field+" LIKE '%"+userid+"%';",(err,data)=>{
        res.json({
            field:field,
            userid:userid,
            res_data:data
        });
    });

});

app.delete('/api/v1/deleteuser/:userid',(req,res)=>{
    const userid = req.params.userid;

    db.query("SELECT * FROM candidates WHERE username='"+userid+"';",(err,data)=>{
        if(data){
            db.query("DELETE * FROM candidates WHERE username='"+userid+"';",(err,data)=>{
                res.json({
                    output:data
                });
            });
        }else{
            res.json({
                output:"No relevant row found"
            });
        }
    });
    

});

app.post('/api/v1/createuser',(req,res)=>{
    const secret_id= crypto.createHash('sha256').update(req.body.username).digest('hex');
    const data = {
        userid:req.body.username,
        hashid:secret_id,
        name:req.body.name,
        password:req.body.password,
        email:req.body.email,
        skills:req.body.skills,
        education:req.body.education,
        adress:req.body.adress
    }

    db.query("INSERT INTO candidates(hashid,username,password,email,skills,education,adress)VALUES('"+data.hashid+"','"+data.userid+"','"+data.password+"','"+data.email+"','"+data.skills+"','"+data.education+"','"+data.adress+"');",(err,data)=>{
        res.send('<center><h3>Your registration on the portal is successful<br><a href="/candidate_registration">Goto the Registration Page</a></h3></center>');
    });
    
    

});



/// repeat same for companies
////
/////
////
///
// creation of company data
app.post('/api/v1/createcompany',(req,res)=>{

    const secret_id= crypto.createHash('sha256').update(req.body.companyname).digest('hex');
    const data = {
        companyname:req.body.companyname,
        companyid:req.body.companyid,
        hashid:secret_id,
        descript:req.body.descript,
        password:req.body.companypass,
        email:req.body.email,
        service:req.body.service,
        tin:req.body.tin,
        links:req.body.links,

    }

    db.query("INSERT INTO company(hashid,companyid,companypass,email,service,location,tin,companyname,descript)VALUES('"+data.hashid+"','"+data.companyid+"','"+data.companypass+"','"+data.email+"','"+data.service+"','"+data.location+"','"+data.tin+"','"+data.companyname+"','"+data.descript+"');",(err,data)=>{
        res.send('<center><h3>Your company\'s  registration on the portal is successful<br><a href="/company_registration">Goto the Registration Page</a></h3></center>');
    });
    
    

});


app.post('/api/v1/getcompany/:companyid',(req,res)=>{
    const userid = req.params.companyid;
    db.query("SELECT * FROM company WHERE username='"+companyid+"';",(err,data)=>{
        res.json({
            userid:companyid,
            res_data:data
        });
    });
   
});

app.post('/api/v1/searchcompany/:field/:userdata',(req,res)=>{
    const userid = req.params.companydata;
    const field = req.params.field;

    db.query("SELECT * FROM company WHERE "+field+" LIKE '%"+userid+"%';",(err,data)=>{
        res.json({
            field:field,
            userid:userid,
            res_data:data
        });
    });

});

app.delete('/api/v1/deleteuser/:companyid',(req,res)=>{
    const userid = req.params.companyid;

    db.query("SELECT * FROM candidates WHERE username='"+companyid+"';",(err,data)=>{
        if(data){
            db.query("DELETE * FROM candidates WHERE username='"+companyid+"';",(err,data)=>{
                res.json({
                    output:data
                });
            });
        }else{
            res.json({
                output:"No relevant row found"
            });
        }
    });
    

});

app.post('/api/v1/email/:tomail',(req,res)=>{

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
          clientId: process.env.OAUTH_CLIENTID,
          clientSecret: process.env.OAUTH_CLIENT_SECRET,
          refreshToken: process.env.OAUTH_REFRESH_TOKEN
        }
      });

    let message = {
        from: process.env.GMAIL_APP_ID,
        to: req.params.tomail,
        subject: 'Hello World',
        text: 'Hello World',
        html:'sample code'
    };


  transporter.sendMail(message).then((info)=>{
    res.status(201).send(info);
  }).catch((err)=>{
    res.status(500).send(err);
  })
    
});

const __upload__dir = "./resources";
const upload = multer({dest:__upload__dir});
app.post('/api/v1/upload/:type',upload.single('resume'),(req,res)=>{
   res.json({
    uploaddir:__upload__dir,
    success:true,
    type:req.params.type
   });

    

});

const authorization = (req,res,next)=>{
    const authHeader = req.cookies.LOGGED_IN_TPO;
    const token  = authHeader && authHeader.split(' ')[1];
    if(token==null) return res.send("<center><h2>Must be logged in to use!</h2>, <i><a href='./'>Kindly Log in!</a></i></center>");

    jwt.verify(token,process.env.SECRET_CODE,(err,data)=>{
        if(err) return res.send("<center><h2>Must be logged in to use!</h2>, <i><a href='./'>Kindly Log in!</a></i></center>");
        req.user=user;
        next();
    });
}


app.post('/login',(req,res)=>{

    console.log(`SELECT * FROM candidates where username="${req.body.username}" and password="${req.body.password}";`);
    db.query(`SELECT * FROM candidates where username=\'${req.body.username}\' and password=\'${req.body.password}\';`,(err,data)=>{
        if(data.rowCount==1){

           const access_token =  jwt.sign(data["rows"]["username"], process.env.SECRET_CODE, {noTimestamp:true});
            res.cookie('LOGGED_IN_TPO',access_token);

        }else{
            res.send(err);
        }
    });
});
//app.post('/logincompany',loginCompanyRoute);

app.use(express.static(path.join(__dirname, '/')));

app.get('/candidate_registration',(req,res)=>{
    fs.readFile('web/candidate_registration.html','utf8',(err,data)=>{
        res.send(data);
    })
});

app.get('/company_registration',(req,res)=>{
    fs.readFile('web/register_company.html','utf8',(err,data)=>{
        res.send(data);
    })
});

app.get('/candidate_login',(req,res)=>{
    fs.readFile('web/candidate_login.html','utf8',(err,data)=>{
        res.send(data);
    })
});

app.get('/company_login',(req,res)=>{
    fs.readFile('web/login_company.html','utf8',(err,data)=>{
        res.send(data);
    })
});


app.get('/',(req,res)=>{
    fs.readFile('web/index.html','utf8',(err,data)=>{
        res.send(data);
    })
});

app.get('./welcome',(req,res)=>{
    res.send("welcome sir!");
});

app.get('/forgotpassword',(req,res)=>{
    fs.readFile('web/forgotpassword.html','utf8',(err,data)=>{
        res.send(data);
    })
});


// creating the pages for candidates

app.get('/applyJob',authorization,(req,res)=>{
    fs.readFile('web/apply_for_job.html','utf8',(err,data)=>{
        res.send(data);
    })
});
app.get('/applyIntern',authorization,(req,res)=>{
    fs.readFile('web/apply_intern.html','utf8',(err,data)=>{
        res.send(data);
    })
});

app.get('/savedJobs',authorization,(req,res)=>{
    fs.readFile('web/saved_jobs.html','utf8',(err,data)=>{
        res.send(data);
    })
});

app.get('/updateCandidateInfo',authorization,(req,res)=>{
    fs.readFile('web/saved_jobs.html','utf8',(err,data)=>{
        res.send(data);
    })
});

app.get('/notifications',authorization,(req,res)=>{
    fs.readFile('web/saved_jobs.html','utf8',(err,data)=>{
        res.send(data);
    })
});


// dashboard for candidates
app.get('/xdashboard',authorization,(req,res)=>{
    fs.readFile('web/xdashboard.html','utf8',(err,data)=>{
        res.send(data);
    })
});


//dashboard for companies
app.get('/cdashboard',authorization,(req,res)=>{
    fs.readFile('web/cdashboard.html','utf8',(err,data)=>{
        res.send(data);
    })
});

app.get('/openpositions',authorization,(req,res)=>{

    fs.readFile('web/openpositions.html','utf8',(err,data)=>{
        res.send(data);
    })
});





app.use((req,res,next)=>{
    res.send("<h1>Page not found!</h1>");
});


const PORT = 8000;
app.listen(PORT);