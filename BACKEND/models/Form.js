const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  questions: [
    {
      questionText: { type: String, required: true },
      questionType: { type: String, required: true },
      options: [String],
    },
  ],
});

module.exports = mongoose.model('Form', FormSchema);
