import { useEffect, useState } from "react";
import { Users, ClipboardList, Dumbbell } from "lucide-react"; 
import { DashboardService } from "../../services/DashboardService";

export default function DashboardInstrutor() {
    const storedUser = localStorage.getItem("academia_user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const idInstrutor = user.id; // Pegando o ID do usuário logado

    const [data, setData] = useState<any>({});
    const [loading, setLoading] = useState(true);

    async function loadData() {
        if (!idInstrutor) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const r = await DashboardService.resumoInstrutor(idInstrutor)
            console.log(r)
            setData(r);
        } catch (error) {
            console.error("Erro ao carregar dashboard do instrutor:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [idInstrutor]);


    if (loading)
        return (
            <div className="flex justify-center items-center h-60 bg-gray-900 p-8">
                <p className="text-gray-400 text-lg">
                    Carregando resumo de atividades...
                </p>
            </div>
        );

    // Se não houver ID ou dados, você pode exibir uma mensagem de erro ou redirecionar
    if (!idInstrutor || !data) {
         return (
             <div className="p-8 min-h-screen bg-gray-900 text-white">
                 <p className="text-red-500">Erro: ID do instrutor não encontrado.</p>
             </div>
         );
    }
    
    return (
        <div className="p-8 min-h-screen bg-gray-900">
            <h1 className="text-3xl text-yellow-500 font-extrabold mb-8">
                 Minhas Estatísticas de Trabalho
            </h1>

            {/* Grid com 3 colunas para as métricas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* 1. Total de Alunos */}
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex justify-between items-start shadow-lg hover:border-yellow-500/50 transition duration-200">
                    <div>
                        <p className="text-gray-400 text-sm mb-1">Total de</p>
                        <h2 className="text-4xl font-bold text-white mb-1">
                            {data.total_alunos}
                        </h2>
                        <p className="text-yellow-500 font-semibold">Alunos com Planos</p>
                    </div>
                    <Users size={40} className="text-yellow-500/80 mt-1" />
                </div>

                {/* 2. Planos de Treino Ativos */}
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex justify-between items-start shadow-lg hover:border-yellow-500/50 transition duration-200">
                    <div>
                        <p className="text-gray-400 text-sm mb-1">Quantidade de</p>
                        <h2 className="text-4xl font-bold text-white mb-1">
                            {data.planos_ativos}
                        </h2>
                        <p className="text-yellow-500 font-semibold">Planos de Treino Ativos</p>
                    </div>
                    <ClipboardList size={40} className="text-yellow-500/80 mt-1" />
                </div>

                {/* 3. Fichas de Treino Ativas */}
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex justify-between items-start shadow-lg hover:border-yellow-500/50 transition duration-200">
                    <div>
                        <p className="text-gray-400 text-sm mb-1">Total de</p>
                        <h2 className="text-4xl font-bold text-white mb-1">
                            {data.fichas_ativas}
                        </h2>
                        <p className="text-yellow-500 font-semibold">Fichas/Rotinas Ativas</p>
                    </div>
                    <Dumbbell size={40} className="text-yellow-500/80 mt-1" />
                </div>
            </div>

            {/* Seção Adicional: Lista de Tarefas ou Próximos Passos */}
            <div className="mt-8">
                <h2 className="text-xl text-white font-semibold mb-4">
                    Próximos Passos
                </h2>
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 min-h-40">
                    <ul className="text-gray-400 space-y-3">
                        <li className="flex items-center space-x-2">
                           {/* Exemplo de dica para o instrutor */}
                           <span className="text-yellow-500 text-lg">•</span>
                           <span>Revisar planos que expiram este mês.</span>
                        </li>
                        <li className="flex items-center space-x-2">
                           <span className="text-yellow-500 text-lg">•</span>
                           <span>Verificar a frequência de treino dos alunos.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}