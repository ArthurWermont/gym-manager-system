import api from "./api";

export interface PagamentoData {
  id_pagamento: number;
  fk_id_aluno: number;
  valor: number;
  data_pagamento: string | null;
  data_validade: string;
  metodo_pagamento: "cartao" | "pix" | "dinheiro" | "boleto";
  status: "pago" | "pendente" | "atrasado";
  tipo_plano: "mensal" | "trimestral" | "semestral" | "anual";

  // campos extras vindos do JOIN
  nome_aluno?: string;
  matricula_aluno?: string;
}

interface CriarPagamentoDTO {
  fk_id_aluno: number;
  valor: number;
  tipo_plano: "mensal" | "trimestral" | "semestral" | "anual";
  metodo_pagamento: "cartao" | "pix" | "dinheiro" | "boleto";
}

const caminho = "/pagamentos";

export const PagamentoService = {

  // 1) Lista todos os pagamentos (admin)
  listarTodos: async (): Promise<PagamentoData[]> => {
    const response = await api.get(caminho);
    return response.data;
  },

  // 2) Lista pagamentos de um aluno específico
  listarPorAluno: async (idAluno: number): Promise<PagamentoData[]> => {
    const response = await api.get(`${caminho}/aluno/${idAluno}`);
    return response.data;
  },

  // 3) Criar nova cobrança
  criar: async (dados: CriarPagamentoDTO) => {
    const response = await api.post(caminho, dados);
    return response.data;
  },

  // 4) Marcar pagamento como pago
  pagar: async (idPagamento: number) => {
    const response = await api.patch(`${caminho}/pagar/${idPagamento}`);
    return response.data;
  },

  // 5) Editar parcialmente pagamento
  editar: async (idPagamento: number, campos: Partial<PagamentoData>) => {
    const response = await api.patch(`${caminho}/${idPagamento}`, campos);
    return response.data;
  },

  // 6) Deletar pagamento
  deletar: async (idPagamento: number) => {
    const response = await api.delete(`${caminho}/${idPagamento}`);
    return response.data;
  }

};
