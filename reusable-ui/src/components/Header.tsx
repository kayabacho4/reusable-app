import React from 'react';
import { Link } from 'react-router-dom';
import { AuthUser } from '../types/types';

interface HeaderProps {
  pageName: string;
  user?: AuthUser | null;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ pageName, user, onLogout }) => {
  return (
    <header className="bg-white shadow-md px-4 py-3 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center">
        <Link to="/" className="flex items-center">
        <img
          src="appicon.png"
          className="w-10 h-10 mr-4 rounded-md"
        />
        </Link>
      </div>

      <div className="absolute left-1/2 transform -translate-x-1/2">
        <h1 className="text-xl font-bold text-gray-800">{pageName}</h1>
      </div>

      <div className="flex items-center">
        {user ? (
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-700 hidden sm:block">
              {user.display_name}
            </span>
            <div>
              <div className='block peer'>
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={`${user.display_name}'s avatar`}
                  className="h-8 w-8 rounded-full object-cover border-2 border-indigo-200 cursor-pointer"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium cursor-pointer">
                  {user.display_name.charAt(0).toUpperCase()}
                </div>
              )}
              </div>
              <div className="absolute right-0 w-48 bg-white rounded-md shadow-lg py-1 z-20 hidden hover:flex peer-hover:flex">
                <div className='w-full'>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <button
                  onClick={onLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Sign Out
                </button></div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </header>
  );
};

export default Header;