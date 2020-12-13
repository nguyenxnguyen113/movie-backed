const Country = require("../models/country");
const slugify = require("slugify");
const shortid = require("shortid");

exports.addCountry = (req, res) => {
  const countryObj = {
    name: req.body.name,
    slug: `${slugify(req.body.name)}-${shortid.generate()}`,
  };

  const cat = new Country(countryObj);
  cat.save((error, country) => {
    if (error) {
      return res.status(400).json({ error });
    }

    if (country) {
      return res.status(200).json({ country });
    }
  });
};

exports.getCountry = (req, res) => {
    Country.find({}).exec((error, countries) => {
    if (error) {
      return res.status(400).json({ error });
    }
    if (countries) {
      return res.status(200).json({ countries });
    }
  });
};

exports.deleteCountryById = (req, res) => {
  const { countryId } = req.body.payload;
  if (countryId) {
    Country.deleteOne({ _id: countryId }).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        res.status(202).json({ result });
      }
    });
  } else {
    res.status(400).json({ error: "Params required" });
  }
};