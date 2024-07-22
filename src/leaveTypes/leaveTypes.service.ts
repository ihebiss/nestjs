import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LeaveType } from "src/schemas/LeaveTypes.schema";
import { CreateLeaveTypeDto } from "./dto/create-leave-type.dto";
import { UpdateLeaveTypeDto } from "./dto/update-leave-type.dto";

@Injectable()
export class leaveTypesService {
    constructor(@InjectModel(LeaveType.name) private readonly leaveTypeModel: Model<LeaveType>) {}

    async create(createLeaveTypeDto: CreateLeaveTypeDto): Promise<LeaveType> {
      console.log('Received DTO:', createLeaveTypeDto);
      const createdLeaveType = new this.leaveTypeModel(createLeaveTypeDto);
      return createdLeaveType.save();
    }
    
  

    async findAll(): Promise<LeaveType[]> {
        return this.leaveTypeModel.find().exec();
    }

    async findOne(id: string): Promise<LeaveType> {
        const leaveType = await this.leaveTypeModel.findById(id).exec();
        if (!leaveType) {
            throw new NotFoundException('LeaveType not found');
        }
        return leaveType;
    }

    async update(id: string, updateLeaveTypeDto: UpdateLeaveTypeDto): Promise<LeaveType> {
        const existingLeaveType = await this.leaveTypeModel.findByIdAndUpdate(id, updateLeaveTypeDto, { new: true }).exec();
        if (!existingLeaveType) {
            throw new NotFoundException('LeaveType not found');
        }
        return existingLeaveType;
    }

    async remove(id: string): Promise<LeaveType> {
        const deletedLeaveType = await this.leaveTypeModel.findByIdAndDelete(id).exec();
        if (!deletedLeaveType) {
            throw new NotFoundException('LeaveType not found');
        }
        return deletedLeaveType;
    }
}
