# MR - Material de Construção • API REST Comercial 
> *"Um jeito fácil de construir barato"*


# PROJETO OPEN SOURCE TECINFO 2026

API REST didática, modular e profissional desenvolvida com **Node.js**, **Express**, **TypeScript**, **JWT**, **CORS** e **Swagger UI**.  
Toda a modelagem de entidades, DTOs e endpoints foi desenvolvida estritamente com **nomenclaturas em Português (PT-BR)** para corresponder perfeitamente às telas do sistema comercial (React + Vite).

---

## Correspondência com as Telas de Design

| Tela de Referência | Endpoint Principal | Modelo / DTO |
| :--- | :--- | :--- |
| **1. Imprimir Orçamento** | `GET /api/orcamentos/:id/imprimir` | `RespostaImpressaoOrcamentoDTO` (Cabeçalho, Vendedor, Orçamento nº, Data/Hora, Tabela com Código/Nome/Qtd/Unit/Subtotal, Total R$ 466,00, Forma de Pagamento e Observações) |
| **2. Criar / Cadastrar Orçamento** | `POST /api/orcamentos` | `CriarOrcamentoDTO` (`vendedorId`, `clienteId`, `formaPagamento`, `itens`, `observacoes`) |
| **3. Cadastro de Produto** | `POST /api/produtos` / `GET /api/produtos` | `Produto` (`codigoBarras`, `nomeProduto`, `marca`, `familia`, `fornecedor`, `custo`, `promocional`, `precoVenda`, `descontoAvista`, `precoPrazo`, `taxaLucro`, `estoqueMinimo`, `unidade`, `validade`, `garantia`) |
| **4. Cadastro de Cliente** | `POST /api/clientes` / `GET /api/clientes` | `Cliente` (`nomeCliente`, `telefone`, `rua`, `numero`, `complemento`, `bairro`, `cidade`, `cep`, `pontoReferencia`) |

---

## Como Executar o Projeto

### Pré-requisitos
- Node.js 18+ (testado no Node.js 22 LTS)
- npm ou yarn

### 1. Instalar as dependências
```bash
npm install
```

### 2. Iniciar em modo de Desenvolvimento (Hot-reload)
```bash
npm run dev
```
> O servidor iniciará por padrão na porta **3000** (ou na definida no seu `.env`).

### 3. Compilar e rodar em Produção
```bash
npm run build
npm start
```

---

## Documentação Swagger Interativa

Com o servidor rodando, acesse no navegador:
**[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

No Swagger UI você pode testar todos os endpoints, autenticar via botão **Authorize** usando o Bearer Token, e visualizar o contrato completo dos DTOs e respostas.

---

## Credenciais Padrão (Injetadas via Seed)

Após rodar o seed do Prisma (`npm run prisma:seed`), o banco de dados estará pronto com as contas e dados idênticos aos mockups:

| Papel | E-mail | Senha | Acesso |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@mrconstrucao.com.br` | `tecinfo2026` | Acesso total (CRUD de Usuários, Produtos, Clientes e Orçamentos) |
| **Vendedor** | `vendedor@mrconstrucao.com.br` | `tecinfo2026` | Criação de orçamentos, consulta de produtos e clientes |

### Dados Injetados no Banco:
- **Produtos**:
  - `00085` - Cimento CP II 50kg (R$ 35,00)
  - `00194` - Rejunte Quartzolit Branco 1kg (R$ 10,00)
  - `02939` - Areia Grossa Lavada m³ (R$ 22,00)
  - `01050` - Tijolo Cerâmico 8 Furos (R$ 1,50)
  - `00420` - Tubo PVC 100mm Esgoto 6m (R$ 48,00)
- **Cliente**:
  - João da Silva - Tel: (83) 98182-9881, Av. Principal dos Estados, 1420, Galpão A, Bessa, João Pessoa - PB.
- **Orçamento de Exemplo (`orc-001`)**:
  - Orçamento nº **00124** para o cliente João da Silva, totalizando **R$ 466,00** (10 Cimentos + 5 Rejuntes + 3 Areias Grossas).

---

## 🏛️ Arquitetura em Camadas Simplificada

```
src/
├── @types/          # Tipagens globais do TypeScript (extensão do Request Express)
├── config/          # Configuração Swagger OpenAPI 3.0 e Singleton do PrismaClient
├── controllers/     # Controladores HTTP (validação de entrada e status codes)
├── dtos/            # Data Transfer Objects (estruturas de requisição e resposta)
├── middlewares/     # Middlewares de Autenticação JWT e Tratamento Central de Erros
├── models/          # Entidades e Interfaces de Domínio em PT-BR
├── repositories/    # Repositórios diretos (ClienteRepository, ProdutoRepository, etc.) + Container
├── routes/          # Definição e roteamento modular dos endpoints
├── services/        # Regras de negócio, cálculos tributários, descontos e validações
├── utils/           # Classe utilitária AppError
├── app.ts           # Configuração do Express, CORS e Swagger
└── server.ts        # Bootstrap e inicialização do servidor HTTP
```

---

## 🗄️ Criação do Banco de Dados e Injeção de Dados (Prisma ORM)

### 1. Onde fica a Modelagem do Banco?
- Arquivo: [`prisma/schema.prisma`](file:///c:/Users/wnn-dev/winnicius-projects/wnn-softwares/wnn-root/tecinfo-tasks/back-end-mr-construcao/prisma/schema.prisma)
- Contém todas as tabelas (`usuarios`, `clientes`, `produtos`, `orcamentos`, `itens_orcamento`), enums e relacionamentos em PT-BR.

### 2. Onde fica o Script de Injeção de Dados (Seed)?
- Arquivo: [`prisma/seed.ts`](file:///c:/Users/wnn-dev/winnicius-projects/wnn-softwares/wnn-root/tecinfo-tasks/back-end-mr-construcao/prisma/seed.ts)
- Utiliza o Prisma Client para injetar via `upsert`:
  - Usuários (Admin e Vendedor com senhas criptografadas em bcrypt);
  - Clientes (João da Silva com endereço completo no Bessa);
  - Produtos (Cimento CP II, Rejunte Quartzolit, Areia Grossa, Tijolo, Tubo PVC com códigos, margens de lucro e preços);
  - Orçamento nº **00124** de **R$ 466,00** (idêntico ao mockup da imagem).

### 3. Comandos para Subir o Banco e Injetar os Dados:

```bash
# 1. Subir o container PostgreSQL em segundo plano (via Docker Compose)
docker compose up -d

# 2. Gerar o Prisma Client tipado e sincronizar o esquema
npm run prisma:generate
npx prisma db push

# 3. Executar a Injeção de Dados (Seed) no Banco de Dados
npm run prisma:seed

# 4. (Opcional) Abrir a interface visual do Prisma Studio
npm run prisma:studio
```
