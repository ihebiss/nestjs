import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeaveEmployees, EmployeeLeaveSchema } from 'src/schemas/LeaveEmployees.schema';
import { employeesLeavesController } from './employeesLeave.controller';
import { EmployeesLeavesService } from './employeesLeave.service';
import { LeaveType, LeaveTypeSchema } from 'src/schemas/LeaveTypes.schema';
import { Employee, EmployeeSchema } from 'src/schemas/Employees.schema';
import { AuthModule } from 'src/auth/auth.module';  // Import AuthModule
import { KeyCloakConfigModule } from 'src/Keycloak/keycloak.module';
import { KeycloakConfigService } from 'src/Keycloak/keycloak.service';
import { KeycloakConnectModule } from 'nest-keycloak-connect';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LeaveEmployees.name, schema: EmployeeLeaveSchema },
      { name: LeaveType.name, schema: LeaveTypeSchema },
      { name: Employee.name, schema: EmployeeSchema },  
      
  
    ]),
    KeycloakConnectModule.registerAsync({
      useClass: KeycloakConfigService,
    }),
  ],
  controllers: [employeesLeavesController],
  providers: [EmployeesLeavesService],
})
export class employeesLeaveModule {}
