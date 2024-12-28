import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'leavesystem738@gmail.com',
        pass: 'vxvz kyvq bydo jvfs' 
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
    });
  }

  async sendNotificationEmail(to: string, subject: string, text: string, html: string) {
    const mailOptions = {
      from: 'leavesystem738@gmail.com',
      to,
      subject,
      text,
      html,
    };
  
    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }}