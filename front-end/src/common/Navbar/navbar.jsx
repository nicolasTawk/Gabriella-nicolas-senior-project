import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaHome, FaUser, FaCog, FaSignOutAlt, FaBars,
  FaUniversity, FaClipboardList, FaUsers, FaBuilding,
  FaKey, FaSchool,
  FaUserPlus,
  FaTrash
} from 'react-icons/fa';
import './navbar.scss';
import title from '../../util/images/title.png'
import api from '../../http-common'

const Navbar = ({ onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    onToggle?.(isOpen);
  }, [isOpen]);

  if (['/login', '/register'].includes(location.pathname)) return null;

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      return;
    }
    try {
      await api.delete('/users/me/delete');
      // clear storage & redirect
      localStorage.clear();
      navigate('/login');
    } catch (err) {
      console.error('Failed to delete account:', err);
      alert('Could not delete account. Please try again.');
    }
  };

  const renderMainLinks = () => {
    switch (userRole) {
      case 'student':
        return (
          <>
            <li className={location.pathname === '/home' ? 'nav-sidebar__item nav-sidebar__item--active' : 'nav-sidebar__item'}>
              <Link to="/home">
                <FaHome className="nav-sidebar__icon" /> {isOpen && 'Home'}
              </Link>
            </li>
            <li className={location.pathname === '/questionnaire' ? 'nav-sidebar__item nav-sidebar__item--active' : 'nav-sidebar__item'}>
              <Link to="/questionnaire">
                <FaClipboardList className="nav-sidebar__icon" /> {isOpen && 'Questionnaire'}
              </Link>
            </li>
            <li className={location.pathname === '/universities' ? 'nav-sidebar__item nav-sidebar__item--active' : 'nav-sidebar__item'}>
              <Link to="/universities">
                <FaUniversity className="nav-sidebar__icon" /> {isOpen && 'Universities'}
              </Link>
            </li>
            <li className={location.pathname === '/majorsList' ? 'nav-sidebar__item nav-sidebar__item--active' : 'nav-sidebar__item'}>
              <Link to="/majorsList">
              <FaSchool className="nav-sidebar__icon" /> {isOpen && 'Majors'}
              </Link>
            </li>
          </>
        );
      case 'university':
        return (
          <>
            <li className={location.pathname === '/universityProfile' ? 'nav-sidebar__item nav-sidebar__item--active' : 'nav-sidebar__item'}>
              <Link to="/universityProfile">
                <FaUser className="nav-sidebar__icon" /> {isOpen && 'Profile'}
              </Link>
            </li>
            <li className={location.pathname === '/faculties' ? 'nav-sidebar__item nav-sidebar__item--active' : 'nav-sidebar__item'}>
              <Link to="/faculties">
                <FaBuilding className="nav-sidebar__icon" /> {isOpen && 'Faculties'}
              </Link>
            </li>
            <li className={location.pathname === '/majors' ? 'nav-sidebar__item nav-sidebar__item--active' : 'nav-sidebar__item'}>
              <Link to="/majors">
                <FaBuilding className="nav-sidebar__icon" /> {isOpen && 'Majors'}
              </Link>
            </li>
          </>
        );
      case 'admin':
        return (
          <>
            <li className={location.pathname === '/createUniversity' ? 'nav-sidebar__item nav-sidebar__item--active' : 'nav-sidebar__item'}>
              <Link to="/createUniversity">
                <FaUniversity className="nav-sidebar__icon" /> {isOpen && 'Dashboard'}
              </Link>
            </li>
            <li className={location.pathname === '/createAdmin' ? 'nav-sidebar__item nav-sidebar__item--active' : 'nav-sidebar__item'}>
              <Link to="/createAdmin">
                <FaUserPlus className="nav-sidebar__icon" /> {isOpen && 'Dashboard'}
              </Link>
            </li>
            <li className={location.pathname === '/listUniversities' ? 'nav-sidebar__item nav-sidebar__item--active' : 'nav-sidebar__item'}>
              <Link to="/listUniversities">
                <FaUniversity className="nav-sidebar__icon" /> {isOpen && 'Universities'}
              </Link>
            </li>
            <li className={location.pathname === '/listStudents' ? 'nav-sidebar__item nav-sidebar__item--active' : 'nav-sidebar__item'}>
              <Link to="/ListStudents">
                <FaUsers className="nav-sidebar__icon" /> {isOpen && 'Students'}
              </Link>
            </li>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`nav-sidebar ${isOpen ? 'nav-sidebar--open' : ''}`}>
      <div className="nav-sidebar__top">
        <div className="nav-sidebar__toggle" onClick={() => setIsOpen(!isOpen)}>
          <FaBars />
        </div>
        {isOpen && <img src={title} alt="Logo" className="nav-sidebar__logo" /> }
      </div>

      <ul className="nav-sidebar__section nav-sidebar__section--main">
        {renderMainLinks()}
      </ul>

      <ul className="nav-sidebar__section nav-sidebar__section--bottom">
  {(userRole === 'student') && (
    <li className={location.pathname === '/profile' ? 'nav-sidebar__item nav-sidebar__item--active' : 'nav-sidebar__item'}>
      <Link to="/profile">
        <FaUser className="nav-sidebar__icon" /> {isOpen && 'Profile'}
      </Link>
    </li>
  )}
  {(userRole === 'admin') && (
    <li className={location.pathname === '/changeAdminPassword' ? 'nav-sidebar__item nav-sidebar__item--active' : 'nav-sidebar__item'}>
      <Link to="/changeAdminPassword">
        <FaKey className="nav-sidebar__icon" /> {isOpen && 'Profile'}
      </Link>
    </li>
  )}
  {userRole === 'university' && ( 
    <li className="nav-sidebar__item" onClick={handleDeleteAccount}>
      <span>
        <FaTrash className="nav-sidebar__icon" /> {isOpen && 'Delete Account'}
      </span>
    </li>
  )}

        {/* <li className={location.pathname === '/settings' ? 'nav-sidebar__item nav-sidebar__item--active' : 'nav-sidebar__item'}>
          <Link to="/settings">
            <FaCog className="nav-sidebar__icon" /> {isOpen && 'Settings'}
          </Link>
        </li> */}
        <li className="nav-sidebar__item" onClick={handleLogout}>
          <span>
            <FaSignOutAlt className="nav-sidebar__icon" /> {isOpen && 'Logout'}
          </span>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
