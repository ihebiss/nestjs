import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Employee } from "src/schemas/Employees.schema";
import { AddEmployeeDto } from "./dto/addEmployee.dto";
import { UpdateEmployeeDto } from "./dto/updateEmployee.dto";
import { LeaveEmployees } from "src/schemas/LeaveEmployees.schema";
import { LeaveType } from "src/schemas/LeaveTypes.schema";
import { differenceInCalendarDays } from 'date-fns';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee.name) private readonly employeeModel: Model<Employee>,
    @InjectModel(LeaveEmployees.name) private readonly leaveRequestModel: Model<LeaveEmployees>,
    @InjectModel(LeaveType.name) private readonly leaveTypeModel: Model<LeaveType>,
    
  ) {}

  private generateRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  async validateTeamLeadId(teamLeadId: string, department: string): Promise<void> {
    if (!teamLeadId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException('Invalid TeamLead ID format');
    }

    const teamLead = await this.employeeModel.findOne({ _id: teamLeadId, role: 'TeamLead', department });
    if (!teamLead) {
      throw new BadRequestException('Invalid TeamLead ID or TeamLead does not belong to the same department');
    }
  }

  async createEmployee(createEmployeeDto: AddEmployeeDto): Promise<Employee> {
    const generatedColor = this.generateRandomColor();

    if (createEmployeeDto.TeamLeadId) {
      await this.validateTeamLeadId(createEmployeeDto.TeamLeadId, createEmployeeDto.department);
    }

    const createdEmployee = new this.employeeModel({
      ...createEmployeeDto,
      color: generatedColor,
    });

    return createdEmployee.save();
  }

  async getAllEmployees(): Promise<Employee[]> {
    return this.employeeModel.find().exec();
  }

  async getEmployeeById(id: string): Promise<Employee> {
    const employee = await this.employeeModel.findById(id).populate('leaveBalances.subtypes').exec();
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    return employee;
  }
  async getManagerByDepartment(department: string): Promise<Employee | null> {
    return this.employeeModel.findOne({ role: 'Manager', department }).exec();
  }
  async updateEmployee(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    const existingEmployee = await this.employeeModel.findById(id).exec();
    if (!existingEmployee) {
      throw new NotFoundException('Employee not found');
    }

    if (updateEmployeeDto.TeamLeadId) {
      await this.validateTeamLeadId(updateEmployeeDto.TeamLeadId, updateEmployeeDto.department);
    }

    Object.assign(existingEmployee, updateEmployeeDto);
    return existingEmployee.save();
  }

  async deleteEmployee(id: string): Promise<Employee> {
    const deletedEmployee = await this.employeeModel.findByIdAndDelete(id).exec();
    if (!deletedEmployee) {
      throw new NotFoundException('Employee not found');
    }
    return deletedEmployee;
  }

  private calculateLeaveDays(startDate: Date, endDate: Date, startPeriod: string, endPeriod: string): number {
    let leaveDays = differenceInCalendarDays(endDate, startDate) + 1;

    if (startPeriod === "afternoon") {
      leaveDays -= 0.5;
    }
    if (endPeriod === "morning") {
      leaveDays -= 0.5;
    }

    return leaveDays;
  }

  async calculateAndUpdateLeaveBalance(employeeId: string, leaveRequestId: string): Promise<void> {
    const leaveRequest = await this.leaveRequestModel.findById(leaveRequestId).exec();
    if (!leaveRequest) {
      throw new NotFoundException(`Leave request with ID ${leaveRequestId} not found.`);
    }

    const employee = await this.employeeModel.findById(employeeId).exec();
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found.`);
    }

    const leaveType = await this.leaveTypeModel.findById(leaveRequest.leaveTypeId).exec();
    if (!leaveType) {
      throw new NotFoundException(`Leave type with ID ${leaveRequest.leaveTypeId} not found.`);
    }

    const leaveDays = this.calculateLeaveDays(leaveRequest.startDate, leaveRequest.endDate, leaveRequest.startPeriod, leaveRequest.endPeriod);

    const updatedBalances = employee.leaveBalances.map(balance => {
      if (balance.leaveTypeId.toString() === leaveRequest.leaveTypeId.toString()) {
        balance.balance -= leaveDays;
      }
      return balance;
    });

    await this.employeeModel.findByIdAndUpdate(employeeId, { leaveBalances: updatedBalances }).exec();
  }
 
  async findTeamLeadIdByKeycloakId(keycloakId: string): Promise<string> {
    try {
      const employee = await this.employeeModel.findOne({ keycloakId }).populate('_id').exec();
      
      if (!employee) {
        console.error(`Employee not found for keycloakId: ${keycloakId}`);
        throw new NotFoundException(`Employee not found for keycloakId: ${keycloakId}`);
      }
      
      if (!employee._id) {
        console.error(`TeamLeadId is not set for employee with keycloakId: ${keycloakId}`);
        throw new NotFoundException(`TeamLeadId is not set for employee with keycloakId: ${keycloakId}`);
      }
      
      return employee._id.toString();
    } catch (error) {
      console.error(`Error finding team lead ID for keycloakId ${keycloakId}:`, error);
      throw new NotFoundException(`Error finding team lead ID for keycloakId ${keycloakId}.`);
    }
  }
  async getEmployeesByTeamLead(teamLeadId: string): Promise<Employee[]> {
    return this.employeeModel.find({ TeamLeadId: new Types.ObjectId(teamLeadId) }).exec();
  }
 
}
