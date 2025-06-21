import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface WorksheetAttrs {
  id: string;
  title: string;
  userId: string;
  keywords: string[];
  status: 'processing' | 'completed' | 'failed';
  version?: number;
}

interface WorksheetDoc extends mongoose.Document {
  title: string;
  userId: string;
  keywords: string[];
  status: 'processing' | 'completed' | 'failed';
  version: number;
  createdAt: Date;  
  updatedAt: Date; 
}

interface WorksheetModel extends mongoose.Model<WorksheetDoc> {
  build(attrs: WorksheetAttrs): WorksheetDoc;
}

const worksheetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    keywords: {
      type: [String],
      required: true,
    },
    status: {
      type: String,
      enum: ['processing', 'completed', 'failed'],
      default: 'processing',
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    timestamps: true,
  }
);

worksheetSchema.set('versionKey', 'version');
worksheetSchema.plugin(updateIfCurrentPlugin);

worksheetSchema.statics.build = (attrs: WorksheetAttrs) => {
  return new Worksheet({
    _id: attrs.id,
    title: attrs.title,
    userId: attrs.userId,
    keywords: attrs.keywords,
    status: attrs.status,
    version: attrs.version,
  });
};

const Worksheet = mongoose.model<WorksheetDoc, WorksheetModel>('Worksheet', worksheetSchema);

export { Worksheet };