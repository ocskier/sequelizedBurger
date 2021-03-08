// Burger controller
const express = require('express');
const Sequelize = require('sequelize');
const router = express.Router();
import { Request, Response } from 'express';
import { BurgerType } from '../models/burger';
import { Model } from 'sequelize';

const db = require('../models');

router.get('/', (req: Request, res: Response) => {
  res.redirect('/burgers');
});

router.get('/burgers', async (req: Request, res: Response) => {
  try {
    const dbBurgers = await db.Burger.findAll({
      include: [
        {
          model: db.Customer,
          attributes: ['id', 'customer', 'numBurgersEaten'],
        },
      ],
      order: [['burger_name', 'ASC']],
    });
    const hbsObject = {
      burgers: dbBurgers.map((el: Model) => el.get({ plain: true })),
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
      order: [['customer', 'ASC']],
    });
    const hbsObject = {
      customers: dbCustomers.map((el: Model) => el.get({ plain: true })),
    };
    return res.render('customer', hbsObject);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post('/api/burgers/create', async (req: Request, res: Response) => {
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

router.put('/api/burgers/update', async (req: Request, res: Response) => {
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
      const [dbCustomer, created] = result;

      if (!created) {
        console.log('Customer already exists');
      } else {
        console.log('Created customer...');
      }

      const dbBurger = await db.Burger.update(
        {
          isEaten: true,
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
      res.status(500).json(err);
    }
  }
  // If we aren't given a customer, just update the burger to be devoured
  else {
    try {
      const dbBurger: BurgerType = await db.Burger.update(
        {
          isEaten: true,
        },
        {
          where: {
            id: req.body.burger_id,
          },
        }
      );
      res.json('/');
    } catch (err) {
        res.status(500).json(err);
    };
  }
});

router.delete('/api/burgers/:id', async (req: Request, res: Response) => {
  try {
    const { affectedRows }: { affectedRows: number } = await db.Burger.destroy({ where: { id: req.params.id } });
    if (affectedRows == 0) {
      return res.status(404).end();
    } else {
      res.status(200).end();
    }
  } catch(err) {
    res.status(500).json(err);
  }
});

module.exports = router;
