import { useEffect, useState } from "react";
import Table from "../../components/ui/table";
import Badge from "../../components/ui/bagde";
import { PagamentoService } from "../../services/PagamentoService";
import CriarCobrancaModal from "./cobranca";

export default function PagamentosAdmin() {
  const [pagamentos, setPagamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);

  // pagamento mais recente por aluno (usando data_pagamento)
  const ultimoPorAluno: Record<number, any> = {};

  pagamentos.forEach((p) => {
    const atual = ultimoPorAluno[p.fk_id_aluno];

    // se ainda não tem, ou se esse pagamento é mais recente, substitui
    if (
      !atual ||
      new Date(p.data_pagamento).getTime() >
        new Date(atual.data_pagamento).getTime()
    ) {
      ultimoPorAluno[p.fk_id_aluno] = p;
    }
  });

  function openModal(p: any) {
    setAlunoSelecionado(p);
    setModalOpen(true);
  }

  useEffect(() => {
    async function fetchPagamentos() {
      try {
        const data = await PagamentoService.listarTodos();
        setPagamentos(data);
      } catch (err) {
        console.error("Erro ao carregar pagamentos:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPagamentos();
  }, []);

  const columns = [
    { header: "Aluno", accessor: "nome_aluno" },
    { header: "Matrícula", accessor: "matricula_aluno" },
    { header: "Valor", accessor: "valor" },
    { header: "Validade", accessor: "data_validade" },
    { header: "Método", accessor: "metodo_pagamento" },
    { header: "Status", accessor: "status" },
    { header: "Ações", accessor: "acoes" },
  ];

  const rows = pagamentos.map((p) => {
    const ultimo = ultimoPorAluno[p.fk_id_aluno];

    const ehUltimoDoAluno = ultimo && ultimo.id_pagamento === p.id_pagamento;
    const podeCobrar = ehUltimoDoAluno && ultimo.status === "pago";

    return {
      ...p,
      valor: `R$ ${Number(p.valor).toFixed(2)}`,
      data_validade: new Date(p.data_validade).toLocaleDateString(),
      metodo_pagamento:
        p.metodo_pagamento.charAt(0).toUpperCase() +
        p.metodo_pagamento.slice(1),

      status: (
        <Badge
          label={
            p.status === "pago"
              ? "Pago"
              : p.status === "atrasado"
              ? "Atrasado"
              : "Pendente"
          }
          color={
            p.status === "pago"
              ? "green"
              : p.status === "atrasado"
              ? "red"
              : "yellow"
          }
        />
      ),

      acoes: podeCobrar ? (
        <button
          className="text-yellow-400 hover:text-yellow-300"
          onClick={() => openModal(p)}
        >
          Cobrar
        </button>
      ) : (
        <span className="text-gray-700 opacity-40 cursor-not-allowed">—</span>
      ),
    };
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-yellow-400">Pagamentos</h1>

      <p className="text-sm text-gray-400 mb-4">
        Histórico geral de pagamentos de alunos.
      </p>

      <Table columns={columns} data={rows} />
      {modalOpen && (
        <CriarCobrancaModal
          aluno={alunoSelecionado}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onCreated={() => window.location.reload()}
        />
      )}
    </div>
  );
}
