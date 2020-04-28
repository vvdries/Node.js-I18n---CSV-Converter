# Node.js I18n - CSV Converter

Convert i18n files to a single CSV file and back.

The node_modules have been excluded from this git repository.
Please install the required packages as mentioned in the blogs.

The MTA project (created in the SAP Full-Stack WebIDE) has been added to test the conversion.

More information on how about to build and run this app can be found in my SCN blogs:

 [Christmas 🎁 Node.js I18n – CSV Converter – Part 🎄](https://blogs.sap.com/2019/12/21/christmas-%f0%9f%8e%81-node.js-i18n-csv-converter-part-%f0%9f%8e%84/)

 [Christmas 🎁 Node.js I18n – CSV Converter – Part 🎄🎄](https://blogs.sap.com/2019/12/21/christmas-%f0%9f%8e%81-node.js-i18n-csv-converter-part-%f0%9f%8e%84%f0%9f%8e%84/)


 
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