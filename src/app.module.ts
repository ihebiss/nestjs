import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { employeesModule } from './employees/employees.module';
import { LeaveTypeModule} from './leaveTypes/leaveTypes.module';
 
import { employeesLeaveModule } from './employeesLeave/employeesLeave.module';
 

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
   
    employeesModule,
    LeaveTypeModule,
    employeesLeaveModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
