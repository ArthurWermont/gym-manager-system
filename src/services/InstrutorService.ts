import api from "./api";

// Interface para Instrutor (sem todos os campos do Model, apenas os necessários para CRUD básico)
export interface InstrutorData {
  id_instrutor?: number; // Opcional no cadastro/edição
  nome: string;
  matricula: string;
  email: string;
  senha: string; // Opcional na edição, requerido no cadastro
  data_nascimento: string;
  ativo?: boolean;
}

export interface LoginData {
  matricula: string;
  senha: string;
}

const caminho = "/instrutores";

export const InstrutorService = {
  // GET - Listar todos
  listar: async () => {
    const response = await api.get(caminho);
    return response.data;
  },

  // POST - Cadastrar
  cadastrar: async (dados: InstrutorData) => {
    const response = await api.post(caminho, dados);
    return response.data;
  },

  buscarPorId: async (id: number) => {
    const response = await api.get(`${caminho}/${id}`);
    return response.data;
  },

  // POST - Login
  login: async (dados: LoginData) => {
    const response = await api.post(`${caminho}/login`, dados);
    return response.data;
  },

  // PATCH - Editar (precisa do ID na URL)
  editar: async (id: number, dados: Partial<InstrutorData>) => {
    const response = await api.patch(`${caminho}/${id}`, dados);
    return response.data;
  },

  // DELETE - Deletar (precisa do ID na URL)
  deletar: async (id: number) => {
    const response = await api.delete(`${caminho}/${id}`);
    return response.data;
  },

  // PATCH - Desativar (se precisar de uma rota específica)
  desativar: async (id: number) => {
    const response = await api.patch(`${caminho}/desativar/${id}`);
    return response.data;
  },

  // PATCH - Reativar
  reativar: async (id: number) => {
    const response = await api.patch(`${caminho}/reativar/${id}`);
    return response.data;
  },

  listarMeusAlunos: async (idInstrutor: number) => {
    const response = await api.get(`/instrutores/${idInstrutor}/alunos`);
    return response.data;
  },

  async verificarMatricula(matricula: string) {
    const r = await api.get(`${caminho}/verificar-matricula/${matricula}`);
    return r.data.existe; // true ou false
  },
};
