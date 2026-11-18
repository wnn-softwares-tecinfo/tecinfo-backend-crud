import { Request, Response } from 'express';
import { OrcamentoService } from '../services/orcamento.service';
import { StatusOrcamento } from '../models/orcamento.model';

export class OrcamentoController {
  constructor(private orcamentoService: OrcamentoService) {}

  criar = async (req: Request, res: Response): Promise<void> => {
    const orcamento = await this.orcamentoService.criar(req.body);
    res.status(201).json(orcamento);
  };

  listar = async (req: Request, res: Response): Promise<void> => {
    const { status, vendedorId, clienteId } = req.query;

    const orcamentos = await this.orcamentoService.listar({
      status: typeof status === 'string' ? (status as StatusOrcamento) : undefined,
      vendedorId: typeof vendedorId === 'string' ? vendedorId : undefined,
      clienteId: typeof clienteId === 'string' ? clienteId : undefined,
    });

    res.status(200).json(orcamentos);
  };

  buscarPorId = async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params.id);
    const orcamento = await this.orcamentoService.buscarPorId(id);
    res.status(200).json(orcamento);
  };

  imprimir = async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params.id);
    const payloadImpressao = await this.orcamentoService.gerarPayloadImpressao(id);
    res.status(200).json(payloadImpressao);
  };

  atualizarStatus = async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params.id);
    const { status } = req.body;
    const orcamento = await this.orcamentoService.atualizarStatus(id, status);
    res.status(200).json(orcamento);
  };
}
