import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { LeaveEmployees } from "src/schemas/LeaveEmployees.schema";
import { CreateLeaveEmployeesDto } from "./dto/create-leave-employees.dto";
import { Employee } from "src/schemas/Employees.schema";
import { LeaveType } from "src/schemas/LeaveTypes.schema";
import {differenceInCalendarDays} from 'date-fns'
@Injectable()
export class EmployeesLeavesService{
    constructor(
        @InjectModel(LeaveEmployees.name) private readonly leaveRequestModel: Model<LeaveEmployees>,
        @InjectModel(Employee.name) private readonly employeeModel: Model<Employee>,
        @InjectModel(LeaveType.name) private readonly leaveTypeModel: Model<LeaveType>,
   
      ) {}
    
      async create(createLeaveRequestDto: CreateLeaveEmployeesDto): Promise<LeaveEmployees> {
        const { employeeId, leaveTypeId, startDate, endDate, startPeriod, endPeriod } = createLeaveRequestDto;
    
        const employee = await this.employeeModel.findById(employeeId).exec();
        if (!employee) {
          throw new NotFoundException(`Employee with ID ${employeeId} not found`);
        }
    
        const leaveType = await this.leaveTypeModel.findById(leaveTypeId).exec();
        if (!leaveType) {
          throw new NotFoundException(`LeaveType with ID ${leaveTypeId} not found`);
        }
    
        const leaveRequest = new this.leaveRequestModel({
          employeeId,
          leaveTypeId,
          startDate,
          endDate,
          startPeriod,
          endPeriod,
        });
    
        await leaveRequest.save();
    
        // Calculate leave days including partial days
        const leaveDays = this.calculateLeaveDays(new Date(startDate), new Date(endDate), startPeriod, endPeriod);
        const leaveBalance = employee.leaveBalances.find(balance => balance.leaveTypeId.toString() === leaveTypeId.toString());
    
        if (leaveBalance) {
          leaveBalance.balance -= leaveDays;
        } else {
          throw new NotFoundException(`Leave balance for leaveTypeId ${leaveTypeId} not found for employee ${employeeId}`);
        }
    
        await employee.save();
    
        return leaveRequest;
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
    
      async findAll(): Promise<LeaveEmployees[]> {
        return this.leaveRequestModel.find().populate('employeeId leaveTypeId').exec();
    }
     async findOne(id: string): Promise<LeaveEmployees> {
            const leaveRequest = await this.leaveRequestModel.findById(id).populate('employeeId leaveTypeId').exec();
            if (!leaveRequest) {
              throw new NotFoundException(`Leave request with ID ${id} not found`);
            }
            return leaveRequest;
          }
          async update(id: string, updateLeaveRequestDto: CreateLeaveEmployeesDto): Promise<LeaveEmployees> {
            const existingLeaveRequest = await this.leaveRequestModel.findByIdAndUpdate(id, updateLeaveRequestDto, { new: true }).exec();
            if (!existingLeaveRequest) {
              throw new NotFoundException(`Leave request with ID ${id} not found`);
            }
            return existingLeaveRequest;
          }
        
          async remove(id: string): Promise<LeaveEmployees> {
            const deletedLeaveRequest = await this.leaveRequestModel.findByIdAndDelete(id).exec();
            if (!deletedLeaveRequest) {
              throw new NotFoundException(`Leave request with ID ${id} not found`);
            }
            return deletedLeaveRequest;
          }
          async findByEmployeeId(employeeId: string): Promise<LeaveEmployees[]> {
            return this.leaveRequestModel.find({ employeeId }).populate('employeeId leaveTypeId').exec();
          }
          async findTeamLeaves(teamLeadId: string): Promise<LeaveEmployees[]> {
            try {
              console.log(`Finding team members for Team Lead ID: ${teamLeadId}`);
              
              // Convertir teamLeadId en ObjectId
              const teamLeadObjectId = new this.employeeModel.base.Types.ObjectId(teamLeadId);
              
              // Rechercher les membres de l'équipe en utilisant 'TeamLeadId' avec la bonne casse
              const teamMembers = await this.employeeModel.find({ TeamLeadId: teamLeadObjectId }).exec();
              
              // Vérifier s'il y a des membres d'équipe trouvés
              if (teamMembers.length === 0) {
                throw new NotFoundException(`No team members found for Team Lead ID: ${teamLeadId}`);
              }
              
              console.log(`Found ${teamMembers.length} team members for Team Lead ID: ${teamLeadId}`);
              
              // Extraire les IDs des membres de l'équipe
              const teamMemberIds = teamMembers.map(member => member._id);
              
              // Rechercher les demandes de congé des membres de l'équipe
              const leaveRequests = await this.leaveRequestModel.find({ employeeId: { $in: teamMemberIds } }).populate('employeeId leaveTypeId').exec();
              
              return leaveRequests;
            } catch (error) {
              throw new NotFoundException(`Team Lead with ID ${teamLeadId} not found.`);
            }
          }
        
       
   
        }
