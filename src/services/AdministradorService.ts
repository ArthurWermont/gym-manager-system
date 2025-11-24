import api from "./api";

export interface AdminData {
  id_administrador?: number;
  nome: string;
  matricula: string;
  email: string;
  senha?: string;
}

export interface LoginData {
  email: string;
  senha: string;
}

const caminho = "/administradores"; // O prefixo da rota

export const AdministradorService = {
  // GET - Listar todos
  listar: async () => {
    const response = await api.get(caminho);
    return response.data;
  },

  // POST - Cadastrar
  cadastrar: async (dados: AdminData) => {
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

  // PATCH - Editar (precisa do ID na URL)
  editar: async (id: number, dados: Partial<AdminData>) => {
    const response = await api.patch(`${caminho}/${id}`, dados);
    return response.data;
  },

  // DELETE - Deletar (precisa do ID na URL)
  deletar: async (id: number) => {
    const response = await api.delete(`${caminho}/${id}`);
    return response.data;
  },
};
