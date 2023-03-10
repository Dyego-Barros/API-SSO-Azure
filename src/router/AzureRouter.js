const express = require('express');
const router = express.Router();
const axios = require('axios');
const getLicense = require('../Interfaces/InterfaceLicense');
const passport = require('passport');
const saml = require('passport-saml').Strategy;

const crypto = require('crypto-js');



router.get('/',(req,res)=>{
    res.send("Teste de SSO");
    });

router.get('/login/:id', (req,res,next)=>{
    if(isNaN(req.params.id)){
        res.render('error_id.ejs');
    }else{
        const license= [];

       getLicense.getid(req.params.id)
       .then(response =>{
            const license = response;
        
           if(license.length <= 0){
            res.render('error_id.ejs');
           }else{
           
            const dateLicense = new Date(license[0]['DateExpire']);
           
            var today = new Date();
            if(today < dateLicense){

                let dados = [];

                axios.get(license[0]['MetadataUrl'])
                .then(response => {
                   
                    ///Sepera a String e pegas o valores necessarios

                    let result = response.data.split("SingleSignOnService")
                    let newResult = result[1].split("Location")
                    let certificate = response.data.split("X509Certificate")
                    let newcertificate = certificate[1].replace(">", "").replace("</","")

                    //Insere Valores no array
                   dados.push(newcertificate);
                   dados.push(newResult[1].replace("="," ","\\"," "))
                 
                   //Serializa o Objeto Passport

                   passport.serializeUser((user, done)=>{
                      done(null,user);
                  })

                   //Deserializa o Objeto Passport
    
                  passport.deserializeUser((user, done)=>{
                      done(null,user);
                  })
    
                //Configura Estrategia do PASSPORT
             passport.use(new saml(
                      {
                          entryPoint:dados[1].replace("\""," ").replace("/><"," "). replace("/saml2\"", "/saml2") ,
                          issuer: license[0]['UrlIdentificacao'],
                          callbackUrl: license[0]['UrlIdentificacao'] + '/azure/callback',
                          cert: dados[0],
                          authnContext:['http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/password'],
                       
                      },(profile, done)=>{
                          done(null, profile);
                      }
                  ));
                 
                // const obj ={
                //     url:dados[1].replace("\""," ").replace("/><"," "). replace("/saml2\"", "/saml2")
                // }
                //     res.send(obj);

                    next();
                })
                .catch(function (error) {
                    // manipula erros da requisi????o
                    res.json("{Error: Falaha na comunica????o com a  URL de MetaDados}").status(400);
                })
               
            }else{
                res.render('error.ejs');
            }
           }
           

       })       
       .catch(err => console.log(err));     
    }


},  passport.authenticate("saml"));

router.post('/azure/callback', passport.authenticate('saml'),(req,res,next)=>{
    res.send(req.user);
    // let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
  
    // if(regex.test(data["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameID"])){
  
    //     const cypher = crypto.AES.encrypt(data["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameID"],'secret').toString();
  
    //    res.redirect(`https://cloud4.webnesta.com:44302/sso2/Login/Callback?token=${cypher}`);
  
    // }else if(regex.test(data["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]) ){
  
    //     const cypher = crypto.AES.encrypt(data["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],'secret').toString();
  
    //     res.redirect(`https://cloud4.webnesta.com:44302/sso2/Login/Callback?token=${cypher}`);
  
    // }else if(regex.test(data["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"])){
  
    //     const cypher = crypto.AES.encrypt(data["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],'secret').toString();;
  
    //      res.redirect(`https://cloud4.webnesta.com:44302/sso2/Login/Callback?token=${cypher}`);
  
    //}
})

router.post('/sso/decipher/',(req, res)=>{
    const token = req.body.token; 
     if(token == undefined || token == null){
        res.send("Token est?? vazio ou indefinido");
  
     }else{
         let decipher = crypto.AES.decrypt(token, 'secret');
         let decipherToken = decipher.toString(crypto.enc.Utf8);
          res.json(decipherToken);
     }
  
  
  })


module.exports = router;