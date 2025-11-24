import { useState } from "react";
import { FichaService } from "../../services/FichaService";
import type FichaData from "../../services/FichaService";

interface Props {
  open: Boolean;
  onClose: () => void;
  onSuccess: () => void;
  idPlano: number;
}
export default function CriarFicha({
  open,
  onClose,
  onSuccess,
  idPlano,
}: Props) {
  const [form, setForm] = useState<FichaData>({
    fk_id_plano: idPlano,
    nome: "",
    observacoes: "",
  });
  
  async function handleCreate() {
    try {
      if (!form.nome.trim()) {
        alert("Digite um nome para a ficha.");
        return;
      }

      await FichaService.criar(form);
      alert("Ficha criada com sucesso!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Erro ao criar ficha");
    }
  }
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-neutral-900 p-6 rounded-xl w-96 border border-neutral-700">
        <h2 className="text-xl font-bold text-yellow-400 mb-4">
          Criar Nova Ficha
        </h2>

        {/* Nome da ficha */}
        <label className="text-gray-300 text-sm">Nome da Ficha</label>
        <input
          type="text"
          placeholder="Ex: Ficha A, Full Body..."
          className="w-full p-2 rounded bg-neutral-800 text-white border border-neutral-700 mb-3"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
        />

        {/* Observações */}
        <label className="text-gray-300 text-sm">Observações (opcional)</label>
        <textarea
          className="w-full p-2 rounded bg-neutral-800 text-white border border-neutral-700 mb-3"
          rows={3}
          value={form.observacoes}
          onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
        />

        {/* Botões */}
        <div className="flex justify-between mt-4">
          <button className="text-gray-400" onClick={onClose}>
            Cancelar
          </button>

          <button
            className="bg-yellow-500 text-black px-4 py-2 rounded font-bold"
            onClick={handleCreate}
          >
            Criar Ficha
          </button>
        </div>
      </div>
    </div>
  );
}
