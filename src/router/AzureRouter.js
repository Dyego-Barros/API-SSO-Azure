const express = require('express');
const router = express.Router();
const passport = require('../passport/AzurePassPort');
const getLicense = require('../Interfaces/InterfaceLicense');
const crypto = require('crypto-js');



router.get('/',(req,res)=>{
    res.send("Teste de SSO");
    });

router.get('/login/:id', (req,res,next)=>{
    if(isNaN(req.params.id)){
        res.sendStatus(400);

    }else{
        const license= [];
       getLicense.getid(req.params.id)
       .then(response =>{
            const license = response
            const dateLicense = new Date(license[0]['dataexp']);
            var today = new Date();
            if(today < dateLicense){
                next();
            }else{
                res.render('error.ejs');
            }

       })       
       .catch(err => console.log(err));     
    }


}, passport.authenticate('saml'));

router.post('/azure/callback', passport.authenticate('saml'),(req,res,next)=>{
    const data = req.user;
    let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
  
    if(regex.test(data["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameID"])){
  
        const cypher = crypto.AES.encrypt(data["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameID"],'secret').toString();
  
       res.redirect(`https://cloud4.webnesta.com:44302/sso2/Login/Callback?token=${cypher}`);
  
    }else if(regex.test(data["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]) ){
  
        const cypher = crypto.AES.encrypt(data["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],'secret').toString();
  
        res.redirect(`https://cloud4.webnesta.com:44302/sso2/Login/Callback?token=${cypher}`);
  
    }else if(regex.test(data["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"])){
  
        const cypher = crypto.AES.encrypt(data["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],'secret').toString();;
  
         res.redirect(`https://cloud4.webnesta.com:44302/sso2/Login/Callback?token=${cypher}`);
  
    }
})

router.post('/sso/decipher/',(req, res)=>{
    const token = req.body.token; 
     if(token == undefined || token == null){
        console.log("Token está vazio ou indefinido")
  
     }else{
         let decipher = crypto.AES.decrypt(token, 'secret');
         let decipherToken = decipher.toString(crypto.enc.Utf8);
          res.json(decipherToken);
     }
  
  
  })


module.exports = router;