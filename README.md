# Projeto de Dashboard de Análises de Vendas

Este é um sistema de dashboard de análises de vendas e métricas associadas, que oferece uma interface para visualizar dados como vendas, clientes, produtos, pagamentos e entregas. O projeto é dividido em duas partes principais: o **backend**, desenvolvido em **Node.js** com **Express**, e o **frontend**, desenvolvido em **React** utilizando **Styled Components**.

## Tecnologias Utilizadas

- **Backend:**
  - **Node.js** com **Express**
  - **PostgreSQL** como banco de dados
  - **Controllers** para gerenciar diferentes partes da análise (ex: `ChannelAnalyticsController`, `CouponAnalyticsController`, etc.)
  - **Models** representando as entidades do sistema (ex: `channel`, `customer`, `delivery`, etc.)
  - **Routes** para gerenciamento das rotas de API (`routes.js`)

- **Frontend:**
  - **React** com **Styled Components**
  - Interface funcional de dashboards de análises de vendas

- **Banco de Dados:**
  - **PostgreSQL** para armazenar todas as informações do sistema

## Estrutura do Projeto

- **Backend:**  
  - A pasta `backend` contém os arquivos para o servidor Node.js, incluindo o arquivo `routes.js` para definição das rotas de API.
  - O arquivo `generate_data.py` em `./backend` é responsável por popular o banco de dados com dados de exemplo.
  - O script completo para criar as tabelas do banco de dados pode ser encontrado em `tabelas_core.sql` dentro da pasta `./backend`.

- **Frontend:**  
  - A pasta `frontend` contém o código da interface do usuário, utilizando React e Styled Components.
  - A aplicação do frontend é totalmente funcional, exceto pelo login, que é uma simulação (mock) para fins de teste e desenvolvimento.

## Como Rodar o Projeto

### 1. Instalar Dependências

Para rodar o projeto, é necessário instalar as dependências tanto no backend quanto no frontend.

#### Backend:

1. Navegue até a pasta `backend`.
2. Execute o comando:
   ```bash
   npm install

#### Frontend:

1. Navegue até a pasta `frontend`.
2. Execute o comando:
    ```bash
    npm install

### 2. Rodar o Servidor Backend

1. Para rodar o `backend`.
2. Execute o comando:
    ```bash
    npm run dev

### 3. Rodar o Frontend

1. Para rodar o `frontend`.
2. Execute o comando:
    ```bash
    npm run dev

### 4. Popular o Banco de Dados

O banco de dados pode ser populado com dados de exemplo utilizando o script Python generate_data.py. Siga as instruções abaixo:

* Verifique se você tem o Python 3.x instalado.

* Navegue até a pasta ./backend.

* Para rodar o script:

1. Execute o comando:
    ```bash
    npm run dev


* Esse script irá utilizar o arquivo tabelas_core.sql para criar as tabelas e popular o banco de dados com dados de exemplo.

### 5. Conectar ao Banco de Dados

Certifique-se de ter o PostgreSQL rodando em sua máquina ou utilizando um serviço de banco de dados PostgreSQL. O banco de dados será configurado automaticamente ao rodar o script de geração de dados.

#### Estrutura de Banco de Dados

* O banco de dados é estruturado com várias tabelas, conforme definido no script tabelas_core.sql. 

* Essas tabelas são utilizadas para armazenar dados relacionados aos clientes, vendedores, produtos, pedidos e itens dos pedidos.

#### Funcionalidades

Backend:

* Rotas de API para manipulação de dados de vendas, clientes, pagamentos, produtos, etc.

* Implementação de controllers para diferentes áreas de análise (ex: ChannelAnalyticsController, CouponAnalyticsController, etc.).

* Suporte para integração com o banco de dados PostgreSQL.

#### Frontend:

* Dashboards de análises de vendas, clientes, produtos, e muito mais.

* Filtros dinâmicos para visualização de métricas específicas.

* Interface de usuário completamente funcional (exceto login, que é mockado).

#### Testes

* Os testes não foram abordados explicitamente neste projeto, mas a estrutura do backend e frontend permite fácil adição de testes unitários e de integração.

#### Licença

* Este projeto não está associado a nenhuma licença específica. Sinta-se à vontade para usar, modificar e distribuir o código conforme necessário.

#### Observações

* O projeto não implementa autenticação de usuários, e não está focado nesse aspecto.

* O login está mockado e não realiza autenticação real de usuários.

#### Contato

* Se você tiver alguma dúvida ou sugestão sobre o projeto, sinta-se à vontade para entrar em contato.