const mongoose = require('mongoose');
const DB = 'mongodb+srv://parveen:himanshup@cluster0.vltnj.mongodb.net/EmployeeDB?retryWrites=true&w=majority';

mongoose.connect(DB, 

{ useNewUrlParser: true,  
    useUnifiedTopology: true,
useNewUrlParser:true,
useFindAndModify:false},

(err) => {
    if (!err) { console.log('MongoDB Connection Succeeded.') }
    else { console.log('Error in DB connection : ' + err) }
});

require('./employee.model');

