import { useEffect, useState } from "react";
import { FrequenciaService } from "../../services/FrequenciaService";
import { CalendarCheck, CalendarX2 } from "lucide-react";

export default function FrequenciaAluno() {
  const [presencas, setPresencas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const storedUser = localStorage.getItem("academia_user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const idAluno = user.id;

  async function presencasAluno() {
    setLoading(true);
    try {
      const presencas = await FrequenciaService.listarPorAluno(idAluno);
      setPresencas(presencas);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar frequência.");
    }
    setLoading(false);
  }

  useEffect(() => {
    presencasAluno();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-300 mt-10">Carregando...</p>;
  }

  return (
    <div className="p-6 min-h-screen bg-gray-900">
      <h1 className="text-3xl font-bold text-yellow-500 mb-6">
        Minhas Presenças
      </h1>

      {presencas.length === 0 ? (
        <p className="text-gray-400 text-center mt-20">
          Nenhuma presença registrada ainda.
        </p>
      ) : (
        <div className="space-y-3">
          {presencas.map((f: any) => {
            const presente = f.presenca === 1;
            return (
              <div
                key={f.id_frequencia}
                className="flex items-center justify-between bg-gray-800 p-4 rounded-lg border border-gray-700"
              >
                <div>
                  <p className="text-white font-semibold">
                    {new Date(f.data).toLocaleDateString("pt-BR")}
                  </p>

                  <p className="text-gray-400 text-sm">
                    {presente ? "Treino realizado" : "Ausência"}
                  </p>
                </div>

                <div>
                  {presente ? (
                    <CalendarCheck size={32} className="text-green-500" />
                  ) : (
                    <CalendarX2 size={32} className="text-red-400" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
