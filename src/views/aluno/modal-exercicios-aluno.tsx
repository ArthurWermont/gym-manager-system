import { useEffect, useState } from "react";
import { ExercicioService } from "../../services/ExercicioService";
import { FichaService } from "../../services/FichaService";
import { FrequenciaService } from "../../services/FrequenciaService";

interface Props {
  open: boolean;
  onClose: () => void;
  idFicha: number;
}

export default function ExercicioAluno({
  open,
  onClose,
  idFicha,
  }: Props) {
  const [ficha, setFicha] = useState<any>(null);
  const [exercicios, setExercicios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [presenteHoje, setPresenteHoje] = useState(false);

  const storedUser = localStorage.getItem("academia_user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const idAluno = user.id;

  async function loadData() {
    setLoading(true);
    try {
      const f = await FichaService.buscarPorId(idFicha);
      setFicha(f);

      const ex = await ExercicioService.listarPorFicha(idFicha);
      setExercicios(ex);

      const freq = await FrequenciaService.listarHoje(idAluno);
      setPresenteHoje(freq.presenteHoje);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar dados do treino.");
    }

    setLoading(false);
  }

  async function registrarTreino() {
    try {
      await FrequenciaService.registrarPresencaHoje(idAluno, idFicha);
      setPresenteHoje(true);
      alert("Treino registrado com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao registrar treino.");
    }
  }

  useEffect(() => {
    if (open) loadData();
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-neutral-900 p-6 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-neutral-700">
        {/* Cabeçalho */}
        <h2 className="text-2xl text-yellow-400 font-bold mb-2">
          {ficha?.nome}
        </h2>

        <p className="text-gray-400 text-sm mb-2">
          {ficha?.observacoes || "Sem observações."}
        </p>

        <p className="text-gray-500 text-sm mb-4">
          Criada em: {new Date(ficha?.data_inicio).toLocaleDateString()}
        </p>

        {/* Lista de exercícios */}
        <div className="space-y-3">
          {loading ? (
            <p className="text-gray-400 text-center">Carregando...</p>
          ) : exercicios.length === 0 ? (
            <p className="text-gray-400">Nenhum exercício nesta ficha.</p>
          ) : (
            exercicios.map((ex: any) => (
              <div
                key={ex.id_exercicio}
                className="bg-gray-800 p-3 rounded-lg border border-gray-700"
              >
                <h3 className="text-white font-bold text-lg">{ex.nome}</h3>

                <p className="text-gray-400 text-sm">
                  {ex.series} séries • {ex.repeticoes} repetições
                </p>

                {ex.carga !== null && (
                  <p className="text-gray-400 text-sm">Carga: {ex.carga} kg</p>
                )}

                {ex.intervalo_segundos !== null && (
                  <p className="text-gray-400 text-sm">
                    Intervalo: {ex.intervalo_segundos}s
                  </p>
                )}

                {ex.observacoes && (
                  <p className="text-gray-500 text-sm italic mt-1">
                    Obs: {ex.observacoes}
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* BOTÃO DE PRESENÇA */}
        <div className="mt-5">
          {presenteHoje ? (
            <button
              disabled
              className="w-full bg-green-600 text-black py-2 rounded-lg font-bold opacity-70 cursor-not-allowed"
            >
              Presença Confirmada ✔
            </button>
          ) : (
            <button
              onClick={registrarTreino}
              className="w-full bg-yellow-500 text-black py-2 rounded-lg font-bold"
            >
              Registrar Presença
            </button>
          )}
        </div>

        {/* FECHAR */}
        <button
          onClick={onClose}
          className="mt-4 w-full text-gray-400 hover:text-white"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
