import mongoose from 'mongoose';

interface SessionAttrs {
  title: string;
  userId: string;
  audioFile?: string;
  transcript?: string;
  summary: string;
  duration?: number;
  status: 'processing' | 'completed';
}

interface SessionDoc extends mongoose.Document {
  title: string;
  userId: string;
  audioFile?: string;
  transcript?: string;
  summary: string;
  duration?: number;
  status: 'processing' | 'completed';
  createdAt: Date;
}

interface SessionModel extends mongoose.Model<SessionDoc> {
  build(attrs: SessionAttrs): SessionDoc;
}

const sessionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    audioFile: {
      type: String,
      required: false,
    },
    transcript: {
      type: String,
      required: false,
    },
    summary: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: false,
      min: 0,
    },
    status: {
      type: String,
      enum: ['processing', 'completed'],
      default: 'processing',
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      transform(doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

sessionSchema.index({ userId: 1, status: 1 });
sessionSchema.index({ createdAt: -1 });

sessionSchema.statics.build = (attrs: SessionAttrs) => {
  return new Session(attrs);
};

const Session = mongoose.model<SessionDoc, SessionModel>('Session', sessionSchema);

export { Session };