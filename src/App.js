import {useState} from 'react';
import {Routes, Route} from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import TopNav from './components/partials/Navbar';
import Register from './components/forms/Register';
import Login from './components/forms/Login';
import Home from './components/Home';
// import DatingCards from './components/DatingCards';
import './components/style/App.css';
import DatingProfile from './components/forms/DatingProfile';
import Posts from './components/Posts';
import Match from './components/Match';
import Reports from './components/Reports';
import Swal from 'sweetalert2';

function App() {
  const [token, setToken] = useState('');
  const [userData, setUserData] = useState({});

  let handleLogin = (data) => {
    let decoded = jwt_decode(data);
    setToken(data);
    setUserData(decoded);

    localStorage.setItem('userData', JSON.stringify(decoded));
    localStorage.setItem('token', data);
  };

  let handleLogout = () => {
    setToken();
    setUserData({});
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
  };

  return (
    <div className="App">
      <TopNav handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/match" element={<Match />} />
        <Route path="/register" element={<Register handleLogin={handleLogin} />} />
        <Route path="/login" element={<Login handleLogin={handleLogin} />} />
        <Route path="/myprofile" element={<DatingProfile />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </div>
  );
}

export default App;
