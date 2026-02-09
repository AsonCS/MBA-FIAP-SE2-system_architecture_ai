-- Welcome Email Template
INSERT INTO message_templates (id, name, subject, body, required_variables, channel, created_at, updated_at)
VALUES (
  'welcome-email',
  'Welcome Email',
  'Bem-vindo ao AutoFix, {{name}}!',
  '<html>
    <body style="font-family: Arial, sans-serif; padding: 20px;">
      <h1>Olá, {{name}}!</h1>
      <p>Seja bem-vindo ao <strong>AutoFix</strong>!</p>
      <p>Estamos felizes em tê-lo conosco. Sua conta foi criada com sucesso.</p>
      <p>ID do Usuário: {{userId}}</p>
      <p>Agora você pode acessar nossa plataforma e começar a gerenciar suas ordens de serviço.</p>
      <br>
      <p>Atenciosamente,<br>Equipe AutoFix</p>
    </body>
  </html>',
  ARRAY['name', 'userId'],
  'EMAIL',
  NOW(),
  NOW()
);

-- Password Recovery Template
INSERT INTO message_templates (id, name, subject, body, required_variables, channel, created_at, updated_at)
VALUES (
  'password-recovery',
  'Password Recovery',
  'Recuperação de Senha - AutoFix',
  '<html>
    <body style="font-family: Arial, sans-serif; padding: 20px;">
      <h1>Recuperação de Senha</h1>
      <p>Você solicitou a recuperação de senha da sua conta AutoFix.</p>
      <p>Clique no link abaixo para redefinir sua senha:</p>
      <a href="{{resetLink}}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
        Redefinir Senha
      </a>
      <p>Este link expira em: {{formatDate expiresAt}}</p>
      <p>Se você não solicitou esta recuperação, ignore este e-mail.</p>
      <br>
      <p>Atenciosamente,<br>Equipe AutoFix</p>
    </body>
  </html>',
  ARRAY['resetLink', 'expiresAt'],
  'EMAIL',
  NOW(),
  NOW()
);

-- Order Status Update Template (WhatsApp)
INSERT INTO message_templates (id, name, subject, body, required_variables, channel, created_at, updated_at)
VALUES (
  'order-status-update',
  'Order Status Update',
  '',
  'Olá {{customerName}}! 👋

Sua ordem de serviço #{{orderId}} teve o status atualizado para: *{{uppercase status}}*

{{#if estimatedCompletion}}
Previsão de conclusão: {{formatDate estimatedCompletion}}
{{/if}}

Obrigado por escolher o AutoFix! 🚗',
  ARRAY['customerName', 'orderId', 'status'],
  'WHATSAPP',
  NOW(),
  NOW()
);
