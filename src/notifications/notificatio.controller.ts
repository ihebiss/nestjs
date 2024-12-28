import { Body, Controller, Post } from "@nestjs/common";
import { NotificationService } from "./notification.service";

@Controller('notifications')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Post('send-notification')
    async sendNotification(
        @Body('to') to: string,
        @Body('subject') subject: string,
        @Body('text') text: string,
        @Body('html') html: string
    ) {
        try {
            await this.notificationService.sendNotificationEmail(to, subject, text, html);
            return { message: 'Notification sent successfully' };
        } catch (error) {
            console.error('Error sending notification:', error);
            return { message: 'Failed to send notification', error };
        }
    }}