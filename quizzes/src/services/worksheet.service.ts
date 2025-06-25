import { prisma } from '../lib/prisma-client';
import { CreateWorksheetData, Worksheet } from '../types/worksheet';


export class WorksheetService {
  static async create(data: CreateWorksheetData): Promise<Worksheet> {
    return await (prisma as any).worksheet.create({
      data: {
        id: data.id,
        title: data.title,
        userId: data.userId,
        keywords: data.keywords,
        version: data.version,
      },
    });
  }

  static async findById(id: string): Promise<Worksheet | null> {
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
    return await (prisma as any).worksheet.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string): Promise<void> {
    await (prisma as any).worksheet.delete({
      where: { id },
    });
  }

  static async exists(id: string): Promise<boolean> {
    const worksheet = await (prisma as any).worksheet.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!worksheet;
  }
}