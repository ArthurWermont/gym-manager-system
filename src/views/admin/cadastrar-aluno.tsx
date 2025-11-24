import { useState } from "react";
import {
  AlunoService,
  type CreateAlunoData,
} from "../../services/AlunoService";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CadastroModalAluno({
  open,
  onClose,
  onSuccess,
}: Props) {
  const [newUser, setNewUser] = useState<CreateAlunoData>({
    nome: "",
    matricula: "",
    email: "",
    senha: "",
    data_nascimento: "",
    peso: 0,
    altura: 0,
    observacoes: "",
    ativo: true,
    tipo_plano: "mensal",
    valor_plano: 0,
    metodo_pagamento: "pix",
    matricula_instrutor: "",
  });

  const [errors, setErrors] = useState<string[]>([]);

  if (!open) return null;

  // ---------------------------
  //  VALIDADORES INDIVIDUAIS
  // ---------------------------

  function validarNome(nome: string) {
    return /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(nome);
  }

  function validarMatricula(m: string) {
    return /^\d{7}$/.test(m);
  }

  function validarEmail(email: string) {
    return /^[A-Za-z0-9._%+-]+@[A-Za-z.-]+\.[A-Za-z]{2,}$/.test(email);
  }

  function validarSenha(s: string) {
    return /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(s);
  }

  function validarMatriculaInstrutor(m: string) {
    return /^\d{5}$/.test(m);
  }

  function validarDataNascimento(dt: string) {
    const hoje = new Date();
    const data = new Date(dt);

    if (data > hoje) return false;

    const limite = new Date();
    limite.setFullYear(hoje.getFullYear() - 130);

    return data >= limite;
  }

  function validarPeso(peso: number) {
    return peso >= 20 && peso <= 350;
  }

  function validarAltura(altura: number) {
    return altura >= 100 && altura <= 250;
  }

  function validarObservacoes(obs: string) {
    return obs.length <= 300;
  }

  function validarValorPlano(v: number) {
    return v > 0 && v <= 10000;
  }

  // --------------------------------
  //  FUNÇÃO PRINCIPAL DE CADASTRO
  // --------------------------------
  async function cadastrarAluno() {
    const e: string[] = [];

    const matriculaExiste = await AlunoService.verificarMatricula(
      newUser.matricula
    );

    if (matriculaExiste)
      e.push("Esta matrícula já está cadastrada no sistema.");
    if (!validarNome(newUser.nome)) e.push("Nome inválido (somente letras).");
    if (!validarMatricula(newUser.matricula))
      e.push("Matrícula deve ter 7 números.");
    if (!validarEmail(newUser.email)) e.push("Email inválido.");
    if (!validarSenha(newUser.senha))
      e.push("Senha deve ter 6+ caracteres, com letras e números.");
    if (!validarDataNascimento(newUser.data_nascimento))
      e.push("Data de nascimento inválida.");
    if (!validarPeso(newUser.peso))
      e.push("Peso deve estar entre 20 kg e 350 kg.");
    if (!validarAltura(newUser.altura))
      e.push("Altura deve estar entre 100 cm e 250 cm.");
    if (!validarObservacoes(newUser.observacoes))
      e.push("Observações devem ter no máximo 300 caracteres.");
    if (!validarValorPlano(newUser.valor_plano))
      e.push("Valor do plano inválido (precisa ser > 0).");
    if (!validarMatriculaInstrutor(newUser.matricula_instrutor))
      e.push("Matrícula deve ter 5 números.");

    setErrors(e);

    if (e.length > 0) return;

    try {
      await AlunoService.cadastrar(newUser);
      alert("Aluno cadastrado com sucesso!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro inesperado ao cadastrar aluno.");
    }
  }

  // estilos
  const inputStyle =
    "w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:border-yellow-500 transition duration-150 placeholder-gray-500";
  const sectionTitleStyle =
    "text-yellow-500 font-bold mt-4 mb-3 border-b border-gray-700 pb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-extrabold text-yellow-500 mb-6">
          Cadastro de Novo Aluno
        </h2>

        {/* Mensagens de erro */}
        {errors.length > 0 && (
          <div className="mb-4 bg-red-600/20 border border-red-500 text-red-300 p-3 rounded-md text-sm">
            <p className="font-bold mb-1">Corrija os seguintes erros:</p>
            <ul className="list-disc ml-5">
              {errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        {/* --- Dados Pessoais --- */}
        <p className={sectionTitleStyle}>Dados Pessoais</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nome *"
            className={inputStyle}
            value={newUser.nome}
            onChange={(e) => {
              const value = e.target.value;

              // REGRA: Apenas letras e espaços (inclui acentos)
              if (/^[A-Za-zÀ-ÿ\s]*$/.test(value)) {
                setNewUser({ ...newUser, nome: value });
              }
            }}
          />

          <input
            type="email"
            placeholder="Email *"
            className={inputStyle}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />

          <input
            type="date"
            className={`${inputStyle} text-gray-400`}
            onChange={(e) =>
              setNewUser({ ...newUser, data_nascimento: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Peso (kg)"
            className={inputStyle}
            onChange={(e) =>
              setNewUser({ ...newUser, peso: Number(e.target.value) })
            }
          />

          <input
            type="number"
            placeholder="Altura (cm)"
            className={inputStyle}
            onChange={(e) =>
              setNewUser({ ...newUser, altura: Number(e.target.value) })
            }
          />
          <input
            type="text"
            placeholder="Matrícula do Instrutor"
            className={inputStyle}
            value={newUser.matricula_instrutor}
            onChange={(e) => {
              const v = e.target.value;
              if (/^\d{0,5}$/.test(v)) {
                setNewUser({ ...newUser, matricula_instrutor: v });
              }
            }}
          />

          <select
            className={inputStyle}
            onChange={(e) =>
              setNewUser({ ...newUser, ativo: e.target.value === "true" })
            }
          >
            <option value="true">Status: Ativo</option>
            <option value="false">Status: Inativo</option>
          </select>
        </div>

        <textarea
          placeholder="Observações (até 300 caracteres)"
          className={`${inputStyle} mt-4 h-24`}
          onChange={(e) =>
            setNewUser({ ...newUser, observacoes: e.target.value })
          }
        />

        {/* Credenciais */}
        <p className={sectionTitleStyle}>Credenciais de Acesso</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Matrícula *"
            className={inputStyle}
            maxLength={7}
            value={newUser.matricula}
            onChange={(e) => {
              const value = e.target.value;

              // Permite somente números e máximo 7 caracteres
              if (/^\d{0,7}$/.test(value)) {
                setNewUser({ ...newUser, matricula: value });
              }
            }}
          />

          <input
            type="password"
            placeholder="Senha *"
            className={inputStyle}
            onChange={(e) => setNewUser({ ...newUser, senha: e.target.value })}
          />
        </div>

        {/* Plano */}
        <p className={sectionTitleStyle}>Plano e Pagamento</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <select
            className={inputStyle}
            onChange={(e) =>
              setNewUser({ ...newUser, tipo_plano: e.target.value as any })
            }
          >
            <option value="mensal">Mensal</option>
            <option value="trimestral">Trimestral</option>
            <option value="semestral">Semestral</option>
            <option value="anual">Anual</option>
          </select>

          <input
            type="number"
            placeholder="Valor do plano (R$)"
            className={inputStyle}
            onChange={(e) =>
              setNewUser({ ...newUser, valor_plano: Number(e.target.value) })
            }
          />

          <select
            className={inputStyle}
            onChange={(e) =>
              setNewUser({
                ...newUser,
                metodo_pagamento: e.target.value as any,
              })
            }
          >
            <option value="pix">PIX</option>
            <option value="cartao">Cartão</option>
            <option value="dinheiro">Dinheiro</option>
            <option value="boleto">Boleto</option>
          </select>
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg text-gray-400 font-semibold hover:bg-gray-800 hover:text-white transition"
          >
            Cancelar
          </button>

          <button
            onClick={cadastrarAluno}
            className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-bold hover:bg-yellow-400 shadow-md shadow-yellow-500/30"
          >
            Salvar Aluno
          </button>
        </div>
      </div>
    </div>
  );
}
