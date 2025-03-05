import mongoose from 'mongoose';

const PublicationSchema = new mongoose.Schema({
  prof: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  publicationURL: {
    type: String,
    required: true
  },
  pagesToShow:{
    type:Number,
    required:true
  }
}, { timestamps: true });

export const Publication = mongoose.model('Publication', PublicationSchema);
