import { Quiz } from './quiz';

export interface Worksheet {
   id: string;
   title: string;
   userId: string;
   keywords: string[];
   version: number;
   createdAt: Date;
   updatedAt: Date;
   quizzes?: Quiz[];
 }

export interface CreateWorksheetData {
   id: string;
   title: string;
   userId: string;
   keywords: string[];
   version: number;
 }
