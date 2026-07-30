
import mongoose from "mongoose";        // Importing Mongoose

const resumeSchema = new mongoose.Schema({          // Creating a Schema

  user: {                                             // Defining the Fields
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  resumeFile: {                                     // Stores the uploaded resume file URL/path
    type: String,
    required: true
  },
  fileName: {                                           // Stores the original file name
    type: String,
    required: true
  },
  extractedText: {                                        // Stores the extracted text from the uploaded resume                      
    type: String,
    default: ""
  },
  extractedSkills: {
    type: [String],
    default: []
  },
  atsScore: {
    type: Number,
    default: 0
  },
  aiFeedback: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    default: "Pending"
  }

}, {

  timestamps: true
});

const Resume = mongoose.model("Resume", resumeSchema);          // Converting Schema into Model

export default Resume;                                            // Exporting the Model