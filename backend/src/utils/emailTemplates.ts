interface EmailTemplateOptions {
  resetUrl: string;
  recipientName?: string;
}

interface WelcomeEmailOptions {
  userName: string;
  loginUrl: string;
}

interface NotificationEmailOptions {
  title: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
}

class EmailTemplates {
  static getPasswordResetTemplate(options: EmailTemplateOptions): string {
    const { resetUrl, recipientName = 'Usuário' } = options;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recuperação de Senha - SIGMA</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(10, 28, 68, 0.1); overflow: hidden;">
          
          <!-- Header com gradiente SIGMA -->
          <div style="background: linear-gradient(135deg, #3183CF 0%, #0A1C44 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 32px; font-weight: bold; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              SIGMA
            </h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px; font-weight: 300;">
              Sistema de Gestão e Monitoramento Avançado
            </p>
          </div>
          
          <!-- Conteúdo principal -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #0A1C44; font-size: 24px; font-weight: 600; margin: 0 0 20px 0; text-align: center;">
              Recuperação de Senha
            </h2>
            
            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Olá${recipientName !== 'Usuário' ? `, ${recipientName}` : ''}! Você solicitou a recuperação de senha para sua conta no <strong>SIGMA</strong>.
            </p>
            
            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              Para redefinir sua senha com segurança, clique no botão abaixo:
            </p>
            
            <!-- Botão de ação -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="display: inline-block; background: linear-gradient(135deg, #3183CF 0%, #2570B5 100%); 
                        color: #ffffff; padding: 16px 32px; text-decoration: none; 
                        border-radius: 6px; font-size: 16px; font-weight: 600; 
                        box-shadow: 0 4px 12px rgba(49, 131, 207, 0.3);
                        transition: all 0.3s ease;">
                🔐 Redefinir Minha Senha
              </a>
            </div>
            
            <!-- Informações de segurança -->
            <div style="background-color: #f8f9ff; border-left: 4px solid #3183CF; padding: 20px; margin: 30px 0; border-radius: 0 6px 6px 0;">
              <p style="color: #0A1C44; font-size: 14px; font-weight: 600; margin: 0 0 8px 0;">
                ⚠️ Importante para sua segurança:
              </p>
              <ul style="color: #333333; font-size: 14px; line-height: 1.5; margin: 0; padding-left: 20px;">
                <li>Este link expira em <strong>1 hora</strong> por segurança</li>
                <li>Use apenas se você solicitou esta recuperação</li>
                <li>Nunca compartilhe este link com terceiros</li>
              </ul>
            </div>
            
            <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
              Se você não solicitou esta recuperação de senha, pode ignorar este email com segurança. 
              Sua conta permanecerá protegida.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f8f9ff; padding: 30px; text-align: center; border-top: 1px solid #e0e6f0;">
            <p style="color: #666666; font-size: 12px; margin: 0 0 10px 0;">
              Problemas com o botão? Copie e cole este link no seu navegador:
            </p>
            <p style="font-size: 11px; color: #3183CF; word-break: break-all; margin: 0 0 20px 0;">
              <a href="${resetUrl}" style="color: #3183CF; text-decoration: none;">${resetUrl}</a>
            </p>
            
            <div style="border-top: 1px solid #e0e6f0; padding-top: 20px; margin-top: 20px;">
              <p style="color: #999999; font-size: 11px; margin: 0;">
                Este email foi enviado automaticamente pelo sistema <strong>SIGMA</strong><br>
                Por favor, não responda a este email.
              </p>
            </div>
          </div>
          
        </div>
      </body>
      </html>
    `;
  }

  // Template para email de boas-vindas
  static getWelcomeTemplate(options: WelcomeEmailOptions): string {
    const { userName, loginUrl } = options;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bem-vindo ao SIGMA</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(10, 28, 68, 0.1); overflow: hidden;">
          
          <!-- Header com gradiente SIGMA -->
          <div style="background: linear-gradient(135deg, #3183CF 0%, #0A1C44 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 32px; font-weight: bold; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              SIGMA
            </h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px; font-weight: 300;">
              Sistema de Gestão e Monitoramento Avançado
            </p>
          </div>
          
          <!-- Conteúdo principal -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #0A1C44; font-size: 24px; font-weight: 600; margin: 0 0 20px 0; text-align: center;">
              🎉 Bem-vindo(a) ao SIGMA!
            </h2>
            
            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Olá, <strong>${userName}</strong>! Sua conta foi criada com sucesso no sistema SIGMA.
            </p>
            
            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              Agora você pode acessar todas as funcionalidades da plataforma. Clique no botão abaixo para fazer seu primeiro login:
            </p>
            
            <!-- Botão de ação -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${loginUrl}" 
                 style="display: inline-block; background: linear-gradient(135deg, #3183CF 0%, #2570B5 100%); 
                        color: #ffffff; padding: 16px 32px; text-decoration: none; 
                        border-radius: 6px; font-size: 16px; font-weight: 600; 
                        box-shadow: 0 4px 12px rgba(49, 131, 207, 0.3);
                        transition: all 0.3s ease;">
                🚀 Acessar Plataforma
              </a>
            </div>
          </div>
          
          ${this.getEmailFooter()}
          
        </div>
      </body>
      </html>
    `;
  }

  // Template para notificações gerais
  static getNotificationTemplate(options: NotificationEmailOptions): string {
    const { title, message, actionUrl, actionText } = options;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title} - SIGMA</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(10, 28, 68, 0.1); overflow: hidden;">
          
          <!-- Header com gradiente SIGMA -->
          <div style="background: linear-gradient(135deg, #3183CF 0%, #0A1C44 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 32px; font-weight: bold; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              SIGMA
            </h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px; font-weight: 300;">
              Sistema de Gestão e Monitoramento Avançado
            </p>
          </div>
          
          <!-- Conteúdo principal -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #0A1C44; font-size: 24px; font-weight: 600; margin: 0 0 20px 0; text-align: center;">
              ${title}
            </h2>
            
            <div style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              ${message}
            </div>
            
            ${actionUrl && actionText ? `
            <!-- Botão de ação -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${actionUrl}" 
                 style="display: inline-block; background: linear-gradient(135deg, #3183CF 0%, #2570B5 100%); 
                        color: #ffffff; padding: 16px 32px; text-decoration: none; 
                        border-radius: 6px; font-size: 16px; font-weight: 600; 
                        box-shadow: 0 4px 12px rgba(49, 131, 207, 0.3);
                        transition: all 0.3s ease;">
                ${actionText}
              </a>
            </div>
            ` : ''}
          </div>
          
          ${this.getEmailFooter()}
          
        </div>
      </body>
      </html>
    `;
  }

  // Footer padrão para todos os emails
  private static getEmailFooter(): string {
    return `
      <!-- Footer -->
      <div style="background-color: #f8f9ff; padding: 30px; text-align: center; border-top: 1px solid #e0e6f0;">
        <div style="border-top: 1px solid #e0e6f0; padding-top: 20px; margin-top: 20px;">
          <p style="color: #999999; font-size: 11px; margin: 0;">
            Este email foi enviado automaticamente pelo sistema <strong>SIGMA</strong><br>
            Por favor, não responda a este email.
          </p>
        </div>
      </div>
    `;
  }


  // Template base que pode ser usado para customizações
  static getBaseTemplate(content: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SIGMA</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(10, 28, 68, 0.1); overflow: hidden;">
          
          <!-- Header com gradiente SIGMA -->
          <div style="background: linear-gradient(135deg, #3183CF 0%, #0A1C44 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 32px; font-weight: bold; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              SIGMA
            </h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px; font-weight: 300;">
              Sistema de Gestão e Monitoramento Avançado
            </p>
          </div>
          
          <!-- Conteúdo customizado -->
          ${content}
          
          ${this.getEmailFooter()}
          
        </div>
      </body>
      </html>
    `;
  }
}

export default EmailTemplates;
export { EmailTemplateOptions, WelcomeEmailOptions, NotificationEmailOptions };
