const express = require("express");
const router = express.Router();
const GoodCatch = require("../models/goodCatch");
const User = require("../models/user");

router.delete("/delete/:id", async (req, res) => {
  try {
    const goodCatchId = req.params.id;
    const deletedGoodCatch = await GoodCatch.findByIdAndDelete(goodCatchId);
    if (!deletedGoodCatch) {
      return res.status(404).json({ message: "Good Catch not found" });
    }
    res.status(200).json({ message: "Good Catch deleted successfully" });
  } catch (error) {
    console.error("Error deleting Good Catch:", error);
    res.status(500).json({ message: "Failed to delete Good Catch" });
  }
});

const {
  companySites,
  eventCategories,
  corpDepartments,
} = require("../constants");

router.get("/createCatch", (req, res) => {
  res.render("goodCatch/createCatch", {
    companySites,
    eventCategories,
    corpDepartments,
    successMessage: "",
  });
});

router.post("/create", async (req, res) => {
  try {
    const { site, department, event, description } = req.body;

    const newGoodCatch = new GoodCatch({
      site,
      department,
      events: [{ event, description }],
    });

    await newGoodCatch.save();
    res.render("goodCatch/createCatch", {
      companySites,
      eventCategories,
      corpDepartments,
      successMessage: "Record successfully created!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

router.get("/updateCatch", async (req, res) => {
  try {
    const goodCatches = await GoodCatch.find({});
    res.render("goodCatch/updateCatch", { goodCatches });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Render the search form
router.get("/search", async (req, res) => {
  try {
    const results = await GoodCatch.find({}).populate("creationUser"); // ✅ Fetch all records
    res.render("goodCatch/readCatch", { goodCatches: results });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/delete", (req, res) => {
  res.render("goodCatch/deleteCatch");
});

router.post("/deleteCatch", async (req, res) => {
  try {
    const { recordId } = req.body;
    const deletedGoodCatch = await GoodCatch.findByIdAndDelete(recordId);

    if (!deletedGoodCatch) {
      return res.send("Record not found.");
    }

    res.send("Record deleted successfully.");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Handle the search query and display results
router.get("/search-results", async (req, res) => {
  try {
    const { startDate, endDate, site, department, creationUser, category } =
      req.query;
    const query = {};

    if (startDate) {
      query["events.creationDate"] = { $gte: new Date(startDate) };
    }
    if (endDate) {
      query["events.creationDate"] = {
        ...query["events.creationDate"],
        $lte: new Date(endDate),
      };
    }
    if (site) {
      query.site = site;
    }
    if (department) {
      query.department = department;
    }
    if (creationUser) {
      query.creationUser = creationUser;
    }
    if (category) {
      query["events.event"] = category; // Assuming "event" field in eventSchema stores the category
    }

    const results = await GoodCatch.find(query).populate({
      path: "creationUser", // Populate the creationUser field in the GoodCatch model
      populate: {
        path: "creationUser", // Populate the creationUser field within the User model
      },
    });

    res.render("goodCatch/results", { results });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// router.delete("/:id", deleteCatch);

module.exports = router;
