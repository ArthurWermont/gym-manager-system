import api from "./api";

export interface ExercicioData {
    id_exercicio?: number;
    fk_id_ficha: number;
    nome: string;
    series: number;
    repeticoes: number;
    carga?: number | null;
    intervalo_segundos?: number | null;
    observacoes?: string | null;
}

const caminho = "/exercicios"

export const ExercicioService = {
  // Criar exercício
  criar: async (dados: ExercicioData) => {
    const r = await api.post(caminho, dados);
    return r.data;
  },

  // Listar todos os exercícios da ficha
  listarPorFicha: async (idFicha: number) => {
    const r = await api.get(`${caminho}/${idFicha}`);
    return r.data;
  },

  // Buscar exercício por ID
  buscarPorId: async (idExercicio: number) => {
    const r = await api.get(`${caminho}/buscar/${idExercicio}`);
    return r.data;
  },

  // Buscar exercícios pelo nome
  buscarPorNome: async (nome: string) => {
    const r = await api.get(`${caminho}/nome/${nome}`);
    return r.data;
  },

  // Atualizar exercício (PATCH)
  atualizar: async (idExercicio: number, dados: Partial<ExercicioData>) => {
    const r = await api.patch(`${caminho}/${idExercicio}`, dados);
    return r.data;
  },

  // Deletar exercício
  deletar: async (idExercicio: number) => {
    const r = await api.delete(`${caminho}/${idExercicio}`);
    return r.data;
  },
};