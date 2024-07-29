import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { EmployeesLeavesService } from "./employeesLeave.service";
import { CreateLeaveEmployeesDto } from "./dto/create-leave-employees.dto";
import { LeaveEmployees } from "src/schemas/LeaveEmployees.schema";
import { AuthGuard } from "nest-keycloak-connect";
import { Request } from 'express';
@Controller('employees-leaves')
export class employeesLeavesController{
   
        constructor(private readonly leaveEmployeesService: EmployeesLeavesService) {}
      
        @Post()
        async create(@Body() createLeaveRequestDto: CreateLeaveEmployeesDto): Promise<LeaveEmployees> {
          try {
            return await this.leaveEmployeesService.create(createLeaveRequestDto);
          } catch (error) {
            console.error('Error creating LeaveRequest:', error);
            throw error; 
          }
        }
        @Get()
        async findAll(): Promise<LeaveEmployees[]> {
        return this.leaveEmployeesService.findAll();
        }
        @Get(':id')
        async findOne(@Param('id') id: string): Promise<LeaveEmployees> {
          return this.leaveEmployeesService.findOne(id);
        }
       
        @Get('employee')
        @UseGuards(AuthGuard)
     async findByEmployeeId(@Req() request: Request) {
    const employeeId = request.user.sub; 
    return this.leaveEmployeesService.findOne(employeeId);
  }
        @Put(':id')
        async update(@Param('id') id: string, @Body() updateLeaveRequestDto: CreateLeaveEmployeesDto): Promise<LeaveEmployees> {
          return this.leaveEmployeesService.update(id, updateLeaveRequestDto);
        }

        @Delete(':id')
        async remove(@Param('id') id: string): Promise<LeaveEmployees> {
          return this.leaveEmployeesService.remove(id);
        }
        @Get('team/:teamLeadId')
  async findTeamLeaves(@Param('teamLeadId') teamLeadId: string): Promise<LeaveEmployees[]> {
    return this.leaveEmployeesService.findTeamLeaves(teamLeadId);
  }

}