import { useState } from "react";
import { PlanoService } from "../../services/PlanoService";
import type PlanoData from "../../services/PlanoService";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  alunos: any[]; // lista de alunos do instrutor
  idInstrutor: number;
}

export default function CriarPlano({
  open,
  onClose,
  onSuccess,
  alunos,
  idInstrutor,
}: Props) {
  const [form, setForm] = useState<PlanoData>({
    fk_id_aluno: 0,
    fk_id_instrutor: idInstrutor,
    descricao: "",
    duracao_semanas: "",
  });

  if (!open) return null;

  async function handleCriarPlano() {
    try {
      if (!form.fk_id_aluno) return alert("Selecione um aluno!");
      if (!form.descricao.trim()) return alert("Descreva o plano!");
      if (!form.duracao_semanas) return alert("Informe a duração!");

      await PlanoService.criar(form);

      alert("Plano criado com sucesso!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Erro ao criar plano");
    }
  }

 return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-neutral-900 p-6 rounded-xl w-96 border border-neutral-700">
        <h2 className="text-xl font-bold text-yellow-400 mb-4">Criar Novo Plano</h2>

        {/* Selecionar aluno */}
        <label className="text-gray-300 text-sm">Aluno</label>
        <select
          className="w-full p-2 rounded bg-neutral-800 text-white border border-neutral-700 mb-3"
          value={form.fk_id_aluno}
          onChange={(e) => setForm({ ...form, fk_id_aluno: Number(e.target.value) })}
        >
          <option value={0}>Selecione...</option>
          {alunos.map((a: any) => (
            <option key={a.id_aluno} value={a.id_aluno}>
              {a.nome}
            </option>
          ))}
        </select>

        {/* Descrição */}
        <label className="text-gray-300 text-sm">Descrição</label>
        <input
          type="text"
          className="w-full p-2 rounded bg-neutral-800 text-white border border-neutral-700 mb-3"
          value={form.descricao}
          onChange={(e) => setForm({ ...form, descricao: e.target.value })}
        />

        {/* Duração */}
        <label className="text-gray-300 text-sm">Duração (semanas)</label>
        <input
          type="number"
          min="0"
          className="w-full p-2 rounded bg-neutral-800 text-white border border-neutral-700 mb-3"
          value={form.duracao_semanas}
          onChange={(e) => setForm({ ...form, duracao_semanas: e.target.value })}
        />

        <div className="flex justify-between mt-4">
          <button className="text-gray-400" onClick={onClose}>Cancelar</button>
          <button className="bg-yellow-500 text-black px-4 py-2 rounded font-bold"
            onClick={handleCriarPlano}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}