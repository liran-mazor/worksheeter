import { prisma } from '../lib/prisma-client';
import { CreateWorksheetData, Worksheet } from '../types/worksheet';
import { DatabaseConnectionError, NotFoundError } from '@liranmazor/common';

export class WorksheetService {
  static async create(data: CreateWorksheetData): Promise<Worksheet> {
    try {
      return await (prisma as any).worksheet.create({
        data: {
          id: data.id,
          title: data.title,
          userId: data.userId,
          keywords: data.keywords,
          version: data.version,
        },
      });
    } catch (error) {
      throw new DatabaseConnectionError(error);
    }
  }

  static async findById(id: string): Promise<Worksheet> {
    try {
      const worksheet = await (prisma as any).worksheet.findUnique({
        where: { id },
      });
      
      if (!worksheet) {
        throw new NotFoundError();
      }
      
      return worksheet;
    } catch (error) {
      throw new DatabaseConnectionError(error);
    }
  }

  // ✅ Add overload for cases where null is acceptable
  static async findByIdOrNull(id: string): Promise<Worksheet | null> {
    return await (prisma as any).worksheet.findUnique({
      where: { id },
    });
  }

  static async findByUserId(userId: string): Promise<Worksheet[]> {
    return await (prisma as any).worksheet.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async update(
    id: string,
    data: Partial<Pick<Worksheet, 'title' | 'keywords' | 'version'>>
  ): Promise<Worksheet> {
    try {
      return await (prisma as any).worksheet.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new DatabaseConnectionError(error);
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await (prisma as any).worksheet.delete({
        where: { id },
      });
    } catch (error) {
      throw new DatabaseConnectionError(error);
    }
  }

  static async exists(id: string): Promise<boolean> {
    const worksheet = await (prisma as any).worksheet.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!worksheet;
  }

  static async findByIdAndUserId(id: string, userId: string): Promise<Worksheet> {
    try {
      const worksheet = await (prisma as any).worksheet.findFirst({
        where: { 
          id,
          userId 
        },
      });
      
      if (!worksheet) {
        throw new NotFoundError();
      }
      
      return worksheet;
    } catch (error) {
      throw new DatabaseConnectionError(error);
    }
  }
}