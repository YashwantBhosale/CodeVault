import logo from './logo.svg';
import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Snippet } from './pages/Snippet';
import { Profile } from './pages/Profile';
import { Explore } from './pages/Explore';
import { ViewPost } from './pages/ViewPost';
import { useAuthContext } from './hooks/useAuthContext';

function App() {
  const {user} = useAuthContext();
  return (
    <>
      <ToastContainer />
      <Header userObj={user}/>

      <Routes>
        <Route path='/' element={!user ? <Login /> : <Navigate to="/home" />} />
        <Route path="/login" element={ !user ? <Login /> : <Navigate to="/home" />} />
        <Route path="/signup" element={  !user ? <SignUp /> : <Navigate to="/home" />} />
        
          
        <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path='/snippets' element={ user ? <Snippet /> : <Navigate to="/login" />} />
        <Route path='/profile' element={ user ? <Profile /> : <Navigate to="/login" />} />
        <Route path='/explore' element={ user ? <Explore userObj={user}/> : <Navigate to="/login" />} />
        <Route path='/viewpost' element={ user ? <ViewPost /> : <Navigate to="/login" />} />
        
      </Routes>
      <Footer />
    </>
  );
}

export default App;
