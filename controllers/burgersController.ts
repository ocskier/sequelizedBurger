// Our Burger controller
// =====================
const express = require('express');
const Sequelize = require('sequelize');
const router = express.Router();
import { Request, Response } from 'express';
import { BurgerType } from '../models/burger';
import { Model } from 'sequelize';

// grabbing our models
const db = require('../models');

// get route -> index
router.get('/', (req: Request, res: Response) => {
  // send us to the next get function instead.
  res.redirect('/burgers');
});

// get route, edited to match sequelize
router.get('/burgers', async (req: Request, res: Response) => {
  try {
    const dbBurgers = await db.Burger.findAll({
      include: [
        {
          model: db.Customer,
          attributes: ['id', 'customer', 'numBurgersEaten'],
        },
      ],
      // Here we specify we want to return our burgers in ordered by ascending burger_name
      order: [['burger_name', 'ASC']],
    }).map((el: Model) => el.get({ plain: true })); // https://stackoverflow.com/questions/46380563/get-only-datavalues-from-sequelize-orm

    // into the main index, updating the page
    const hbsObject = {
      burgers: dbBurgers,
    };
    return res.render('index', hbsObject);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get('/customers', async (req: Request, res: Response) => {
  try {
    const dbCustomers = await db.Customer.findAll({
      include: [
        {
          model: db.Burger,
          attributes: ['id', 'burger_name'],
        },
      ],
      // Here we specify we want to return our burgers in ordered by ascending burger_name
      order: [['customer', 'ASC']],
      // raw: true,
    }).map((el: Model) => el.get({ plain: true }));
    console.log(dbCustomers);
    const hbsObject = {
      customers: dbCustomers,
    };
    return res.render('customer', hbsObject);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// post route to create burgers
router.post('api/burgers/create', async (req: Request, res: Response) => {
  // edited burger create to add in a burger_name
  const newBurger = new db.Burger({
    burger_name: req.body.burger_name,
  });
  try {
    const dbBurger = await newBurger.save();
    // redirect
    res.redirect('/');
  } catch (err) {
    res.status(500).json(err);
  }
});

// put route to devour a burger
router.put('api/burgers/update', async (req: Request, res: Response) => {
  // If we are given a customer, create the customer and give them this devoured burger
  console.log(req.body);
  if (req.body.customer) {
    try {
      const result = await db.Customer.findOrCreate({
        where: {
          customer: req.body.customer,
        },
        defaults: {
          customer: req.body.customer,
        },
        raw: true,
      });
      console.log(result); // destructure array below
      const [dbCustomer, created] = result;

      if (!created) {
        // false if author already exists and was not created.
        console.log('Customer already exists');
      } else {
        console.log('Created customer...');
      }

      const dbBurger = await db.Burger.update(
        {
          devoured: true,
          CustomerId: dbCustomer.id,
        },
        {
          where: {
            id: req.body.burger_id,
          },
        }
      );

      const customerUpdate = await db.Customer.update(
        { numBurgersEaten: Sequelize.literal('numBurgersEaten + 1') },
        { where: { id: dbCustomer.id } }
      );

      res.json('/');
    } catch (err) {
      return res.status(500).json(err);
    }
  }
  // If we aren't given a customer, just update the burger to be devoured
  else {
    // older way of handling promises
    db.Burger.update(
      {
        devoured: true,
      },
      {
        where: {
          id: req.body.burger_id,
        },
      }
    )
      .then(function (dbBurger: BurgerType) {
        res.json('/');
      })
      .catch((err: Error) => {
        return res.status(500).json(err);
      });
  }
});

router.delete('/api/burgers/:id', async (req: Request, res: Response) => {
  const { affectedRows }: { affectedRows: number } = db.Burger.destroy({ where: { id: req.params.id } });
  if (affectedRows == 0) {
    // If no rows were changed, then the ID must not exist, so 404
    return res.status(404).end();
  } else {
    res.status(200).end();
  }
});

module.exports = router;
