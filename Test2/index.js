const express = require('express');
const app = express();
const cookieparser = require('cookie-parser');
app.use(cookieparser())


// ____________________Answer1____________________________
let count = 1;
app.get('/uservisit',(req,res)=>{
    res.cookie("count",count++) 
    res.send("count : "+ (req.cookies.count!=undefined? req.cookies.count : 0)+" times previously visited");
    
})

// ____________________Answer2___________________________
const checks=(req,res,next)=>{
    
    // let arr={name:'pavi'}
    // res.cookie("user",arr)
    // const name = req.params.name;
    // res.write(name)
    // res.end(req.name)
    // if(name===req.name){
    //     res.send(name)
    // }

    const val=req.cookies.user.name
    // res.send(val+req.name)
    // // console.log(name,val,req.cookies.user[name])
    if(val===req.name){
        console.log("name",req.name)
        res.send(req.name)
        res.end();
        // next();
    }
    else{
        throw new Error("user not authenticated")
    }
}
// app.use('/authenticate/:name',check)
app.get('/authenticate/:name',(req,res,next)=>{
    let name=req.params.name
    req.name=name
    next();
})

app.get('/authenticate/:name',(req,res,next)=>{
    console.log("route",req.name)
    next();
})

app.use('/authenticate/:name',checks)

// ____________________Answer3___________________________
const fs=require('fs');
app.get('/writingfile',(request,respond)=>{
    fs.readFile('testing.html',(err,res)=>{
        if(err){
            console.log(err);
        }
        else{
            respond.send(res.toString());
        }
    })
})

// ____________________Answer4___________________________

const events=require("events");
const eventsEmit=new events.EventEmitter();

eventsEmit.on('writeFile', (content) => {
    fs.writeFile('newFile.txt', content, (err) => {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("successfully written");
        }
    });
});

eventsEmit.emit('writeFile', 'Write some contents to the file');

// ____________________Answer5___________________________

const MongoClient = require('mongodb').MongoClient;
const objId = require('mongodb').ObjectId;
const url="mongodb://0.0.0.0:27017/mydb"
const client=new MongoClient(url);
 
app.get('/database/:objId', (req, res) => {
    
    client.connect(url).then(()=>{
        try{
            console.log('Connected to MongoDB');
            const NewDb=client.db("mydb");
            app.set('view engine', 'ejs');
            app.set('views',__dirname)
            const coll=NewDb.collection("myNewCollection")
            coll.find({_id: new objId(req.params.objId)}).toArray().then((value)=>{
                res.render('view',{value:value})
            })
        }
        catch{
            res.send("no data");
        }
    })
    
    
})

app.listen(8080, function(){
    console.log('listening on');
})