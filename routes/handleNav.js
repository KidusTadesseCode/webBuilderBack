require('dotenv').config()

var express = require('express');
var router = express.Router();
var app = express();

const {dbConnect, selectDBdata}= require('../dbMySql/dbConnect');
const {clg, clr, clb} = require('../developmentOnly')
const {authenticatTokens,} = require('../authFuncion')
const path = require('path')

const mysqlPromes = require('promise-mysql');
const buffer = require('buffer')

const deleteLine = require('./handleNavFunction/handleNavFunctions')

const {compSubscriptions} = require('./middleware/registerMiddleware');


router.use(authenticatTokens)
//router.use(compSubscriptions)


router.route('/')
    .post(compSubscriptions, async (req, res)=>{
        clg('/post navigation handleNav')
        if(req.user){
            //console.log(req.body.projctID)
            let values= req.body.navlist[0].map((v)=>{
                return [req.user.id, v.id, req.body.projctID, v.inputValue, v.order]
            })
            console.log(values)	
            let navQ = `INSERT INTO navigationComp (userID, itemID, projectID, item, itemOrder) VALUES ?`
            let navDB = await selectDBdata(navQ, [values]);
            if(navDB) res.send('success')
            
        }
    })
    .get(async (req, res)=>{
        clg('/get navigation handleNav')
        if(req.user){
            let navQ = `SELECT itemID, item, itemOrder FROM navigationComp WHERE userID=${req.user.id} AND projectID=${req.query.projctID} ORDER BY itemOrder ASC`
            let navDB = await selectDBdata(navQ)
            res.json(navDB)
            clg('/get navigation pass')
        }
    })
    .patch(async (req, res)=>{
        clg('/patch navigation handleNav');
        if(req.user){
            const {result, projctID}=req.body
            result.map(async (v)=>{
                await selectDBdata(`UPDATE navigationComp SET itemOrder = '${v.order}' WHERE projectID = ${projctID} AND itemID = '${v.id}' AND userID = ${req.user.id}`)
            })
            res.send('success')
        }
        res.status(403)
    })

    .delete(async (req, res)=>{
        clg('/delete handleNav');
        if(req.user){
            const {id, projctID}=req.body
            deleteLine(req.user, req.body)
            let deleteQ = `DELETE FROM navigationComp WHERE projectID = ${projctID} AND itemID = '${id}' AND userID = ${req.user.id}`;
            //deleteQ = await selectDBdata(deleteQ)
            //console.log(deleteQ)

            res.send('success')
            return
        }
        res.status(403)
    })

module.exports = router;