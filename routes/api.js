const router = require("express").Router();
const Workout = require("../models/Workout");
const path = require("path");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "./public/index.html"));
});

// get all workouts (called by getLastWorkout)
router.get("/api/workouts", async (req, res) => {
  await Workout.aggregate([
    { $unwind: "$exercises"},
    { $match: {} },
    {
      $addFields:
      {
        totalDuration: { $sum: "$exercises.duration" }
      }
    },
    {
      $group:
      {
        _id : "$_id",
        totalDuration: { $sum : "$exercises.duration" }
      }
    },
  ]).then(results => {
    for(let i = 0; i < results.length; i++) {
      Workout.updateOne(
        {
          _id: results[i]._id
        },
        {
          totalDuration: results[i].totalDuration
        })
        .then(results => {
          // console.log(results);
        })
        .catch(err => console.log(err));
    }
  }).catch(err => console.log(err));

  Workout.find({})
    .sort({ day: 1 })
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

// get workouts in a range (past 7 workouts)
router.get("/api/workouts/range", async (req, res) => {
  Workout.aggregate([
    { $unwind: "$exercises"},
    {
      $project: {
        _id: 0,
        _id: "$_id",
        day: "$day",
        totalDuration: "$totalDuration",
        exercises: [{
          "name": "$exercises.name",
          "duration": "$exercises.duration",
          "type": "$exercises.type",
          "weight": { $sum: "$exercises.weight" },
        }]
      }
    },
  ])
    .sort({ day: -1 })
    .limit(7)
    .then(workout => {
      for(let i = 0; i < workout.length; i++) {
        console.log(workout);
      }
      res.json(workout);
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
