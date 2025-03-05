const express = require("express");
const router = express.Router();
const GoodCatch = require("../models/goodCatch");
const User = require("../models/user");

router.delete("/deleteCatch", async (req, res) => {
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

router.put("/updateCatch/:id", async (req, res) => {
  try {
    const goodCatchId = req.params.id;
    const updatedData = {
      site: req.body.site,
      department: req.body.department,
      events: [{ event: req.body.event, description: req.body.description }]
    };
    const updatedGoodCatch = await GoodCatch.findByIdAndUpdate(goodCatchId, updatedData, { new: true });

    if (!updatedGoodCatch) {
      return res.status(404).json({ message: "Good Catch not found" });
    }

    res.status(200).json({ message: "Good Catch updated successfully", updatedGoodCatch });
  } catch (error) {
    console.error("Error updating Good Catch:", error);
    res.status(500).json({ message: "Failed to update Good Catch" });
  }
});



router.get("/updateSearch", async (req, res) => {
  try {
    const recordId = req.query.recordId;
    const goodCatch = await GoodCatch.findById(recordId);

    if (!goodCatch) {
      return res.status(404).send("Good Catch not found.");
    }

    res.render("goodCatch/updateCatch", { goodCatch });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/updateCatch/:id", async (req, res) => {
  try {
    const recordId = req.params.id;
    const goodCatch = await GoodCatch.findById(recordId);

    if (!goodCatch) {
      return res.status(404).send("Good Catch not found.");
    }

    res.render("goodCatch/updateCatch", { goodCatch });
  } catch (err) {
    res.status(500).send(err.message);
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


router.get("/search", async (req, res) => {
  try {
    const query = {};

    if (req.query.site) {
      query.site = req.query.site;
    }
    if (req.query.department) {
      query.department = req.query.department;
    }
    if (req.query.category) {
      query["events.event"] = req.query.category;
    }

    console.log("Search Query:", query); // Debugging line
    const hasQueryParameters = Object.keys(req.query).length > 0;

    let results = [];
    if (hasQueryParameters) {
      results = await GoodCatch.find(query).populate("creationUser");
    }

    console.log("Search Results:", results); // Debugging line

    res.render("goodCatch/search", {
      goodCatches: results,
      hasQueryParameters,
      companySites: req.app.locals.companySites,
      eventCategories: req.app.locals.eventCategories,
      corpDepartments: req.app.locals.corpDepartments,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/updateCatch", async (req, res) => {
  try {
    const recordId = req.query.recordId;
    const goodCatch = await GoodCatch.findById(recordId);

    if (!goodCatch) {
      return res.status(404).send("Good Catch not found.");
    }

    res.render("goodCatch/updateCatch", { goodCatch });
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// Render the search form
router.get("/search", async (req, res) => {
  try {
    const results = await GoodCatch.find({}).populate("creationUser"); // ✅ Fetch all records
    res.render("goodCatch/updateSearch", { goodCatches: results });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/delete", (req, res) => {
  res.render("goodCatch/deleteCatch");
});

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

// router.post("/deleteCatch", async (req, res) => {
//   try {
//     const { recordId } = req.body;
//     const deletedGoodCatch = await GoodCatch.findByIdAndDelete(recordId);

//     if (!deletedGoodCatch) {
//       return res.send("Record not found.");
//     }

//     res.send("Record deleted successfully.");
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

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