import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  
  title: {
    type: String,
    required: true
  },
  eventDate: {
    type: Date,
    required: true
  },
  reg_url: {
    type: String
  },
  description: {
    type: String,
    required: true
  },
  img_url: {
    type: String
  },
  FIC: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

export const Event = mongoose.model('Event', EventSchema);
