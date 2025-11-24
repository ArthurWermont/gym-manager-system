import api from "./api";

export default interface PlanoData {
  fk_id_aluno: number;
  fk_id_instrutor: number;
  descricao: string;
  duracao_semanas: string;
}

const caminho = "/planos";

export const PlanoService = {
  // 📌 Criar plano
  criar: async (dados: any) => {
    const r = await api.post(caminho, dados);
    return r.data;
  },

  // 📌 Listar planos por aluno
  listarPorAluno: async (idAluno: number) => {
    const r = await api.get(`${caminho}/aluno/${idAluno}`);
    return r.data;
  },

  // 📌 Atualizar parcialmente (PATCH)
  atualizar: async (idPlano: number, dados: any) => {
    const r = await api.patch(`${caminho}/${idPlano}`, dados);
    return r.data;
  },

  // 📌 Desativar plano
  desativar: async (idPlano: number) => {
    const r = await api.patch(`${caminho}/desativar/${idPlano}`);
    return r.data;
  },

  // 📌 Deletar plano
  deletar: async (idPlano: number) => {
    const r = await api.delete(`${caminho}/${idPlano}`);
    return r.data;
  },

  // 📌 Listar planos por instrutor (NOVA ROTA)
  listarPorInstrutor: async (idInstrutor: number) => {
    const r = await api.get(`${caminho}/${idInstrutor}`);
    return r.data;
  },

  buscarPorId: async (idPlano: number) => {
    const r = await api.get(`${caminho}/${idPlano}/plano`);
    return r.data
  },
};
