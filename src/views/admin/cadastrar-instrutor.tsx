import { useState } from "react";
import {
  InstrutorService,
  type InstrutorData,
} from "../../services/InstrutorService";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CadastroModalInstrutor({
  open,
  onClose,
  onSuccess,
}: Props) {
  const [newInstru, setNewInstru] = useState<InstrutorData>({
    nome: "",
    matricula: "",
    email: "",
    senha: "",
    data_nascimento: "",
    ativo: true,
  });

  const [errors, setErrors] = useState<string[]>([]);

  if (!open) return null;

  // ---------- Validações ----------
  const validarNome = (nome: string) => /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(nome);

  function validarMatricula(m: string) {
    return /^\d{5}$/.test(m);
  }

  const validarEmail = (email: string) =>
    /^[A-Za-z0-9._%+-]+@[A-Za-z.-]+\.[A-Za-z]{2,}$/.test(email);

  const validarSenha = (s: string) => /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(s);

  const validarDataNascimento = (dt: string) => {
    const hoje = new Date();
    const data = new Date(dt);

    if (data > hoje) return false;

    const limite = new Date();
    limite.setFullYear(hoje.getFullYear() - 130);

    return data >= limite;
  };

  // ---------- Tratamento + Cadastro ----------
  async function cadastrarInstrutor() {
    const e: string[] = [];

    const matriculaExiste = await InstrutorService.verificarMatricula(
      newInstru.matricula
    );

    if (matriculaExiste)
      e.push("Esta matrícula já está cadastrada no sistema.");
    if (!validarNome(newInstru.nome)) e.push("Nome inválido (somente letras).");

    if (!validarMatricula(newInstru.matricula))
      e.push("Matrícula deve ter exatamente 5 números.");

    if (!validarEmail(newInstru.email)) e.push("E-mail inválido.");

    if (!validarSenha(newInstru.senha))
      e.push("Senha deve ter 6+ caracteres, contendo letras e números.");

    if (!validarDataNascimento(newInstru.data_nascimento))
      e.push("Data de nascimento inválida.");

    if (e.length > 0) {
      setErrors(e);
      return;
    }

    try {
      await InstrutorService.cadastrar(newInstru);
      alert("Instrutor cadastrado com sucesso!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar instrutor.");
    }
  }

  // ---------- Estilos ----------
  const inputStyle =
    "w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:border-yellow-500 placeholder-gray-500";

  const sectionTitleStyle =
    "text-yellow-500 font-bold mt-4 mb-3 border-b border-gray-700 pb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-8 w-full max-w-xl">
        <h2 className="text-2xl font-extrabold text-yellow-500 mb-6">
          Cadastrar Instrutor
        </h2>

        {/* Erros */}
        {errors.length > 0 && (
          <div className="bg-red-900/40 text-red-300 border border-red-700 p-3 rounded mb-4">
            {errors.map((err, i) => (
              <p key={i}>• {err}</p>
            ))}
          </div>
        )}

        {/* Dados pessoais */}
        <p className={sectionTitleStyle}>Dados Pessoais</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nome (bloqueia números e símbolos) */}
          <input
            type="text"
            placeholder="Nome *"
            className={inputStyle}
            value={newInstru.nome}
            onChange={(e) => {
              const v = e.target.value;
              if (/^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/.test(v))
                setNewInstru({ ...newInstru, nome: v });
            }}
          />

          <input
            type="text"
            placeholder="Matrícula *"
            className={inputStyle}
            maxLength={5}
            value={newInstru.matricula}
            onChange={(e) => {
              const v = e.target.value;

              // Permite somente números e até 5 caracteres
              if (/^\d{0,5}$/.test(v)) {
                setNewInstru({ ...newInstru, matricula: v });
              }
            }}
          />

          <input
            type="date"
            className={`${inputStyle} text-gray-400`}
            onChange={(e) =>
              setNewInstru({ ...newInstru, data_nascimento: e.target.value })
            }
          />
        </div>

        {/* Credenciais */}
        <p className={sectionTitleStyle}>Credenciais</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="email"
            placeholder="Email *"
            className={inputStyle}
            onChange={(e) =>
              setNewInstru({ ...newInstru, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Senha *"
            className={inputStyle}
            onChange={(e) =>
              setNewInstru({ ...newInstru, senha: e.target.value })
            }
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
          >
            Cancelar
          </button>

          <button
            onClick={cadastrarInstrutor}
            className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-bold hover:bg-yellow-400 shadow-lg shadow-yellow-500/30"
          >
            Salvar Instrutor
          </button>
        </div>
      </div>
    </div>
  );
}
