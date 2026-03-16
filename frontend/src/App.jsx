import Login from "./pages/Login";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import { UserData } from "./context/User";
import Loading from "./components/Loading";
import Admin from "./pages/Admin";
import PlayList from "./pages/PlayList";
import Album from "./pages/Album";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Layout from "./components/Layout";

const App = () => {
  const { loading, user, isAuth } = UserData();

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route
              element={isAuth ? <Layout /> : <Navigate to="/login" replace />}
            >
              <Route path="/" element={<Home />} />
              <Route path="/album/:id" element={<Album />} />
              <Route path="/playlist" element={<PlayList user={user} />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/search" element={<Search />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route
              path="/login"
              element={isAuth ? <Navigate to="/" replace /> : <Login />}
            />
            <Route
              path="/register"
              element={isAuth ? <Navigate to="/" replace /> : <Register />}
            />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
