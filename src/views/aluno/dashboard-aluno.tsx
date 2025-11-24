import { useEffect, useState } from "react";
import { Wallet, ClipboardList, Dumbbell } from "lucide-react";
import { DashboardService } from "../../services/DashboardService";

export default function DashboardAluno() {
  const storedUser = localStorage.getItem("academia_user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const idAluno = user.id;

  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // 🔵 MELHORIA 7 — Status humanizado
  const statusMap: Record<string, string> = {
    pago: "Pago",
    pendente: "Pendente",
    atrasado: "Atrasado",
    nenhum: "Nenhum pagamento registrado",
  };

  // 🔵 Cores dinâmicas com base no status
  function getStatusColor(status: string) {
    switch (status) {
      case "pago":
        return "text-green-400";
      case "pendente":
        return "text-yellow-400";
      case "atrasado":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  }

  // 🔵 Data formatada de forma mais elegante
  function formatarData(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year:"numeric"
    });
  }

  async function loadData() {
    if (!idAluno) {
      setLoading(false);
      return;
    }

    try {
      const r = await DashboardService.resumoAluno(idAluno);
      setData(r);
    } catch (error) {
      console.error("Erro ao carregar dashboard do aluno:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [idAluno]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-60 bg-gray-900 p-8">
        <p className="text-gray-400 text-lg">Carregando suas informações...</p>
      </div>
    );

  if (!idAluno || !data) {
    return (
      <div className="p-8 min-h-screen bg-gray-900 text-white">
        <p className="text-red-500">Erro: ID do aluno não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-gray-900">
      <h1 className="text-3xl text-blue-400 font-extrabold mb-8">
        Meu Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* STATUS DO PAGAMENTO */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex justify-between items-start shadow-lg hover:border-blue-400/50 transition duration-200">
          <div>
            <p className="text-gray-400 text-sm mb-1">Status do Pagamento</p>

            <h2
              className={`text-3xl font-bold mb-1 ${getStatusColor(
                data.pagamento_status
              )}`}
            >
              {statusMap[data.pagamento_status] || "Indefinido"}
            </h2>

            {data.pagamento_validade && (
              <p className="text-blue-400 font-semibold">
                Validade: {formatarData(data.pagamento_validade)}
              </p>
            )}
          </div>

          <Wallet size={38} className="text-blue-400 mt-1" />
        </div>

        {/* PLANOS ATIVOS */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex justify-between items-start shadow-lg hover:border-blue-400/50 transition duration-200">
          <div>
            <p className="text-gray-400 text-sm mb-1">Você possui</p>

            <h2 className="text-4xl font-bold text-white mb-1">
              {data.planos_ativos === 0 ? "Nenhum" : data.planos_ativos}
            </h2>

            <p className="text-blue-400 font-semibold">
              Plano(s) de Treino Ativo(s)
            </p>
          </div>

          <ClipboardList size={40} className="text-blue-400 mt-1" />
        </div>

        {/* FICHAS ATIVAS */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex justify-between items-start shadow-lg hover:border-blue-400/50 transition duration-200">
          <div>
            <p className="text-gray-400 text-sm mb-1">Total de</p>

            <h2 className="text-4xl font-bold text-white mb-1">
              {data.fichas_ativas === 0 ? "Nenhuma" : data.fichas_ativas}
            </h2>

            <p className="text-blue-400 font-semibold">
              Ficha(s) de Treino Ativa(s)
            </p>
          </div>

          <Dumbbell size={40} className="text-blue-400 mt-1" />
        </div>
      </div>

      {/* RECOMENDAÇÕES */}
      <div className="mt-8">
        <h2 className="text-xl text-white font-semibold mb-4">
          Suas Recomendações
        </h2>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 min-h-40">
          <ul className="text-gray-400 space-y-3">
            {/* Recomendações baseadas no status */}
            <li className="flex items-center space-x-2">
              <span className="text-blue-400 text-lg">•</span>
              <span>
                {data.pagamento_status === "pago"
                  ? "Seu pagamento está em dia! Continue treinando!"
                  : data.pagamento_status === "pendente"
                  ? "Há um pagamento pendente. Fique atento ao vencimento!"
                  : data.pagamento_status === "atrasado"
                  ? "Seu pagamento está atrasado. Regularize para manter acesso aos treinos."
                  : "Nenhum pagamento registrado. Procure a recepção."}
              </span>
            </li>

            {/* Se não tem plano ativo */}
            {data.planos_ativos === 0 && (
              <li className="flex items-center space-x-2">
                <span className="text-blue-400 text-lg">•</span>
                <span>
                  Você ainda não possui um plano ativo. Fale com um instrutor
                  para iniciar seu treinamento!
                </span>
              </li>
            )}

            <li className="flex items-center space-x-2">
              <span className="text-blue-400 text-lg">•</span>
              <span>
                Confira suas fichas de treino e siga corretamente seu plano.
              </span>
            </li>

            <li className="flex items-center space-x-2">
              <span className="text-blue-400 text-lg">•</span>
              <span>Mantenha consistência: treine ao menos 3x por semana!</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
