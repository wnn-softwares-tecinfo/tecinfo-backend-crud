import { ClienteRepository } from '../repositories/cliente.repository';
import { CriarClienteDTO, AtualizarClienteDTO } from '../dtos/cliente.dto';
import { Cliente } from '../models/cliente.model';
import { AppError } from '../utils/AppError';

export class ClienteService {
  constructor(private clienteRepository: ClienteRepository) {}

  async criar(dados: CriarClienteDTO): Promise<Cliente> {
    if (!dados.nomeCliente?.trim()) {
      throw new AppError('O campo Nome Cliente é obrigatório.', 400);
    }

    if (!dados.telefone?.trim()) {
      throw new AppError('O campo Telefone é obrigatório.', 400);
    }

    if (!dados.rua?.trim() || !dados.numero?.trim() || !dados.bairro?.trim() || !dados.cidade?.trim() || !dados.cep?.trim()) {
      throw new AppError('Os campos de endereço (Rua, Número, Bairro, Cidade e CEP) são obrigatórios.', 400);
    }

    return this.clienteRepository.criar({
      nomeCliente: dados.nomeCliente.trim(),
      telefone: dados.telefone.trim(),
      rua: dados.rua.trim(),
      numero: dados.numero.trim(),
      complemento: dados.complemento?.trim() || undefined,
      bairro: dados.bairro.trim(),
      cidade: dados.cidade.trim(),
      cep: dados.cep.trim(),
      pontoReferencia: dados.pontoReferencia?.trim() || undefined,
    });
  }

  async listar(busca?: string): Promise<Cliente[]> {
    return this.clienteRepository.listar(busca);
  }

  async buscarPorId(id: string): Promise<Cliente> {
    const cliente = await this.clienteRepository.buscarPorId(id);
    if (!cliente) {
      throw new AppError('Cliente não encontrado.', 404);
    }
    return cliente;
  }

  async atualizar(id: string, dados: AtualizarClienteDTO): Promise<Cliente> {
    const clienteExistente = await this.clienteRepository.buscarPorId(id);
    if (!clienteExistente) {
      throw new AppError('Cliente não encontrado para atualização.', 404);
    }

    const atualizado = await this.clienteRepository.atualizar(id, dados);
    if (!atualizado) {
      throw new AppError('Falha ao atualizar dados do cliente.', 500);
    }

    return atualizado;
  }

  async excluir(id: string): Promise<void> {
    const clienteExistente = await this.clienteRepository.buscarPorId(id);
    if (!clienteExistente) {
      throw new AppError('Cliente não encontrado.', 404);
    }

    const sucesso = await this.clienteRepository.excluir(id);
    if (!sucesso) {
      throw new AppError('Não foi possível excluir o cliente.', 500);
    }
  }
}
