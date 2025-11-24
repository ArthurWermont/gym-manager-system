import { useState } from "react";
import { PagamentoService } from "../../services/PagamentoService";

interface ModalProps {
  aluno: any;
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CriarCobrancaModal({
  aluno,
  open,
  onClose,
  onCreated,
}: ModalProps) {
  if (!open) return null;

  const [valor, setValor] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    let pagamento;
    try {
      setLoading(true);

      pagamento = await PagamentoService.listarPorAluno(aluno.fk_id_aluno);
      // ordena da maior validade para a menor
      const ultimoPag = pagamento.sort(
        (a, b) =>
          new Date(b.data_validade).getTime() -
          new Date(a.data_validade).getTime()
      )[0];

      console.log("DADOS ENVIADOS:", {
        fk_id_aluno: aluno.fk_id_aluno,
        valor,
        tipo_plano: ultimoPag?.tipo_plano,
        metodo_pagamento: ultimoPag?.metodo_pagamento,
      });

      await PagamentoService.criar({
        fk_id_aluno: aluno.fk_id_aluno,
        valor: Number(valor),
        tipo_plano: ultimoPag?.tipo_plano ?? "mensal",
        metodo_pagamento: ultimoPag?.metodo_pagamento ?? "pix",
      });

      onCreated();
      onClose();
    } catch (err) {
      console.error("Erro ao criar cobrança:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center animate-fadeIn">
      <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-xl w-96 shadow-2xl animate-scaleIn">
        {/* TÍTULO */}
        <h2 className="text-xl font-bold text-yellow-400 mb-1">
          Criar Cobrança
        </h2>
        <p className="text-gray-400 text-sm mb-4 border-b border-neutral-700 pb-2">
          Cobrar aluno: <span className="text-gray-200">{aluno.nome}</span>
        </p>

        {/* INPUT */}
        <label className="block text-sm mb-1 text-gray-300">
          Valor da cobrança (R$)
        </label>
        <input
          type="number"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="w-full mb-6 rounded-lg bg-neutral-800 px-3 py-2 text-gray-200 
                     border border-neutral-700 focus:border-yellow-400 outline-none transition"
        />

        {/* BOTÕES */}
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-lg border border-neutral-600 text-gray-300 
                       hover:bg-neutral-800 transition"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            className="px-4 py-2 rounded-lg bg-yellow-400 text-black font-semibold
                       hover:bg-yellow-300 transition disabled:opacity-60"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Criando..." : "Criar cobrança"}
          </button>
        </div>
      </div>

      {/* ANIMAÇÕES */}
      <style>
        {`
        .animate-fadeIn {
          animation: fadeIn .2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn .2s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }
        @keyframes scaleIn {
          from { transform: scale(.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}
      </style>
    </div>
  );
}
