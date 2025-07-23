import React from 'react';
import { Button } from '../ui/button';
import { NavLink } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';
import { FaHome, FaQuestionCircle, FaUsers } from 'react-icons/fa';

function Header() {
  const { user, isSignedIn } = useUser();

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-8">
            <NavLink to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <FaQuestionCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  StackIt
                </span>
                <span className="text-xs text-gray-500 -mt-1">Community</span>
              </div>
            </NavLink>

                         {/* Navigation Links */}
             <nav className="hidden md:flex items-center gap-1">
               <NavLink 
                 to="/" 
                 className={({ isActive }) => 
                   `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                     isActive 
                       ? 'bg-gradient-to-r from-green-100 to-blue-100 text-green-700 shadow-sm' 
                       : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                   }`
                 }
               >
                 <FaHome className="w-4 h-4" />
                 Home
               </NavLink>
               
               <NavLink 
                 to="/questions" 
                 className={({ isActive }) => 
                   `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                     isActive 
                       ? 'bg-gradient-to-r from-green-100 to-blue-100 text-green-700 shadow-sm' 
                       : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                   }`
                 }
               >
                 <FaQuestionCircle className="w-4 h-4" />
                 Questions
               </NavLink>
             </nav>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            {isSignedIn ? (
              <>
                {/* User Stats */}
                <div className="hidden sm:flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Welcome back!</span>
                  </div>
                </div>
                
                {/* User Button */}
                <div className="flex items-center gap-2">
                  <div className="hidden sm:block text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {user?.firstName || user?.username || 'User'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user?.emailAddresses?.[0]?.emailAddress || 'Member'}
                    </div>
                  </div>
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                      }
                    }}
                  />
                </div>
              </>
            ) : (
                             <div className="flex items-center gap-3">
                 <NavLink to="/auth/sign-in">
                   <Button 
                     variant="outline" 
                     className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                   >
                     Sign In
                   </Button>
                 </NavLink>
               </div>
            )}
          </div>
        </div>

                 {/* Mobile Navigation */}
         <div className="md:hidden mt-4 pt-4 border-t border-gray-100">
           <nav className="flex items-center justify-center gap-8">
             <NavLink 
               to="/" 
               className={({ isActive }) => 
                 `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                   isActive 
                     ? 'bg-gradient-to-r from-green-100 to-blue-100 text-green-700' 
                     : 'text-gray-600 hover:bg-gray-50'
                 }`
               }
             >
               <FaHome className="w-4 h-4" />
               Home
             </NavLink>
             
             <NavLink 
               to="/questions" 
               className={({ isActive }) => 
                 `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                   isActive 
                     ? 'bg-gradient-to-r from-green-100 to-blue-100 text-green-700' 
                     : 'text-gray-600 hover:bg-gray-50'
                 }`
               }
             >
               <FaQuestionCircle className="w-4 h-4" />
               Questions
             </NavLink>
           </nav>
         </div>
      </div>
    </header>
  );
}

export default Header;
