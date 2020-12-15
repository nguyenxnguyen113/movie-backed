const Product = require("../models/product");
const mongoose = require('mongoose')
const shortid = require("shortid");
const { default: slugify } = require("slugify");
const { Mongoose } = require("mongoose");
const actor = require("../models/actor");
const product = require("../models/product");

exports.createProduct = (req, res) => {
  // res.status(200).json({file: req.file, body: req.body})
  const { name, ename, description, categories, actors, countries, url,streamTapeId, img, largerImg, year, vote } = req.body;

  const product = new Product({
    name: name,
    slug: slugify(name),
    ename,
    img,
    largerImg,
    description,
    url,
    streamTapeId,
    year,
    categories,
    actors,
    countries,
    vote
  });

  product.save((error, product) => {
    if (error) {
      return res.status(400).json({ error });
    }
    if (product) {
      return res.status(201).json({ product });
    }
  });
};

exports.getProduct = async (req, res) => {
  const PAGE_SIZE = 3;
  const page = parseInt(req.query.page || "0");
  const total = await Product.countDocuments({});
  Product.find({}).limit(PAGE_SIZE).skip(PAGE_SIZE * page).exec((error, products) => {
    if (error) {
      return res.status(400).json({ error });
    }
    if (products) {
      return res.status(200).json({ totalPages: Math.ceil(total / PAGE_SIZE), products });
    }
  });
};

exports.getProductByQuery = async (req, res) => {
  const { limit, page, actor, category, year, sort ,country } = req.query;
  let _year = undefined
  let _category = undefined
  let _country = undefined
  if(category!=="default"&&category!==""){
    _category = category
  }
  if(country!=="default"&&country!==""){
    _country = country
  }
  if(year !== "default" && year!== ""){
    _year = year
  }
  console.log(req.query);
  const all = await Product.find({}).count()
  const arrProduct = []
  if (sort == "date") {
    arrProduct.push({
      $sort: {
        cratedAt: -1
      }
    })
  }
  if (sort == "vote") {
    arrProduct.push({
      $sort: {
        cratedAt: -1
      }
    })
  }
  if (page && limit) {
    arrProduct.push({ $skip: limit * (page - 1) })
  }
  if (limit) {
    arrProduct.push({ $limit: parseInt(limit) })
  }
  let getAverageVote = [
    {
      $unwind: "$votes"
    },
    {
      $group: {
        _id: "$_id",
        categories: { "$first": "$categories" },
        country: { "$first": "$countries" },
        actors: { "$first": "$actors" },
        name: { "$first": "$name" },
        ename: { "$first": "$ename" },
        slug: { "$first": "$slug" },
        img: { "$first": "$img" },
        largerImg: { "$first": "$largerImg" },
        description: { "$first": "$description" },
        url: { "$first": "$url" },
        streamTapeId:{"$first":"$streamTapeId"},
        comments: { "$first": "$comments" },
        createdAt: { "$first": "$createdAt" },
        updatedAt: { "$first": "$updatedAt" },
        voteLength: { "$sum": 1 },
        sumVotes: { "$sum": "$votes.vote" },
      }
    },
    {
      $addFields: {
        "averageVote": {
          "$divide": ["$sumVotes", "$voteLength"]
        }
      }
    }
  ]
  if (actor) {
    arrProduct.push({ $match: { actors: mongoose.Types.ObjectId(actor) } })
  }
  if (_category!==undefined) {
    arrProduct.push({ $match: { categories: mongoose.Types.ObjectId(_category) } })
  }
  if (_country){
    arrProduct.push({ $match: { countries: mongoose.Types.ObjectId(_country) } })
  }
  if (_year) {
    arrProduct.push({ $match: { year: parseInt(_year) } })
  }
  arrProduct.push(...getAverageVote)
  console.log(arrProduct);
  await Product.aggregate(arrProduct).exec((err, products) => {
    if (err) {
      return res.status(400).json({ err: err })
    }
    if (products) {
      // console.log(voteAverage(products))
      return res.status(200).json({ total:all,product: products })
    }
  })
}

exports.vote = (req, res) => {
  const { idFilm, idUser, vote } = req.body
  Product.update(
    {
      _id: mongoose.Types.ObjectId(idFilm),
      votes: {
        $elemMatch: {
          userId: mongoose.Types.ObjectId(idUser)
        }
      }
    }, {
    $set: {
      "votes.$.vote": vote
    }
  }
  ).exec((err, product) => {
    if (err) {
      return res.status(400).json({ err: err })
    }
    if (product) {
      if (product.n <= 0) {
        Product.updateOne(
          { _id: mongoose.Types.ObjectId(idFilm) },
          { $push: { votes: { userId: mongoose.Types.ObjectId(idUser), vote: vote } } }
        ).exec((err, result) => {
          if (err) {
            return res.status(400).json({ err: err })
          }
           else if (result) {
            return res.status(200).json({ message: "vote successfully" })
          }
        })
      }
      else {
        return res.status(200).json({message:"update vote successfully"})
      }
    }
  })
}

exports.getProductById = (req, res) => {
  const id = mongoose.Types.ObjectId(req.query.id)
  Product.aggregate(
    [
      {
        $match: {
          _id: id
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categories',
          foreignField: '_id',
          as: 'categories'
        }
      },
      {
        $lookup: {
          from: 'actors',
          localField: 'actors',
          foreignField: '_id',
          as: 'actors'
        }
      },
      {
        $lookup: {
          from: 'countries',
          localField: 'countries',
          foreignField: '_id',
          as: 'countries'
        }
      },
      {
        $unwind: "$votes"
      },
      {
        $group: {
          _id: "$_id",
          categories: { "$first": "$categories" },
          country: { "$first": "$countries" },
          actors: { "$first": "$actors" },
          name: { "$first": "$name" },
          ename: { "$first": "$ename" },
          slug: { "$first": "$slug" },
          img: { "$first": "$img" },
          largerImg: { "$first": "$largerImg" },
          description: { "$first": "$description" },
          url: { "$first": "$url" },
          streamTapeId:{"$first":"$streamTapeId"},
          comments: { "$first": "$comments" },
          createdAt: { "$first": "$createdAt" },
          updatedAt: { "$first": "$updatedAt" },
          voteLength: { "$sum": 1 },
          sumVotes: { "$sum": "$votes.vote" },
        // $addFields: {
        //   nameCategories: "$lookupNameCategories.name",
        //   nameCountries: "$lookupNameCountries.name",
        //   nameActors: "$lookupNameActors.name, $lookupNameActors.avatar",
        }
      },
      {
        $addFields: {
          "averageVote": {
            "$divide": ["$sumVotes", "$voteLength"]
          }
        }
      }
    ])
    
    .then(product => res.json(product[0]))
    .catch(err => res.status(400).json('Error: ' + err));
};
exports.deleteProductById = (req, res) => {
  const { productId } = req.body.payload;
  if (productId) {
    Product.deleteOne({ _id: productId }).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        res.status(202).json({ result });
      }
    });
  } else {
    res.status(400).json({ error: "Params required" });
  }
};

exports.updateProductById = (req, res) => {
  Product.findById(mongoose.Types.ObjectId(req.params.id))
    .then(product => {
      product.name = req.body.name;
      product.ename = req.body.ename;
      product.description = req.body.description;
      product.categories = req.body.categories;
      product.categories = req.body.categories;
      product.actors = req.body.actors;
      product.countries = req.body.countries;
      product.url = req.body.url;
      product.streamTapeId = req.streamTapeId;
      product.img = req.body.img;
      product.streamTapeId = req.body.streamTapeId;
      product.largerImg = req.body.largerImg;
      product.year = req.body.year;
      product.save()
        .then(() => res.json('film updated !'))
        .catch(err => res.status(400).json('Error: ' + err));
    }).catch(err => res.status(400).json('Error: ' + err));
}

exports.createComment = (req, res) => {
  const { id, userId, comment } = req.body
  product.updateOne(
    {
      _id: mongoose.Types.ObjectId(id)
    },
    {
      $push: {
        comments: {
          userId: userId,
          comment: comment
        }
      }
    }
  ).exec((err, product) => {
    if (err) res.status(500).json('Internal server error')
    else res.status(200).json('comment successfully')
  })
}
exports.getComment = (req, res) => {
  const {id,limit} = req.query;
  const pipleline = [
    {
      $match:{
        _id:mongoose.Types.ObjectId(id)
      }
    },
    {
      $project:{
        "comments":{
          $reverseArray:"$comments"
        }
      }
    },
    {
      $unwind: {
        path:"$comments"
      }
    },
    {
      $lookup:{
        from:"users",
        localField:"comments.userId",
        foreignField:"_id",
        as:'comments.user'
      }
    },
    {
      $project:{
        "comments":1
      }
    },
    {
      $group:{
        _id:"$_id",
        "comments":{
          "$push":"$comments"
        }
      }
    },
    {
      $project:{
        "comments.user.hash_password":0,
        "comments.userId":0, 
      }
    }
  ]
  pipleline.splice(3,0,{
    $limit: parseInt(limit)
  })
  Product.aggregate(pipleline).exec((err,comment)=>{
    if(err) res.status(500).json({message:"server error"})
    else {
      if(comment.length>0){
        res.status(200).json({comments: comment[0].comments})
      }
      else res.status(200).json({comments:[]})
    }
  })
}

exports.searchFilm = (res,req)=>{
    console.log(req.body);
}