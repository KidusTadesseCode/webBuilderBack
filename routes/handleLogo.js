require('dotenv').config()

var express = require('express');
var router = express.Router();
var app = express();

const {selectDBdata}= require('../dbMySql/dbConnect');
const {clg, clr, clb} = require('../developmentOnly');
const {authenticatTokens,} = require('../authFuncion');
const mysqlPromes = require('promise-mysql');
const buffer = require('buffer');

const {compSubscriptions} = require('./middleware/registerMiddleware');

router.use(authenticatTokens)

router.route('/')
    .post(compSubscriptions, async function(req, res) {
        clg('/POST uploadlogo')
        console.log(req.body.projctID)

        console.log(req.files.files)
        if(req.user){
            if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
            }
            const {id}=req.user
            const {name, data, mimetype}=req.files.files
            let selectData = `SELECT COUNT(userID) userID FROM logoComp WHERE userID = ${id} AND projectID=${req.body.projctID}`
            const selectDataDB = await selectDBdata(selectData);
            
            if (selectDataDB[0]['userID']==0){ 
                let insertData = `INSERT INTO logoComp (userID, imgName, img, imgType, projectID) VALUES (?, ?, ?, ?, ?)`;
                let values = [id, name, data, mimetype, req.body.projctID]
                await selectDBdata(insertData, values);  
            }else{
                let insertData = `UPDATE logoComp 
                                SET imgName = '${name}', imgType='${mimetype}', img = ${mysqlPromes.escape(data)}
                                WHERE userID = ${id} AND projectID=${req.body.projctID}`;
                await selectDBdata(insertData);
            }
            const b64 = buffer.Buffer.from(data).toString('base64')
            res.json({image:b64, imagetype:mimetype})
        }res.status(403)

    })

  .get( async (req, res)=>{
    clg('/GET uploadLogo')
    //console.log(req.query.projctID) 
    if (req.user){
        if(req.query.projctID){
            let selectQ = `SELECT img, imgType FROM logoComp WHERE userID = ${req.user.id} AND projectID = ${req.query.projctID}`
            let result = await selectDBdata(selectQ);
            if (result.length>0){
                const {img, imgType}=result[0]
                res.json({img:buffer.Buffer.from(img).toString('base64'), imgType:imgType})
                return
            }
        }
    }else{ res.status(403) }
  })

module.exports = router;

// userID, projectID