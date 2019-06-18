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
const urlhost = "https://raw.githubusercontent.com/virkillz/tailstack/master/templates/";

if (process.argv.length <= 2) {
    const usageText = `
    _______            _   
    |__   __|          | |  
       | |___  ___ _ __| |_ 
       | / __|/ _ \\ '__| __|
       | \\__ \\  __/ |  | |_ 
       |_|___/\\___|_|   \\__| by virkillz
                                       
       v 0.1.0

       This is a simple CLI tool to rapidly fetch HTML snippet and put it in your code. 
       By using this, we can fetch snippet code from github repository and insert directly 
       into given HTML file. By put 'tsert::[filename]' it will call http request, get the 
       file and insert into your text.

  
	usage:
	  tsert <path>
  
	example:
	   tsert index.html
	`
    console.log(usageText);
    process.exit(-1);
}

var file = process.argv[2];

    check(file);

    function check(file) {
        fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
                console.log("<tsert>  Error: Cannot read the file.");
                return;
            } else {
    
                if (data.includes("tsert::")) {
                        fetchKeyword(data, file);
                } else {
                    console.log("<tsert> ~ Finished: no keyword 'tsert::' founded anymore. ~");
                }
            };
        });
    }

    function firstWord(str) {
        var res = str.split(" ");
        return res[0];
    }

    function stripNewLine(str) {
        var res = str.split("\n");
        return res[0];
    } 
    
    function stripBraces(str) {
        var res = str.split("<");
        return res[0];
    }     

    function fetchKeyword(data, path) {
        var res = data.split("tsert::");
        rawkeyword = firstWord(res[1]);
        newrawkeyword = stripNewLine(rawkeyword);
        keyword = stripBraces(newrawkeyword);
        console.log(keyword);
        http.get(urlhost + keyword + ".html", (res) => {
            const statusCode = res.statusCode;
            const contentType = res.headers['content-type'];

            //for debug purpose only
            // console.log(res);

            let error;
            if (statusCode !== 200) {
                error = new Error(`Request Failed.` + `Status Code: ${statusCode}` + '. Keyword Unknown.');
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
            console.log("<tsert> Error: The given path " + path + " did not exist");
            process.exit(-1);
        }
    
        var document = "";
        fs.readFile(path, 'utf8', function (err, data) {
            if (err) {
                console.log("<tsert>  Error: Cannot read the file.");
                return console.log(err);
            } else {
    
                document = data.replace("tsert::" + keyword, content);
    
            };
    
            if (document == "") {
                console.log("<tsert> Error: Failed to insert.");
            } else {
                fs.writeFile(path, document, 'utf8', function (err) {
                    if (err) { console.log(err); }
                    else { console.log("<tsert> Success: " + " has been replaced."); check(path); }
                    ;
                });
            }
    
        });
    }
    