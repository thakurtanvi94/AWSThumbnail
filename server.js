var express = require('express');
require('dotenv').config()
var app = express();
const path = require('path');
const Promise = require('bluebird');
const mysql = require('mysql');
const s3_base_url = process.env.s3BaseUrl; //update this with the own s3 base url

var connection = mysql.createConnection({
    host : process.env.hostname,
    user : process.env.user,
    password : process.env.password,
    database : process.env.database,

});
var queryAsync = Promise.promisify(connection.query.bind(connection));
connection.connect();
app.use(express.static('./public'));
// app.get('/thumbnails', function(request, response){
//     console.log(request.query.pageIndex);
//     conn.query('select concat("'+s3_base_url+'",filename) as image_url, filename as name from thumbnail_success order by thumbnail_size limit 5', function(error, results){
//         if ( error ){
//             console.log(error)
//             response.status(400).send('Error in database operation');
//         } else {
//             // console.log(results);
//             response.send(results);
//         }
//     });
// });
app.get('/thumbnails', function(req, res){
    var numRows;
    var queryPagination;
    var numPerPage = parseInt(req.query.npp, 10) || 1;
    var page = parseInt(req.query.page, 10) || 0;
    var numPages;
    var skip = page * numPerPage;
    // Here we compute the LIMIT parameter for MySQL query
    var limit = skip + ',' + numPerPage;
    queryAsync('SELECT count(1) as numRows FROM thumbnail_success')
    .then(function(results) {
      numRows = results[0].numRows;
      numPages = Math.ceil(numRows / numPerPage);
      console.log('number of pages:', numPages);
    })
    .then(() => queryAsync('select concat("'+s3_base_url+'",filename) as image_url, filename as name from thumbnail_success order by thumbnail_size limit ' + limit))
    .then(function(results) {
      var responsePayload = {
        results: results
      };
      if (page < numPages) {
        responsePayload.pagination = {
          current: page,
          perPage: numPerPage,
          previous: page > 0 ? page - 1 : undefined,
          next: page < numPages - 1 ? page + 1 : undefined
        }
      }
      else responsePayload.pagination = {
        err: 'queried page ' + page + ' is >= to maximum page number ' + numPages
      }
      res.json(responsePayload);
    })
    .catch(function(err) {
      console.error(err);
      res.json({ err: err });
    });
});

app.get('/',function(req,res) {
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});