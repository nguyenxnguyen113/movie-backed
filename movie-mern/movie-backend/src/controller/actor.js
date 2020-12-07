const Actor = require("../models/actor");
const slugify = require("slugify");
const shortid = require("shortid");

exports.addActor = (req, res) => {
  const actorObj = {
    name: req.body.name,
    avartar: req.body.avartar,
    slug: `${slugify(req.body.name)}-${shortid.generate()}`,
  };

  const actor = new Actor(actorObj);
  actor.save((error, actor) => {
    if (error) {
      return res.status(400).json({ error });
    }

    if (actor) {
      return res.status(200).json({ actor });
    }
  });
};

exports.getActor = (req, res) => {
    Actor.find({}).exec((error, actors) => {
      if (error) {
        return res.status(400).json({ error });
      }
      if (actors) {
        return res.status(200).json({ actors });
      }
    });
  };
  