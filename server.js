//Imported Dependencies
var express = require('express');
var exphbs  = require('express-handlebars');
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

var cors = require('cors');
//Modules
var path = require('path');
const fileUpload = require('express-fileupload');
//Imported Files
var routes = require('./routes/handle');
var slidesRouter = require('./routes/handleSlides')
var logoRouter = require('./routes/handleLogo')
var projectRouter = require('./routes/handleProject')
var navRouter = require('./routes/handleNav');
var iframeVideos = require('./routes/handleiFrameVideo')
const subcribedComp = require('./routes/handleComp')



var app = express();

app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(express.static('public'));
app.use(methodOverride("_method"));
app.use(bodyParser.json());

app.use(express.urlencoded({extended:true})) //youtube added
app.use('/subcribedComp', subcribedComp)
app.use('/iframe', iframeVideos)
app.use('/navigation', navRouter)
app.use('/projects', projectRouter)
app.use('/uploadlogo',logoRouter)
app.use('/slide', slidesRouter);
app.use('/', routes);

var port = 8000;
app.listen(port, () => {
    console.log(`Running Backend Server on ${port}`);
})