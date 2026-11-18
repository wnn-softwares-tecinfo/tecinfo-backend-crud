import { OpenAPIV3 } from 'openapi-types';

export const swaggerDocument: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'MR - Material de Construção • API REST Comercial',
    version: '1.0.0',
    description:
      'API REST modular e didática desenvolvida para servir como backend do sistema comercial de materiais de construção (MR - Material de Construção). Modelada estritamente com nomenclaturas em Português (PT-BR) conforme o design de referência do front-end.',
    contact: {
      name: 'Suporte TecInfo / MR Construção',
      email: 'admin@mrconstrucao.com.br',
    },
  },
  servers: [
    {
      url: 'https://winnicius.com/tecinfo/labs/api-mr-construcao/server',
      description: 'Servidor de Produção (VPS Hostinger)',
    },
    {
      url: 'http://localhost:3000',
      description: 'Servidor Local de Desenvolvimento',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'Insira o token JWT gerado no endpoint de login no formato: Bearer <TOKEN>',
      },
    },
    schemas: {
      LoginDTO: {
        type: 'object',
        required: ['email', 'senha'],
        properties: {
          email: {
            type: 'string',
            example: 'admin@mrconstrucao.com.br',
          },
          senha: {
            type: 'string',
            example: 'tecinfo2026',
          },
        },
      },
      RespostaLoginDTO: {
        type: 'object',
        properties: {
          token: { type: 'string' },
          usuario: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              nome: { type: 'string' },
              email: { type: 'string' },
              cargo: { type: 'string', enum: ['ADMIN', 'VENDEDOR'] },
            },
          },
        },
      },
      Cliente: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'cli-001' },
          nomeCliente: { type: 'string', example: 'João da Silva' },
          telefone: { type: 'string', example: '(83) 98182-9881' },
          rua: { type: 'string', example: 'Av. Principal dos Estados' },
          numero: { type: 'string', example: '1420' },
          complemento: { type: 'string', example: 'Galpão A' },
          bairro: { type: 'string', example: 'Bessa' },
          cidade: { type: 'string', example: 'João Pessoa' },
          cep: { type: 'string', example: '58035-000' },
          pontoReferencia: { type: 'string', example: 'Próximo ao Posto Shell' },
          criadoEm: { type: 'string', format: 'date-time' },
        },
      },
      CriarClienteDTO: {
        type: 'object',
        required: ['nomeCliente', 'telefone', 'rua', 'numero', 'bairro', 'cidade', 'cep'],
        properties: {
          nomeCliente: { type: 'string', example: 'João da Silva' },
          telefone: { type: 'string', example: '(83) 98182-9881' },
          rua: { type: 'string', example: 'Av. Principal dos Estados' },
          numero: { type: 'string', example: '1420' },
          complemento: { type: 'string', example: 'Galpão A' },
          bairro: { type: 'string', example: 'Bessa' },
          cidade: { type: 'string', example: 'João Pessoa' },
          cep: { type: 'string', example: '58035-000' },
          pontoReferencia: { type: 'string', example: 'Próximo ao Posto Shell' },
        },
      },
      Produto: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'prod-001' },
          codigoBarras: { type: 'string', example: '7891234560011' },
          codigo: { type: 'string', example: '00085' },
          nomeProduto: { type: 'string', example: 'Cimento CP II 50kg' },
          marca: { type: 'string', example: 'Votoran' },
          familia: { type: 'string', example: 'Alvenaria' },
          fornecedor: { type: 'string', example: 'Votorantim Cimentos' },
          custo: { type: 'number', example: 24.5 },
          promocional: { type: 'boolean', example: false },
          precoVenda: { type: 'number', example: 35.0 },
          descontoAvista: { type: 'number', example: 33.0 },
          precoPrazo: { type: 'number', example: 38.0 },
          taxaLucro: { type: 'number', example: 42.8 },
          estoqueMinimo: { type: 'number', example: 50 },
          estoqueAtual: { type: 'number', example: 340 },
          unidade: { type: 'string', example: 'Saco' },
          garantia: { type: 'string', example: 'Conforme fabricante' },
          criadoEm: { type: 'string', format: 'date-time' },
        },
      },
      CriarProdutoDTO: {
        type: 'object',
        required: ['codigoBarras', 'nomeProduto', 'custo', 'precoVenda', 'precoPrazo', 'taxaLucro', 'unidade'],
        properties: {
          codigoBarras: { type: 'string', example: '7891234560099' },
          codigo: { type: 'string', example: '00550' },
          nomeProduto: { type: 'string', example: 'Argamassa AC-II 20kg' },
          marca: { type: 'string', example: 'Votoran' },
          familia: { type: 'string', example: 'Alvenaria' },
          fornecedor: { type: 'string', example: 'Distribuidora Central' },
          custo: { type: 'number', example: 12.0 },
          promocional: { type: 'boolean', example: false },
          precoVenda: { type: 'number', example: 18.5 },
          descontoAvista: { type: 'number', example: 17.0 },
          precoPrazo: { type: 'number', example: 20.0 },
          taxaLucro: { type: 'number', example: 54.1 },
          estoqueMinimo: { type: 'number', example: 20 },
          estoqueAtual: { type: 'number', example: 150 },
          unidade: { type: 'string', example: 'Saco' },
        },
      },
      CriarOrcamentoDTO: {
        type: 'object',
        required: ['vendedorId', 'clienteId', 'formaPagamento', 'itens'],
        properties: {
          vendedorId: { type: 'string', example: 'user-vend-01' },
          clienteId: { type: 'string', example: 'cli-001' },
          formaPagamento: {
            type: 'string',
            enum: ['A_VISTA', 'PARCELADO', 'COM_DESCONTO'],
            example: 'A_VISTA',
          },
          numeroParcelas: { type: 'number', example: 3 },
          percentualDesconto: { type: 'number', example: 5 },
          observacoes: { type: 'string', example: 'Entregar no período da manhã.' },
          itens: {
            type: 'array',
            items: {
              type: 'object',
              required: ['produtoId', 'quantidade'],
              properties: {
                produtoId: { type: 'string', example: 'prod-001' },
                quantidade: { type: 'number', example: 10 },
                valorUnitario: { type: 'number', example: 35.0 },
              },
            },
          },
        },
      },
      RespostaImpressaoOrcamentoDTO: {
        type: 'object',
        properties: {
          cabecalho: {
            type: 'object',
            properties: {
              empresa: { type: 'string', example: 'MR - MATERIAL DE CONSTRUÇÃO' },
              slogan: { type: 'string', example: 'Um jeito fácil de construir barato' },
              titulo: { type: 'string', example: 'ORÇAMENTO' },
            },
          },
          dadosGerais: {
            type: 'object',
            properties: {
              numeroOrcamento: { type: 'string', example: '00124' },
              dataHora: { type: 'string', example: '18/11/2026 10:45' },
              vendedor: { type: 'string', example: 'Carlos Eduardo (Vendedor)' },
              status: { type: 'string', example: 'PENDENTE' },
            },
          },
          cliente: {
            type: 'object',
            properties: {
              nome: { type: 'string', example: 'João da Silva' },
              telefone: { type: 'string', example: '(83) 98182-9881' },
              rua: { type: 'string', example: 'Av. Principal dos Estados' },
              numero: { type: 'string', example: '1420' },
              bairro: { type: 'string', example: 'Bessa' },
              cidade: { type: 'string', example: 'João Pessoa' },
            },
          },
          itens: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                codigo: { type: 'string', example: '00085' },
                nomeProduto: { type: 'string', example: 'Cimento CP II 50kg' },
                quantidade: { type: 'number', example: 10 },
                valorUnitario: { type: 'number', example: 35.0 },
                subtotal: { type: 'number', example: 350.0 },
              },
            },
          },
          totais: {
            type: 'object',
            properties: {
              valorTotal: { type: 'number', example: 466.0 },
              valorTotalFormatado: { type: 'string', example: 'R$ 466,00' },
              formaPagamentoDescricao: { type: 'string', example: 'À vista - Preço normal' },
            },
          },
        },
      },
    },
  },
  paths: {
    '/api/health': {
      get: {
        tags: ['Status'],
        summary: 'Healthcheck da API',
        responses: {
          '200': { description: 'API online e operacional' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Autenticação'],
        summary: 'Autenticação de Usuário/Vendedor',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginDTO' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Autenticado com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RespostaLoginDTO' },
              },
            },
          },
          '401': { description: 'Credenciais inválidas' },
        },
      },
    },
    '/api/usuarios/vendedores': {
      get: {
        tags: ['Usuários'],
        summary: 'Lista vendedores ativos para o dropdown da tela de orçamento',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': { description: 'Lista de vendedores retornada com sucesso' },
        },
      },
    },
    '/api/clientes': {
      get: {
        tags: ['Clientes'],
        summary: 'Listar clientes com busca por nome/telefone',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'busca',
            in: 'query',
            schema: { type: 'string' },
            description: 'Termo para busca textual (nome, telefone, cidade, bairro)',
          },
        ],
        responses: {
          '200': { description: 'Lista de clientes' },
        },
      },
      post: {
        tags: ['Clientes'],
        summary: 'Cadastrar novo cliente (com endereço completo)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CriarClienteDTO' },
            },
          },
        },
        responses: {
          '201': { description: 'Cliente cadastrado com sucesso' },
        },
      },
    },
    '/api/clientes/{id}': {
      get: {
        tags: ['Clientes'],
        summary: 'Obter dados completos de um cliente por ID',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Dados do cliente' },
          '404': { description: 'Cliente não encontrado' },
        },
      },
      put: {
        tags: ['Clientes'],
        summary: 'Atualizar dados de um cliente',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CriarClienteDTO' },
            },
          },
        },
        responses: {
          '200': { description: 'Cliente atualizado' },
        },
      },
      delete: {
        tags: ['Clientes'],
        summary: 'Excluir um cliente',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '204': { description: 'Cliente excluído com sucesso' },
        },
      },
    },
    '/api/produtos': {
      get: {
        tags: ['Produtos'],
        summary: 'Listar produtos com filtros (busca, família, promocional)',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'busca', in: 'query', schema: { type: 'string' } },
          { name: 'familia', in: 'query', schema: { type: 'string' } },
          { name: 'promocional', in: 'query', schema: { type: 'boolean' } },
        ],
        responses: {
          '200': { description: 'Lista de produtos retornada' },
        },
      },
      post: {
        tags: ['Produtos'],
        summary: 'Cadastrar novo produto',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CriarProdutoDTO' },
            },
          },
        },
        responses: {
          '201': { description: 'Produto cadastrado com sucesso' },
        },
      },
    },
    '/api/produtos/codigo/{codigo}': {
      get: {
        tags: ['Produtos'],
        summary: 'Buscar produto pelo código de orçamento (ex: 00085)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'codigo', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Produto localizado' },
          '404': { description: 'Produto não encontrado' },
        },
      },
    },
    '/api/produtos/auxiliares/familias': {
      get: {
        tags: ['Produtos'],
        summary: 'Retorna a lista de Famílias para o dropdown da tela',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': { description: 'Lista de famílias (Elétrico, Hidráulico...)' },
        },
      },
    },
    '/api/produtos/auxiliares/unidades': {
      get: {
        tags: ['Produtos'],
        summary: 'Retorna a lista de Unidades para o dropdown da tela',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': { description: 'Lista de unidades (Metro, Saco, Litro, Quilo...)' },
        },
      },
    },
    '/api/produtos/{id}': {
      get: {
        tags: ['Produtos'],
        summary: 'Buscar detalhes de um produto por ID',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Dados do produto' },
        },
      },
      put: {
        tags: ['Produtos'],
        summary: 'Atualizar dados de um produto',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CriarProdutoDTO' },
            },
          },
        },
        responses: {
          '200': { description: 'Produto atualizado' },
        },
      },
      delete: {
        tags: ['Produtos'],
        summary: 'Excluir um produto',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '204': { description: 'Produto excluído' },
        },
      },
    },
    '/api/orcamentos': {
      get: {
        tags: ['Orçamentos'],
        summary: 'Listar orçamentos cadastrados',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['PENDENTE', 'APROVADO', 'CANCELADO'] } },
          { name: 'vendedorId', in: 'query', schema: { type: 'string' } },
          { name: 'clienteId', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Lista de orçamentos' },
        },
      },
      post: {
        tags: ['Orçamentos'],
        summary: 'Emitir novo orçamento comercial',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CriarOrcamentoDTO' },
            },
          },
        },
        responses: {
          '201': { description: 'Orçamento gerado com sucesso' },
        },
      },
    },
    '/api/orcamentos/{id}': {
      get: {
        tags: ['Orçamentos'],
        summary: 'Buscar detalhes de um orçamento por ID',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Dados do orçamento' },
        },
      },
    },
    '/api/orcamentos/{id}/imprimir': {
      get: {
        tags: ['Orçamentos'],
        summary: 'Espelho formatado para a tela de IMPRIMIR ORÇAMENTO (Imagem 1)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': {
            description: 'Payload formatado para impressão',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RespostaImpressaoOrcamentoDTO' },
              },
            },
          },
        },
      },
    },
    '/api/orcamentos/{id}/status': {
      patch: {
        tags: ['Orçamentos'],
        summary: 'Alterar status do orçamento (PENDENTE, APROVADO, CANCELADO)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: { type: 'string', enum: ['PENDENTE', 'APROVADO', 'CANCELADO'] },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Status atualizado com sucesso' },
        },
      },
    },
  },
};
