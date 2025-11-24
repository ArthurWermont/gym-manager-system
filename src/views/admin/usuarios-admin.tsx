import Table from "../../components/ui/table";
import Badge from "../../components/ui/bagde";
import { useEffect, useState } from "react";
import { AlunoService } from "../../services/AlunoService";
import { InstrutorService } from "../../services/InstrutorService";
import { PagamentoService } from "../../services/PagamentoService";
import CadastroModalAluno from "./cadastrar-aluno";
import CadastroModalInstrutor from "./cadastrar-instrutor";
import { UserPlus, Users } from 'lucide-react';
export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpenAluno, setModalOpenAluno] = useState(false);
  const [modalInstrutorOpen, setModalInstrutorOpen] = useState(false); // modal instrutor

  useEffect(() => {
    async function fetchData() {
      try {
        const dataAluno = await AlunoService.listar();
        const dataInstrutor = await InstrutorService.listar();

        const alunosComPagamento = await Promise.all(
          dataAluno.map(async (a: any) => {
            const pagamentos = await PagamentoService.listarPorAluno(
              a.id_aluno
            );
            const ultimoPag = pagamentos[0]; // Já vem ordenado

            return {
              ...a,
              tipo: "aluno",
              pagamento_status: ultimoPag?.status ?? "pendente",
            };
          })
        );

        // Instrutor não tem pagamento
        const instrutoresComPagamento = dataInstrutor.map((i: any) => ({
          ...i,
          tipo: "instrutor",
          pagamento_status: "N/A",
        }));

        setUsuarios([...alunosComPagamento, ...instrutoresComPagamento]);
      } catch (err) {
        console.error("Erro ao carregar usuários:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const columns = [
    { header: "Nome", accessor: "nome" },
    { header: "Matrícula", accessor: "matricula" },
    { header: "E-mail", accessor: "email" },
    { header: "Tipo", accessor: "tipo" },
    { header: "Status", accessor: "ativo" },
    { header: "Pagamento", accessor: "pagamento" },
  ];

  const rows = usuarios.map((u: any) => ({
    nome: u.nome,
    matricula: u.matricula,
    email: u.email,

    tipo: u.tipo === "aluno" ? "Aluno" : "Instrutor",

    ativo: (
      <Badge
        label={u.ativo ? "Ativo" : "Inativo"}
        color={u.ativo ? "green" : "red"}
      />
    ),

    pagamento: (
      <Badge
        label={
          u.pagamento_status === "pago"
            ? "Pago"
            : u.pagamento_status === "atrasado"
            ? "Atrasado"
            : u.pagamento_status === "pendente"
            ? "Pendente"
            : "N/A"
        }
        color={
          u.pagamento_status === "pago"
            ? "green"
            : u.pagamento_status === "atrasado"
            ? "red"
            : u.pagamento_status === "pendente"
            ? "yellow"
            : "gray"
        }
      />
    ),
  }));

  if (loading) return <p className="text-gray-300">Carregando usuários...</p>;

  return (
    <div>
      <div className="flex justify-end mb-6 gap-4"> {/* Aumentei o espaçamento (gap-4) e a margem inferior (mb-6) */}
    
    {/* --- BOTÃO ALUNO (Primário - Destaque Amarelo) --- */}
    <button
      onClick={() => setModalOpenAluno(true)}
      className="flex items-center space-x-2 
        px-4 py-2 rounded-lg 
        bg-yellow-500 text-gray-900 text-base font-bold 
        shadow-lg shadow-yellow-500/40 
        hover:bg-yellow-400 hover:shadow-xl hover:shadow-yellow-500/50 
        active:scale-[0.98] 
        transition-all duration-200"
    >
      <UserPlus size={18} /> {/* Ícone para "Novo Aluno" */}
      <span>Novo Aluno</span>
    </button>

    {/* --- BOTÃO INSTRUTOR (Secundário - Azul) --- */}
    <button
      onClick={() => setModalInstrutorOpen(true)}
      className="flex items-center space-x-2
        px-4 py-2 rounded-lg 
        bg-blue-500 text-white text-base font-medium 
        shadow-lg shadow-blue-500/40 
        hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-500/50 
        active:scale-[0.98] 
        transition-all duration-200"
    >
      <Users size={18} /> {/* Ícone para "Novo Instrutor" */}
      <span>Novo Instrutor</span>
    </button>
  </div>

      {/* MODAL */}
      <CadastroModalAluno
        open={modalOpenAluno}
        onClose={() => setModalOpenAluno(false)}
        onSuccess={() => window.location.reload()}
      />
      <CadastroModalInstrutor
        open={modalInstrutorOpen}
        onClose={() => setModalInstrutorOpen(false)}
        onSuccess={() => window.location.reload()}
      />

      <h1 className="text-2xl font-bold mb-6 text-yellow-400">Usuários</h1>

      <p className="text-sm text-gray-400 mb-4">
        Visualização geral de alunos e instrutores cadastrados.
      </p>

      <Table columns={columns} data={rows} />
    </div>
  );
}
