import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { AddEmployeeDto } from "./dto/addEmployee.dto";
import { Employee } from "src/schemas/Employees.schema";
import { EmployeesService } from "./employees.service";
import { UpdateEmployeeDto } from "./dto/updateEmployee.dto";
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
}