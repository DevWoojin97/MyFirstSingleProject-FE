import Cookies from 'js-cookie';

import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get('token'));
  const [nickname, setNickname] = useState(
    localStorage.getItem('nickname') || '',
  );
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');

  const login = (token, userNickname, id) => {
    Cookies.set('token', token, { expires: 1 });
    localStorage.setItem('nickname', userNickname);
    localStorage.setItem('userId', id); // 로컬스토리지에 ID 저장

    setIsLoggedIn(true);
    setNickname(userNickname);
    setUserId(id);
  };

  const logout = () => {
    Cookies.remove('token');
    localStorage.removeItem('nickname');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setNickname('');
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, nickname, login, logout, userId }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
