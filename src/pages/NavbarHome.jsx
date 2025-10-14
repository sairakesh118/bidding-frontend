import React from 'react';
import { LogOut, PenBox, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/features/auth/authSlice';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

const NavbarHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    try {
      dispatch(logout());
      toast.success("Logged out successfully");
      navigate("/auth");
    } catch (error) {
      toast.error("Logout failed");
      //console.error("Logout error:", error);
    }
  };

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Company Logo */}
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200 cursor-pointer">
          EliteAuctions
        </div>
        </div>

        {/* Profile + Logout */}
        <div className="flex items-center space-x-2">
          {/* Profile Button */}
          <button 
            onClick={() => navigate('/profile')} 
            className="flex items-center space-x-2 px-4 py-2 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 ease-in-out group"
          >
            <User className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            <span className="hidden sm:inline font-medium">Profile</span>
          </button>

          {/* Logout Button */}
          <button 
            onClick={() => navigate('/create-bid')} 
            className="flex items-center space-x-2 px-4 py-2 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 ease-in-out group"
          >
            <PenBox className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            <span className="hidden sm:inline font-medium">Create Bid</span>
          </button>

          <button 
            onClick={handleLogout} 
            className="flex items-center space-x-2 px-4 py-2 rounded-full text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 ease-in-out group"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            <span className="hidden sm:inline font-medium">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavbarHome;