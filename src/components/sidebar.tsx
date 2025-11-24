import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  // Recupera o usuário logado
  const storedUser = localStorage.getItem("academia_user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const role = user?.role || "aluno"; // fallback para aluno

  const menus = {
    aluno: [
      { to: "/aluno/dashboard", label: "Dashboard" },
      { to: "/aluno/treino", label: "Treinos" },
      { to: "/aluno/financeiro", label: "Financeiro" },
      { to: "/aluno/frequencia", label: "Frequência" },
      { to: "/perfil", label: "Perfil" },
    ],
    instrutor: [
      { to: "/instrutor/dashboard", label: "Dashboard" },
      { to: "/instrutor/alunos", label: "Meus alunos" },
      { to: "/instrutor/planos", label: "Planos de treino" },
      { to: "/perfil", label: "Perfil" },
    ],
    admin: [
      { to: "/admin/dashboard", label: "Dashboard" },
      { to: "/admin/usuarios", label: "Usuários" },
      { to: "/admin/pagamentos", label: "Pagamentos" },
      { to: "/admin/frequencias", label: "Frequências" },
      { to: "/perfil", label: "Perfil" },
    ],
  };

  const links = menus[role as keyof typeof menus];

  function logout() {
    localStorage.removeItem("academia_user");
    navigate("/login");
  }

  return (
    <aside className="hidden md:flex fixed top-0 left-0 h-screen w-64 flex-col border-r border-neutral-800 bg-neutral-900">


      {/* Cabeçalho */}
      <div className="px-5 py-5 border-b border-neutral-800">
        <h2 className="text-yellow-400 font-bold capitalize">{role}</h2>
        {user && (
          <p className="text-xs text-gray-400 mt-1">{user.email}</p>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 p-3 space-y-2">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                "block rounded-lg px-3 py-2 text-sm",
                isActive
                  ? "bg-yellow-400 text-black font-semibold"
                  : "text-gray-200 hover:bg-neutral-800",
              ].join(" ")
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Sair */}
      <div className="p-4 border-t border-neutral-800">
        <button
          onClick={logout}
          className="w-full text-sm text-gray-400 hover:text-yellow-400"
        >
          Sair
        </button>
      </div>

    </aside>
  );
}
