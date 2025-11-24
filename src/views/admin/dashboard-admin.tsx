import { useEffect, useState } from "react";
import { DashboardService } from "../../services/DashboardService";
import { Users, UserCog, ClipboardList } from "lucide-react";

export default function DashboardAdmin() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    const r = await DashboardService.resumoAdmin();
    setData(r);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-60 bg-gray-900 p-8">
        <p className="text-gray-400 text-lg">
          Carregando dados do Dashboard...
        </p>
      </div>
    );

  return (
    <div className="p-8 min-h-screen bg-gray-900">
      <h1 className="text-3xl text-yellow-500 font-extrabold mb-8">
        Painel de Controle Administrativo
      </h1>

      {/* Grid com 3 colunas em telas médias e grandes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Alunos Card */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex justify-between items-start shadow-lg hover:border-yellow-500/50 transition duration-200">
          <div>
            <p className="text-gray-400 text-sm mb-1">Total de</p>
            <h2 className="text-4xl font-bold text-white mb-1">
              {data.alunos_ativos}
            </h2>
            <p className="text-yellow-500 font-semibold">Alunos Ativos</p>
          </div>
          <Users size={40} className="text-yellow-500/80 mt-1" />
        </div>

        {/* Instrutores Card */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex justify-between items-start shadow-lg hover:border-yellow-500/50 transition duration-200">
          <div>
            <p className="text-gray-400 text-sm mb-1">Total de</p>
            <h2 className="text-4xl font-bold text-white mb-1">
              {data.instrutores_ativos}
            </h2>
            <p className="text-yellow-500 font-semibold">Instrutores Ativos</p>
          </div>
          <UserCog size={40} className="text-yellow-500/80 mt-1" />
        </div>

        {/* Planos Card */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex justify-between items-start shadow-lg hover:border-yellow-500/50 transition duration-200">
          <div>
            <p className="text-gray-400 text-sm mb-1">Total de</p>
            <h2 className="text-4xl font-bold text-white mb-1">
              {data.planos_ativos}
            </h2>
            <p className="text-yellow-500 font-semibold">Planos Ativos</p>
          </div>
          <ClipboardList size={40} className="text-yellow-500/80 mt-1" />
        </div>
      </div>

      {/* Seção Adicional (Visão Detalhada) */}
      {/* <div className="mt-8">
        <h2 className="text-xl text-white font-semibold mb-4">
          Visão Detalhada
        </h2>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-64 flex items-center justify-center">
          <p className="text-gray-500">
            Espaço reservado para gráficos ou tabelas de desempenho.
          </p>
        </div>
      </div> */}
    </div>
  );
}
