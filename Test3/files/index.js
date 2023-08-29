const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser=require('body-parser');
const multer=require('multer');
const path=require('path');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
mongoose.connect('mongodb://0.0.0.0:27017/test3',{useNewUrlParser:true,useUnifiedTopology:true})

const db = mongoose.connection;
db.once('open', () => {
  console.log('Connected to MongooseDB');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

const User = require('./src/models/User'); 

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const authroutes = require('./src/routes/authrouter');
app.use('/api', authroutes);

// 3. Create REST API to accept multiple files from the user and 
// upload all of them in the database using mongoose.

const UserSchema=new mongoose.Schema({
    image:{
        type:String
    }
})
const MyUser=mongoose.model('myfileupload',UserSchema)
const multimulterStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'files')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})


const multiupload=multer({storage:multimulterStorage}).array('myfile');

app.post('/uploader',function(req,res){
    multiupload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        console.log(req.body,"req.file")
        MyUser.create({image:req.file})
        MyUser.find({}).then((user)=>{
            res.send("file uploaded")
        })
        res.send("error")
    });
});





// 4. Create REST API to accept only images from the user. 
// If the file is not an image then display an error message.

const multerStorage=multer.diskStorage({
    destination: (req,file,cb)=>
    {    
        if(path.extname(file.originalname)==='.png' || path.extname(file.originalname)==='.jpg' || path.extname(file.originalname)==='.jpeg')
        {
            cb(null,"images")
        }
        else{
            cb(new Error("error format is wrong"),false)
        }
    },
    filename: (req,file,cb)=>
    {
        cb(null,file.originalname)
    }
});

const upload=multer({storage:multerStorage});

app.post('/upload',upload.single("myfile"),(req,res)=>{
    res.send("file upload")
});


app.listen(8080,(req,res)=> console.log("listening on"))