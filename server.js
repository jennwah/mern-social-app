const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const cors = require('cors');
const app = express();

const postRoute = require('./routes/post')
const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const mongoURI = require('./config/config').mongoURI;


//mongodb connection
mongoose.connect(mongoURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(console.log('mongoDB connected!'))

mongoose.connection.on('error', err => {
    console.log(`DB connection eror: ${err.message}`);
})


app.get('/', (req,res)=> {
    fs.readFile('apiDocs.json', (err, data) => {
        if (err) {
            return res.json({error: err})
        } else {
            res.json(JSON.parse(data));
        }
    })
})

app.use(morgan('dev'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors());
app.use('/api/posts', postRoute);
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({error: "User must get authenticated before performing this action!"});
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}!`)
})