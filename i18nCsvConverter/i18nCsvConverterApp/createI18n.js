'use strict';

const csvToJson = require('csvtojson');
const jsonToProperties = require("properties-file");
const fs = require('fs');
const unicodeToJsEscape = require('unicode-escape');

const filePath = process.argv[2].replace(/\\/g, "/");
const filePathOutput = process.argv[3].replace(/\\/g, "/");

console.log("Filepath to CSV File: " + filePath);

csvToJson().fromFile(filePath).then((jsonObj) => {

    const result = jsonObj.reduce(function (accum, element) {
        const o = null;

        let appName = accum.find(obj => {
            return obj.appName === element.appName;
        });

        if (!appName) {
            // create object and add to right langauge
            let app = {
                appName: element.appName,
            }

            let aLanguages = Object.keys(element);
            aLanguages = aLanguages.filter(function (l) {
                return l !== 'appName' && l !== 'key'
            });

            aLanguages.forEach(function (lang) {
                let key = element.key;
                app[lang] = {};
                app[lang][key] = element[lang];
            });

            accum.push(app);
        } else {
            // add to right langauge array
            let aLanguages = Object.keys(element);
            aLanguages = aLanguages.filter(function (l) {
                return l !== 'appName' && l !== 'key'
            });

            aLanguages.forEach(function (lang) {
                let key = element.key;
                appName[lang][key] = unicodeToJsEscape(element[lang]);
            });
        }

        return accum;
    }, []);


    result.forEach(function (appFile) {
        let aLanguages = Object.keys(appFile);
        aLanguages = aLanguages.filter(function (l) {
            return l !== 'appName'
        });
        let appName = appFile.appName;
        let fullFinalOutputPath = null;
        aLanguages.forEach(function (lang) {
            let fullFinalOutputPath = filePathOutput + appName;
            if (lang === "default") {
                fullFinalOutputPath = fullFinalOutputPath + ".properties";
            } else {
                fullFinalOutputPath = fullFinalOutputPath + "_" + lang + ".properties";
            }

            fs.writeFile(fullFinalOutputPath, jsonToProperties.stringify(appFile[lang]), (err) => {
                if (err) {
                    console.log(err);
                    throw new Error(err);
                }
                console.log('Success!');

            });
        });
    });
});

/*
To assure a correct encoded and escaped non assci values in your i18n.properties files, the following funnctions can be used:

function padWithLeadingZeros(string) {
    return new Array(5 - string.length).join("0") + string;
}

function unicodeCharEscape(charCode) {
    return "\\u" + padWithLeadingZeros(charCode.toString(16));
}

function unicodeEscape(string) {
    return string.split("")
        .map(function (char) {
            var charCode = char.charCodeAt(0);
            return charCode > 127 ? unicodeCharEscape(charCode) : char;
        })
        .join("");
}

And are called as follow:
var specialStr = 'ipsum áá éé lore';
var encodedStr = unicodeEscape(specialStr);

If found this code and trick here:
https://stackoverflow.com/questions/7499473/need-to-escape-non-ascii-characters-in-javascript

This way only the special characters will be "converetd"





An other way to achieve this is via the following npm package:
https://www.npmjs.com/package/unicode-escape
npm install unicode-escape
var unicodeToJsEscape = require('unicode-escape');
unicodeToJsEscape('pasta');
// > \u0070\u0061\u0073\u0074\u0061

/*