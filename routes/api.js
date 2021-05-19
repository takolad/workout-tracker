const router = require("express").Router();
const db = require("../models");
const path = require("path");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "./public/index.html"));
});

// get all workouts (called by getLastWorkout)
router.get("/api/workouts", (req, res) => {
  db.Workout.find({})
    .sort({ day: 1 })
    .then(dbWorkout => {
      console.log(dbWorkout);
      res.json(dbWorkout);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

// get workouts in a range (all workouts?)
router.get("/api/workouts/range", (req, res) => {
  db.Workout.find({})
    .sort({ day: -1 })
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

// create new workout
router.post("/api/workouts", ({ body }, res) => {
  db.Workout.create(body)
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

// add exercise to workout
router.put("/api/workouts/:id", (req, res) => {
  db.Workout.updateOne(
    {
      _id: mongojs.ObjectId(req.params.id),
    },
    {
      exercises: req.body
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
