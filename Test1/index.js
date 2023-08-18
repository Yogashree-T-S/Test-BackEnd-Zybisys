const express=require('express');
const validation=express();
const bodyparser=require('body-parser')
const {Add,Subtract, Product, Division}=require('./demo')


// Answer 1
validation.use(bodyparser.json());
validation.use(bodyparser.urlencoded({extended: true}));
validation.post('/validate', function(req, res){
    // let email=req.body.email;
    // let password=req.body.password;

    // if(email && password) {
    for(let val of req.body) {
    
        if(!(val.email.includes('@') && val.password.length >4))
            res.status(400).send("Invalid Data");
    }
    res.status(200).send("Success")  
    // }
    // res.status(400).send("Invalid Data");

})

// Answer 2
validation.get('/toupper/:name', function(req, res){
    let name=(req.params.name).trim().toUpperCase();
    if(name)
        res.send(name);
    res.send("Enter something");
})

// Answer 3
validation.get('/calculate', function(req, res){
    res.send("Addition  :  " + Add(8,9) +"  ||  Subtraction :  " +Subtract(10,5)+"  ||   Multiplication : " +Product(3,3)+"  ||  Division : " +Division(10,2))
});
validation.listen('8000',function(){
    console.log('listening');
})

// Answer 4

/*
____________4=>a_________________________
db.Reviews.find({"property_type":"House"})

____________4=>b_________________________

db.Reviews.find({"price":{$gt:500}},{"_id":0,"listing_url":1, "name":1, "host.host_name":1, "host.host_location":1, "reviews.reviewer_name":1, "price":1})
____________4=>c_________________________

db.Reviews.find({$and:[{'address.country':"Brazil"},{"review_scores.review_scores_rating":{$gte:9}}]})

____________4=>d_________________________

db.Reviews.find({price:{$gt:600,$lt:900}})
*/