import { useEffect, useState } from "react";
import Badge from "../components/ui/bagde";
import { AlunoService } from "../services/AlunoService";
import { InstrutorService } from "../services/InstrutorService";
import { AdministradorService } from "../services/AdministradorService";
import { PagamentoService } from "../services/PagamentoService";

export default function Perfil() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const storedUser = localStorage.getItem("academia_user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [form, setForm] = useState({
    nome: "",
    email: "",
    matricula: "",
  });

  const [userInfo, setUserInfo] = useState<any>({
    tipo: "",
    ativo: false,
    data_ingresso: "",
    validade: "",
    pagamento_status: "",
    tipo_plano: "",
  });

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;

      try {
        let response;
        let pagamento;

        if (user.role === "aluno") {
          response = await AlunoService.buscarPorId(user.id);

          // Pagamentos
          pagamento = await PagamentoService.listarPorAluno(user.id);
          const ultimoPag = pagamento[0];

          setUserInfo({
            tipo: "Aluno",
            ativo: response.ativo === 1,
            data_ingresso: response.data_ingresso,
            validade: ultimoPag?.data_validade ?? "Sem plano",
            pagamento_status: ultimoPag?.status ?? "pendente",
            tipo_plano: ultimoPag?.tipo_plano ?? "Sem plano",
          });
        } else if (user.role === "instrutor") {
          response = await InstrutorService.buscarPorId(user.id);

          setUserInfo({
            tipo: "Instrutor",
            ativo: true,
            data_ingresso: response.data_ingresso,
            validade: "N/A",
            pagamento_status: "N/A",
            tipo_plano: "N/A",
          });
        } else if (user.role === "admin") {
          response = await AdministradorService.buscarPorId(user.id);

          setUserInfo({
            tipo: "Administrador",
            ativo: true,
            data_ingresso: response.data_ingresso,
            validade: "N/A",
            pagamento_status: "N/A",
            tipo_plano: "N/A",
          });
        }

        // Formulário com dados reais
        setForm({
          nome: response.nome,
          email: response.email,
          matricula: response.matricula,
        });
      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    // 🔒 RESTRIÇÃO PARA O CAMPO NOME
    if (name === "nome") {
      // Apenas letras, acentos e espaços
      if (!/^[A-Za-zÀ-ÿ\s]*$/.test(value)) return;
    }
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSave() {
    if (!user) return;

    setSaving(true);

    const campos = {
      nome: form.nome,
      email: form.email,
    };

    try {
      if (user.role === "aluno") {
        await AlunoService.editar(user.id, campos);
      } else if (user.role === "instrutor") {
        await InstrutorService.editar(user.id, campos);
      } else if (user.role === "admin") {
        await AdministradorService.editar(user.id, campos);
      }

      // Atualiza localStorage
      localStorage.setItem(
        "academia_user",
        JSON.stringify({
          ...user,
          nome: form.nome,
          email: form.email,
        })
      );

      setIsEditing(false);
    } catch (err) {
      console.error("Erro ao salvar alterações:", err);
      alert("Erro ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center text-gray-400 mt-10">
        Carregando perfil...
      </div>
    );
  }

  function safeDate(date: any) {
    const d = new Date(date);
    return isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
  }

  return (
    <div className="max-w-2xl mx-auto text-gray-200">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4 border-b border-neutral-800 pb-6 mb-6">
        <div className="h-20 w-20 flex items-center justify-center rounded-full bg-yellow-400 text-black text-3xl font-bold">
          {form.nome.charAt(0).toUpperCase()}
        </div>

        <div>
          <h1 className="text-2xl font-bold">{form.nome}</h1>
          <p className="text-gray-400 capitalize">{userInfo.tipo}</p>
        </div>

        <div className="ml-auto">
          <Badge
            label={userInfo.ativo ? "Ativo" : "Inativo"}
            color={userInfo.ativo ? "green" : "red"}
          />
        </div>
      </div>

      {/* Formulário */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Nome</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm outline-none ${
              isEditing ? "focus:border-yellow-400" : "opacity-70"
            }`}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">E-mail</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm outline-none ${
              isEditing ? "focus:border-yellow-400" : "opacity-70"
            }`}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Matrícula</label>
          <input
            type="text"
            name="matricula"
            value={form.matricula}
            disabled
            className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm opacity-70"
          />
        </div>
      </div>

      {/* Informações Fixas */}
      <div className="mt-8 border-t border-neutral-800 pt-6 text-sm space-y-2">
        <p>
          <span className="text-gray-400">Tipo de usuário:</span>{" "}
          {userInfo.tipo}
        </p>

        <p>
          <span className="text-gray-400">Plano atual:</span>{" "}
          {userInfo.tipo_plano}
        </p>

        <p>
          <span className="text-gray-400">Data de ingresso:</span>{" "}
          {safeDate(userInfo.data_ingresso)}
        </p>

        <p>
          <span className="text-gray-400">Data de validade:</span>{" "}
          {safeDate(userInfo.validade)}
        </p>
      </div>

      {/* Botões */}
      <div className="mt-8 flex justify-end">
        {isEditing ? (
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-yellow-400 text-black px-4 py-2 font-semibold hover:bg-yellow-300 disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-lg border border-yellow-400 text-yellow-400 px-4 py-2 font-semibold hover:bg-yellow-400 hover:text-black"
          >
            Editar perfil
          </button>
        )}
      </div>
    </div>
  );
}
