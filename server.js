/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

require('babel-register') ({
    presets: ['react']
});

const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require('fs');
var upload = multer();
var {PythonShell} = require('python-shell');
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var CalcComponent = require('./calculationoutput.jsx');

var app = express();
var courses = []; 

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static(__dirname + '/views'));
app.use(upload.array()); 

app.get('/', (req, res) => {
    fs.writeFile('outputclasses.json', JSON.stringify({}));
    res.render("index.html");
});

app.get('/test', (req,res) => {
    res.sendFile('output.html', {root : __dirname + '/views'});
});

app.post('/courses', (req, res) => {
    console.log(req.body.course);
    courses.push(req.body.course.toUpperCase());
  });

app.delete('/delete', () => {
    courses.pop();
});

function calculate(req, res) {
    var options = {
        args: [JSON.stringify(courses)]
    };

    console.log(JSON.stringify(courses))
    PythonShell.run('igetccalculation.py', options, function (err, data) {
            if (err) {
                console.log(err)
            }
            courses = []
            console.log("python script output:" + data);
            var output = fs.readFileSync("outputclasses.json");
            areaobj = JSON.parse(output);
            //console.log(areaobj)
            fs.writeFileSync("./outputclasses.json", "{}"); 
            var html = ReactDOMServer.renderToString(React.createElement(CalcComponent, {areaobj}, null));
            res.send(html);
        }
    );
}

app.get('/calculation', calculate);

app.listen(8080,() => {
    console.log("Started on port " + 8080);
});

