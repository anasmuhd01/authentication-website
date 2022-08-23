//jshint esversion:6
//jshint esversion:6
require('dotenv').config()
const express = require('express');
const ejs = require('ejs');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

mongoose.connect("mongodb://localhost:27017/customer11DB");

const app=express();
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');

var userSchema = new mongoose.Schema({
    email: String,
    password: String
    // whatever else
});
// var secret = "process.env.SOME_LONG_UNGUESSABLE_STRING";
userSchema.plugin(encrypt, { secret: process.env.SECRET_KEY ,encryptedFields: ['password']});

const User = new mongoose.model("User",userSchema);

app.get("/",function(req,res){
  res.render("home");
})

app.get("/register",function(req,res){
  res.render("register");

})

app.get("/login",function(req,res){
  res.render("login");
})

app.post("/register",function(req,res){
    const newuser=new User({
      email:req.body.username,
      password:req.body.password
    })
    newuser.save(function(err){
      if(err){
        console.log(err);
      }else{
        res.render("secrets")
      }
    });
});

app.post("/login",function(req,res){
  const username = req.body.username;
  const password1 = req.body.password;

  User.findOne({email:username},function(err,founduser){
    if(err){
      console.log(err);
    }else{
      if(founduser){
        if(founduser.password === password1){

          res.render("secrets");
        }
      }
    }
  });
});

app.listen(3000,function(){
  console.log("server started on port 3000");
});
