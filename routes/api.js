const router = require("express").Router();
const Workout = require("../models/Workout");
const path = require("path");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "./public/index.html"));
});

// get all workouts (called by getLastWorkout)
router.get("/api/workouts", (req, res) => {
  Workout.aggregate([
    { $unwind: "$exercises"},
    { $match: {} },
    {
      $group:
      {
        _id : "$_id",
        totalDuration: { $sum : "$exercises.duration" }
      }
    },
  ]).then(test => {
    const options = { upsert: true, new: true};
    for (let i = 0; i < test.length; i++) {
      Workout.findByIdAndUpdate(
        { _id : test[i]._id }, { totalDuration: test[i].totalDuration }, options);
    }
  });

  Workout.find({})
    .sort({ day: 1 })
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

// get workouts in a range (all workouts?)
router.get("/api/workouts/range", (req, res) => {
  Workout.find({})
    // .sort({ day: -1 })
    .then(dbWorkout => {

      res.json(dbWorkout);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

// create new workout
router.post("/api/workouts", ({ body }, res) => {
  Workout.create(body)
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

// add exercise to workout
router.put("/api/workouts/:id", (req, res) => {
  console.log(req.body);
  Workout.updateOne(
    {
      _id: req.params.id,
    },
    {
      $push : { exercises:  req.body },
    }
  )
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

router.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/exercise.html"));
});

router.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/stats.html"));
});

module.exports = router;
