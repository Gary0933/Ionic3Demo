module.exports = function (ctx) {
  console.info("**Serve Before Script Start");
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
      "public static cordova_dependence = true",
      "public static cordova_dependence = false"
    );
    
    console.log("Open the output console logs");
    data = _.replace(
      data,
      "public static console_overwrite = true",
      "public static console_overwrite = false"
    );

    fs.writeFile(filePath, data, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.info("**Serve Before Script Done");
    });
  });
};
