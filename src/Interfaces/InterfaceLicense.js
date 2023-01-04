const sequelize = require('../../config/configDb');
const { QueryTypes}= require('sequelize');


module.exports={
    getid: async function(id){
        const idEnterprise = await sequelize.query(`SELECT * FROM public."client" WHERE id=${id}`,{type:QueryTypes.SELECT});
      if(idEnterprise){
         return idEnterprise;
      }else{
        return idEnterprise;
      }
    }
}
