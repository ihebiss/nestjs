import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LeaveType } from "src/schemas/LeaveTypes.schema";
import { CreateLeaveTypeDto } from "./dto/create-leave-type.dto";
import { UpdateLeaveTypeDto } from "./dto/update-leave-type.dto";
import { Subtype } from "src/schemas/Subtype.schema";


@Injectable()
export class leaveTypesService {
    constructor(@InjectModel(LeaveType.name) private readonly leaveTypeModel: Model<LeaveType>,
    @InjectModel(Subtype.name) private readonly subtypeModel: Model<Subtype> ) {}

    async create(createLeaveTypeDto: CreateLeaveTypeDto): Promise<LeaveType> {
      const createdLeaveType = new this.leaveTypeModel(createLeaveTypeDto);
      return createdLeaveType.save();
    }

    async findAll(): Promise<LeaveType[]> {
        const leaveTypes = await this.leaveTypeModel.find().populate('subtypes').exec();
        return leaveTypes;
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
    async addSubtypesToLeaveType(leaveTypeId: string, subtypesDto: { name: string, nbdays?: number }[]): Promise<LeaveType> {
        const leaveType = await this.leaveTypeModel.findById(leaveTypeId).exec();
        if (!leaveType) {
            throw new NotFoundException(`LeaveType with ID ${leaveTypeId} not found`);
        }

        const subtypes = await Promise.all(subtypesDto.map(async (subtypeDto) => {
            let subtype = await this.subtypeModel.findOne({ name: subtypeDto.name }).exec();
            if (!subtype) {
                subtype = new this.subtypeModel(subtypeDto);
                await subtype.save();
            }
            return subtype;
        }));

        leaveType.subtypes = subtypes;
        return leaveType.save();
    }
}
