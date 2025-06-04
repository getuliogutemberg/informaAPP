import nodemailer from 'nodemailer';
import EmailTemplates from '../utils/emailTemplates';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  
  private ensureTransporter(): void {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    }
  }  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      this.ensureTransporter();

      // Verificar configurações
      if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        throw new Error('Configurações SMTP não encontradas no .env');
      }

      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html
      };
      
      const result = await this.transporter!.sendMail(mailOptions);
      console.log(`Email enviado para ${options.to}:`, result.messageId);
    } catch (error) {
      console.error('Erro detalhado ao enviar email:', error);
      
      if (error instanceof Error) {
        // Tratar erros específicos
        if (error.message.includes('authentication') || error.message.includes('Invalid login')) {
          throw new Error('Erro de autenticação SMTP - verifique as credenciais do Gmail');
        } else if (error.message.includes('connection') || error.message.includes('ECONNREFUSED')) {
          throw new Error('Erro de conexão SMTP - verifique o host e porta');
        } else if (error.message.includes('timeout')) {
          throw new Error('Timeout na conexão SMTP');
        } else {
          throw new Error(`Falha ao enviar email: ${error.message}`);
        }
      }
      
      throw new Error('Falha ao enviar email');
    }
  }  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/redefinir-senha/${resetToken}`;
    
    const html = EmailTemplates.getPasswordResetTemplate({
      resetUrl
    });

    await this.sendEmail({
      to: email,
      subject: 'Recuperação de Senha - SIGMA',
      html
    });
  }

  // Envia email de boas-vindas para novos usuários
  async sendWelcomeEmail(email: string, userName: string): Promise<void> {
    const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`;
    
    const html = EmailTemplates.getWelcomeTemplate({
      userName,
      loginUrl
    });

    await this.sendEmail({
      to: email,
      subject: 'Bem-vindo ao SIGMA',
      html
    });
  }


  // Envia email de notificação geral
  async sendNotificationEmail(
    email: string, 
    title: string, 
    message: string,
    actionUrl?: string,
    actionText?: string
  ): Promise<void> {
    const html = EmailTemplates.getNotificationTemplate({
      title,
      message,
      actionUrl,
      actionText
    });

    await this.sendEmail({
      to: email,
      subject: `${title} - SIGMA`,
      html
    });
  }

  // Método de teste para verificar configurações
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      this.ensureTransporter();
      await this.transporter!.verify();
      return { success: true, message: 'Conexão SMTP funcionando corretamente' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      return { success: false, message: `Erro na conexão SMTP: ${errorMessage}` };
    }
  }
}

export default new EmailService();
