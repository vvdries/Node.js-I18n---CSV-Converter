# Just parse .properties files which used in firefox localization

## Install

`npm i properties-file`

## Usage

### Parse .properties file

```js
var parser = require("properties-file");

var object = parser.parse(propertiesFileContents);
// object with key value strings
// for example if you have .properties file:
// str1=text1
// str2=text2
// you will get object like this:
// {
//   "str1": "text1",
//   "str2": "text2"
// }
```

### Generate properties file from object

```js
var parser = require("properties-file");

var string = parser.stringify({
  str1: "text1",
  str2: "text2"
});
// string will be
// str1=text1
// str2=text2
```


