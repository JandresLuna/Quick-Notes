import React, { useState } from 'react'
import ProfileInfo from '../Cards/ProfileInfo'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../SearchBar/SearchBar'


const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {

  const[searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const onLogout= () =>{
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () =>{
    if(searchQuery){
      onSearchNote(searchQuery)
    }
  }

  const onClearSeach = () =>{
    setSearchQuery("");
    handleClearSearch();
  }

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
        <h2 className="text-base cursor-pointer font-medium text-gray-950 py-2 md:text-xl">QuickNotes</h2>
        
        <SearchBar value={searchQuery}
          onChange={({target})=>{
            setSearchQuery(target.value);
          }}

          handleSearch={handleSearch}
          onClearSeach={onClearSeach}
        />
        
        <ProfileInfo userInfo={userInfo} onLogout={onLogout}/>
    </div>
  )
}

export default Navbar