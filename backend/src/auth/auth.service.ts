// src/auth/auth.service.ts
import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { CreateTenantDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // Create tenant + first admin user
  async createTenant(dto: CreateTenantDto) {

    const slug = dto.name.toLowerCase().replace(/\s+/g, '-');

    // Check if tenant exists
    const existingTenant = await this.prisma.tenant.findUnique({
      where: { slug },
    });
    if (existingTenant) throw new ConflictException('Tenant already exists');

    // Check if user email exists globally
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) throw new ConflictException('User already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Transaction: create tenant + admin user
    const result = await this.prisma.$transaction(async (prisma) => {
      const tenant = await prisma.tenant.create({
        
        data: { name: dto.name , slug},
      });

      const adminUser = await prisma.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          password: hashedPassword,
          role: 'ADMIN',
          tenantId: tenant.id,
        },
      });

      return { tenant, adminUser };
    });

    const token = this.jwtService.sign(
      { sub: result.adminUser.id, email: result.adminUser.email, tenantId: result.tenant.id, role: result.adminUser.role },
      { expiresIn: this.configService.get('JWT_EXPIRES_IN') || '1h' },
    );

    return { access_token: token, user: result.adminUser, tenant: result.tenant };
  }

  // Login user
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {tenant: true}
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');


    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });
    
    const token = this.jwtService.sign(
      { sub: user.id, email: user.email, tenantId: user.tenantId , role: user.role },
      { expiresIn: this.configService.get('JWT_EXPIRES_IN') || '1h' },
    );

    return { access_token: token, user };
  }
}
