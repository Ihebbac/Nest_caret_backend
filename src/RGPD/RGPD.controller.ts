import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  UseGuards,
  Put,
  Param,
  NotFoundException,
  Delete,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard.ts';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RGPDService } from './RGPD.service';
import { RGPDDto } from './RGPDDTO';
import { FileInterceptor } from '@nestjs/platform-express';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('api/RGPD')
@UseInterceptors(CacheInterceptor)
export class RGPDController {
  constructor(private RGPDService: RGPDService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    Role.Admin,
    Role.SuperAdmin,
    Role.Member,
    Role.Guest,

    Role.CompanyPartner,
    Role.CandidatMember,
    Role.CandidatAdmin,
  )
  @Post('/')
  async addCooptation(@Body() RGPDDto: RGPDDto) {
    const appliaction = await this.RGPDService.addRGPD(RGPDDto);
    return appliaction;
  }

  @Get('/')
  async getRGPD() {
    const appliaction = await this.RGPDService.findRGPD();
    return appliaction;
  }
  @Get('/findRGPDBytitle/:title')
  async findRGPDBytitle(@Param('title') title: string) {
    const RGPD = await this.RGPDService.findRGPDBytitle(title);
    if (!RGPD) throw new NotFoundException('RGPD does not exist!');
    return RGPD;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    Role.Admin,
    Role.SuperAdmin,
    Role.Member,
    Role.Guest,

    Role.CompanyPartner,
    Role.CandidatMember,
    Role.CandidatAdmin,
  )
  @Put('/:id')
  async UpdateRGPD(@Param('id') id: string, @Body() RGPDDto: RGPDDto) {
    const appliaction = await this.RGPDService.UpdateRGPD(id, RGPDDto);
    return appliaction;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    Role.Admin,
    Role.SuperAdmin,
    Role.Member,
    Role.Guest,

    Role.CompanyPartner,
    Role.CandidatMember,
    Role.CandidatAdmin,
  )
  @Delete('/:id')
  async DeleteRGPD(@Param('id') id: string) {
    const appliaction = await this.RGPDService.DeleteRGPD(id);
    return appliaction;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin, Role.CompanyAdmin)
  @Post('/backup')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    const fileBuffer = Buffer.from(file.buffer, 'binary');

    const listUserAdded = await this.RGPDService.BackUp(fileBuffer.toString());
    return listUserAdded;
  }
}
