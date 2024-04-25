import { Navigate, Route, Routes } from 'react-router-dom';
import { AppRoute } from './constants';
import IntroPage from './pages/intro-page/intro-page';
import LoginPage from './pages/login-page/login-page';
import RegisterPage from './pages/register-page/register-page';
import MainPage from './pages/main-page/main-page';
import TrainerRoomPage from './pages/trainer-room-page/trainer-room-page';
import ClientRoomPage from './pages/client-room-page/client-room-page';
import ErrorPage from './pages/error-page/error-page';
import { useAppSelector } from './redux/store';
import {
  getIsAuth,
  getIsTrainer,
  getIsUserLoading,
} from './redux/userSlice/selectors';
import LoadingPage from './pages/loading-page/loading-page';
import PrivateRoute from './components/private-route/private-route';
import { RoleRoutePage } from './pages/role-route/role-route';
import FormRegisterTrainer from './components/form-register-trainer/form-register-trainer';
import FormRegisterClient from './components/form-register-client/form-register-client';
import CreateTrainingPage from './pages/create-training-page/create-training-page';

export function App() {
  const isLoading = useAppSelector(getIsUserLoading);
  const isAuth = useAppSelector(getIsAuth);
  const isTrainer = useAppSelector(getIsTrainer);

  if (isLoading) {
    //  return <LoadingPage />;
  }

  return (
    <Routes>
      <Route
        path={AppRoute.Root}
        element={
          <PrivateRoute isAuth={isAuth}>
            <RoleRoutePage isTrainer={isTrainer} />
          </PrivateRoute>
        }
      />
      <Route
        path={AppRoute.Intro}
        element={isAuth ? <Navigate to={AppRoute.Root} /> : <IntroPage />}
      />
      <Route
        path={AppRoute.Register}
        element={isAuth ? <Navigate to={AppRoute.Root} /> : <RegisterPage />}
      />
      <Route
        path={AppRoute.RegisterTrainer}
        element={
          isAuth ? <Navigate to={AppRoute.Root} /> : <FormRegisterTrainer />
        }
      />
      <Route
        path={AppRoute.RegisterClient}
        element={
          isAuth ? <Navigate to={AppRoute.Root} /> : <FormRegisterClient />
        }
      />
      <Route
        path={AppRoute.Login}
        element={isAuth ? <Navigate to={AppRoute.Root} /> : <LoginPage />}
      />
      <Route
        path={AppRoute.Main}
        element={
          <PrivateRoute isAuth={isAuth}>
            {!isTrainer ? <MainPage /> : <Navigate to={AppRoute.Root} />}
          </PrivateRoute>
        }
      />
      <Route
        path={AppRoute.TrainerRoom}
        element={
          <PrivateRoute isAuth={isAuth}>
            {isTrainer ? <TrainerRoomPage /> : <Navigate to={AppRoute.Root} />}
          </PrivateRoute>
        }
      />
      <Route
        path={AppRoute.ClientRoom}
        element={
          <PrivateRoute isAuth={isAuth}>
            {!isTrainer ? <ClientRoomPage /> : <Navigate to={AppRoute.Root} />}
          </PrivateRoute>
        }
      />
      <Route
        path={AppRoute.CreateTraining}
        element={
          <PrivateRoute isAuth={isAuth}>
            {isTrainer ? (
              <CreateTrainingPage />
            ) : (
              <Navigate to={AppRoute.Root} />
            )}
          </PrivateRoute>
        }
      />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
