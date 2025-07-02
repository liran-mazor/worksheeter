import { NotFoundError } from '@liranmazor/common';
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface WorksheetAttrs {
  title: string;
  userId: string;
  keywords: string[];
  questions: string[];
}

interface WorksheetDoc extends mongoose.Document {
  title: string;
  userId: string;
  
  keywords: string[];  
  questions: string[]; 

  keywordDefinitions?: Array<{
    keyword: string;
    definition: string;
  }>;
  questionAnswers?: Array<{
    question: string;
    answer: string;
  }>;
  
  status: 'processing' | 'completed' | 'failed';
  version: number;
}

interface WorksheetModel extends mongoose.Model<WorksheetDoc> {
  build(attrs: WorksheetAttrs): WorksheetDoc;
  findByIdOrThrow(id: string): Promise<WorksheetDoc>;
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
    questions: {
      type: [String],
      default: [],
    },
    keywordDefinitions: [{
      keyword: {
        type: String,
        required: true,
      },
      definition: {
        type: String,
        required: true,
      }
    }],
    questionAnswers: [{
      question: {
        type: String,
        required: true,
      },
      answer: {
        type: String,
        required: true,
      }
    }],
    status: {
      type: String,
      enum: ['processing', 'completed', 'failed'],
      default: 'processing',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

worksheetSchema.index({ 
  userId: 1, 
  title: 1 
}, { 
  unique: true,
  name: 'unique_title_per_user'
});

worksheetSchema.set('versionKey', 'version')
worksheetSchema.plugin(updateIfCurrentPlugin);

worksheetSchema.statics.build = (attrs: WorksheetAttrs) => {
  return new Worksheet(attrs);
};

worksheetSchema.statics.findByIdOrThrow = async function(id: string): Promise<WorksheetDoc> {
  const worksheet = await this.findById(id);
  
  if (!worksheet) {
    throw new NotFoundError();
  }
  
  return worksheet;
};

const Worksheet = mongoose.model<WorksheetDoc, WorksheetModel>('Worksheet', worksheetSchema);

export { Worksheet };