import api from "./api";

const caminho = "/frequencia";
export const FrequenciaService = {
  registrarPresencaHoje: async (idAluno: number, idFicha: number) => {
    const r = await api.post(`${caminho}/registrar/${idAluno}/${idFicha}`, {
      fk_id_ficha: idFicha,
    });
    return r.data;
  },

  listarHoje: async (idAluno: number) => {
    const r = await api.get(`${caminho}/hoje/${idAluno}`);
    return r.data;
  },

  listarPorAluno: async (idAluno: number) => {
    const r = await api.get(`${caminho}/aluno/${idAluno}`);
    return r.data;
  },

  listarPresencas: async () => {
    const r = await api.get(`${caminho}`);
    return r.data;
  },

};
