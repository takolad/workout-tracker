const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
  exercise: new Schema({
    type:
      {
        type: String,
        enum: ['cardio', 'resistance'],
        required: [ true, 'An exercise type must be selected']
      },
    name:
    {
      type: String,
      trim: true,
      minLength: 4,
      required: [ true, 'An exercise name is required' ]
    },
    duration: {
      type: Number,
      required: [ true, 'A duration is required' ],
      min: 0
    },
    weight: {
      type: Number,
      required: false,
      min: 0
    },
    sets: {
      type: Number,
      required: false,
      min: 0
    },
    reps: {
      type: Number,
      required: false,
      min: 0
    },
    distance: {
      type: Number,
      required: false,
      min: 0
    },
  })
});

const Exercise = mongoose.model("Exercise", ExerciseSchema);

module.exports = Exercise;
