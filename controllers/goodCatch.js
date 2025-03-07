const express = require("express");
const router = express.Router();
const GoodCatch = require("../models/goodCatch");
const {
  companySites,
  corpDepartments,
  eventCategories,
} = require("../constants");

// Dashboard
router.get("/", async (req, res) => {
  try {
    const userGoodCatches = await GoodCatch.find({
      creationUser: req.session.user._id,
    });
    const totalCount = userGoodCatches.length;

    const categoryCounts = {};
    userGoodCatches.forEach((gc) => {
      const category = gc.events[0].event;
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    res.render("goodCatch/index", {
      user: req.session.user,
      totalCount,
      categoryCounts, // Make sure to include this
      goodCatches: userGoodCatches,
    });
  } catch (err) {
    console.error("Error in dashboard route:", err);
    res.status(500).send("An error occurred while fetching your Good Catches.");
  }
});

// New Good Catch Form
router.get("/new", (req, res) => {
  try {
    res.render("goodCatch/new", {   // was "goodCatch/new"
      successMessage: "",
      user: req.session.user,
      companySites, // Pass the companySites array
      corpDepartments, // Pass the corpDepartments array
      eventCategories, // Pass the eventCategories array
    });
  } catch (error) {
    console.error("Error rendering new catch view:", error);
    res.status(500).send("An error occurred while displaying the new form.");
  }
});

// Submit a New Good Catch
router.post("/", async (req, res) => {
  console.log()
  try {
    const newGoodCatch = new GoodCatch({
      site: req.body.site,
      department: req.body.department,
      events: [{ event: req.body.event, description: req.body.description }],
      creationUser: req.session.user._id,
    });

    await newGoodCatch.save();
    res.redirect(`/users/${req.session.user._id}/catches`); // Redirect to user's catches
  } catch (err) {
    console.error("Error creating a new Good Catch:", err);
    res.status(500).send("An error occurred while creating the Good Catch.");
  }
});

// Search Good Catches
router.get("/search", async (req, res) => {
  try {
    const query = { creationUser: req.session.user._id }; // Filter by logged-in user

    if (req.query.site) query.site = req.query.site;
    if (req.query.department) query.department = req.query.department;
    if (req.query.category) query["events.event"] = req.query.category;

    const results = await GoodCatch.find(query);
    res.render("goodCatch/results", { goodCatches: results });
  } catch (err) {
    console.error("Error searching for Good Catches:", err);
    res.status(500).send("An error occurred while searching for Good Catches.");
  }
});

// Edit Form
router.get("/:id/edit", async (req, res) => {
  try {
    const goodCatch = await GoodCatch.findOne({
      _id: req.params.id,
      creationUser: req.session.user._id,
    });
    if (!goodCatch) return res.status(404).send("Not Found");

    res.render("goodCatch/editCatch", { goodCatch }); // Updated view name
  } catch (err) {
    console.error("Error fetching Good Catch for editing:", err);
    res
      .status(500)
      .send("An error occurred while fetching the Good Catch for editing.");
  }
});

// Update Good Catch
router.put("/:id", async (req, res) => {
  try {
    const updatedGoodCatch = await GoodCatch.findOneAndUpdate(
      { _id: req.params.id, creationUser: req.session.user._id },
      {
        site: req.body.site,
        department: req.body.department,
        "events.0.event": req.body.event,
        "events.0.description": req.body.description,
      },
      { new: true }
    );

    if (!updatedGoodCatch) return res.status(404).send("Not Found");

    res.redirect(`/users/${req.session.user._id}/catches`); // Redirect to user's catches
  } catch (err) {
    console.error("Error updating Good Catch:", err);
    res.status(500).send("An error occurred while updating the Good Catch.");
  }
});

// Delete Good Catch
router.delete("/:id", async (req, res) => {
  try {
    const deletedGoodCatch = await GoodCatch.findOneAndDelete({
      _id: req.params.id,
      creationUser: req.session.user._id,
    });

    if (!deletedGoodCatch) return res.status(404).send("Not Found");

    res.redirect(`/users/${req.session.user._id}/catches`); // Redirect to user's catches
  } catch (err) {
    console.error("Error deleting Good Catch:", err);
    res.status(500).send("An error occurred while deleting the Good Catch.");
  }
});

module.exports = router;
