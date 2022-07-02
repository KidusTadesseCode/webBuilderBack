const {clg, clr, clb} = require('../../developmentOnly');
const {selectDBdata} = require('../../dbMySql/dbConnect')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//get subscriptions, subscribe, unsubscribe,

async function compSubscriptions(req, res, next){
    next()
    clr(`started compSubscriptions()`)
    console.log(" ")

    let compName = req.baseUrl.split("/")[1];
    let userID = req.user.id;
    let method = req.method;
    let projctID;
    
    if (method=="GET"){
        projctID= req.query['projctID']
    }else if(method=="POST"){
        projctID = req.body.projctID
    }
    let regComps = `SELECT compID FROM comp_list WHERE path = '${compName}' ORDER BY compID ASC`
    regComps = await selectDBdata(regComps)

    console.log('regComps');
    console.log(regComps[0]['compID']);

    let usersComps = `SELECT COUNT(compID) as compIDlength FROM comp_subscription WHERE userID=${userID} AND projectID=${projctID} AND compID=${regComps[0]['compID']}`
    usersComps = await selectDBdata(usersComps)
    
    
    console.log('usersComps')
    console.log(usersComps)
    
    if (usersComps[0]['compIDlength']==0){
        clr('usersComps')
        console.log(usersComps)
        //console.log(usersComps[0]['compIDlength'])

        let regesterComp = `INSERT INTO comp_subscription (compID, userID, projectID) VALUES ('${regComps[0]['compID']}', ${userID}, ${projctID})`
        regesterComp = await selectDBdata(regesterComp);
        console.log(regesterComp)
    }
    

    clr('compName')
    console.log(compName)
    clr('userID')
    console.log(userID)
    clr('method')
    console.log(method)
    clr('projctID')
    console.log(projctID)

    clr(`ended compSubscriptions()`) 
    return
}


module.exports= {
    compSubscriptions:compSubscriptions
}