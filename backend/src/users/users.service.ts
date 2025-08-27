// src/users/users.service.ts
import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from "./dto/create-user.dto"
import { NotFoundException } from '@nestjs/common';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.user.findMany({
      where: { tenantId },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
      },
    });
  }

  async findOne(userId: string, tenantId: string) {
    return this.prisma.user.findFirst({
      where: { id: userId, tenantId },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
      },
    });
  }

  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { tenant: true }, // include tenant info
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      lastLogin: user.lastLogin,
      tenant: {
        id: user.tenant.id,
        name: user.tenant.name,
        slug: user.tenant.slug,
      },
    };
  }


  async create(dto: CreateUserDto, tenantId: string, currentUserRole: string) {
    if (currentUserRole !== 'ADMIN') {
      throw new ForbiddenException('Only admins can create users');
    }

    return this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        password: dto.password,
        role: dto.role || 'MEMBER',
        tenantId,
      },
    });
  }
}
