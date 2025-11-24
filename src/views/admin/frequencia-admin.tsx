import { useEffect, useState } from "react";
import { FrequenciaService } from "../../services/FrequenciaService";
import { CalendarCheck, CalendarX, User } from "lucide-react";

export default function Frequencias() {
  const [presencas, setPresencas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function presencasUsuarios() {
    setLoading(true);
    try {
      const dados = await FrequenciaService.listarPresencas();
      setPresencas(dados);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar frequência.");
    }
    setLoading(false);
  }

  useEffect(() => {
    presencasUsuarios();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-300 mt-10">Carregando...</p>;
  }

  return (
    <div className="p-8 min-h-screen bg-gray-900">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">
        Frequência Geral dos Alunos
      </h1>

      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-yellow-400 border-b border-gray-700">
              <th className="p-3">Aluno</th>
              <th className="p-3">Data</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {presencas.map((item: any) => {
              const presente = item.presenca === 1;

              return (
                <tr
                  key={item.id_frequencia}
                  className="border-b border-gray-700 hover:bg-gray-700/50 transition"
                >
                  {/* Nome do aluno (ou ID caso não tenha join) */}
                  <td className="p-3 text-white flex items-center space-x-2">
                    <User size={16} className="text-gray-400" />
                    <span>
                      {item.nome_aluno ? item.nome_aluno : `Aluno #${item.fk_id_aluno}`}
                    </span>
                  </td>

                  {/* Data */}
                  <td className="p-3 text-gray-300">
                    {new Date(item.data).toLocaleDateString("pt-BR")}
                  </td>

                  {/* Status */}
                  <td className="p-3">
                    {presente ? (
                      <span className="flex items-center space-x-2 text-green-400 font-semibold">
                        <CalendarCheck size={18} />
                        <span>Presente</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-2 text-red-400 font-semibold">
                        <CalendarX size={18} />
                        <span>Ausente</span>
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
