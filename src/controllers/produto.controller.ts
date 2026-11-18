import { Request, Response } from 'express';
import { ProdutoService } from '../services/produto.service';

export class ProdutoController {
  constructor(private produtoService: ProdutoService) {}

  criar = async (req: Request, res: Response): Promise<void> => {
    const produto = await this.produtoService.criar(req.body);
    res.status(201).json(produto);
  };

  listar = async (req: Request, res: Response): Promise<void> => {
    const { busca, familia, promocional } = req.query;

    const produtos = await this.produtoService.listar({
      busca: typeof busca === 'string' ? busca : undefined,
      familia: typeof familia === 'string' ? familia : undefined,
      promocional: promocional !== undefined ? promocional === 'true' : undefined,
    });

    res.status(200).json(produtos);
  };

  buscarPorId = async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params.id);
    const produto = await this.produtoService.buscarPorId(id);
    res.status(200).json(produto);
  };

  buscarPorCodigo = async (req: Request, res: Response): Promise<void> => {
    const codigo = String(req.params.codigo);
    const produto = await this.produtoService.buscarPorCodigo(codigo);
    res.status(200).json(produto);
  };

  atualizar = async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params.id);
    const produto = await this.produtoService.atualizar(id, req.body);
    res.status(200).json(produto);
  };

  movimentarEstoque = async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params.id);
    const { quantidadeDelta } = req.body;
    const produto = await this.produtoService.movimentarEstoque(id, {
      quantidadeDelta: Number(quantidadeDelta),
    });
    res.status(200).json(produto);
  };

  excluir = async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params.id);
    await this.produtoService.excluir(id);
    res.status(204).send();
  };

  listarFamilias = async (_req: Request, res: Response): Promise<void> => {
    const familias = this.produtoService.listarFamiliasDisponiveis();
    res.status(200).json(familias);
  };

  listarUnidades = async (_req: Request, res: Response): Promise<void> => {
    const unidades = this.produtoService.listarUnidadesDisponiveis();
    res.status(200).json(unidades);
  };
}
