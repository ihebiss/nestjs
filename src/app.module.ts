import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';

import { employeesModule } from './employees/employees.module';
import { LeaveTypeModule } from './leaveTypes/leaveTypes.module';
import { employeesLeaveModule } from './employeesLeave/employeesLeave.module';

import { KeycloakConnectModule } from 'nest-keycloak-connect';
import { KeyCloakConfigModule } from './Keycloak/keycloak.module';
import { KeycloakConfigService } from './Keycloak/keycloak.service';
import { GlobalKeyCloakGuard } from './Keycloak/auth.guard';
import { SubtypesModule } from './subtypes/subtypes.module';
import { NotificationModule } from './notifications/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    employeesModule,
    LeaveTypeModule,
    employeesLeaveModule,
    KeyCloakConfigModule,
    SubtypesModule,
    NotificationModule,
    KeycloakConnectModule.registerAsync({
      useClass: KeycloakConfigService,
    }),
  ],
  controllers: [],
  providers: [
    ...GlobalKeyCloakGuard,
  ],
})
export class AppModule {}
