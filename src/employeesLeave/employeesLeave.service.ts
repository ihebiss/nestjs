import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UseGuards } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model, Types } from "mongoose";
import { LeaveEmployees } from "src/schemas/LeaveEmployees.schema";
import { CreateLeaveEmployeesDto } from "./dto/create-leave-employees.dto";
import { Employee } from "src/schemas/Employees.schema";
import { LeaveType } from "src/schemas/LeaveTypes.schema";
import {differenceInCalendarDays} from 'date-fns'
import { UpdateLeaveEmployeesDto } from "./dto/update-leave-employees.dto";
import { toObjectId } from "./transformer";
import { Schema as MongooseSchema } from 'mongoose';
import { EmployeesService } from "src/employees/employees.service";

@Injectable()
export class EmployeesLeavesService{

    constructor(
     private readonly employeesService: EmployeesService,
        @InjectModel(LeaveEmployees.name) private readonly leaveRequestModel: Model<LeaveEmployees>,
        @InjectModel(Employee.name) private readonly employeeModel: Model<Employee>,
        @InjectModel(LeaveType.name) private readonly leaveTypeModel: Model<LeaveType>,
   
      ) {}
    
      async create(createLeaveRequestDto: CreateLeaveEmployeesDto): Promise<LeaveEmployees> {
        const { employeeId, leaveTypeId, startDate, endDate, startPeriod, subtype, endPeriod, keycloakId, explanation, attachment, reason } = createLeaveRequestDto;
    
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
            keycloakId: employee.keycloakId,
            explanation,
            attachment,
            subtype: subtype ? subtype : undefined,
            reason
        });
    
        await leaveRequest.save();
        const leaveDays = this.calculateLeaveDays(new Date(startDate), new Date(endDate), startPeriod, endPeriod);
        let leaveBalanceUpdated = false;
    
        for (const balance of employee.leaveBalances) {
            if (!balance.leaveTypeId) {
                throw new BadRequestException(`Missing leaveTypeId in leaveBalances for employee ${employeeId}`);
            }
    
            if (balance.leaveTypeId.toString() === leaveTypeId.toString()) {
                if (leaveType.name === 'Death') {
                    if (subtype) {
                        const subtypeBalance = balance.subtypes.find(st => st._id.toString() === subtype.toString());
                        if (subtypeBalance) {
                            subtypeBalance.nbdays -= leaveDays; 
                            leaveBalanceUpdated = true;
                        } else {
                            throw new NotFoundException(`Subtype with ID ${subtype} not found for leaveTypeId ${leaveTypeId}`);
                        }
                    } else {
                        throw new BadRequestException(`Subtype is required for leaveTypeId ${leaveTypeId}`);
                    }
                } else {
                    if (subtype) {
                        const subtypeBalance = balance.subtypes.find(st => st._id.toString() === subtype.toString());
                        if (subtypeBalance) {
                            subtypeBalance.nbdays -= leaveDays; 
                            balance.balance -= leaveDays;
                            leaveBalanceUpdated = true;
                        } else {
                            throw new NotFoundException(`Subtype with ID ${subtype} not found for leaveTypeId ${leaveTypeId}`);
                        }
                    } else {
                        balance.balance -= leaveDays;
                        leaveBalanceUpdated = true;
                    }
                }
            }
        }
    
        if (leaveBalanceUpdated) {
            await employee.save();
        }
    
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
    
      async findAll(currentUserId: string): Promise<LeaveEmployees[]> {
        const currentUser = await this.employeeModel.findOne({ keycloakId: currentUserId }).exec();
        if (!currentUser) {
          throw new NotFoundException(`User with ID ${currentUserId} not found`);
        }
          return this.leaveRequestModel.find({ employeeId: { $ne: currentUser._id } }).exec();
      }
     async findOne(employeeId: string): Promise<LeaveEmployees> {
      try {
        const employeeObjectId = new this.leaveRequestModel.base.Types.ObjectId(employeeId);
          return this.leaveRequestModel.findOne({ employeeId: employeeObjectId }).populate('employeeId leaveTypeId').exec();
      } catch (error) {
        throw new NotFoundException(`No leave requests found for Employee ID ${employeeId}`);
      }
          }
          async update(
            id: string, 
            updateLeaveRequestDto: UpdateLeaveEmployeesDto, 
            currentUserId: string,
          ): Promise<LeaveEmployees> {
            if (!Types.ObjectId.isValid(id)) {
              throw new BadRequestException('Invalid leave request ID format');
            }
          
            const existingLeaveRequest = await this.leaveRequestModel.findById(id).exec();
            if (!existingLeaveRequest) {
              throw new NotFoundException(`Leave request with ID ${id} not found`);
            }
          
           
          
            const currentUser = await this.employeeModel.findOne({ keycloakId: currentUserId }).exec(); 
            if (!currentUser) {
              throw new NotFoundException(`User with ID ${currentUserId} not found`);
            }
          
            const isTeamLead = currentUser.role === 'TeamLead';
          
            if (updateLeaveRequestDto.employeeId) {
              let existingEmployeeId: Types.ObjectId;
          
              if (existingLeaveRequest.employeeId instanceof Types.ObjectId) {
                existingEmployeeId = existingLeaveRequest.employeeId;
              } else {
                existingEmployeeId = new Types.ObjectId(existingLeaveRequest.employeeId as unknown as string); 
              }
          
              const leaveEmployeeId = new Types.ObjectId(updateLeaveRequestDto.employeeId); 
          
              const isSameEmployee = existingEmployeeId.equals(leaveEmployeeId);
              const isSameTeam = isTeamLead && currentUser._id===(existingEmployeeId);
          
              if (!isSameEmployee && !isSameTeam) {
                throw new ForbiddenException('You are not authorized to modify this leave request');
              }
            }
            existingLeaveRequest.employeeId = toObjectId(updateLeaveRequestDto.employeeId) as any ?? existingLeaveRequest.employeeId;
            existingLeaveRequest.leaveTypeId = toObjectId(updateLeaveRequestDto.leaveTypeId) as any ?? existingLeaveRequest.leaveTypeId;
            existingLeaveRequest.subtype = toObjectId(updateLeaveRequestDto.subtype) as any ?? existingLeaveRequest.subtype;
            existingLeaveRequest.startDate = updateLeaveRequestDto.startDate ?? existingLeaveRequest.startDate;
            existingLeaveRequest.endDate = updateLeaveRequestDto.endDate ?? existingLeaveRequest.endDate;
            existingLeaveRequest.startPeriod = updateLeaveRequestDto.startPeriod ?? existingLeaveRequest.startPeriod;
            existingLeaveRequest.endPeriod = updateLeaveRequestDto.endPeriod ?? existingLeaveRequest.endPeriod;
            existingLeaveRequest.status = updateLeaveRequestDto.status ?? existingLeaveRequest.status;
            existingLeaveRequest.explanation = updateLeaveRequestDto.explanation ?? existingLeaveRequest.explanation;
            existingLeaveRequest.attachment = updateLeaveRequestDto.attachment ?? existingLeaveRequest.attachment;
            existingLeaveRequest.reason = updateLeaveRequestDto.reason ?? existingLeaveRequest.reason;
            return existingLeaveRequest.save();
          }
          async remove(id: string): Promise<LeaveEmployees> {
            const deletedLeaveRequest = await this.leaveRequestModel.findByIdAndDelete(id).exec();
            if (!deletedLeaveRequest) {
              throw new NotFoundException(`Leave request with ID ${id} not found`);
            }
            return deletedLeaveRequest;
          }
          async findByEmployeeId(employeeId: string): Promise<LeaveEmployees[]> {
            return this.leaveRequestModel.find({ employeeId })//.populate('employeeId leaveTypeId').exec();
          }
          async findTeamLeaves(teamLeadId: string): Promise<LeaveEmployees[]> {
            try {
              const teamLeadObjectId = new mongoose.Types.ObjectId(teamLeadId);
              const teamMembers = await this.employeeModel.find({ TeamLeadId: teamLeadObjectId }).exec();
              if (teamMembers.length === 0) {
                return []; 
              }
              const teamMemberIds = teamMembers.map(member => member._id);
              const leaveRequests = await this.leaveRequestModel.find({ employeeId: { $in: teamMemberIds } })
                //.populate('employeeId leaveTypeId')
                .exec();
              return leaveRequests;
            } catch (error) {
              console.error(`Error finding leaves for teamLeadId ${teamLeadId}:`, error);
              throw new Error(`Failed to find leaves for teamLeadId ${teamLeadId}`);
            }
          }
          
          async getLeavesByKeycloakId(keycloakId: string): Promise<LeaveEmployees[]> {
            return this.leaveRequestModel.find({ keycloakId })//.populate('employeeId leaveTypeId').exec();
          }
       
          async getNotificationEmails(employeeId: string): Promise<{ teamLeadEmail?: string; managerEmail: string }> {
            const employee = await this.employeesService.getEmployeeById(employeeId);
          
            if (!employee) {
              throw new Error('Employee not found');
            }
          
            let teamLeadEmail;
            let managerEmail = 'default_manager_email@example.com';
          
            if (employee.TeamLeadId) {
              const teamLeadId = employee.TeamLeadId.toString();
              const teamLead = await this.employeesService.getEmployeeById(teamLeadId);
              teamLeadEmail = teamLead ? teamLead.email : 'default_team_lead_email@example.com';
            }
            const manager = employee.TeamLeadId 
              ? await this.employeesService.getManagerByDepartment(employee.department) 
              : await this.employeesService.getManagerByDepartment(employee.department);
          
            managerEmail = manager ? manager.email : 'default_manager_email@example.com';
          
            return {
              ...(teamLeadEmail ? { teamLeadEmail } : {}), 
              managerEmail,
            };
          }
        }          