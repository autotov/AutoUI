import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { Navbar, Footer, Sidebar, ThemeSettings } from './components';
import { Ecommerce, Orders, Calendar, CarsMain, Stacked, Pyramid, Companies, Kanban, Line, Area, Bar, Pie, Financial, ColorPicker, ColorMapping, Editor } from './pages';
import './App.css';

import { useStateContext } from './contexts/ContextProvider';
import CarCard from './pages/CarCard';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Users from './pages/Users';


const App = () => {
  const { setCurrentColor, setCurrentMode, currentMode, activeMenu, currentColor, themeSettings, setThemeSettings,
    companyValue, setCompanyValue, runGetCars, setRunGetCars, runGetDrivers, setRunGetDrivers, companyOptions, setCompanyOptions,
    isLogin, setIsLogin } = useStateContext();

  let data = sessionStorage.getItem("userData");
  console.log("data="+data)
  console.log("isLogin="+isLogin)
  if(data != undefined && data != null && data != "" && data != "{}" && !isLogin) {
    setIsLogin(true);
  }

  useEffect(() => {
    const currentThemeColor = localStorage.getItem('colorMode');
    const currentThemeMode = localStorage.getItem('themeMode');
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []);

  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <BrowserRouter>
        <div className="flex relative dark:bg-main-dark-bg">
          {isLogin ? (
          <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
            <TooltipComponent
              content="Settings"
              position="Top"
              >
              <button
                type="button"
                onClick={() => setThemeSettings(true)}
                style={{ background: currentColor, borderRadius: '50%' }}
                className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
              >
                <FiSettings />
              </button>

            </TooltipComponent>
          </div>
          ): (<div></div>)}

          {isLogin ? (
            activeMenu ? (
            <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
              <Sidebar />
            </div>
          ) : (
            <div className="w-0 dark:bg-secondary-dark-bg">
              <Sidebar />
            </div>
          )) :(<div></div>)}
         
          <div
            className={
              isLogin ? (
              activeMenu
                ? 'dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  '
                : 'bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 '
              ) : ('empty')
            }
          >
            {isLogin ? (
            <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
              <Navbar />
            </div>
            ): (<div></div>)}
            
            <div>
              {themeSettings && isLogin && (<ThemeSettings />)}

              <Routes>
                {/* dashboard  */}
                <Route path="/" element={(<Login />)} />
                <Route path="/login" element={(<Login />)} />
                <Route path="/logout" element={(<Logout />)} />
                <Route path="/ecommerce" element={(<Ecommerce />)} />
                <Route path="/CarCard/:id" element={(<CarCard />)} />

                {/* pages  */}
                <Route path="/orders" element={<Orders />} />
                <Route path="/carsmain" element={<CarsMain />} />
                <Route path="/companies" element={<Companies />} />
                <Route path="/users" element={<Users />} />

                {/* apps  */}
                <Route path="/kanban" element={<Kanban />} />
                <Route path="/editor" element={<Editor />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/color-picker" element={<ColorPicker />} />

                {/* charts  */}
                <Route path="/line" element={<Line />} />
                <Route path="/area" element={<Area />} />
                <Route path="/bar" element={<Bar />} />
                <Route path="/pie" element={<Pie />} />
                <Route path="/financial" element={<Financial />} />
                <Route path="/color-mapping" element={<ColorMapping />} />
                <Route path="/pyramid" element={<Pyramid />} />
                <Route path="/stacked" element={<Stacked />} />

              </Routes>
            </div>
            <Footer />
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
  
};

export default App;
