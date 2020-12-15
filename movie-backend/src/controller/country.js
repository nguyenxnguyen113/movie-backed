const Country = require("../models/country");
const slugify = require("slugify");
const shortid = require("shortid");
const mongoose = require('mongoose');
const country = require("../models/country");

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

exports.getCountry = async (req, res) => {
  console.log(req.query);
  const {limit} = req.query
  if(!limit){
    const PAGE_SIZE = 3;
    const page = parseInt(req.query.page || "0");
    const total = await Country.countDocuments({});
    Country.find({}).limit(PAGE_SIZE).skip(PAGE_SIZE * page).exec((error, countries) => {
      if (error) {
        return res.status(400).json({ error });
      }
      if (countries) {
        return res.status(200).json({ totalPages: Math.ceil(total / PAGE_SIZE), countries });
      }
    });
  }else{
    country.find({}).exec((err,countries)=>{
      if(err) res.status(500).json({message:"server error"})
      else res.status(200).json({countries})
    })
  }
  
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

exports.updateCountryById = (req, res) => {
  Country.findById(mongoose.Types.ObjectId(req.params.id))
    .then(country => {
      country.name = req.body.name;

      country.save()
        .then(() => res.json('country updated !'))
        .catch(err => res.status(400).json('country: ' + err));
    }).catch(err => res.status(400).json('error: ' + err));
}
exports.getCountryById = (req, res) => {
  const id = mongoose.Types.ObjectId(req.params.id)
  Country.aggregate(
    [
      {
        $match: {
          _id: id
        },
      }
    ])
    .then(product => { console.log(product); res.json(product[0]) })
    .catch(err => res.status(400).json('Error: ' + err));
};