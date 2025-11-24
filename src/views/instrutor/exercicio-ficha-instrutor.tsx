import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FichaService } from "../../services/FichaService";
import {
  ExercicioService,
  type ExercicioData,
} from "../../services/ExercicioService";
import CriarExercicio from "./modal-criar-exercicio";
import EditarExercicio from "./modal-editar-exercicio";

export default function ExerciciosFicha() {
  const { idFicha } = useParams();
  const navigate = useNavigate();

  const [ficha, setFicha] = useState<any>(null);
  const [exercicios, setExercicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModalCriar, setOpenModalCriar] = useState(false);
  const [editando, setEditando] = useState<ExercicioData | null>(null);
  const fichaFinalizada = ficha?.data_fim != null;

  async function loadData() {
    setLoading(true);

    const f = await FichaService.buscarPorId(Number(idFicha));
    setFicha(f);

    const e = await ExercicioService.listarPorFicha(Number(idFicha));
    setExercicios(e);

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [idFicha]); // <= executa apenas 1x

  if (loading) {
    return (
      <div className="text-center text-gray-300 mt-10">
        Carregando exercícios...
      </div>
    );
  }
  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      {/* CABEÇALHO */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-yellow-500">
            Exercícios da Ficha
          </h1>

          {ficha && (
            <>
              <p className="text-gray-400 mt-1">
                Ficha: <b className="text-yellow-400">{ficha.nome}</b>
              </p>
            </>
          )}
        </div>

        <button
          onClick={() => navigate(-1)}
          className="text-gray-300 hover:text-yellow-400"
        >
          ⟵ Voltar
        </button>
      </div>

      {/* LISTA DE EXERCÍCIOS */}
      {exercicios.length === 0 ? (
        <div className="flex flex-col items-center mt-20">
          <p className="text-gray-400 mb-4">Nenhum exercício ainda</p>
          <button
            disabled={fichaFinalizada}
            className={`px-4 py-2 rounded font-bold ${
              fichaFinalizada
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-yellow-500 text-black hover:bg-yellow-400"
            }`}
            onClick={() => !fichaFinalizada && setOpenModalCriar(true)}
          >
            + Criar Exercício
          </button>

          {fichaFinalizada && (
            <p className="text-gray-400 text-sm mt-2">
              Esta ficha foi finalizada. Não é possível adicionar novos
              exercícios.
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {exercicios.map((ex: any) => (
              <div
                key={ex.id_exercicio}
                className="bg-gray-800 p-4 rounded-xl border border-gray-700"
              >
                <h2 className="text-xl text-white font-bold">{ex.nome}</h2>

                <p className="text-gray-400 text-sm mt-1">
                  Séries: <b>{ex.series}</b> — Repetições:{" "}
                  <b>{ex.repeticoes}</b>
                </p>

                {ex.carga && (
                  <p className="text-gray-400 text-sm">
                    Carga: <b>{ex.carga} kg</b>
                  </p>
                )}

                {ex.intervalo_segundos && (
                  <p className="text-gray-400 text-sm">
                    Intervalo: <b>{ex.intervalo_segundos}s</b>
                  </p>
                )}

                {ex.observacoes && (
                  <p className="text-gray-500 text-sm mt-2 italic">
                    {ex.observacoes}
                  </p>
                )}

                <div className="flex gap-6 mt-3">
                  <button
                    className="text-yellow-400 hover:text-yellow-300"
                    onClick={() => setEditando(ex)}
                  >
                    Editar
                  </button>

                  <button
                    className="text-red-400 hover:text-red-300"
                    onClick={async () => {
                      if (confirm("Excluir exercício?")) {
                        await ExercicioService.deletar(ex.id_exercicio);
                        loadData();
                      }
                    }}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Botão Adicionar */}
          <button
            disabled={fichaFinalizada}
            onClick={() => !fichaFinalizada && setOpenModalCriar(true)}
            className={`mt-6 w-full p-4 rounded-xl border border-dashed ${
              fichaFinalizada
                ? "bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-gray-800 border-gray-600 text-yellow-500 hover:bg-gray-700"
            }`}
          >
            + Adicionar Exercício
          </button>

          {fichaFinalizada && (
            <p className="text-gray-400 text-sm mt-2 text-center">
              Esta ficha foi finalizada. Não é possível adicionar novos
              exercícios.
            </p>
          )}
        </>
      )}

      {/* MODAL CRIAR */}
      <CriarExercicio
        open={openModalCriar}
        onClose={() => setOpenModalCriar(false)}
        onSuccess={loadData}
        idFicha={Number(idFicha)}
      />

      {/* MODAL EDITAR */}
      <EditarExercicio
        open={!!editando}
        idExercicio={editando?.id_exercicio ?? 0}
        onClose={() => setEditando(null)}
        onSuccess={loadData}
      />
    </div>
  );
}
