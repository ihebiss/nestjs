import { Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { EmployeesLeavesService } from "./employeesLeave.service";
import { CreateLeaveEmployeesDto } from "./dto/create-leave-employees.dto";
import { LeaveEmployees } from "src/schemas/LeaveEmployees.schema";
import { AuthGuard } from "nest-keycloak-connect";
import { Request } from 'express';
import { KeycloakId } from "src/Keycloak/keycloak.decorator";
import { UpdateLeaveEmployeesDto } from "./dto/update-leave-employees.dto";
import { NotificationService } from "src/notifications/notification.service";
import { leaveTypesService } from "src/leaveTypes/leaveTypes.service";
import { EmployeesService } from "src/employees/employees.service";
@Controller('employees-leaves')
export class employeesLeavesController{
   
        constructor(private readonly leaveEmployeesService: EmployeesLeavesService,
          private readonly employeesService: EmployeesService,
    private readonly leaveTypesService: leaveTypesService,
          private readonly notificationService: NotificationService,
        ) {}
        @UseGuards(AuthGuard)
        @Post()
      
        async create(  @KeycloakId() keycloakId: string,@Body() createLeaveRequestDto: CreateLeaveEmployeesDto): Promise<LeaveEmployees> {
         
            try {
              const startDate = new Date(createLeaveRequestDto.startDate);
              const endDate = new Date(createLeaveRequestDto.endDate);
              const employee = await this.employeesService.getEmployeeById(createLeaveRequestDto.employeeId);
              const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee';
              const leaveType = await this.leaveTypesService.findOne(createLeaveRequestDto.leaveTypeId);
              const leaveTypeName = leaveType ? leaveType.name : 'Unknown Leave Type';
              const startDateString = `${startDate.toLocaleDateString('fr-FR')} ${createLeaveRequestDto.startPeriod}`;
              const endDateString = `${endDate.toLocaleDateString('fr-FR')} ${createLeaveRequestDto.endPeriod}`;
              const textMessage = `Bonjour,
        ${employeeName} a soumis une nouvelle demande de congé de ${startDateString} à ${endDateString}.
        Type de congé : ${leaveTypeName}
        Merci de vérifier la demande.
        Cordialement,
        Votre Système de Gestion des Congés`;
              const htmlMessage = `<p>Bonjour,</p>
        <p>${employeeName} a soumis une nouvelle demande de congé de ${startDateString} à ${endDateString}.</p>
        <p>Type de congé : ${leaveTypeName}</p>
        <p>Merci de vérifier la demande.</p>
        <p>Cordialement,</p>
        <p>Votre Système de Gestion des Congés</p>`;
              const leaveRequest = await this.leaveEmployeesService.create({
                ...createLeaveRequestDto,
                keycloakId,
                startDate,
                endDate,
              });
        
              const { teamLeadEmail, managerEmail } = await this.leaveEmployeesService.getNotificationEmails(createLeaveRequestDto.employeeId);
              await this.notificationService.sendNotificationEmail(
                teamLeadEmail,
                'Nouvelle demande de congé',
                textMessage,
                htmlMessage
              );
        
              await this.notificationService.sendNotificationEmail(
                managerEmail,
                'Nouvelle demande de congé',
                textMessage,
                htmlMessage
              );
        
              return leaveRequest;
            } catch (error) {
              console.error('Error creating LeaveRequest:', error);
              throw error;
            }
          }
        
        @Get()
        async findAll( @KeycloakId() keycloakId: string): Promise<LeaveEmployees[]> {
        return this.leaveEmployeesService.findAll(keycloakId);
        }
        @Get(':id')
        async findOne(@Param('id') id: string): Promise<LeaveEmployees> {
          return this.leaveEmployeesService.findOne(id);
        }
       
        @Get('employee/:id')
       
        async findByEmployeeId(@Param('id') id: string) {
    
          return this.leaveEmployeesService.findOne(id);
        }
  
        @Put(':id')
  async update(
    @Param('id') id: string, 
          @Body() updateLeaveRequestDto: UpdateLeaveEmployeesDto,
          @Req() request: Request
        ): Promise<LeaveEmployees> {
          const currentUserId = request.user?.sub; 
          if (!currentUserId) {
            throw new ForbiddenException('User not authenticated');
          }
      
          return this.leaveEmployeesService.update(id, updateLeaveRequestDto, currentUserId);
        }
        @Delete(':id')
        async remove(@Param('id') id: string): Promise<LeaveEmployees> {
          return this.leaveEmployeesService.remove(id);
        }
        @Get('team/:teamLeadId')
  async findTeamLeaves(@Param('teamLeadId') teamLeadId: string): Promise<LeaveEmployees[]> {
    return this.leaveEmployeesService.findTeamLeaves(teamLeadId);
  }
  @Get('by-keycloak-id/:keycloakId')
  async getLeavesByKeycloakId(@Param('keycloakId') keycloakId: string) {
    return this.leaveEmployeesService.getLeavesByKeycloakId(keycloakId);
  }
}