import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd} from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import AddNotesImg from "../../assets/images/add-note.png";
import NoDataImg from "../../assets/images/no-data.svg";

const Home = () => {

  const [openAddEditModal, setOpendAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });


  const [showToastMsg,setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add"
  });

  const [allNotes, setAllNotes] = useState([])
  const [userInfo, setUserInfo] = useState(null);

  const [isSearch, setIsSearch] = useState (false);

  const navigate = useNavigate();

  const handleEdit = (noteDetails)=>{
    setOpendAddEditModal({isShown: true, data: noteDetails, type: "edit"});
  };

  const showToastMessage = (message, type)=>{
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  };

  const handleCloseToast = ()=>{
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };
  //Obtener informacion del usuario

  const getUserInfo = async () =>{
    try {
      const response = await axiosInstance.get("/get-user");
      if(response.data && response.data.user){
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if(error.response.status ===401){
        localStorage.clear();
        navigate("/login")
      }
    }
  };

  //Obtener las cartas que haya creado la cuenta
  const getAllNotes = async()=>{
    try {
      const response = await axiosInstance.get("/get-all-notes");

      if(response.data && response.data.notes){
        setAllNotes(response.data.notes)
      }
    } catch (error) {
      console.log("Un error inesperado ha ocurrido.");
    }
  }

  //Eliminar un evento
  const deleteNote = async(data) =>{
    const noteId = data._id;
    try {
      const response = await axiosInstance.delete("/delete-note/"+noteId);

      if(response.data && !response.data.error){
          showToastMessage("Nota Eliminada con exito", 'delete')
          getAllNotes();
      }
  } catch (error) {
      if(error.response && error.response.data && error.response.data.message ){
        console.log("Un error inesperado ha ocurrido.");
      }
  }
  }

  // Buscar un evento o nota
  const onSearchNote = async(query)=>{
    try {
      const response = await axiosInstance.get("/search-notes",{
        params: {query},
      });

      if(response.data && response.data.notes){
        setIsSearch(true);;
        setAllNotes(response.data.notes)
      }
    } catch (error) {
      console.log(error);
    }
  };

  //fijar una nota
  const updateIsPinned = async (noteData)=>{
    const noteId = noteData._id;
        try {
            const response = await axiosInstance.put("/update-note-pinned/"+noteId,{
              "isPinned": !noteData.isPinned

            });

            if(response.data && response.data.note){
                showToastMessage("Nota Actualizada con exito")
                getAllNotes();
            }
        } catch (error) {
            console.log(error);
        }
  }


  const handleClearSearch = ()=>{
    setIsSearch(false);
    getAllNotes();
  }

  useEffect(() => {
    getAllNotes();
    getUserInfo();
    return () => {}
  }, [])
  

  return (
    <>
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch}/>
      <div className="container mx-auto px-4 md:px-16">
    {allNotes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-3">



          {allNotes.map((item,index)=>(
            <NoteCard 
            key={item._id}
            title={item.title} 
            date={item.createdOn}
            content={item.content}
            tags={item.tags}
            isPinned={item.isPinned}
            onEdit={()=>handleEdit(item)}
            onDelete={()=>deleteNote(item)}
            onPinNote={()=>updateIsPinned(item)}
            />
          ))}
        
        </div>) : (
        <EmptyCard imgSrc={isSearch ?  NoDataImg: AddNotesImg} 
        message={isSearch ? `Lo sentimos, no se encontraron resultados`:`Que te parece si creas tu primera nota! Haz clic al 
        'Botón añadir' para plasmar tus pensamientos, ideas y/o compromisos.`}/>
      )}
      </div>

      <button
  className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-slate-700 fixed right-10 bottom-10"
  onClick={() => {
    setOpendAddEditModal({ isShown: true, type: "add", data: null });
  }}>
  <MdAdd className="text-[32px] text-white" />
</button>


      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)"
          },
        }}
        contentLabel=""
        className="w-96 h-100 md:w-[45%] md:max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-hidden"
      >

        <AddEditNotes 
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpendAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={getAllNotes}
          showToastMessage ={showToastMessage}
        />
      </Modal>
      <Toast
        isShown ={showToastMsg.isShown}
        message={showToastMsg.message}
        type ={showToastMsg.type}
        onClose={handleCloseToast}
        />
    </>
  );
};

export default Home;