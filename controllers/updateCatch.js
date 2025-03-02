const express = require('express');
const router = express.Router();
const GoodCatch = require('../models/goodCatch');

router.get('/updateCatch', (req, res) => {
    res.render('goodCatch/updateCatch');
});

router.get('/updateSearch', async (req, res) => {
    const { recordId, creatorId, date, title } = req.query;
    const query = {};

    if (recordId) query._id = recordId;
    if (creatorId) query.user = creatorId;
    if (date) query['events.creationDate'] = { $gte: new Date(date) };
    if (title) query['events.title'] = title;

    try {
        const goodCatches = await GoodCatch.find(query);
        res.render('goodCatch/updateResults', { goodCatches });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/updateForm/:id', async (req, res) => {
    try {
        const goodCatch = await GoodCatch.findById(req.params.id);
        res.render('goodCatch/updateForm', { goodCatch });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/update/:id', async (req, res) => {
    const { site, department, title, description } = req.body;

    try {
        const goodCatch = await GoodCatch.findById(req.params.id);
        goodCatch.site = site;
        goodCatch.department = department;
        goodCatch.title = title;
        goodCatch.description = description;

        await goodCatch.save();
        res.send('Record updated successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;