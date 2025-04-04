import mongoose from 'mongoose';

const PublicationSchema = new mongoose.Schema({
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title:{
    type:String,
    required:true
  },
  publicationURL: {
    type: String,
    required: true
  },
  
}, { timestamps: true });

export const Publication = mongoose.model('Publication', PublicationSchema);
