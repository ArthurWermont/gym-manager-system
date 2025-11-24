import api from "./api";

export const DashboardService = {
  resumoAdmin: async () => {
    const r = await api.get("/dashboard/admin");
    return r.data;
  },
  resumoInstrutor: async (idInstrutor: number) => {
    const r = await api.get(`/dashboard/instrutor/${idInstrutor}`);
    return r.data;
  },
  resumoAluno: async (idAluno: number) => {
    const r = await api.get(`/dashboard/aluno/${idAluno}`);
    return r.data;
  },
};
