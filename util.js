const fs = require("fs");
const getCountries = async() => {
    const countries = await fs.readFileSync("./assets/data/data.json", "utf8", (err, jsonString) => {
        if (err) {
            console.error("File read failed:", err);
            return;
        }
        return jsonString
    });
    return JSON.parse(countries);
};

const writeCountries = async(data) => {
    const countries = await fs.writeFileSync("./assets/data/data.json", data, "utf8", (err, jsonString) => {
        if (err) {
            console.error("File read failed:", err);
            return false;
        }
        return true
    });
    return countries;
};
module.exports = { getCountries, writeCountries }