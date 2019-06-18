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

if (process.argv.length <= 3) {
    const usageText = `
    _______            _   
    |__   __|          | |  
       | |___  ___ _ __| |_ 
       | / __|/ _ \\ '__| __|
       | \\__ \\  __/ |  | |_ 
       |_|___/\\___|_|   \\__|
                                       

                                                                                          v 0.1.0

    tsert will fetch html snippet from repository and insert into your html file. It will replace '[tsert-here]'
    inside your html document, or put before <footer> or before </body> when other not present.
  
	usage:
	  tsert <keyword> <path>
  
	example:
	   tsert nav-1 index.html
	`
    console.log(usageText);
    process.exit(-1);
}

var componentName = process.argv[2];
var fileTarget = process.argv[3];

fetchAndWrite(componentName, fileTarget);

function fetchAndWrite(keyword, path) {
    //get the text from repo
    http.get(urlhost + keyword + ".html", (res) => {
        const statusCode = res.statusCode;
        const contentType = res.headers['content-type'];

        let error;
        if (statusCode !== 200) {
            error = new Error(`Request Failed.` + `Status Code: ${statusCode}`);
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
                writeFile(rawData, path);
            } catch (e) {
                console.log(e.message);
            }
        });

    }).on('error', (e) => {
        console.log(`Got error: ${e.message}`);
    });
}




function writeFile(content, path) {

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

            if (data.includes("[tsert-here]")) {
                var res = data.split("[tsert-here]");
                if (res.length == 2) {
                    document = res[0] + content + res[1];
                } else {
                    console.log(res.length);
                    console.log("<tsert> Error: Seems like more than one keyword [tsert-here] founded");
                };
            } else if (data.includes("<footer>")) {
                var res = data.split("<footer>");
                if (res.length == 2) {
                    document = res[0] + "\n" + content + "\n\n<footer>" + res[1];
                } else {
                    console.log(res.length);
                    console.log("<tsert>  Error: Seems like more than one keyword <footer> founded");
                };
            } else if (data.includes("</body>")) {
                var res = data.split("</body>");
                if (res.length == 2) {
                    document = res[0] + "\n" + content + "\n\n</body>" + res[1];
                } else {
                    console.log(res.length);
                    console.log("<tsert> Error: Seems like more than one keyword </body> founded");
                };
            } else
                console.log("We can't find any [tsert-here], <footer> or <body> inside the docs");

        };

        if (document == "") {
            console.log("<tsert> Error: Failed to insert.");
        } else {
            fs.writeFile(path, document, 'utf8', function (err) {
                if (err) { console.log(err); }
                else { console.log("<tsert> Success: Insert done! Check " + path) }
                ;
            });
        }

    });
}


