import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project-dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InternalServerErrorException } from '@nestjs/common';
@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    try {
      const projects = await this.prisma.project.findMany({
        where: { tenantId, deletedAt: null },
      });
      return projects;
    } catch (error) {
      // You can log the error for debugging
      console.error('Error fetching projects:', error);
      // Throw a controlled HTTP exception
      throw new InternalServerErrorException('Failed to fetch projects');
    }
  }
  
  async findOne(projectId: string, tenantId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, tenantId, deletedAt: null },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async create(dto: CreateProjectDto, tenantId: string, userId: string) {
    return this.prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description,
        tenantId,
        createdBy: userId,
        status: dto.status
      },
    });
  }

  async update(id: string, tenantId: string, userId: string, dto: UpdateProjectDto) {
    return this.prisma.project.updateMany({
      where: { id, tenantId }, 
      data: {
        ...dto,
        updatedBy: userId, 
      },
    });
  }
  

  async delete(projectId: string, tenantId: string, userRole: string) {
    if (userRole !== 'ADMIN') {
      throw new ForbiddenException('Only admins can delete projects');
    }

    return this.prisma.project.update({
      where: { id: projectId },
      data: { deletedAt: new Date() },
    });
  }
}
