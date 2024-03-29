const randomString = (length = 50, lowercase = true) => {
    var result = "";
    const characters = lowercase
        ? "abcdefghijklmnopqrstuvwxyz0123456789"
        : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
};
const clean = (string) => {
    return string
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
};

const sliceFileName = (filename) => {
    pos = filename.lastIndexOf(".");

    return {
        base: filename.slice(0, pos),
        ext: filename.slice(pos + 1),
    };
};

module.exports = {
    randomString,
    clean,
    sliceFileName,
};
