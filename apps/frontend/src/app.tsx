import { Route, Routes } from 'react-router-dom';
import { AppRoute } from './const';
import IntroPage from './pages/intro-page/intro-page';
import LoginPage from './pages/login-page/login-page';
import RegisterPage from './pages/register-page/register-page';
import PrivateRoute from './components/private-route/private-route';
import MainPage from './pages/main-page/main-page';
import { useAppSelector } from './redux/store';
import { getIsAuth } from './redux/authSlice/selectors';
import TrainerRoomPage from './pages/trainer-room-page/trainer-room-page';

export function App() {
  const isAuth = useAppSelector(getIsAuth);

  return (
    <Routes>
      <Route path={AppRoute.Intro} element={<IntroPage />} />
      <Route path={AppRoute.Login} element={<LoginPage />} />
      <Route path={AppRoute.Register} element={<RegisterPage />} />

      <Route
        path={AppRoute.TrainerRoom}
        element={
          <PrivateRoute isAuth={isAuth}>
            <TrainerRoomPage />
          </PrivateRoute>
        }
      />

      <Route
        path={AppRoute.Main}
        element={
          <PrivateRoute isAuth={isAuth}>
            <MainPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
