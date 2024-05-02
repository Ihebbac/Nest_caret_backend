import { Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { RGPD, RGPDDocument } from './RGPD.schema';

import * as moment from 'moment';
import { RGPDDto } from './RGPDDTO';
import { UserService } from 'src/user/user.service';
import {
  notification,
  notificationDocument,
} from '../notification/notification.schema';
import { SocketGateway } from 'src/socketIO/socket.gateway';

@Injectable()
export class RGPDService {
  constructor(
    @InjectModel('RGPD')
    private readonly RGPDModule: Model<RGPDDocument>,
    private readonly userService: UserService,
    @InjectModel('Notification')
    private readonly NotificationModule: Model<notificationDocument>,
    private readonly SocketGateway: SocketGateway,
  ) {}

  async addRGPD(RGPDDto: RGPDDto): Promise<any> {
    const oldVp = await this.RGPDModule.findOne({
      title: RGPDDto.title,
    });
    if (!oldVp) {
      try {
        const newRGPD = await this.RGPDModule.create(RGPDDto);
        newRGPD.save();

        return newRGPD;
      } catch (err) {
        throw new HttpException(
          `Error: ${err.message}`,
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      throw new HttpException('Config is Already Exist', HttpStatus.NOT_FOUND);
    }
  }

  //test
  async UpdateRGPD(id: string, RGPDDto: RGPDDto): Promise<any> {
    const newRGPD = await this.RGPDModule.findByIdAndUpdate(id, {
      title: RGPDDto.title,
      desc: RGPDDto.desc,
    });

    return newRGPD;
  }

  async findRGPD(): Promise<RGPD[] | undefined> {
    const RGPDs = await this.RGPDModule.find();
    if (!RGPDs) {
      throw new HttpException(
        'No RGPDs Done is Found for this User ',
        HttpStatus.NOT_FOUND,
      );
    } else {
      return RGPDs;
    }
  }
  async findRGPDBytitle(title: string): Promise<RGPD[] | undefined> {
    const RGPDs = await this.RGPDModule.find();
    if (!RGPDs) {
      throw new HttpException(
        'No RGPDs Done is Found for this title ',
        HttpStatus.NOT_FOUND,
      );
    } else {
      return RGPDs;
    }
  }

  async DeleteRGPD(id: string): Promise<RGPD | undefined> {
    const variableDePaie = await this.RGPDModule.findOneAndDelete({
      _id: id,
    });
    if (!variableDePaie) {
      throw new HttpException(
        'variableDePaie Not Found ',
        HttpStatus.NOT_FOUND,
      );
    } else {
      return variableDePaie;
    }
  }

  async BackUp(data: any): Promise<any | undefined> {
    const deleteMany = await this.RGPDModule.deleteMany();
    const parList = await this.RGPDModule.insertMany(JSON.parse(data));
    return parList;
  }
}
