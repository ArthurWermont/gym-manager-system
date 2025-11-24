import Badge from "../../components/ui/bagde";
import { useEffect, useState } from "react";
import { InstrutorService } from "../../services/InstrutorService";
import { Users, Mail, Dumbbell } from "lucide-react"; // Importação de ícones para o visual

export default function AlunosInstrutor() {
  const storedUser = localStorage.getItem("academia_user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function alunosData() {
      if (!user || user.role !== "instrutor") return;

      const data = await InstrutorService.listarMeusAlunos(user.id);
      console.log(data);
      setAlunos(data);
      setLoading(false);
    }
    alunosData();
  }, [user]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-400 text-lg">Carregando alunos...</p>
      </div>
    );

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-extrabold text-yellow-500 mb-2 flex items-center space-x-3">
        <Users size={28} />
        <span>Meus Alunos</span>
      </h1>

      <p className="text-gray-400 mb-6 border-b border-gray-700 pb-4">
        Lista completa de alunos sob sua responsabilidade como instrutor.
      </p>

      {alunos.length === 0 ? (
        <div className="text-center p-10 border border-dashed border-gray-700 rounded-lg">
          <p className="text-gray-400 text-lg">
            Você não tem alunos associados no momento.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {alunos.map((a: any) => (
            <div
              key={a.id_aluno}
              // Estilo do Card: Fundo escuro, borda suave, sombra e efeito hover
              className="p-5 bg-gray-800 border border-gray-700 rounded-xl flex justify-between items-start 
                         hover:bg-gray-700/50 hover:border-yellow-500/50 transition duration-300 shadow-md"
            >
              {/* Informações Principais */}
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-white truncate mb-1">
                  {a.nome}
                </h2>

                {/* Detalhes Secundários */}
                <div className="flex items-center text-gray-400 text-sm space-x-4 mt-1">
                  <span className="flex items-center space-x-1">
                    <Dumbbell size={14} className="text-yellow-500" />
                    <span className="font-medium">Matrícula:</span>
                    <span>{a.matricula}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Mail size={14} className="text-yellow-500" />
                    <span>{a.email}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Users size={14} className="text-yellow-500" />
                    <span className="font-medium">Altura:</span>
                    <span>{a.altura} cm</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Users size={14} className="text-yellow-500" />
                    <span className="font-medium">Peso:</span>
                    <span>{a.peso} kg</span>
                  </span>
                  {a.observacoes && (
                    <span className="flex items-center space-x-1">
                      <span className="font-medium">Observações:</span>
                      <span>{a.observacoes}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Status e Ações */}
              <div className="flex flex-col items-end space-y-2 ml-4">
                <Badge
                  label={a.ativo ? "ATIVO" : "INATIVO"}
                  // Ajusta cores para serem mais consistentes com o tema escuro
                  color={a.ativo ? "green" : "red"}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
