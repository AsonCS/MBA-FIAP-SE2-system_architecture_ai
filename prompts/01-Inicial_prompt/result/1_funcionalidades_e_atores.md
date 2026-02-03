# Funcionalidades e Atores

## 👥 Tipos de Usuários (Atores)
O sistema conta com Controle de Acesso Baseado em Funções (RBAC).

1.  **Administrador da Oficina (Tenant Owner):** Acesso total, gerencia usuários, configura dados da empresa e visualiza relatórios financeiros.
2.  **Recepcionista:** Cadastra clientes, agenda serviços e abre Ordens de Serviço (O.S.).
3.  **Mecânico:** Visualiza fila de tarefas, requisita peças, atualiza status da O.S. e registra horas trabalhadas.
4.  **Cliente Final:** (Acesso limitado via portal/app) Consulta histórico do veículo e aprova orçamentos.

## 🚀 Funcionalidades Principais
* **Gestão de Multi-tenancy:** Isolamento lógico de dados por oficina.
* **Agendamento:** Calendário de serviços.
* **Gestão de Ordens de Serviço (O.S.):** Ciclo de vida completo (Aberto -> Em Análise -> Aguardando Aprovação -> Em Execução -> Finalizado).
* **Controle de Estoque:** Entrada e saída de peças, alertas de estoque baixo.
* **Faturamento:** Geração de faturas e integração com meios de pagamento.
* **Histórico Veicular:** Registro de todas as manutenções por placa/chassi.
