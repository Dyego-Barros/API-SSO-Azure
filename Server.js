const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const port = 2000;
const Routers = require('./src/router/AzureRouter');
const https = require('https');
const fs = require('fs');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(session({
    secret: 'mysecret',
    saveUninitialized:true,
    resave:true
}))
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, 'views'));
app.use('/', Routers);


// const options={
//     key:fs.readFileSync(__dirname + "/ssl/privkey.pem"),
//     cert:fs.readFileSync(__dirname + "/ssl/cert.pem"),
// }

// https.createServer(options,app).listen(port);


 app.listen(port, (error)=>{
     if(error){
         console.log(error);
     }else{
         console.log(`Server listening on port:${port}`);
     }
 })
