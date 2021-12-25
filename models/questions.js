import mongoose from "mongoose";

const questionSchema = new Mongoose.Schema({
    title: {
        type: String,
        required: true,
      },
    url: {
        type: String,
        required: true,
      }, 
    votes: {
        type: Number,
        required: true,
      },
    answers: {
        type: Number,
        required: true,
      },
    views: {
        type: Number,
        required: true,
    },
    referenceCount: {
        type: Number,
        default: 0
    },
    time: {
        type: Number,
        required: true,
    }
    
})

const Questions = Mongoose.model("Question", questionSchema)

export default Questions;