import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  eventId:{
    type:String,
    unique:true,
    required:true
  },
  title: {
    type: String,
    required: true
  },
  eventDate: {
    type:Date,
    required:[true,"Event-date is needed"],
    validate:{
        validator:(value)=> !isNaN(new Date(value).getTime()),
        message:"Invalid date format"
    },
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
