import { Body, Controller, Delete, Get, InternalServerErrorException, Param, Post, Put, UseGuards } from "@nestjs/common";
import { AddEmployeeDto } from "./dto/addEmployee.dto";
import { Employee } from "src/schemas/Employees.schema";
import { EmployeesService } from "./employees.service";
import { UpdateEmployeeDto } from "./dto/updateEmployee.dto";
import { Request } from "@nestjs/common";
@Controller('employees')
export class employeesController{
    constructor(private readonly employeeService: EmployeesService) {}
  
  @Post()
  async createEmployee(@Body() createEmployeeDto: AddEmployeeDto): Promise<Employee> {
    return this.employeeService.createEmployee(createEmployeeDto);
  }
  @Get()
  async getAllEmployees(): Promise<Employee[]> {
    return this.employeeService.getAllEmployees();
  }
  
  @Get(':id')
  async getEmployeeById(@Param('id') id: string): Promise<Employee> {
    return this.employeeService.getEmployeeById(id);
  }
  @Put(':id')
  async updateEmployee(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    return this.employeeService.updateEmployee(id, updateEmployeeDto);
  }
  @Delete(':id')
  async deleteEmployee(@Param('id') id: string): Promise<Employee> {
    return this.employeeService.deleteEmployee(id);
  }
 
  @Get('teamlead-id/:keycloakId')
  async findTeamLeadId(@Param('keycloakId') keycloakId: string): Promise<string> {
    return this.employeeService.findTeamLeadIdByKeycloakId(keycloakId);
  }
  @Get(':id/leave-balances')
  async getLeaveBalances(@Param('id') id: string) {
    const employee = await this.employeeService.getEmployeeById(id);
    return { leaveBalances: employee.leaveBalances };
  }
  @Get('/teamlead/:teamLeadId')
  
  async getEmployeesByTeamLead(@Param('teamLeadId') teamLeadId: string): Promise<Employee[]> {
    try {
      return await this.employeeService.getEmployeesByTeamLead(teamLeadId);
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw new InternalServerErrorException('Error fetching employees');
    }
  }
  
}

