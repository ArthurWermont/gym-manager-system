import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PlanoService } from "../../services/PlanoService";
import { FichaService } from "../../services/FichaService";
import CriarFicha from "./modal-ficha";
import {
  ClipboardList,
  FileSpreadsheet,
  PlusCircle,
  Trash2,
} from "lucide-react";

export default function FichasDoPlano() {
  const { idPlano } = useParams();
  const navigate = useNavigate();

  const [fichas, setFichas] = useState([]);
  const [plano, setPlano] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  async function loadData() {
    if (!idPlano) return;

    const p = await PlanoService.buscarPorId(Number(idPlano));
    const f = await FichaService.listarPorPlano(Number(idPlano));

    setPlano(p);
    setFichas(f);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-400 text-lg">Carregando fichas...</p>
      </div>
    );

  const planoDesativado = plano?.ativo === 0;

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-yellow-500 flex items-center space-x-3">
            <ClipboardList size={30} />
            <span>Fichas do Plano</span>
          </h1>

          <p className="text-gray-400 mt-1">
            Plano: <b className="text-yellow-400">{plano.descricao}</b>
          </p>

          <p className="text-gray-400">
            Aluno(a): <b className="text-yellow-400">{plano.nome_aluno}</b>
          </p>

          {planoDesativado && (
            <p className="text-red-400 text-sm mt-1 font-semibold">
              Este plano está desativado — não é possível criar novas fichas.
            </p>
          )}
        </div>

        <button
          onClick={() => navigate("/instrutor/planos")}
          className="text-gray-300 hover:text-yellow-400"
        >
          ⟵ Voltar
        </button>
      </div>

      <hr className="border-gray-700 mb-6" />

      {/* SEM FICHAS */}
      {fichas.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20">
          <FileSpreadsheet size={60} className="text-yellow-500 mb-4" />
          <h2 className="text-2xl text-white font-bold mb-2">
            Nenhuma ficha criada ainda
          </h2>
          <p className="text-gray-400 mb-6">
            Comece adicionando a primeira ficha.
          </p>

          <button
            disabled={planoDesativado}
            onClick={() => !planoDesativado && setOpenModal(true)}
            className={`bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold flex items-center space-x-2 
              ${
                planoDesativado
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-yellow-400"
              }
            `}
          >
            <PlusCircle size={20} />
            <span>Criar Ficha</span>
          </button>
        </div>
      ) : (
        <>
          {/* LISTA */}
          <div className="space-y-4">
            {fichas.map((f: any) => (
              <div
                key={f.id_ficha}
                className={`p-5 rounded-xl flex justify-between items-center transition border
                  ${
                    f.data_fim
                      ? "bg-gray-700/40 border-gray-600 opacity-50"
                      : "bg-gray-800 border-gray-700 hover:bg-gray-700/40"
                  }
                `}
              >
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {f.nome}

                    {f.data_fim && (
                      <span className="px-2 py-1 bg-red-600/20 text-red-400 text-xs rounded-md">
                        Desativada
                      </span>
                    )}
                  </h3>

                  <p className="text-gray-400 text-sm">{f.observacoes}</p>

                  <p className="text-gray-400 text-sm">
                    Criada em: {new Date(f.data_inicio).toLocaleDateString()}
                  </p>

                  {f.data_fim && (
                    <p className="text-red-400 text-sm">
                      Encerrada em: {new Date(f.data_fim).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* BOTÕES */}
                <div className="flex items-center space-x-5">
                  <button
                    onClick={() =>
                      navigate(`/instrutor/fichas/${f.id_ficha}/exercicios`)
                    }
                    className={`font-semibold transition ${
                      f.data_fim
                        ? "text-gray-400 hover:text-gray-300" // desativada
                        : "text-yellow-500 hover:text-yellow-300" // ativa
                    }`}
                  >
                    Ver Exercícios →
                  </button>

                  <button
                    disabled={!!f.data_fim}
                    onClick={async () => {
                      if (confirm("Deseja desativar esta ficha?")) {
                        await FichaService.desativar(f.id_ficha);
                        loadData();
                      }
                    }}
                    className={
                      f.data_fim
                        ? "text-gray-500 cursor-not-allowed text-sm"
                        : "text-red-500 hover:text-red-400 text-sm"
                    }
                  >
                    Desativar
                  </button>

                  <button
                    onClick={async () => {
                      const ok = confirm(
                        "Tem certeza que deseja excluir esta ficha?"
                      );
                      if (!ok) return;

                      try {
                        await FichaService.deletar(f.id_ficha);
                        loadData();
                      } catch (error: any) {
                        alert(
                          error.response?.data?.message || "Erro ao excluir."
                        );
                      }
                    }}
                    className="text-red-500 hover:text-red-400 p-1"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* BOTÃO NOVA FICHA */}
          <button
            disabled={planoDesativado}
            onClick={() => !planoDesativado && setOpenModal(true)}
            className={`flex items-center justify-center w-full space-x-2 mt-6 p-5 rounded-xl border border-dashed 
              ${
                planoDesativado
                  ? "bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-gray-700 border-gray-600 text-yellow-500 hover:bg-gray-600/50"
              }
            `}
          >
            <PlusCircle size={20} />
            <span>Adicionar Nova Ficha</span>
          </button>
        </>
      )}

      <CriarFicha
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={loadData}
        idPlano={Number(idPlano)}
      />
    </div>
  );
}
