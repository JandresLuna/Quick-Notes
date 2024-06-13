import React, { useState } from 'react'
import PasswordInput from '../../components/Input/PasswordInput';
import { Link, useNavigate} from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';

const SignUp = () => {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState(null);

  const navigate = useNavigate()

  const handleSignUp = async(e)=>{
    e.preventDefault();

    if(!name){
      setError("Por favor ingresa tu nombre");
      return;

    }

    if(!validateEmail(email)){
      setError("Por favor ingrese un correo valido.");
      return;

    }

    if(!password){
      setError("Por favor ingrese la contraseña");
      return;
    }

    setError('')
    //Api para el crear cuenta 

    try {
      const response = await axiosInstance.post("/create-account",{
        fullName: name,
        email: email,
        password: password,
      });

      if(response.data && response.data.error){

        setError(response.data.message)
        return
      }
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
        <form onSubmit={handleSignUp}>
        <h4 className="text-2xl mb-7">Sign Up</h4>

        <input type="text" placeholder="Nombre"
        className="input-box" 
        value={name} 
        onChange={(e)=>setName(e.target.value)} 

        />
        <input type="text" placeholder="Correo Electronico"
        className="input-box" 
        value={email} 
        onChange={(e)=>setEmail(e.target.value)} 

        />

        <PasswordInput value={password}
        onChage={(e)=>setPassword(e.target.value)}
        />

        {error && <p className="text-red-600 text-xs pb-1">{error}</p> }


        <button type="submit" className="btn-primary">Crear cuenta</button>

        <p className="text-sm text-center mt-4">¿Ya tienes una cuenta?{" "}
        <Link to="/login" className="font-medium text-primary underline">Inicia sesión</Link>
        </p>

        </form>
        </div>
        </div>
    </>
  );
};

export default SignUp