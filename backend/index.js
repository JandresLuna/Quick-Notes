require ("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose")

mongoose.connect(config.connectionString)

const User = require("./models/user.model");
const Note = require ("./models/note.model");

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const {authenticateToken} = require("./utilities");

app.use(express.json());

app.use(
    cors({
        origin: "*",
    })
);

app.get("/",(req,res)=>{
    res.json({data: "hello"});

});

//Crear la cuenta

app.post("/create-account", async(req,res)=>{

    const {fullName, email, password} = req.body;

    if(!fullName){
        return res
        .status(400)
        .json({error:true,message:"El nombre es obligatorio"});
    }

    if(!email){
        return res
        .status(400)
        .json({error:true,message:"El correo es obligatorio"});
    }

    if(!password){
        return res
        .status(400)
        .json({error:true,message:"La contraseña es obligatoria"});
    }

    const isUser= await User.findOne({email: email});

    if(isUser){
        return res.json({
            error: true,
            message: "Usuario ya existe",
        });
    }

    const user = new User({
        fullName,
        email,
        password,

    });

    await user.save();

    const accessToken = jwt.sign({
        user
    },process.env.ACCESS_TOKEN_SECRET,{
        expiresIn: "36000m"
    });
    return res.json({
        error: false,
        user,
        accessToken,
        message: "Registrado con exito"
    });
});

//Iniciar sesión
app.post("/login", async (req,res)=>{

    const{email,password} = req.body;

    if(!email){
        return res.status(400).json({message: "El correo es obligatorio"});


    };

    if(!password){
        return res.status(400).json({message: "La contraseña es obligatoria"});

        
    }

    const userInfo = await User.findOne({email:email});

    if(!userInfo){
        return res.status(400).json({message: "Usuario no encontrado"})
    }

    if(userInfo.email== email && userInfo.password == password){
        const user ={user:userInfo};
        const accessToken =jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: "36000m"
        });

        return res.json({
            error: false,
            message: "Inicio de sesión exitoso",
            email,
            accessToken,
        });
    }else{
        return res.status(400).json({
            error: true,
            message: "Correo o contraseña incorrectos"
        });
    }
});

//Obtener usuario
app.get("/get-user", authenticateToken, async (req,res)=>{
    const {user}= req.user;

    const isUser = await User.findOne({_id: user._id});
    
    if(!isUser){
        return res.sendStatus(401);
    }

    return res.json({
        user: {
            fullName: isUser.fullName, 
            email: isUser.email, 
            "_id":isUser.id, 
            createOn: isUser.createOn},
        message: "",
    });
});

//Añadir nota
app.post("/add-note", authenticateToken, async (req,res)=>{
    const {title, content, tags } = req.body
    const {user} = req.user;

    if(!title){
        return res.status(400).json({error: true, message:"Por favor agrega un titulo"});
    }

    if(!content){
        return res.status(400).json({error: true, message:"Por favor ingrese el contenido"});
    }

    try{
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id,
        });

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Nota creada con exito",
        });

    }catch (error) {
        
            return res.status(500).json({
            error: true,
            message:"Error del servidor"
        });
    }
});

//Editar nota
app.put("/edit-note/:noteId", authenticateToken, async (req,res)=>{
    const noteId = req.params.noteId;
    const {title,content,tags,isPinned} = req.body
    const {user} = req.user;

    if(!title && !content && !tags){
        return res.status(400).json({
            error: true,
            message: "No han habido cambios"
        })
    }

    try{
        const note = await Note.findOne({_id: noteId, userId: user._id })

        if(!note){
            return res.status(400).json({
                error:true,
                message: "La nota no ha sido encontrada"
            });
        }

        if(title) note.title = title;
        if(content) note.content = content;
        if(tags) note.tags = tags;
        if(isPinned) note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Nota editada con exito",
        });

    }catch (error){
        return res.status(500).json({
            error: true,
            message: "Error del servidor"
        });

    }
});

//Obtener notas
app.get("/get-all-notes/", authenticateToken, async (req,res)=>{

    const {user} = req.user;

    try {
        const notes = await Note.find({
            userId : user._id})
            .sort({isPinned: -1});

            return res.json({
                error: false,
                notes,
                message: "Notas obtenidas con exito"
            });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Error interno del servidor"
        });
    }


});

//Borrar una nota
app.delete("/delete-note/:noteId", authenticateToken, async (req,res)=>{
     const noteId = req.params.noteId;
     const {user} = req.user;

     try {
        const note = await Note.findOne({_id: noteId, userId: user._id});

        if(!note){
            return res.status(404).json({
                error: true,
                message: "No existe la nota a borrar"
            });
        }

        await Note.deleteOne({_id: noteId, userId: user._id})

        return res.json({
            error: false,
            message: "Nota eliminada"
        });

     } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Error interno del servidor"
        });
     }
});

//Actualizar fijada
app.put("/update-note-pinned/:noteId", authenticateToken, async (req,res)=>{
    const noteId = req.params.noteId;
    const {isPinned} = req.body
    const {user} = req.user;

   

    try{
        const note = await Note.findOne({_id: noteId, userId: user._id })

        if(!note){
            return res.status(400).json({
                error:true,
                message: "La nota no ha sido encontrada"
            });
        }

        note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Nota actualizada con exito",
        });

    }catch (error){
        return res.status(500).json({
            error: true,
            message: "Error del servidor"
        });

    }
});

//Buscar notas
app.get("/search-notes/", authenticateToken, async (req,res)=>{
    const {user} = req.user;
    const {query} = req.query;

    if(!query){
        return res
        .status(400).json({
            error: true,
            message: "El query de busqueda es requerido"
        })
    }

    try {
        const matchingNotes = await Note.find({
            userId: user._id,
            $or: [{title:{ $regex: new RegExp(query, "i")}},
                  {content: {$regex: new RegExp(query, "i")}},
                  {tags: {$regex: new RegExp(query, "i")}},
            ],

        });

        return res.json({
            error: false,
            notes: matchingNotes,
            message: "Notas encontradas con el buscador de forma exitosa"
        });

    } catch (error) {
        console.error("Error:", error)
        return res.status(500).json({
            error: true,
            message: "Error interno del servidor",
        });
    }
})

app.listen(8000);

module.exports = app;