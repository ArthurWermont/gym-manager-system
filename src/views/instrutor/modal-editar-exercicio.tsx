import { useEffect, useState } from "react";
import { ExercicioService } from "../../services/ExercicioService";
import type { ExercicioData } from "../../services/ExercicioService";

interface Props {
  open: Boolean;
  onClose: () => void;
  onSuccess: () => void;
  idExercicio: number;
}
export default function EditarExercicio({
  open,
  onClose,
  onSuccess,
  idExercicio,
}: Props) {
  const [form, setForm] = useState<Partial<ExercicioData>>({
    nome: "",
    series: 0,
    repeticoes: 0,
    carga: null,
    intervalo_segundos: null,
    observacoes: "",
  });

  const [loading, setLoading] = useState(true);

  async function loadExercicio() {
    setLoading(true);
    try {
      const dados = await ExercicioService.buscarPorId(idExercicio);
      setForm(dados);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar exercício.");
    }
    setLoading(false);
  }

  useEffect(() => {
    if (open) loadExercicio();
  }, [open]);

  async function handleUpdate() {
    try {
      if (!form.nome?.trim()) {
        alert("Digite o nome do exercício.");
        return;
      }

      if (form.series! < 0) {
        alert("O número de séries não pode ser negativo.");
        return;
      }

      if (form.repeticoes! < 0) {
        alert("O número de repetições não pode ser negativo.");
        return;
      }

      if (form.carga != null && form.carga < 0) {
        alert("A carga não pode ser negativa.");
        return;
      }

      if (form.intervalo_segundos != null && form.intervalo_segundos < 0) {
        alert("O intervalo não pode ser negativo.");
        return;
      }

      await ExercicioService.atualizar(idExercicio, form);
      alert("Exercício atualizado!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar exercício.");
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-neutral-900 p-6 rounded-xl w-96 border border-neutral-700">
        <h2 className="text-xl text-yellow-400 font-bold mb-4">
          Editar Exercício
        </h2>

        {loading ? (
          <p className="text-gray-400 text-center">Carregando...</p>
        ) : (
          <>
            {/* Nome */}
            <label className="text-gray-300 text-sm">Nome</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-neutral-800 text-white border border-neutral-700 mb-3"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />

            {/* Séries */}
            <label className="text-gray-300 text-sm">Séries</label>
            <input
              type="number"
              min="0"
              className="w-full p-2 rounded bg-neutral-800 text-white border border-neutral-700 mb-3"
              value={form.series}
              onChange={(e) =>
                setForm({ ...form, series: Number(e.target.value) })
              }
            />

            {/* Repetições */}
            <label className="text-gray-300 text-sm">Repetições</label>
            <input
              type="number"
              min="0"
              className="w-full p-2 rounded bg-neutral-800 text-white border border-neutral-700 mb-3"
              value={form.repeticoes}
              onChange={(e) =>
                setForm({ ...form, repeticoes: Number(e.target.value) })
              }
            />

            {/* Carga */}
            <label className="text-gray-300 text-sm">Carga (kg)</label>
            <input
              type="number"
              min="0"
              className="w-full p-2 rounded bg-neutral-800 text-white border border-neutral-700 mb-3"
              value={form.carga ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  carga: e.target.value ? Number(e.target.value) : null,
                })
              }
            />

            {/* Intervalo */}
            <label className="text-gray-300 text-sm">
              Intervalo (segundos)
            </label>
            <input
              type="number"
              min="0"
              className="w-full p-2 rounded bg-neutral-800 text-white border border-neutral-700 mb-3"
              value={form.intervalo_segundos ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  intervalo_segundos: e.target.value
                    ? Number(e.target.value)
                    : null,
                })
              }
            />

            {/* Observações */}
            <label className="text-gray-300 text-sm">Observações</label>
            <textarea
              rows={3}
              className="w-full p-2 rounded bg-neutral-800 text-white border border-neutral-700 mb-3"
              value={form.observacoes ?? ""}
              onChange={(e) =>
                setForm({ ...form, observacoes: e.target.value })
              }
            />

            {/* BOTÕES */}
            <div className="flex justify-between mt-4">
              <button className="text-gray-400" onClick={onClose}>
                Cancelar
              </button>

              <button
                onClick={handleUpdate}
                className="bg-yellow-500 text-black px-4 py-2 rounded font-bold"
              >
                Salvar Alterações
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
