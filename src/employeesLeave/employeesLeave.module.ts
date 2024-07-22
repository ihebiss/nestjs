import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { LeaveEmployees,EmployeeLeaveSchema } from 'src/schemas/LeaveEmployees.schema';
import { employeesLeavesController } from './employeesLeave.controller';
import { EmployeesLeavesService } from './employeesLeave.service';
import { LeaveType, LeaveTypeSchema } from 'src/schemas/LeaveTypes.schema';
import { Employee } from 'src/schemas/Employees.schema';
import { EmployeesService } from 'src/employees/employees.service';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LeaveEmployees.name, schema: EmployeeLeaveSchema },
      {name: LeaveType.name,schema:LeaveTypeSchema},
      {name:Employee.name,schema:EmployeeLeaveSchema}

    ]),
  ],
  controllers: [employeesLeavesController],
  providers: [EmployeesLeavesService]
})
export class employeesLeaveModule {}
