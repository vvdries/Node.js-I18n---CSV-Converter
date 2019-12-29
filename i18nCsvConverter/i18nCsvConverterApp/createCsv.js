'use strict';

const fs = require('fs');
const rra = require('recursive-readdir-async');
const propertiesToJSON = require("properties-to-json");
const jsonexport = require('jsonexport');

const filePath = process.argv[2].replace(/\\/g, "/");

console.log("Filepath to search for i18n files: " + filePath);

const options = {
    mode: rra.LIST,
    recursive: true,
    stats: false,
    ignoreFolders: true,
    extensions: false,
    deep: false,
    realPath: true,
    normalizePath: true,
    include: [".properties"],
    exclude: [],
    readContent: false,
    encoding: 'base64'
}

rra.list(filePath, options).then(function (list) {
    const i18nFiles = list.filter(file => file.path.substring(file.path.length - 5) === "/i18n");

    let aPromises = i18nFiles.map(file => {

        let appPath = file.fullname.split(filePath)[1].replace(/(_[a-zA-Z]{2}){0,2}.properties/, "");

        let language = file.fullname.match(/(_[a-zA-Z]{2}){0,2}.properties/)[0].replace(".properties", "").substring(1) || "default";

        let promise = new Promise(function (resolve, reject) {
            fs.readFile(file.fullname, 'utf-8', function (err, data) {
                resolve({ appPath: appPath, language: language, data: propertiesToJSON(data) });
            });
        });
        return promise;
    });

    Promise.all(aPromises).then(function (result) {

        let aTranslationEntries = [];
        result.forEach(function (file) {
            Object.keys(file.data).forEach(function (key) {
                let foundTranslation = aTranslationEntries.filter(entry => entry.key === key && entry.appName === file.appPath)[0];
                if (foundTranslation) {
                    foundTranslation[[file.language]] = file.data[key];
                }
                else {
                    aTranslationEntries.push({
                        appName: file.appPath,
                        key: key,
                        [[file.language]]: file.data[key]
                    });
                }
            });
        });

        jsonexport(aTranslationEntries, function (err, csv) {
            const sPath = filePath.match(/^(.*[\\\/])[^\\\/]*$/)[1] + "translationFileI18n.csv";
            // console.log(csv);

            // IMPORTANT to pass \ufeff to tell csv that it is UTF-8
            fs.writeFile(sPath, "\ufeff" + csv, (err) => {
                if (err) {
                    console.log(err); // Do something to handle the error or just throw it
                    throw new Error(err);
                }
                // console.log('Success!');
            });
        });
    });
});