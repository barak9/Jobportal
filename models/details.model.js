const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");

var detailSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'This field is required.'
    },
    technology:{
        type: String,
        required: 'This field is required.'
    },
    company: {
        type: String
    },
    skills:{
        type: String
    },

    email: {
        type: String
    },
    projects:{
        type: String
    },
    password:{
        type:String,
        required: true,
        unique: true
    },summary:{
        type: String
    },
    confirmpassword:{
        type:String,
        required: true,
        unique: true
    },

    profile:{
        type:String,
    },
    phone: {
        type: Number
    },
    personal:{
        type:String,
    },
    img: {
        type: String
    },
    doc: {
        type: String
    },
    tokens:[{
        token:{
            
                type: String,
                required: true
          
        }
    }]
    

    
});

// Custom validation for email
detailSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

mongoose.model('Detail', detailSchema);
