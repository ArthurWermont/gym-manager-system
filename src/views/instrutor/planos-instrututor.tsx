import { useEffect, useState } from "react";
import { PlanoService } from "../../services/PlanoService";
import { Users, ClipboardList, PlusCircle, Dumbbell } from "lucide-react";
import { InstrutorService } from "../../services/InstrutorService";
import CriarPlano from "./modal-plano";

export default function PlanosInstrutor() {
  const storedUser = localStorage.getItem("academia_user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [planos, setPlanos] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  async function loadData() {
    const p = await PlanoService.listarPorInstrutor(user.id);
    const a = await InstrutorService.listarMeusAlunos(user.id);

    setPlanos(p);
    setAlunos(a);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-400 text-lg">Carregando planos...</p>
      </div>
    );

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      {/* Título e botão criar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-yellow-500 flex items-center space-x-3">
          <ClipboardList size={30} />
          <span>Planos de Treino</span>
        </h1>

        {planos.length > 0 && (
          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center space-x-2 bg-yellow-500 px-4 py-2 rounded-lg font-bold text-black hover:bg-yellow-400 shadow-md shadow-yellow-500/30"
          >
            <PlusCircle size={18} />
            <span>Novo Plano</span>
          </button>
        )}
      </div>

      <p className="text-gray-400 mb-6 border-b border-gray-700 pb-4">
        Gerencie todos os planos criados para seus alunos.
      </p>

      {/* Sem planos → tela especial */}
      {planos.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-10 shadow-lg text-center">
            <ClipboardList size={60} className="text-yellow-500 mx-auto mb-4" />

            <h2 className="text-2xl font-bold text-white mb-2">
              Nenhum plano criado ainda
            </h2>

            <p className="text-gray-400 mb-6 max-w-md">
              Comece criando seu primeiro plano de treino.
            </p>

            <button
              onClick={() => setOpenModal(true)}
              className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold flex items-center space-x-2 hover:bg-yellow-400 shadow-md"
            >
              <PlusCircle size={20} />
              <span>Criar meu primeiro plano</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {planos.map((p: any) => (
            <div
              key={p.id_plano}
              className="p-5 bg-gray-800 border border-gray-700 rounded-xl flex justify-between items-start"
            >
              {/* Info principal */}
              <div>
                <h2 className="text-xl font-bold text-white mb-1">
                  {p.descricao || "Plano sem descrição"}
                </h2>

                <p className="text-gray-400 text-sm flex items-center space-x-2">
                  <Users size={15} className="text-yellow-500" />
                  <span>
                    <b>Aluno(a):</b> {p.nome_aluno}
                  </span>
                </p>

                <p className="text-gray-400 text-sm flex items-center space-x-2">
                  <Dumbbell size={15} className="text-yellow-500" />
                  <span>
                    <b>Duração:</b> {p.duracao_semanas} semanas
                  </span>
                </p>
              </div>

              {/* Botões */}
              <div className="flex flex-col items-end space-y-2">
                <button
                  onClick={() =>
                    (window.location.href = `/instrutor/planos/${p.id_plano}/fichas`)
                  }
                  className="text-yellow-500 hover:text-yellow-300 font-semibold text-sm"
                >
                  Ver Fichas →
                </button>
              </div>
            </div>
          ))}

          {/* Botão gigante adicionar novo */}
          {/* <button
            onClick={() => setOpenModal(true)}
            className="flex items-center justify-center w-full space-x-2 
                       p-5 bg-gray-700 border border-dashed border-gray-600 rounded-xl 
                       text-yellow-500 font-semibold text-lg hover:bg-gray-600/50"
          >
            <PlusCircle size={20} />
            <span>Adicionar Novo Plano</span>
          </button> */}
        </div>
      )}

      {/* Modal */}
      <CriarPlano
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={loadData}
        alunos={alunos}
        idInstrutor={user.id}
      />
    </div>
  );
}
