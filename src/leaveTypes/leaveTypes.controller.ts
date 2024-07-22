import { Body, Controller, NotFoundException, Post,Get,Put,Delete, Param } from "@nestjs/common";
import { LeaveType } from "src/schemas/LeaveTypes.schema";
import { CreateLeaveTypeDto } from "./dto/create-leave-type.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { leaveTypesService } from "./leaveTypes.service";
import { UpdateLeaveTypeDto } from "./dto/update-leave-type.dto";

@Controller('leave-types')
export class LeaveTypeController {
    constructor(private readonly leaveTypeService: leaveTypesService) {}

    @Post()
    async create(@Body() createLeaveTypeDto: CreateLeaveTypeDto): Promise<LeaveType> {
      try {
        return await this.leaveTypeService.create(createLeaveTypeDto);
      } catch (error) {
        console.error('Error creating LeaveType:', error);
        throw new Error('Failed to create LeaveType');
      }
    }
    
    @Get()
    async findAll(): Promise<LeaveType[]> {
        return this.leaveTypeService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<LeaveType> {
        return this.leaveTypeService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateLeaveTypeDto: UpdateLeaveTypeDto): Promise<LeaveType> {
        return this.leaveTypeService.update(id, updateLeaveTypeDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<LeaveType> {
        return this.leaveTypeService.remove(id);
    }
}