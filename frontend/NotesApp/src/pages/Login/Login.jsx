import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/Input/PasswordInput';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';

const Login = () => {

  const [email,setEmail] = useState("");
  const[password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate  = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault();

    if(!validateEmail(email)){
      setError("Por favor ingrese un correo valido.");
      return;
    }
    if(!password){
      setError("Por favor ingrese la contraseña");
      return;
    }
    setError("")

    //Api para el login
    try {
      const response = await axiosInstance.post("/login",{
        email: email,
        password: password,
      });

      if(response.data && response.data.accessToken){
        localStorage.setItem("token", response.data.accessToken)
        navigate('/dashboard')
      }
    } catch (error) {
        if(error.response && error.response.data && error.response.data.message){
          setError(error.response.data.message);
        }else{
          setError("Ha ocurrido un error inesperado. Por favor intente otra vez");
        }
    }

  };
  return (
    <>
    
    <div className="flex items-center justify-center mt-20">
      <div className="w-96 border rounded bg-white px-7 py-10">
        <form onSubmit={handleLogin}>
        <h4 className="text-2xl mb-7">Login</h4>

        <input type="text" placeholder="Correo Electronico" className="input-box" value={email} 
        onChange={(e)=>setEmail(e.target.value)} 
        />

        <PasswordInput value={password}
        onChage={(e)=>setPassword(e.target.value)}
        />


        {error && <p className="text-red-600 text-xs pb-1">{error}</p> }


        <button type="submit" className="btn-primary">Inicia Sesión</button>

        <p className="text-sm text-center mt-4">¿Aún no tienes una cuenta?{" "}
        <Link to="/signUp" className="font-medium text-primary underline">Crear una cuenta</Link>
        </p>
        </form>
      </div>
    </div>
    </>
  )
};

export default Login