const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL).then(result => {
    console.log("MongoDB is Connected")
})
    .catch(err => {
        console.log("MongoDB error: " + err);
    })
