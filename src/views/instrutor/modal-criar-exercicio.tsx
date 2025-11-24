import { useState } from "react";
import {
  ExercicioService,
  type ExercicioData,
} from "../../services/ExercicioService";

interface Props {
  open: Boolean;
  onClose: () => void;
  onSuccess: () => void;
  idFicha: number;
}
export default function CriarExercicio({
  open,
  onClose,
  onSuccess,
  idFicha,
}: Props) {
  const [form, setForm] = useState<ExercicioData>({
    fk_id_ficha: idFicha,
    nome: "",
    series: 0,
    repeticoes: 0,
    carga: null,
    intervalo_segundos: null,
    observacoes: "",
  });

  async function handleCriarExercicio() {
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

      await ExercicioService.criar(form);

      alert("Exercício criado com sucesso!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Erro ao criar exercício.");
    }
  }
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-neutral-900 p-6 rounded-xl w-96 border border-neutral-700">
        <h2 className="text-xl text-yellow-400 font-bold mb-4">
          Novo Exercício
        </h2>

        {/* Nome */}
        <label className="text-gray-300 text-sm">Nome</label>
        <input
          type="text"
          className="w-full p-2 rounded bg-neutral-800 text-white border border-neutral-700 mb-3"
          placeholder="Ex: Supino reto"
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
          onChange={(e) => setForm({ ...form, series: Number(e.target.value) })}
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
        <label className="text-gray-300 text-sm">Carga (kg) — opcional</label>
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
          Intervalo (segundos) — opcional
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
          className="w-full p-2 rounded bg-neutral-800 text-white border border-neutral-700 mb-3"
          rows={3}
          value={form.observacoes ?? ""}
          onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
        />

        <div className="flex justify-between mt-4">
          <button className="text-gray-400" onClick={onClose}>
            Cancelar
          </button>

          <button
            className="bg-yellow-500 px-4 py-2 rounded text-black font-bold"
            onClick={handleCriarExercicio}
          >
            Criar Exercício
          </button>
        </div>
      </div>
    </div>
  );
}
