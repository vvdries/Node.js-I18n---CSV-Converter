var
  parser = require("../index"),
  should = require("should"),
  fs = require("fs");

describe("Common", function() {
  it("should parse test file", function() {
    var raw = fs.readFileSync(__dirname + "/test.properties", "utf8");
    var res = parser.parse(raw);
    var strRes = parser.stringify(res);
    strRes.should.equal(fs.readFileSync(__dirname + "/stringify_result.properties", "utf8"));
  });

  it("should stringify object", function() {
    var obj = {
      str1: "text1",
      str2: "text2"
    };
    var res = parser.stringify(obj);
    res.should.equal("str1=text1\nstr2=text2");
  });
});

