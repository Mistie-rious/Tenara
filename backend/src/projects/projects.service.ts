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
        include: {
          assignedUsers: {   // whatever your relation field is in the Prisma schema
            select: {
              id: true,
              username: true,
              email: true,
              role: true,
            },
          },
        },
      });
  
      return projects;
    } catch (error) {
      console.error('Error fetching projects:', error);
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

 
  async assignUserToProject(projectId: string, userIds: string[], tenantId: string) {
    try {
      return await this.prisma.project.update({
        where: { id: projectId, tenantId },
        data: {
          assignedUsers: {
            connect: userIds.map((id) => ({ id })),
          },
        },
        include: { assignedUsers: true },
      });
    } catch (error) {
      console.error("Error assigning user to project", {
        projectId,
        userIds,
        tenantId,
        error,
      });
      throw error;
    }
  }
  
  async unassignUserFromProject(projectId: string, userId: string, tenantId: string) {
    try {
      return await this.prisma.project.update({
        where: { id: projectId, tenantId },
        data: {
          assignedUsers: {
            disconnect: { id: userId },
          },
        },
        include: { assignedUsers: true },
      });
    } catch (error) {
      console.error("Error unassigning user from project", {
        projectId,
        userId,
        tenantId,
        error,
      });
      throw error;
    }
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
