# Endpoints da API (REST)

Principais rotas expostas pelo API Gateway.

## Serviço de Clientes e Veículos
| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/v1/customers` | Lista clientes (com paginação e filtros) |
| `POST` | `/api/v1/customers` | Cria novo cliente |
| `POST` | `/api/v1/customers/{id}/vehicles` | Adiciona veículo ao cliente |
| `GET` | `/api/v1/vehicles/{placa}` | Busca dados do veículo pela placa |

## Serviço de Ordens de Serviço (Work Orders)
| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `POST` | `/api/v1/work-orders` | Abre uma nova O.S. |
| `GET` | `/api/v1/work-orders` | Lista O.S. (filtros: status, mecânico, data) |
| `PATCH` | `/api/v1/work-orders/{id}/status` | Atualiza status (ex: Aprovar, Finalizar) |
| `POST` | `/api/v1/work-orders/{id}/items` | Adiciona peça ou serviço à O.S. |

## Serviço de Estoque
| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/v1/products` | Consulta catálogo de peças |
| `POST` | `/api/v1/products/movement` | Registra entrada manual de estoque |
