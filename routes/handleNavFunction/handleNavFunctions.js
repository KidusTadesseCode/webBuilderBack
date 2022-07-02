
const {selectDBdata}= require('../../dbMySql/dbConnect');

async function deleteLine(user, reqBody){
    console.log('deleteLine')
    console.log(user)
    console.log(reqBody)

    const userId=user.id
    const pageID = reqBody.id
    const {projctID}=reqBody


    let deleteFromNav = `DELETE FROM navigationComp WHERE projectID = ${projctID} AND itemID = '${pageID}' AND userID = ${userId}`;
    let deleteFromNavDB = await selectDBdata(deleteFromNav)
    
    let deleteFromSlide = `DELETE FROM slideComp WHERE projectID = ${projctID} AND userId = ${userId} AND navigation_ItemID=${pageID}`;
    let deleteFromSlideDB = await selectDBdata(deleteFromSlide)
    
    let deleteFromVideo = `DELETE FROM video_iFrame_Comp WHERE projectID = ${projctID} AND userID = ${userId} AND navigation_ItemID=${pageID}`;
    let deleteFromVideoDB = await selectDBdata(deleteFromVideo)
    
    console.log("deleteFromNavDB");
    console.log(deleteFromNavDB);
    console.log('deleteFromSlideDB');
    console.log(deleteFromSlideDB);
    console.log('deleteFromVideoDB');
    console.log(deleteFromVideoDB);
    
}




module.exports = deleteLine