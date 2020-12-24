import React, {useState, useContext} from 'react';
import {css} from '@emotion/react';
import {useRouter} from 'next/router';
import Layout from '../components/layout/Layout';
import {Formulario, Campo, InputSubmit, Error} from '../components/ui/Formulario';
import Error404 from '../components/layout/404';

import {FirebaseContext} from '../firebase';

import useValidacion from '../hooks/useValidacion';
import validarCrearProducto from '../validacion/validarCrearProducto';

const STATE_INICIAL = {
  nombre: '',
  empresa: '',
  url: '',
  descripcion: '' 
}

export default function NuevoProducto() {

  //* state de la imagen
  const [nombreimagen, guardarNombreimagen] = useState('');
  const [error, guardarError] = useState(false);

  const {valores, errores, handleChange, handleSubmit} = useValidacion(STATE_INICIAL, validarCrearProducto,crearProducto);

  const {nombre, empresa, url, descripcion} = valores;

  //* hook de routing para redireccionar 
  const router = useRouter();

  //* context con las operaciones crud de firebase
  const {usuario, firebase} = useContext(FirebaseContext);

  const handleFile = e => {
    if(e.target.files[0]){
      console.log(e.target.files[0])
      guardarNombreimagen(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    const uploadTask = await firebase.storage.ref(`productos/${nombreimagen.lastModified}${nombreimagen.name}`).put(nombreimagen);
    const downloadURL = await uploadTask.ref.getDownloadURL();
    return downloadURL
  }

  async function crearProducto(){
   
    //* si el usuario no esta autenticado redireccionar
    if(!usuario){
      return router.push('/login');
    }

    //* crear el objeto de nuevo producto
    const producto = {
      nombre,
      empresa,
      url,
      urlimagen: await handleUpload(),
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now(),
      creador: {
        id: usuario.uid,
        nombre: usuario.displayName
      }, 
      haVotado: []
    }

    //* insertarlo en la bd
     await firebase.db.collection('productos').add(producto);

     return router.push('/');

  }

  return (
    <div>
     <Layout>
       {!usuario ? <Error404/> : (
         <>
         <h1
           css={css`
             text-align: center;
             margin-top: 5rem;
           `}
         >Nuevo Producto</h1>
         <Formulario
           onSubmit={handleSubmit}
           noValidate
         >
           <fieldset>
             <legend>Información General</legend>
           
           <Campo>
             <label htmlFor="nombre">Nombre</label>
             <input 
               type="text" 
               id="nombre" 
               placeholder="Ingresa el nombre del producto" 
               name="nombre"
               value={nombre}
               onChange={handleChange}
             />
           </Campo>
 
           {errores.nombre && <Error>{errores.nombre}</Error>}
 
           <Campo>
             <label htmlFor="empresa">Empresa</label>
             <input 
               type="text" 
               id="empresa" 
               placeholder="Nombre empresa o compañia" 
               name="empresa"
               value={empresa}
               onChange={handleChange}
             />
           </Campo>
 
           {errores.empresa && <Error>{errores.empresa}</Error>}
 
           <Campo>
             <label htmlFor="imagen">Imagen</label>
             <input 
               type="file"
               accept="image/*"
               id="imagen"  
               name="imagen"
               onInput={(e) => handleFile(e)}
             />
           </Campo>
 
           <Campo>
             <label htmlFor="url">Url</label>
             <input 
               type="url" 
               id="url" 
               placeholder="Url del producto" 
               name="url"
               value={url}
               onChange={handleChange}
             />
           </Campo>
 
           {errores.url && <Error>{errores.url}</Error>}
 
           </fieldset>
 
           <fieldset>
             <legend>Sobre tu Producto</legend>
 
             <Campo>
             <label htmlFor="descripcion">Descripción</label>
             <textarea
               id="descripcion" 
               placeholder="Nombre descripcion o compañia" 
               name="descripcion"
               value={descripcion}
               onChange={handleChange}
             />
           </Campo>
 
           {errores.descripcion && <Error>{errores.descripcion}</Error>}
 
           </fieldset>
 
           {error && <Error>{error}</Error>}
 
           <InputSubmit type="submit" value="Crear Producto"/>
         </Formulario>
       </>
       )}
       
     </Layout>

    </div>
  )
}