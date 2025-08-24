import mongoose from 'mongoose';

interface SessionAttrs {
  title: string;
  userId: string;
  mentor?: string;
  class?: string;
  roomUrl?: string;
  roomName?: string;
  recordingUrl?: string;
  transcript?: string;    
  summary?: string;
  keyTopics?: string[];  
  duration?: number;
  status: 'live' | 'completed' | 'processing' | 'failed';
}

interface SessionDoc extends mongoose.Document {
  title: string;
  userId: string;
  mentor?: string;
  class?: string;
  roomUrl?: string;
  roomName?: string;
  recordingUrl?: string;
  transcript?: string;    
  summary?: string;
  keyTopics?: string[];  
  duration?: number;
  status: 'live' | 'completed' | 'processing' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

interface SessionModel extends mongoose.Model<SessionDoc> {
  build(attrs: SessionAttrs): SessionDoc;
}

const sessionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    userId: {
      type: String,
      required: true,
    },
    mentor: {
      type: String,
      maxlength: 100,
    },
    class: {
      type: String,
      maxlength: 50,
    },
    roomUrl: {
      type: String,
    },
    roomName: {
      type: String,
    },
    recordingUrl: {
      type: String,
    },
    transcript: {           // Add transcript field
      type: String,
      default: '',
    },
    summary: {
      type: String,
      default: '',
    },
    keyTopics: {            // Add keyTopics field
      type: [String],
      default: [],
    },
    duration: {
      type: Number, 
    },
    status: {
      type: String,
      enum: ['live', 'completed', 'processing', 'failed'],
      default: 'live',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc: any, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

sessionSchema.statics.build = (attrs: SessionAttrs) => {
  return new Session(attrs);
};

const Session = mongoose.model<SessionDoc, SessionModel>('Session', sessionSchema);

export { Session };