import { useEffect, useState } from "react";
import { FichaService } from "../../services/FichaService";
import { Dumbbell, ListChecks, FileText } from "lucide-react"; // Ícones úteis
import ExercicioAluno from "./modal-exercicios-aluno";

export default function TreinoAluno() {
  const [fichas, setFichas] = useState([]);
  const [loading, setLoading] = useState(true);
  const storedUser = localStorage.getItem("academia_user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const idAluno = user.id;

  const [fichaSelecionada, setFichaSelecionada] = useState<number | null>(null);

  async function loadData() {
    setLoading(true);

    const f = await FichaService.listarPorAluno(idAluno);

    setFichas(f.filter((f: any) => f.data_fim === null));
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  if (loading)
    return <div className="text-center text-gray-300 mt-10">Carregando...</div>;

  return (
    <div className="p-8 min-h-screen bg-gray-900">
      <h1 className="text-3xl font-extrabold text-yellow-500 mb-8 flex items-center space-x-3">
        <Dumbbell size={30} />
        <span>Minhas Fichas de Treino</span>
      </h1>

      {fichas.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 p-10 bg-gray-800 border border-dashed border-gray-700 rounded-xl">
          <ListChecks size={60} className="text-gray-500 mb-4" />
          <h2 className="text-xl text-white font-semibold mb-2">
            Nenhuma Ficha Ativa
          </h2>
          <p className="text-gray-400 text-center">
            Você não possui fichas de treino ativas. Entre em contato com seu
            instrutor.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {" "}
          {/* Mantendo o layout de lista vertical simples */}
          {fichas.map((f: any) => (
            <div
              key={f.id_ficha}
              // Card Minimalista Horizontal: Fundo sutil e borda completa.
              className="bg-gray-800 p-5 rounded-lg border border-gray-700 
                       flex items-center justify-between transition duration-300 
                       hover:bg-gray-700/70 hover:shadow-xl hover:border-yellow-500/50"
            >
              {/* 1. INFORMAÇÕES (Lado Esquerdo) */}
              <div className="flex-1 min-w-0 pr-4">
                {/* Título com destaque amarelo sutil */}
                <h2 className="text-xl text-yellow-500 font-bold mb-1 truncate">
                  {f.nome || "Treino sem Nome"}
                </h2>
                {/* Observações com cor sutil */}
                <p className="text-gray-400 text-sm truncate">
                  {f.observacoes ? `Obs: ${f.observacoes}` : "Sem observações."}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                {/* Botão Secundário: Ver Exercícios (Texto + Ícone) */}
                <button
                  onClick={() => setFichaSelecionada(f.id_ficha)}
                  className="flex items-center space-x-1 p-2 rounded-lg 
                   text-yellow-500 bg-gray-700/50 hover:bg-gray-700 text-sm font-medium transition duration-150"
                  title="Ver Detalhes e Exercícios"
                >
                  <FileText size={16} />
                  <span>Ver Exercícios</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {fichaSelecionada && (
        <ExercicioAluno
          open={true}
          idFicha={fichaSelecionada}
          onClose={() => setFichaSelecionada(null)}
        />
      )}
    </div>
  );
}
