const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");

var registerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'This field is required.'
    },
    headline:{
        type: String,
        required: 'This field is required.'
    },
    age: {
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
    },salary:{
        type: String
    },
    confirmpassword:{
        type:String,
        required: true,
        unique: true
    },

    esalary:{
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
registerSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');
registerSchema.methods.genrateAuthToken =async function(){
    try{
        console.log(this._id);
    const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({token:token})
await this.save();
return token;
    console.log(token);
     
}
    catch(error){
        res.send(error);
        console.log("the error:" + error);
    
    }
}
mongoose.model('Register', registerSchema);