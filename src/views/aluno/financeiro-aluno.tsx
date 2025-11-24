import { useEffect, useState } from "react";
import {
  PagamentoService,
  type PagamentoData,
} from "../../services/PagamentoService";
import Badge from "../../components/ui/bagde";

export default function Financeiro() {
  const storedUser = localStorage.getItem("academia_user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [pagamentos, setPagamentos] = useState<PagamentoData[]>([]);
  const [loading, setLoading] = useState(true);

  async function carregar() {
    try {
      const data = await PagamentoService.listarPorAluno(user.id);
    //   console.log(data);
      setPagamentos(data);
    } catch (err) {
      console.error("Erro ao carregar pagamentos:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const pendente = pagamentos.find((p) => p.status === "pendente");
  const pagos = pagamentos.map((p) => p.status === "pago");

  async function pagarAgora(idPagamento:number) {
    try {
        await PagamentoService.pagar(idPagamento);
        await carregar()
    } catch (error) {
        console.error("Erro ao pagar:", error);
    }
  }
  return (
    <div className="max-w-3xl mx-auto text-gray-200">
      <h1 className="text-2xl font-bold mb-6 text-yellow-400">Financeiro</h1>

      {/* SE TIVER UMA COBRANÇA PENDENTE */}
      {pendente && (
        <div className="mb-8 p-4 bg-neutral-900 border border-neutral-700 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Cobrança pendente</h2>

          <p>
            Valor: <span className="text-yellow-400">R$ {pendente.valor}</span>
          </p>
          <p>
            Vencimento: {new Date(pendente.data_validade).toLocaleDateString()}
          </p>
          <p>Método: {pendente.metodo_pagamento}</p>

          <div className="mt-4">
            <button
              onClick={()=>{pagarAgora(pendente.id_pagamento)}}
              className="px-4 py-2 bg-yellow-400 text-black rounded font-semibold hover:bg-yellow-300"
            >
              Pagar Agora
            </button>
          </div>
        </div>
      )}

      {/* SE NÃO TIVER PENDÊNCIA */}
      {!pendente && (
        <div className="mb-8 p-4 bg-neutral-900 border border-neutral-700 rounded-lg">
          <p className="text-green-400 font-semibold">Você está em dia!</p>
        </div>
      )}

      {/* HISTÓRICO DE PAGAMENTOS */}
      <h2 className="text-lg font-semibold mb-3">Histórico</h2>

      <div className="space-y-3">
        {pagamentos.map((p) => (
          <div
            key={p.id_pagamento}
            className="p-3 bg-neutral-800 rounded-lg border border-neutral-700"
          >
            <p>Valor: R$ {p.valor}</p>
            <p>Validade: {new Date(p.data_validade).toLocaleDateString()}</p>

            <Badge
              label={p.status === "pago" ? "Pago" : "Pendente"}
              color={p.status === "pago" ? "green" : "yellow"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
