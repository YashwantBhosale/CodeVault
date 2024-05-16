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
        <Route path='/' element={ <Login />} />
        <Route path="/login" element={ <Login />} />
        <Route path="/signup" element={  <SignUp />} />
        
          
        <Route path="/home" element={ <Home />} />
        <Route path='/snippets' element={ <Snippet />} />
        <Route path='/profile' element={ <Profile />} />
        <Route path='/explore' element={ <Explore userObj={user}/>} />
        <Route path='/viewpost' element={ <ViewPost />} />
        
      </Routes>
      <Footer />
    </>
  );
}

export default App;
