module.exports = function (ctx) {
  console.info("**Build Before Script Start");
  
  const fs = require("fs");
  const _ = require("lodash");
  const path = require("path");
  const filePath = path.join(__dirname,"..","environments","environment.ts")
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    data = _.replace(
      data,
      "public static cordova_dependence = false",
      "public static cordova_dependence = true"
    );
    if((ctx.argv).indexOf('--prod')>0){
      console.log("production package with --prod");
      console.log("Remove the vconsole");
      data = _.replace(
        data,
        "public static vconsole = true",
        "public static vconsole = false"
      );
      console.log("Close the output console logs");
      data = _.replace(
        data,
        "public static console_overwrite = false",
        "public static console_overwrite = true"
      );
    }else{
      console.log("No production package");
      console.log("Add the vconsole");
      data = _.replace(
        data,
        "public static vconsole = false",
        "public static vconsole = true"
      );
      console.log("Open the output console logs");
      data = _.replace(
        data,
        "public static console_overwrite = true",
        "public static console_overwrite = false"
      );
    }
    console.info(data);
    fs.writeFile(filePath, data, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.info("**Build Before Script Done");
    });
  });
};
