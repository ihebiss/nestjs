import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { employeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { Employee, EmployeeSchema } from 'src/schemas/Employees.schema';
import { LeaveEmployees, EmployeeLeaveSchema } from 'src/schemas/LeaveEmployees.schema';
import { LeaveType, LeaveTypeSchema } from 'src/schemas/LeaveTypes.schema';



@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Employee.name, schema: EmployeeSchema },
      { name: LeaveEmployees.name, schema: EmployeeLeaveSchema },
      { name: LeaveType.name, schema: LeaveTypeSchema },
    ]),
 
  ],
  controllers: [employeesController],
  providers: [EmployeesService],
})
export class employeesModule {}
