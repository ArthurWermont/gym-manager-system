import api from "./api";

// Interface base para Aluno (para listar/editar)
export interface AlunoData {
  id_aluno?: number;
  nome: string;
  matricula: string;
  email: string;
  senha: string;
  data_nascimento: string;
  peso: number;
  altura: number;
  observacoes: string;
  ativo?: boolean;
  matricula_instrutor:string;
}

// Interface para CADASTRO (inclui dados de pagamento inicial que o backend exige)
export interface CreateAlunoData extends AlunoData {
  // Campos extras para o primeiro pagamento (Backend requer isso)
  tipo_plano: "mensal" | "trimestral" | "semestral" | "anual";
  valor_plano: number;
  metodo_pagamento: "cartao" | "pix" | "dinheiro" | "boleto";
}

export interface LoginData {
  matricula: string;
  senha: string;
}

const caminho = "/alunos";

export const AlunoService = {
  // GET - Listar todos
  listar: async () => {
    const response = await api.get(caminho);
    return response.data;
  },

  // POST - Cadastrar (Usa a interface mais complexa)
  cadastrar: async (dados: CreateAlunoData) => {
    const response = await api.post(caminho, dados);
    return response.data;
  },

  buscarPorId: async(id:number) =>{
    const response = await api.get(`${caminho}/${id}`);
    return response.data;
  },
  
  // POST - Login
  login: async (dados: LoginData) => {
    const response = await api.post(`${caminho}/login`, dados);
    return response.data;
  },

  // PATCH - Editar (Usa a interface base/parcial)
  editar: async (id: number, dados: Partial<AlunoData>) => {
    const response = await api.patch(`${caminho}/${id}`, dados);
    return response.data;
  },

  // DELETE - Deletar (precisa do ID na URL)
  deletar: async (id: number) => {
    const response = await api.delete(`${caminho}/${id}`);
    return response.data;
  },
  
  // PATCH - Desativar
  desativar: async (id: number) => {
    const response = await api.patch(`${caminho}/desativar/${id}`);
    return response.data;
  },
  
  // PATCH - Reativar
  reativar: async (id: number) => {
    const response = await api.patch(`${caminho}/reativar/${id}`);
    return response.data;
  },

  async verificarMatricula(matricula: string) {
  const r = await api.get(`${caminho}/verificar-matricula/${matricula}`);
  return r.data.existe; // true ou false
}

};