const Sequelize = require('sequelize');
const config = require('./config.json');

/**
 * COnfiguração de Conexão com o Banco de Dados usando Sequelize e MySQL
 */

const sequelize = new Sequelize(config['Config Database'].database, config['Config Database'].username, config['Config Database'].password,{
    host:config['Config Database'].host,
    port:config['Config Database'].port,
    dialect: config['Config Database'].dialect, 
     
});

try{
 sequelize.authenticate();
 console.log("Database is connected succesfully");
}catch(error){
    console.log("Connected error:" + error);
}

module.exports = sequelize;