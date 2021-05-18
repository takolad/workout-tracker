const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
  exercise: {
    type:
      {
        type: String,
        enum: ['cardio', 'resistance'],
      },
    name:
    {
      type: String,
      minLength: 4
    },
    weight: Number,
    sets: Number,
    reps: Number,
    duration: Number
  }
});

const Exercise = mongoose.model("Exercise", ExerciseSchema);

module.exports = Exercise;
