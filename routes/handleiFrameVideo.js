require('dotenv').config()

var express = require('express');
var app = express();

var router = express.Router();
//const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken');

const {dbConnect, selectDBdata}= require('../dbMySql/dbConnect');
const {clg, clr, clb} = require('../developmentOnly')
const {authenticatTokens} = require('../authFuncion')
const {compSubscriptions} = require('./middleware/registerMiddleware');


router.use(authenticatTokens)
router.route('/')
    .post(compSubscriptions, async(req, res)=>{
        if (req.user){
            const {id}=req.user
            const{projctID, ytvideoId, pageId}=req.body
            console.log(projctID, ytvideoId, id, pageId)
            let chechProject = `SELECT projectID FROM video_iFrame_Comp WHERE projectID=${projctID} AND userID=${id}`
            chechProject = await selectDBdata(chechProject);
            if (chechProject <= 0){
                console.log('INSERT')
                let upload = `INSERT INTO video_iFrame_Comp (userID, projectID, ifameLink, navigation_ItemID) 
                                        VALUES ('${id}', '${projctID}', '${ytvideoId}', '${pageId}')`
                upload = await selectDBdata(upload);
                if(upload) res.json({status: 'success'})
                console.log(upload)
                return
            }else{
                console.log('Update')
                let upload = `UPDATE video_iFrame_Comp SET userID=${id}, projectID=${projctID}, ifameLink="${ytvideoId}"`
                upload = await selectDBdata(upload);
                if(upload) res.json({status: 'success'})
                console.log(upload)
                return
            }
        }
    })
    .get(async(req, res)=>{
        clg('/GET iframe')
        const {id}=req.user
        const{projctID}=req.query

        console.log('req.body')
        console.log(projctID)
        if (req.user && projctID){
            let getYTid = `SELECT ifameLink FROM video_iFrame_Comp WHERE projectID='${projctID}' AND userID=${id}`
            getYTid = await selectDBdata(getYTid)
            if (getYTid[0]){
                res.json({youtubeVDid: getYTid[0]['ifameLink']})
            }
        }
    })
    



module.exports = router; 