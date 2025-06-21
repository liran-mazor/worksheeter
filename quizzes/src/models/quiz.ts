import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface QuizAttrs {
  worksheetId: string;
  userId: string;
  title: string;
  keywords: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface QuizDoc extends mongoose.Document {
  worksheetId: string;
  userId: string;
  title: string;
  keywords: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
  }>;
  
  status: 'processing' | 'available' | 'failed';
  score?: number;
  completedAt?: Date;
  version: number;
  createdAt: Date;
  updatedAt: Date;

  markAsAvailable(questions: Array<{question: string, options: string[], correctAnswer: string}>): Promise<QuizDoc>;
  markAsFailed(): Promise<QuizDoc>;
  complete(score: number): Promise<QuizDoc>;
}

interface QuizModel extends mongoose.Model<QuizDoc> {
  build(attrs: QuizAttrs): QuizDoc;
}

const quizSchema = new mongoose.Schema(
  {
    worksheetId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    keywords: {
      type: [String],
      required: true,
      validate: {
        validator: function(v: string[]) {
          return v.length > 0 && v.length <= 50;
        },
        message: 'Keywords must contain 1-50 items'
      }
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
      index: true,
    },
    questions: {
      type: [{
        question: {
          type: String,
          required: true,
          trim: true,
          maxlength: 500,
        },
        options: {
          type: [String],
          required: true,
          validate: {
            validator: function(v: string[]) {
              return v.length === 4 && v.every(option => option.trim().length > 0);
            },
            message: 'Each question must have exactly 4 non-empty options'
          }
        },
        correctAnswer: {
          type: String,
          required: true,
          trim: true,
          validate: {
            validator: function(this: any, value: string) {
              return this.options && this.options.includes(value);
            },
            message: 'Correct answer must be one of the provided options'
          }
        },
      }],
      default: [],
      validate: {
        validator: function(v: any[]) {
          return v.length === 0 || v.length === 10;
        },
        message: 'Quiz must have 0 questions (processing) or exactly 10 questions (available)'
      }
    },
    status: {
      type: String,
      enum: ['processing', 'available', 'failed'],
      default: 'processing',
      required: true,
      index: true,
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: undefined,
      validate: {
        validator: function(this: any, value: number) {
          if (value !== undefined && value !== null) {
            return this.completedAt !== undefined;
          }
          return true;
        },
        message: 'Score can only be set when quiz is completed'
      }
    },
    completedAt: {
      type: Date,
      default: undefined,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

quizSchema.index({
  userId: 1,
  worksheetId: 1,
  difficulty: 1
}, {
  unique: true,
  name: 'unique_quiz_per_level_per_worksheet'
});

quizSchema.index({ userId: 1, status: 1 });
quizSchema.index({ worksheetId: 1, status: 1 });

quizSchema.set('versionKey', 'version');
quizSchema.plugin(updateIfCurrentPlugin);

quizSchema.statics.build = (attrs: QuizAttrs) => {
  return new Quiz(attrs);
};

quizSchema.methods.markAsAvailable = function(questions: Array<{question: string, options: string[], correctAnswer: string}>) {
  this.questions = questions;
  this.status = 'available';
  return this.save();
};

quizSchema.methods.markAsFailed = function() {
  this.status = 'failed';
  this.questions = []; 
  return this.save();
};

quizSchema.methods.complete = function(score: number) {
  this.score = score;
  this.completedAt = new Date();
  return this.save();
};

quizSchema.pre('save', function(next) {
  if (this.status === 'available' && this.questions.length !== 10) {
    return next(new Error('Available quiz must have exactly 10 questions'));
  }
  
  if (this.status === 'processing' && this.questions.length > 0) {
    return next(new Error('Processing quiz cannot have questions'));
  }
  
  if (this.score !== undefined && this.completedAt === undefined) {
    return next(new Error('Quiz with score must have completion date'));
  }
  
  next();
});

const Quiz = mongoose.model<QuizDoc, QuizModel>('Quiz', quizSchema);

export { Quiz };