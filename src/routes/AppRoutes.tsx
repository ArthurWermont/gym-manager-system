import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../views/login";
import AppLayout from "../components/app-layout";

import DashboardAluno from "../views/aluno/dashboard-aluno";

import DashboardInstrutor from "../views/instrutor/dashboard-instrutor";

import DashboardAdmin from "../views/admin/dashboard-admin";
import UsuariosAdmin from "../views/admin/usuarios-admin";
import AlunosInstrutor from "../views/instrutor/alunos-instrutor";
import Perfil from "../views/perfil";
import PagamentosAdmin from "../views/admin/pagamento";
import Financeiro from "../views/aluno/financeiro-aluno";
import PlanosInstrutor from "../views/instrutor/planos-instrututor";
import FichasDoPlano from "../views/instrutor/fichas-instrutor-aluno";
import ExerciciosFicha from "../views/instrutor/exercicio-ficha-instrutor";
import TreinoAluno from "../views/aluno/treino-aluno";
import FrequenciaAluno from "../views/aluno/frequencia-aluno";
import Frequencias from "../views/admin/frequencia-admin";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        <Route element={<AppLayout/>}>
        {/* Rotas do aluno */}
        <Route path="/aluno/dashboard" element={<DashboardAluno />} />
        <Route path="/aluno/financeiro" element={<Financeiro />} />
        <Route path="/aluno/treino" element={<TreinoAluno />} />
        <Route path="/aluno/frequencia" element={<FrequenciaAluno />} />

        {/* Rotas do instrutor */}
        <Route path="/instrutor/dashboard" element={<DashboardInstrutor />} />
        <Route path="/instrutor/alunos" element={<AlunosInstrutor />} />
        <Route path="/instrutor/planos" element={<PlanosInstrutor />} />
       <Route path="/instrutor/planos/:idPlano/fichas" element={<FichasDoPlano />} />
       <Route path="/instrutor/fichas/:idFicha/exercicios" element={<ExerciciosFicha />} />

        {/* Rotas do admin */}
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        <Route path="/admin/pagamentos" element={<PagamentosAdmin />} />
        <Route path="/admin/usuarios" element={<UsuariosAdmin/>}></Route>
        <Route path="/admin/frequencias" element={<Frequencias />} />

        <Route path="/perfil" element={<Perfil />} />
        </Route>
        <Route path="*" element={<Navigate to="/login"/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
