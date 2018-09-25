
// Import the model (burger.js) to use its database functions.
var db = require("../models");

module.exports = function(app) {
  // Create all our routes and set up logic within those routes where required.
  app.get("/", function(req, res) {
    db.Burger.findAll({raw: true}).then((value) => {
      var hbsObject = {burgers: value};
      console.log(hbsObject);
      res.render("index", hbsObject);
    });
  });

  app.post("/api/burgers", function(req, res) {
    console.log(req.body);
    db.Burger.create({
      burger_name: req.body.burger_name,
      isEaten:req.body.isEaten
    }).then((value) => {
      res.json({ id: value.insertId });
    });
  });

  app.put("/api/burgers/:id", function(req, res) {

    db.Burger.update({
      isEaten: req.body.isEaten
    }, {where:{id: req.params.id}}).then((value) => {
      if (value.changedRows == 0) {
        // If no rows were changed, then the ID must not exist, so 404
        return res.status(404).end();
      } else {
        res.status(200).end();
      }
    });
  });

  app.delete("/api/burgers/:id", function(req, res) {

    db.Burger.destroy({where: {id: req.params.id}}).then((value) => {
      if (value.affectedRows == 0) {
        // If no rows were changed, then the ID must not exist, so 404
        return res.status(404).end();
      } else {
        res.status(200).end();
      }
    });
    
  });

};