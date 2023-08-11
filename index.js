const express=require('express');
const validation=express();
const bodyparser=require('body-parser')
const {Add,Subtract, Product, Division}=require('./demo')

validation.use(bodyparser.json());
validation.use(bodyparser.urlencoded({extended: true}));

validation.post('/validate', function(req, res){
    let email=req.body.email;
    let password=req.body.password;

    if(email && password) {
        if(email.includes('@') && password.length >4)
            res.status(200).send("Success!");
    }
    res.status(400).send("Invalid Data");

})

validation.get('/toupper/:name', function(req, res){
    let name=(req.params.name).trim().toUpperCase();
    if(name)
        res.send(name);
    res.send("Enter something");
})
validation.get('/calculate', function(req, res){
    res.send("Addition  :  " + Add(8,9) +"  ||  Subtraction :  " +Subtract(10,5)+"  ||   Multiplication : " +Product(3,3)+"  ||  Division : " +Division(10,2))
});
validation.listen('8000',function(){
    console.log('listening');
})