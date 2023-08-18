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
const check=(req,res,next)=>{
    // let arr={name:'pavi'}
    // res.cookie("user",arr)
    const name = req.params.name;

    const val=req.cookies.user.name!== undefined?true:false;
    console.log(name,val,req.cookies.user[name])
    if(val===true){
        next();
    }
    else{
        throw new Error("user not authenticated")
    }
}
app.get('/authenticate/:name',check,(req,res)=>{
    res.send("welcome")
})

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
            // res.send(typeof(req.params.objId))
            coll.find({_id: new objId(req.params.objId)}).toArray().then((value)=>{
                // res.send(value[0]);
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