#!/usr/bin/env node

/*
*  Author: Arif Yuliannur
*  Github: virkillz
*  Email: virkill@gmail.com
*  Desc: tsert will fetch html snippet from repository and insert into your html file. It will replace '[tsert-here]'
    inside your html document, or put before <footer> or before </body> when other not present.
*/


const fs = require('fs');
var http = require('https');
var colors = require('ansi-256-colors');

if (process.argv.length <= 2) {
    const usageText = colors.fg.standard[1] + `
    _______            _   
    |__   __|          | |  
       | |___  ___ _ __| |_ 
       | / __|/ _ \\ '__| __|
       | \\__ \\  __/ |  | |_ 
       |_|___/\\___|_|   \\__| ` + colors.reset + colors.fg.standard[4] + `v 1.0.0` + colors.reset + 

       colors.fg.standard[3] + ` 
       
       by virkillz`

                                       
       + colors.fg.standard[5] + `

       This is a simple CLI tool to rapidly fetch HTML snippet and put it in your code. 
       By using this, we can fetch snippet code from github repository and insert directly 
       into given HTML file. By put 'tsert::[filename]' it will call http request, get the 
       file and insert into your text.

       ` + colors.reset + `
       Usage:
       ` + colors.fg.standard[4] + `tsert <path> ` + colors.reset + `                      // for normal use

       ` + colors.fg.standard[4] + `tsert <path> -url <hostname> ` + colors.reset + `      // for custom hostname

       Example:
       ` + colors.fg.standard[5] + `tsert index.html ` + colors.reset + `
       
       This will look inside your 'index.html' file and replace all keyword tsert::[template-name]
       with whatever content from default
       https://raw.githubusercontent.com/virkillz/tailstack/master/templates/template-name.html


       ` + colors.fg.standard[5] + `tsert index.html -h http://something-else.com/template ` + colors.reset + `

       This will look inside your 'index.html' file and replace all keyword tsert::[template-name]
       with whatever content from 
       http://something-else.com/template/template-name.html       
	`
    console.log(usageText);
    process.exit(-1);
}

//Use minimist to parse argument
var argv = require('minimist')(process.argv.slice(2));
var file = argv._[0];

// Default hostname and url path
var urlhost = "https://raw.githubusercontent.com/virkillz/tailstack/master/templates/";

if (argv.h != undefined) {
    urlhost = argv.h;
}

    check(file);

    function check(file) {
        fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
                console.log(colors.fg.standard[5] + "<tsert> " + colors.fg.standard[1] + "   Error: " + colors.reset + " Cannot read the file.");
                return;
            } else {
    
                if (data.includes("tsert::")) {
                        fetchKeyword(data, file);
                } else {
                    console.log(colors.fg.standard[5] + "<tsert> " + colors.reset + "  ~ Finished: no keyword 'tsert::' founded anymore. ~");
                }
            };
        });
    }

    function firstWord(str) {
        let res = str.split(" ");
        return res[0];
    }

    function stripNewLine(str) {
        let res = str.split("\n");
        return res[0];
    } 
    
    function stripBraces(str) {
        let res = str.split("<");
        return res[0];
    }     

    function fetchKeyword(data, path) {
        let res = data.split("tsert::");
        rawkeyword = firstWord(res[1]);
        newrawkeyword = stripNewLine(rawkeyword);
        keyword = stripBraces(newrawkeyword);
        console.log(keyword);
        let fullpath = urlhost + keyword + ".html"
        http.get(fullpath, (res) => {
            const statusCode = res.statusCode;
            const contentType = res.headers['content-type'];

            let error;
            if (statusCode !== 200) {
                error = new Error(`Request Failed when reaching: ` + fullpath + ` Status Code: ${statusCode}`);
            }
    
            if (error) {
                console.log(error.message);
                // consume response data to free up memory
                res.resume;
                return;
            }
    
            res.setEncoding('utf8');
            let rawData = "";
            res.on('data', (chunk) => rawData += chunk);
            res.on('end', _test => {
                try {

                    writeFile(rawData, keyword, path)

                } catch (e) {
                    console.log(e.message);
                }
            });
    
        }).on('error', (e) => {
            console.log(`Got error: ${e.message}`);
        });
    }

    function writeFile(content, keyword, path) {

        if (!fs.existsSync(path)) {
            console.log(colors.fg.standard[5] + "<tsert> " + colors.fg.standard[1] + "  Error: "+ colors.reset + " The given path " + path + " did not exist");
            process.exit(-1);
        }
    
        var document = "";
        fs.readFile(path, 'utf8', function (err, data) {
            if (err) {
                console.log(colors.fg.standard[5] + "<tsert> " + colors.fg.standard[1] + "   Error: " + colors.reset + " Cannot read the file.");
                return console.log(err);
            } else {
    
                document = data.replace("tsert::" + keyword, content);
    
            };
    
            if (document == "") {
                console.log(colors.fg.standard[5] + "<tsert> " + colors.fg.standard[1] + "   Error: " + colors.reset + " Failed to insert.");
            } else {
                fs.writeFile(path, document, 'utf8', function (err) {
                    if (err) { console.log(err); }
                    else { console.log(colors.fg.standard[5] + "<tsert> " + colors.fg.standard[2] + "  Success: tsert::" + keyword + " has been replaced." + colors.reset); check(path); }
                    ;
                });
            }
    
        });
    }
    