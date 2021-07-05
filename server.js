var express = require('express');
require('dotenv').config()
var app = express();
const path = require('path');
var mysql = require('mysql');
const s3_base_url = process.env.s3BaseUrl; //update this with the own s3 base url

var conn = mysql.createConnection({
    host : process.env.hostname,
    user : process.env.user,
    password : process.env.password,
    database : process.env.database,

});

conn.connect();
app.use(express.static('./public'));
app.get('/thumbnails', function(request, response){
    console.log(request.query.pageIndex);
    conn.query('select concat("'+s3_base_url+'",filename) as image_url, filename as name from thumbnail_success order by thumbnail_size limit 5', function(error, results){
        if ( error ){
            console.log(error)
            response.status(400).send('Error in database operation');
        } else {
            // console.log(results);
            response.send(results);
        }
    });
});

app.get('/',function(req,res) {
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});