import mongoose from 'mongoose';

const PublicationSchema = new mongoose.Schema({
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prof',
    required: true
  },
  publicationURL: {
    type: String,
    required: true
  },
  publicationId:{
    type:String,
    unique:true,
    required:true
  }
}, { timestamps: true });

export const Publication = mongoose.model('Publication', PublicationSchema);
