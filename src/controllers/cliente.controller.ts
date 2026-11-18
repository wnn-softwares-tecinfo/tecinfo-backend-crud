import { Request, Response } from 'express';
import { ClienteService } from '../services/cliente.service';

export class ClienteController {
  constructor(private clienteService: ClienteService) {}

  criar = async (req: Request, res: Response): Promise<void> => {
    const cliente = await this.clienteService.criar(req.body);
    res.status(201).json(cliente);
  };

  listar = async (req: Request, res: Response): Promise<void> => {
    const busca = typeof req.query.busca === 'string' ? req.query.busca : undefined;
    const clientes = await this.clienteService.listar(busca);
    res.status(200).json(clientes);
  };

  buscarPorId = async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params.id);
    const cliente = await this.clienteService.buscarPorId(id);
    res.status(200).json(cliente);
  };

  atualizar = async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params.id);
    const cliente = await this.clienteService.atualizar(id, req.body);
    res.status(200).json(cliente);
  };

  excluir = async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params.id);
    await this.clienteService.excluir(id);
    res.status(204).send();
  };
}
