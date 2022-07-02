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

router.use(authenticatTokens)

router.route('/')
    .post(async function (req, res) {
        clg('/GET new Project')
        if(req.user){
            const {id}=req.user
            console.log(req.body)
            const{project, owner}=req.body;
            console.log(project)
            let status, deployed, domainName;
            status = 0; // (default on Progress) or completed
            deployed = 0 //default false = 0 
            domainName = '' //default ''
            let insert = `INSERT INTO projects (userId, ownerName, projectName, status, deployed, domainName) 
            VALUES ('${id}', '${owner}', '${project}', '${status}', "${deployed}", '${domainName}')`;
            const data = await selectDBdata(insert);
            console.log(data.insertId)
            res.json({projectId: data.insertId})
        }
    })
    .get(async function (req, res) {
        clg('/GET existing ProjectTest')
        let select = `SELECT projectID, projectName, ownerName, date FROM projects WHERE deleted = 0 ORDER BY projectID ASC`;
        const data = await selectDBdata(select);
        res.send(data)
    })
    .delete(async (req, res)=>{
        console.log(req.body.projectID)
        console.log(req.user)
        if(req.user){
            let deleteQ = `UPDATE projects SET deleted = 1 WHERE userID=${req.user.id} AND projectID=${req.body.projectID}`
            const deleteDB = await selectDBdata(deleteQ);
            console.log(deleteDB)
            res.send("deleted")
        }
    })


//////////////////////////////////////////////////////////////////////////////////////////
/*
    .post('/newProjecttest', authenticatTokens, function (req, res) {
        //newProjecttest
        res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        
        const{projectName, ownerName}=req.body;
        let status, deployed, domainName;
        //let projectName, ownerName;
        
        //projectName = req.body['project']; ownerName = req.body['owner'];
        status = 'on Progress'; // (default on Progress) or completed
        deployed = 0 //default false = 0 
        domainName = '' //default ''
        if (projectName){
            console.log(projectName);  console.log(ownerName)
            res.send('success');
        }else{
            console.log('There is error');
            res.send('error')
        }
    })



    .get('/projectTest', async function (req, res) {
        //projectTest
        res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        clr('/existingProjectTest')
        const authHeader = req.headers['authorization']
        console.log(authHeader)
        
        let status, deployed, domainName;

        status = 'on Progress'; // (default on Progress) or completed
        deployed = 0 //default false = 0 
        domainName = '' //default '' 

        let select = `SELECT id, projectName, ownerName, date FROM projects ORDER BY id ASC`;
        const data = await selectDBdata(select);
        console.log('data')
        console.log(data)
        
        res.send(data)
    })*/


module.exports = router; 