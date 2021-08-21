const express = require('express')
const util = require('./util')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './assets/images/')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage })

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }));



app.get('/getAllCountriesOrByRank/:rank?', async(req, res) => {
    const rank = parseInt(req.query.rank);
    const countries = await util.getCountries();
    if (!!rank) {
        const filterCountries = {
            country: countries.countries.filter(country => parseInt(country.rank) === rank)[0]
        };
        res.send(filterCountries)

    } else {
        res.send(countries)
    }
});

app.delete('/deleteByRank/:rank?', async(req, res) => {
    const rank = parseInt(req.query.rank);
    const countries = await util.getCountries();
    if (!!rank) {
        const filterCountries = util.writeCountries(JSON.stringify({
            countries: countries.countries.filter(country => parseInt(country.rank) !== rank)

        }));
        const responseMessage = filterCountries ? "Deleted Succcesfully!" : "Sorry,something went wrong while delete operation!"
        res.send(responseMessage)

    } else {
        res.send("Rank is required!")
    }
});

app.post('/addCountry', upload.single('file'), async(req, res) => {
    const flag_path = "images/" + req.file.originalname
    const countries = await util.getCountries();

    if (!req.body.rank) {
        const newRank = Math.max.apply(Math,
            countries.countries.map(country => country.rank)) + 1
        const newCountry = { flag: flag_path, ...req.body, rank: newRank }
        const newCountries = {
            "countries": [
                ...countries.countries,
                newCountry
            ]
        };
        util.writeCountries(JSON.stringify(newCountries));
        res.send(newCountries);
    } else {
        const rank = parseInt(req.body.rank)
        const newCountry = {...req.body, flag: flag_path, rank }
        const existingCountryIndex = countries.countries.findIndex(country => country.rank === rank)
        const updatedCountries = {
            "countries": existingCountryIndex !== -1 ? [
                ...countries.countries.map((country, index) =>
                    index === existingCountryIndex ? newCountry : country
                )
            ] : [
                ...countries.countries,
                newCountry
            ]
        };
        util.writeCountries(JSON.stringify(updatedCountries));
        res.send(updatedCountries);
    }

});

app.listen(3000)