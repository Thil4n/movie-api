const string = require("./string");
const fs = require("fs");

const upload = (file, dir = "", randomeName = true, fileName = "") => {
    return new Promise((resolve, reject) => {
        const path = __dirname + "/../public/img/" + dir + "/";

        const fileName = string.sliceFileName(file.name);

        let base = randomeName
            ? string.randomString(20)
            : string.clean(fileName.base);

        if (fs.existsSync(path + base + "." + fileName.ext))
            base += "-" + string.randomString(5);

        const outputName = base + "." + fileName.ext;
        const outputPath = path + base + "." + fileName.ext;

        file.mv(outputPath, (error) => {
            console.log(outputPath);
            if (error) return reject(error);
            return resolve(outputName);
        });
    });
};

module.exports = {
    upload,
};
