import api from "./api";

export default interface FichaData{
    id_ficha?: number;
    fk_id_plano: number;
    nome: string;
    data_inicio?: string;  // Opcional porque no backend define NOW()
    data_fim?: string;      // Só usado quando desativa
    observacoes?: string;
    ativo?: boolean;        // Backend seta automaticamente
}

const caminho = "/fichas"; 

export const FichaService = {
  // 📌 Criar ficha vinculada ao plano
  criar: async (dados: any) => {
    const r = await api.post(caminho, dados);
    return r.data;
  },

  // 📌 Listar fichas de um plano
  listarPorPlano: async (idPlano: number) => {
    const r = await api.get(`${caminho}/${idPlano}`);
    return r.data;
  },

  // 📌 Atualizar parcial (PATCH)
  atualizar: async (idFicha: number, dados: any) => {
    const r = await api.patch(`${caminho}/${idFicha}`, dados);
    return r.data;
  },

  // 📌 Desativar ficha
  desativar: async (idFicha: number) => {
    const r = await api.patch(`${caminho}/desativar/${idFicha}`);
    return r.data;
  },

  // 📌 Deletar ficha
  deletar: async (idFicha: number) => {
    const r = await api.delete(`${caminho}/${idFicha}`);
    return r.data;
  },

  buscarPorId: async (idFicha: number) => {
    const r = await api.get(`${caminho}/${idFicha}/ficha`);
    return r.data
  },
  // 📌 Listar Fichas por aluno
  listarPorAluno: async (idAluno: number) => {
    const r = await api.get(`${caminho}/aluno/${idAluno}`);
    return r.data;
  },
};