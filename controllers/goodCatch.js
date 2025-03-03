const express = require('express');
const router = express.Router();
const GoodCatch = require('../models/goodCatch');
const { companySites, eventCategories, corpDepartments } = require('../constants');

// Render createCatch form
router.get('/createCatch', (req, res) => {
    res.render('goodCatch/createCatch', {
        companySites,
        eventCategories,
        corpDepartments
    });
});

// Create a new good catch
router.post('/create', async (req, res) => {
    const { site, department, event, description } = req.body;

    const newGoodCatch = new GoodCatch({
        site,
        department,
        events: [{
            event,
            description
        }]
    });

    try {
        await newGoodCatch.save();
        res.redirect('/goodCatch/readCatch');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Read good catch records from the past 30 days
router.get('/readCatch', async (req, res) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    try {
        const goodCatches = await GoodCatch.find({ 'events.creationDate': { $gte: thirtyDaysAgo } });
        res.render('goodCatch/readCatch', { goodCatches });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Search good catch records
router.get('/search', async (req, res) => {
    const { user, site, area, department, date } = req.query;
    const query = {};

    if (user) query.user = user;
    if (site) query.site = site;
    if (area) query.area = area;
    if (department) query.department = department;
    if (date) query['events.creationDate'] = { $gte: new Date(date) };

    try {
        const goodCatches = await GoodCatch.find(query);
        res.render('goodCatch/readCatch', { goodCatches });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
