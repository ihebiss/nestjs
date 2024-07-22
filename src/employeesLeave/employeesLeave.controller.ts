import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from "@nestjs/common";
import { EmployeesLeavesService } from "./employeesLeave.service";
import { CreateLeaveEmployeesDto } from "./dto/create-leave-employees.dto";
import { LeaveEmployees } from "src/schemas/LeaveEmployees.schema";
@Controller('employees-leaves')
export class employeesLeavesController{
   
        constructor(private readonly leaveEmployeesService: EmployeesLeavesService) {}
      
        @Post()
        async create(@Body() createLeaveRequestDto: CreateLeaveEmployeesDto): Promise<LeaveEmployees> {
          try {
            return await this.leaveEmployeesService.create(createLeaveRequestDto);
          } catch (error) {
            console.error('Error creating LeaveRequest:', error);
            throw error; // Laissez NestJS gérer l'erreur et renvoyer une réponse appropriée
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
        @Get('employee/:id')
        async findByEmployeeId(@Param('id') id: string): Promise<LeaveEmployees[]> {
          return this.leaveEmployeesService.findByEmployeeId(id);
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