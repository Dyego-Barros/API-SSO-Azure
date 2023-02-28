/***
 * A Configuração Foi passada Diretamente no Endpoint onde o id do usuario é recebido
 */



// const passport = require('passport');
// const saml = require('passport-saml').Strategy;
// const config = require('../../config/config.json');

// passport.serializeUser((user, done)=>{
//     done(null,user);
// })

// passport.deserializeUser((user, done)=>{
//     done(null,user);
// })

// passport.use(new saml(
//     {
//         entryPoint: config['ConfigStrategyAzure'].entryPoint,
//         issuer: config['ConfigStrategyAzure'].issuer,
//         callbackUrl: config['ConfigStrategyAzure'].callbackUrl,
//         cert: config['ConfigStrategyAzure'].cert,
//         authnContext:[config['ConfigStrategyAzure'].authnContext],
         
//     },(profile, done)=>{
//         done(null, profile);
//     }
// ));

// module.exports = passport;


