require('dotenv').config()

var express = require('express');
var app = express();

var router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {dbConnect, selectDBdata}= require('../dbMySql/dbConnect');
const {clg, clr, clb} = require('../developmentOnly')
const {authenticatTokens} = require('../authFuncion')
const path = require('path')
const {compSubscriptions} = require('./middleware/registerMiddleware')

router.use(authenticatTokens)
//router.use(compSubscriptions)
router.route('/')
    .get(async (req, res)=>{
        clg('/GET subcribedComp handleComp');
        console.log(req.user.id)
        //  ${req.user.id}
        if(req.user){
            let compListQQ = `
            SELECT comp_list.compID, comp_list.compName FROM comp_list
            RIGHT JOIN comp_subscription
            ON comp_list.compID = comp_subscription.compID
            WHERE 
                comp_subscription.userID = 1 AND comp_subscription.projectID = 10
            ORDER BY 
                comp_list.compID ASC
            `;

            let compListQ = `SELECT compID, compName FROM comp_list`;
            let compListDB = await selectDBdata(compListQ)
            
            console.log('compListDB')
            compListDB =  compListDB.map((v,i)=>{
                return {id: v.compID, compName: v.compName}
            })
            console.log(compListDB)
            res.json({compslist:compListDB})
        }
    })
    .post (async (req, res)=>{
        clg('/POST subcribedComp handleComp');
    })
    .delete(async (req, res)=>{
        clg('/DELETE subcribedComp handleComp');
    })
    .patch(async (req, res)=>{
        clg('/PATCH subcribedComp handleComp');
    })






module.exports = router;