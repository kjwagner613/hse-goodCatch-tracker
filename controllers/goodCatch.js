const express = require("express");
const router = express.Router();
const GoodCatch = require("../models/goodCatch");
const deleteCatch = require("../controllers/deleteCatch");

const {
  companySites,
  eventCategories,
  corpDepartments,
} = require("../constants");

// Render createCatch form
router.get("/createCatch", (req, res) => {
  res.render("goodCatch/createCatch", {
    companySites,
    eventCategories,
    corpDepartments,
  });
});

// Create a new good catch
router.post("/create", async (req, res) => {
  const { site, department, event, description } = req.body;

  const newGoodCatch = new GoodCatch({
    site,
    department,
    events: [
      {
        event,
        description,
      },
    ],
  });

  try {
    await newGoodCatch.save();
    res.redirect("/"); // Redirect to the home screen after creating a good catch
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Search good catch records
router.get("/search", async (req, res) => {
  const { startDate, endDate, user, site, department } = req.query;
  const query = {};

  if (startDate) query["events.creationDate"] = { $gte: new Date(startDate) };
  if (endDate)
    query["events.creationDate"] = {
      ...query["events.creationDate"],
      $lte: new Date(endDate),
    };
  if (user) query.user = user;
  if (site && site !== "") query.site = site;
  if (department && department !== "") query.department = department;

  console.log("Search query:", query);

  try {
    const goodCatches = await GoodCatch.find(query);
    res.render("goodCatch/readCatch", {
      goodCatches,
      companySites,
      eventCategories,
      corpDepartments,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.delete("/:id", deleteCatch);

module.exports = router;
