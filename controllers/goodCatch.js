const express = require('express');
const router = express.Router();
const GoodCatch = require('../models/goodCatch');

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