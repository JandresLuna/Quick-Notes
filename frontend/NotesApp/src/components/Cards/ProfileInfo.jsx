import React, { useState, useRef, useEffect } from 'react';
import { getInitials } from '../../utils/helper';

const ProfileInfo = ({ userInfo, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Referencia al menú desplegable
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Estado para almacenar el ancho de la ventana

  // Manejador para actualizar el ancho de la ventana
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  // Función para cerrar el menú si se hace clic fuera de él
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    // Agregar el listener de redimensionamiento
    window.addEventListener('resize', handleResize);

    // Añadir listener cuando el menú esté abierto y la pantalla sea pequeña
    if (isDropdownOpen && windowWidth < 768) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Limpiar el listener cuando el componente se desmonte o el menú se cierre
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, windowWidth]); // Dependencias del efecto incluyen el ancho de la ventana

  const toggleDropdown = () => {
    // Solo permitir que el menú se abra si el ancho de la ventana es menor que 768px
    if (windowWidth < 768) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  return (
    userInfo && <div className="flex items-center gap-3 relative">
      <div onClick={toggleDropdown} className="cursor-pointer w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
        {getInitials(userInfo.fullName)}
      </div>

      {isDropdownOpen && (
        <div ref={dropdownRef} className="absolute right-0 mt-12 py-2 w-48 bg-white rounded-md shadow-xl z-[100]">
          <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Mi Perfil
          </button>
          <button onClick={onLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Cerrar Sesión
          </button>
        </div>
      )}

      <div>
        <p className="text-sm font-medium hidden md:flex">{userInfo.fullName}</p>
        <button className="text-sm text-slate-700 underline hidden md:flex" onClick={onLogout}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

export default ProfileInfo;
