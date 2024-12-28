import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeaveEmployees, EmployeeLeaveSchema } from 'src/schemas/LeaveEmployees.schema';
import { employeesLeavesController } from './employeesLeave.controller';
import { EmployeesLeavesService } from './employeesLeave.service';
import { LeaveType, LeaveTypeSchema } from 'src/schemas/LeaveTypes.schema';
import { Employee, EmployeeSchema } from 'src/schemas/Employees.schema';

import { KeyCloakConfigModule } from 'src/Keycloak/keycloak.module';
import { KeycloakConfigService } from 'src/Keycloak/keycloak.service';
import { KeycloakConnectModule } from 'nest-keycloak-connect';
import { Subtype, SubtypeSchema } from 'src/schemas/Subtype.schema';
import { SubtypesModule } from 'src/subtypes/subtypes.module';
import { NotificationService } from 'src/notifications/notification.service';
// import { MailService } from 'src/mailing/mail.service';
import { EmployeesService } from 'src/employees/employees.service';
import { leaveTypesService } from 'src/leaveTypes/leaveTypes.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LeaveEmployees.name, schema: EmployeeLeaveSchema },
      { name: LeaveType.name, schema: LeaveTypeSchema },
      { name: Employee.name, schema: EmployeeSchema },  
      { name: Subtype.name, schema: SubtypeSchema },
      
  
    ]),
    SubtypesModule,
    KeycloakConnectModule.registerAsync({
      useClass: KeycloakConfigService,
    }),
   
  ],
  controllers: [employeesLeavesController],
  providers: [EmployeesLeavesService,NotificationService,EmployeesService,leaveTypesService],
})
export class employeesLeaveModule {}
