require('dotenv').config()

var express = require('express');
var router = express.Router();
var app = express();

//const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken');

const {selectDBdata}= require('../dbMySql/dbConnect');
const {clg, clr, clb} = require('../developmentOnly')
const {authenticatTokens} = require('../authFuncion')
const mysqlPromes = require('promise-mysql');
const buffer = require('buffer')

const {compSubscriptions} = require('./middleware/registerMiddleware');


router.use(authenticatTokens)

//req.files.files, projctID, req.body
//async function createSlide (reqbody, projctID, reqfiles){
async function createSlide (files, body){
    console.log("createSlide function")
    // console.log(files)
    // console.log("body")
    // console.log(body)
    //console.log(projctID)
    //console.log(body)

    let {name, data, mimetype}= files;
    let {id, order, subtitle, title, projctID, pageId}= body
    let insertData = `INSERT INTO slideComp (userId, projectID, navigation_ItemID, imgId, title, subTitle, imgType, slideOrderNumber, imageBinary, imgName)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    let values = [1, projctID, pageId, id, title, subtitle, mimetype, order, data, name.toString()]
    const datas = await selectDBdata(insertData, values);
    console.log(datas)
    
    let props = {
        fileName: name, 
        data:data, 
        imageType:mimetype,
        imgId: id,
        title:title,
        subtitle:subtitle
    }
    return props
}





router.route('/')
    .get( async function (req, res) {
        clg("/GET slide");
        // userID, projectID
        if (req.user){
            if(req.query.projctID && req.query.pageID){
                let qSlides = `SELECT imgId, title, subTitle, imageBinary, imgType, slideOrderNumber, imgName FROM slideComp
                               WHERE projectID = ${req.query.projctID} AND userId=${req.user.id} AND navigation_ItemID = ${req.query.pageID} AND deleted=0 ORDER BY slideOrderNumber ASC`
                let dbSelectSlides = await selectDBdata(qSlides);
                let q = dbSelectSlides.map((v)=>{
                    return {imgId:v.imgId, title:v.title, subTitle:v.subTitle, imgType:v.imgType, imageBinary:buffer.Buffer.from(v.imageBinary).toString('base64'), slideOrderNumber:v.slideOrderNumber, filename:v.imgName}
                })
                res.json({slides:q})
                return
            }else{
                res.status(400).send('error')
            }
        }
        
    })
    .post(compSubscriptions, async function (req, res) {
        clg("/post slide");
        console.log('req.body')
        //console.log(req.body)

        
        if(req.user && req.body.projctID && req.body.pageId){
            if (!req.files || Object.keys(req.files).length === 0) return res.status(400).send('No files were uploaded.');
            let slideInfo = await createSlide (req.files.files, req.body)
            //console.log(slideInfo)
            //res.json(slideInfo)
            res.json('done')
        }
        
    })
// PATCH NEEDS FIXING 
    .patch( async function (req, res) {
        clg("/patch slide");
        console.log('req.body')
        //console.log(req.body.result)
        if(req.body.update == 'text' && req.body.pageID){
            console.log(req.body.result)
            let e, f;
            req.body.result.map(async (v)=>{
                console.log(v)
                e = `UPDATE slideComp 
                        SET 
                            slideOrderNumber = ${mysqlPromes.escape(v.order)},
                            imgName = ${mysqlPromes.escape(v.imageName)},
                            imgType = "${mysqlPromes.escape(v.imageType)}",
                            subTitle = ${mysqlPromes.escape(v.subtitle)},
                            title = ${mysqlPromes.escape(v.title)}
                        WHERE 
                            userId = ${mysqlPromes.escape(req.user.id)}
                        AND 
                            imgId = ${mysqlPromes.escape(v.id)}
                        AND 
                            projectID = ${mysqlPromes.escape(req.body.projctID)}
                            navigation_ItemID = ${mysqlPromes.escape(req.body.pageID)}
                        `;
               // await selectDBdata(e);
            })
            //res.json(req.body)
            res.send('req.body')
            return

        }

        
        //  id userId projctID	imgId title	subTitle imgName imageBinary imgType slideOrderNumber deleted


/*
        if (req.body.data.changeOne.id || req.body.data.changeOne.order){
            const changeOneID=req.body.data.changeOne.id
            const changeOneOrder=req.body.data.changeOne.order
            let db1 = await selectDBdata(`UPDATE slideComp SET slideOrderNumber = '${req.body.data.changeOne.order}' WHERE imgId = '${req.body.data.changeOne.id}'`);
            console.log('db1'); console.log(db1)
        } 
        if (req.body.data.changeTwo.id || req.body.data.changeTwo.order){
            const changeTwoID=req.body.data.changeTwo.id
            const changeTwoOrder=req.body.data.changeTwo.order
            let db2 = await selectDBdata(`UPDATE slideComp SET slideOrderNumber = '${req.body.data.changeTwo.order}' WHERE imgId = '${req.body.data.changeTwo.id}'`)
            console.log('db2'); console.log(db2)
        }
*/
        
    })


    .delete(async function (req, res) {
        clg("/delete slide");
        clg('req.body')
        const {id}=req.body 
        console.log(id) 
        if (req.user){
            let deleteImg = `UPDATE slideComp SET deleted = 1 WHERE imgId= ${id} AND deleted=0`;
            //let delImg = await selectDBdata(deleteImg);
            //console.log(delImg)
            res.send('id')
        }
    })




    module.exports = router; 



/*
//GET to fetch data
//DELETE to remove data
//PATCH to make partial updates
//PUT //to make full updates
*/