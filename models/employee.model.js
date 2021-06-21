const mongoose = require('mongoose');
var moment = require('moment');
var employeeSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: 'This field is required.'
    },
    email: {
        type: String
    },
    company:{
        type: String
    
    },
    experinace:{
        type: String
    },
    location:{
        type: String
    },
    salary:{
        type: String
    },
    mobile: {
        type: String
    },
    city: {
        type: String
    },
    comment:{
        type: String,
        substr: ["$comment", 0, 50]
       
       
    },
    longcomment:{
        type: String,
    },
    
    
    createdAt: {
        type: String,
        default: moment().format("dddd,h:mm a"),
    },
    time:{
        type:String,
        
        default: moment().format("m,h:mm a"),
    },
    search:{
        type:String,
    },
    checkbox1:{
      type:String,  
    }

});

// Custom validation for email
employeeSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

mongoose.model('Employee', employeeSchema);