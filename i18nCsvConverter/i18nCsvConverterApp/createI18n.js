'use strict';

const csvToJson = require('csvtojson');
const jsonToProperties = require("properties-file");
const fs = require('fs');

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
            aLanguages = aLanguages.filter(function (l) { return l !== 'appName' && l !== 'key' });

            aLanguages.forEach(function (lang) {
                let key = element.key;
                app[lang] = {};
                app[lang][key] = element[lang];
            });

            accum.push(app);
        }
        else {
            // add to right langauge array
            let aLanguages = Object.keys(element);
            aLanguages = aLanguages.filter(function (l) { return l !== 'appName' && l !== 'key' });

            aLanguages.forEach(function (lang) {
                let key = element.key;
                appName[lang][key] = element[lang];
            });
        }

        return accum;
    }, []);


    result.forEach(function (appFile) {
        let aLanguages = Object.keys(appFile);
        aLanguages = aLanguages.filter(function (l) { return l !== 'appName'});
        let appName = appFile.appName;
        let fullFinalOutputPath = null;
        aLanguages.forEach(function (lang) {
            let fullFinalOutputPath = filePathOutput + appName ;
            if(lang === "default") {
                fullFinalOutputPath = fullFinalOutputPath + ".properties";
            }
            else {
                fullFinalOutputPath = fullFinalOutputPath + "_" + lang +".properties";
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