"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var db = require("../models");
module.exports = function (app) {
    app.get("/", function (req, res) {
        db.Burger.findAll({ raw: true }).then((value) => {
            var hbsObject = { burgers: value };
            console.log(hbsObject);
            res.render("index", hbsObject);
        });
    });
    app.post("/api/burgers", function (req, res) {
        console.log(req.body);
        db.Burger.create({
            burger_name: req.body.burger_name,
            isEaten: req.body.isEaten
        }).then(({ insertId }) => {
            res.json({ id: insertId });
        });
    });
    app.put("/api/burgers/:id", function (req, res) {
        db.Burger.update({
            isEaten: req.body.isEaten
        }, { where: { id: req.params.id } }).then(({ changedRows }) => {
            if (changedRows == 0) {
                return res.status(404).end();
            }
            else {
                res.status(200).end();
            }
        });
    });
    app.delete("/api/burgers/:id", function (req, res) {
        db.Burger.destroy({ where: { id: req.params.id } }).then(({ affectedRows }) => {
            if (affectedRows == 0) {
                return res.status(404).end();
            }
            else {
                res.status(200).end();
            }
        });
    });
};
//# sourceMappingURL=burgersController.js.map