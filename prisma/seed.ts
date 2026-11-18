import { PrismaClient, CargoUsuario, FormaPagamento, StatusOrcamento } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log(' Iniciando injeção de dados (Seed) via Prisma no banco de dados...');

  // 1. Injeção de Usuários / Vendedores
  const senhaPadraoHash = await bcrypt.hash('tecinfo2026', 10);

  const usuarioAdmin = await prisma.usuario.upsert({
    where: { email: 'admin@mrconstrucao.com.br' },
    update: {},
    create: {
      id: 'user-admin-01',
      nome: 'Administrador MR',
      email: 'admin@mrconstrucao.com.br',
      senha: senhaPadraoHash,
      cargo: CargoUsuario.ADMIN,
      ativo: true,
    },
  });

  const usuarioVendedor = await prisma.usuario.upsert({
    where: { email: 'vendedor@mrconstrucao.com.br' },
    update: {},
    create: {
      id: 'user-vend-01',
      nome: 'Usuário Padrão (Vendedor)',
      email: 'vendedor@mrconstrucao.com.br',
      senha: senhaPadraoHash,
      cargo: CargoUsuario.VENDEDOR,
      ativo: true,
    },
  });

  console.log('Usuários injetados:', {
    admin: usuarioAdmin.email,
    vendedor: usuarioVendedor.email,
  });

  // 2. Injeção de Clientes (conforme o design e impressão)
  const clienteJoao = await prisma.cliente.upsert({
    where: { id: 'cli-001' },
    update: {},
    create: {
      id: 'cli-001',
      nomeCliente: 'João da Silva',
      telefone: '(83) 98182-9881',
      rua: 'Av. Principal dos Estados',
      numero: '1420',
      complemento: 'Galpão A',
      bairro: 'Bessa',
      cidade: 'João Pessoa',
      cep: '58035-000',
      pontoReferencia: 'Próximo ao Supermercado Litoral',
    },
  });

  await prisma.cliente.upsert({
    where: { id: 'cli-002' },
    update: {},
    create: {
      id: 'cli-002',
      nomeCliente: 'Maria Albuquerque Empreiteira',
      telefone: '(83) 99876-5432',
      rua: 'Rua das Trincheiras',
      numero: '350',
      bairro: 'Centro',
      cidade: 'João Pessoa',
      cep: '58011-000',
      pontoReferencia: 'Em frente à Praça',
    },
  });

  console.log('Clientes injetados com sucesso.');

  // 3. Injeção de Produtos (Correspondência exata com o design das telas)
  const produtoCimento = await prisma.produto.upsert({
    where: { codigo: '00085' },
    update: {},
    create: {
      id: 'prod-001',
      codigoBarras: '7891000000851',
      codigo: '00085',
      nomeProduto: 'Cimento CP II 50kg',
      marca: 'Votoran',
      familia: 'Alvenaria',
      fornecedor: 'Distribuidora Paraíba Cimentos',
      custo: 28.0,
      promocional: false,
      precoVenda: 35.0,
      descontoAvista: 5.0,
      precoPrazo: 38.0,
      taxaLucro: 25.0,
      estoqueMinimo: 20,
      estoqueAtual: 150,
      unidade: 'Saco',
      garantia: '3 meses',
    },
  });

  const produtoRejunte = await prisma.produto.upsert({
    where: { codigo: '00194' },
    update: {},
    create: {
      id: 'prod-002',
      codigoBarras: '7891000001942',
      codigo: '00194',
      nomeProduto: 'Rejunte Quartzolit Branco 1kg',
      marca: 'Quartzolit',
      familia: 'Acabamento',
      fornecedor: 'Quartzolit Nordeste',
      custo: 6.5,
      promocional: true,
      precoVenda: 10.0,
      descontoAvista: 0.0,
      precoPrazo: 12.0,
      taxaLucro: 53.8,
      estoqueMinimo: 10,
      estoqueAtual: 45,
      unidade: 'Quilo',
      garantia: '6 meses',
    },
  });

  const produtoAreia = await prisma.produto.upsert({
    where: { codigo: '02939' },
    update: {},
    create: {
      id: 'prod-003',
      codigoBarras: '7891000029395',
      codigo: '02939',
      nomeProduto: 'Areia Grossa Lavada m³',
      marca: 'Japungu Areias',
      familia: 'Materiais Básicos',
      fornecedor: 'Japungu Mineradora',
      custo: 15.0,
      promocional: false,
      precoVenda: 22.0,
      descontoAvista: 2.0,
      precoPrazo: 25.0,
      taxaLucro: 46.6,
      estoqueMinimo: 5,
      estoqueAtual: 30,
      unidade: 'Metro',
      garantia: 'Indeterminada',
    },
  });

  await prisma.produto.upsert({
    where: { codigo: '01050' },
    update: {},
    create: {
      id: 'prod-004',
      codigoBarras: '7891000010503',
      codigo: '01050',
      nomeProduto: 'Tijolo Cerâmico 8 Furos 9x19x19',
      marca: 'Cerâmica São José',
      familia: 'Alvenaria',
      fornecedor: 'Olaria Regional',
      custo: 0.9,
      promocional: false,
      precoVenda: 1.5,
      descontoAvista: 0.1,
      precoPrazo: 1.7,
      taxaLucro: 66.6,
      estoqueMinimo: 500,
      estoqueAtual: 2400,
      unidade: 'Unidade',
    },
  });

  await prisma.produto.upsert({
    where: { codigo: '00420' },
    update: {},
    create: {
      id: 'prod-005',
      codigoBarras: '7891000004201',
      codigo: '00420',
      nomeProduto: 'Tubo PVC 100mm Esgoto 6 Metros',
      marca: 'Tigre',
      familia: 'Hidráulico',
      fornecedor: 'Tigre Nordeste Distribuição',
      custo: 32.0,
      promocional: false,
      precoVenda: 48.0,
      descontoAvista: 3.0,
      precoPrazo: 52.0,
      taxaLucro: 50.0,
      estoqueMinimo: 15,
      estoqueAtual: 38,
      unidade: 'Unidade',
      garantia: '12 meses',
    },
  });

  console.log('Produtos injetados com sucesso.');

  // 4. Injeção do Orçamento Modelo das Imagens (Total R$ 466,00)
  const orcamentoExistente = await prisma.orcamento.findUnique({
    where: { numeroOrcamento: '00124' },
  });

  if (!orcamentoExistente) {
    await prisma.orcamento.create({
      data: {
        id: 'orc-001',
        numeroOrcamento: '00124',
        vendedorId: usuarioVendedor.id,
        vendedorNome: usuarioVendedor.nome,
        clienteId: clienteJoao.id,
        clienteNome: clienteJoao.nomeCliente,
        formaPagamento: FormaPagamento.A_VISTA,
        observacoes: 'Orçamento padrão emitido conforme mockup para aprovação de material.',
        valorTotal: 466.0,
        status: StatusOrcamento.PENDENTE,
        itens: {
          create: [
            {
              produtoId: produtoCimento.id,
              codigoProduto: produtoCimento.codigo,
              nomeProduto: produtoCimento.nomeProduto,
              quantidade: 10,
              valorUnitario: 35.0,
              subtotal: 350.0,
            },
            {
              produtoId: produtoRejunte.id,
              codigoProduto: produtoRejunte.codigo,
              nomeProduto: produtoRejunte.nomeProduto,
              quantidade: 5,
              valorUnitario: 10.0,
              subtotal: 50.0,
            },
            {
              produtoId: produtoAreia.id,
              codigoProduto: produtoAreia.codigo,
              nomeProduto: produtoAreia.nomeProduto,
              quantidade: 3,
              valorUnitario: 22.0,
              subtotal: 66.0,
            },
          ],
        },
      },
    });
    console.log('Orçamento nº 00124 (R$ 466,00) injetado com sucesso.');
  }

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro durante o seed do Prisma:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
