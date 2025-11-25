import { useNavigate } from "react-router-dom";
import { useState } from "react";
// Assumindo que o caminho para os services está correto:
import { AdministradorService } from "../services/AdministradorService";
import { AlunoService } from "../services/AlunoService";
import { InstrutorService } from "../services/InstrutorService";

export default function Login() {
  const navigate = useNavigate();

  // Usamos 'identifier' para o campo dinâmico (Matrícula ou Email)
  const [identifier, setIdentifier] = useState("");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState<"aluno" | "instrutor" | "admin">("aluno");

  const [showPwd, setShowPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      let response;
      let userData;
      let dashboardRoute;

      // 1. Chama o serviço correto com as credenciais apropriadas
      if (role === "admin") {
        // Para Admin, envia { email: identifier, senha }.
        // Note: Se o AdminService.login esperar a chave 'email', isso está correto.
        response = await AdministradorService.login({
          email: identifier,
          senha,
        });
        userData = response.admin;
        dashboardRoute = "/admin/dashboard";
      } else if (role === "instrutor") {
        // Para Instrutor, envia { matricula: identifier, senha }
        response = await InstrutorService.login({
          matricula: identifier,
          senha,
        });
        userData = response.instrutor;
        dashboardRoute = "/instrutor/dashboard";
      } else {
        // Aluno, envia { matricula: identifier, senha }
        response = await AlunoService.login({ matricula: identifier, senha });
        userData = response.aluno;
        dashboardRoute = "/aluno/dashboard";
      }

      // 2. Salva na sessão
      // IMPORTANTE: Se estivesse usando Firestore/Firebase Auth, salvaríamos o token.
      const userToSave = { ...userData, role: role };
      localStorage.setItem("academia_user", JSON.stringify(userToSave));

      // 3. Redireciona
      navigate(dashboardRoute);
    } catch (error: any) {
      console.error("Erro login:", error);
      // Ajusta a mensagem de erro para ser mais específica ou genérica
      const defaultMsg =
        role === "admin"
          ? "Falha ao entrar. Verifique o e-mail e senha."
          : "Falha ao entrar. Verifique a matrícula e senha.";
      const msg = error.response?.data?.message || defaultMsg;
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }

  // Define o rótulo do campo de identificação
  const identifierLabel = role === "admin" ? "E-mail" : "Matrícula";
  const identifierPlaceholder =
    role === "admin" ? "admin@academia.com" : "Digite sua matrícula";
  const identifierType = role === "admin" ? "email" : "text";

  return (
    <div style={{ overflow: "hidden" }}>
      <div className="relative min-h-screen w-full bg-neutral-950 text-gray-100">
        {/* Fundo Amarelo/Preto */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-yellow-400/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-yellow-500/20 blur-3xl" />
        </div>

        <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 md:grid-cols-2">
          {/* Lado Esquerdo (Branding) */}
          <aside className="hidden md:flex flex-col justify-between p-10">
            <div>
              <div className="inline-flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400 text-black font-extrabold">
                  A
                </div>
                <span className="text-xl tracking-wide font-semibold">
                  Academia <span className="text-yellow-400">Pro</span>
                </span>
              </div>
              <h1 className="mt-14 text-4xl font-extrabold leading-tight">
                Treine com <span className="text-yellow-400">constância</span>
                <br /> evolua com{" "}
                <span className="text-yellow-400">controle</span>
              </h1>
              <p className="mt-4 max-w-md text-gray-300">
                Plataforma integrada para gestão de treinos, avaliações e
                pagamentos.
              </p>
            </div>
            <div className="text-sm text-gray-400">© 2025 Academia Pro</div>
          </aside>

          {/* Lado Direito (Formulário) */}
          <main className="flex items-center justify-center p-6 md:p-10">
            <form
              onSubmit={handleLogin}
              className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold">Acessar conta</h2>
                <p className="mt-1 text-sm text-gray-400">
                  Selecione seu perfil e digite seus dados.
                </p>
              </div>

              {/* Mensagem de Erro Dinâmica */}
              {errorMessage && (
                <div className="mb-4 rounded border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400 text-center">
                  {errorMessage}
                </div>
              )}

              {/* Selector de Role */}
              <div className="mb-6">
                <label className="mb-2 block text-sm text-gray-300">
                  Eu sou:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["aluno", "instrutor", "admin"] as const).map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => {
                        setRole(opt);
                        setIdentifier(""); // Limpa o input ao trocar de perfil
                      }}
                      className={`rounded-xl border px-3 py-2 text-sm capitalize transition-all ${
                        role === opt
                          ? "border-yellow-400 bg-yellow-400 text-black font-bold shadow-[0_0_15px_rgba(250,204,21,0.3)]"
                          : "border-neutral-700 bg-neutral-800 text-gray-400 hover:border-neutral-500"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Dinâmico (Matrícula ou E-mail) */}
              <label className="mb-2 block text-sm text-gray-300">
                {identifierLabel}
              </label>
              <div className="relative mb-4">
                <input
                  type={identifierType}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-3 text-sm placeholder-gray-500 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                  placeholder={identifierPlaceholder}
                  required
                />
              </div>

              {/* Input Senha */}
              <label className="mb-2 block text-sm text-gray-300">Senha</label>
              <div className="relative mb-6">
                <input
                  type={showPwd ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-3 text-sm placeholder-gray-500 outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400"
                >
                  {showPwd ? "Ocultar" : "Mostrar"}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full rounded-xl py-3 text-sm font-bold text-black transition-all ${
                  isLoading
                    ? "bg-neutral-600 cursor-not-allowed"
                    : "bg-yellow-400 hover:bg-yellow-300 hover:shadow-[0_0_20px_rgba(250,204,21,0.4)]"
                }`}
              >
                {isLoading ? "Carregando..." : "Entrar na Plataforma"}
              </button>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}
