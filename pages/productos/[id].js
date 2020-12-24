import React, { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';
import { FirebaseContext } from '../../firebase';
import Layout from '../../components/layout/Layout';
import Error404 from '../../components/layout/404';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Campo, InputSubmit } from '../../components/ui/Formulario';
import Boton from '../../components/ui/Boton';

const ContenedorProducto = styled.div`
   @media (min-width:768px) {
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
   }
`;

const CreadorProducto = styled.p`
    padding: .5rem 2rem;
    background-color: #DA552F;
    color: #fff;
    text-align:center;
    text-transform: uppercase;
    display: inline-block;
    font-weight: bold;
`;
 
const Producto = () => {

    //* state del componentes
    const [producto, guardarProducto] = useState({});
    const [error, guardarError] = useState(false);
    const [comentario, guardarComentario] = useState({});
    const [consultaDb, guardarConsultaDb] = useState(true);

    //* obtener el id a traves del routing
    const router = useRouter();
    const {query: {id}} = router;

    //* context de firebase
    const {firebase, usuario} = useContext(FirebaseContext);

    useEffect(() => {
        if(id && consultaDb){
            const obtenerProducto = async () => {
                const productoQuery = await firebase.db.collection('productos').doc(id);
                const producto = await productoQuery.get();
                if(producto.exists){
                    guardarProducto(producto.data());
                    guardarConsultaDb(false);
                }else{
                    guardarError(true);
                    guardarConsultaDb(false);
                }
            }
            obtenerProducto();
        }
    }, [id]);

    if(Object.keys(producto).length === 0 && !error)  return 'Cargando...';

    const {comentarios, creado, descripcion, empresa, nombre, url, urlimagen, votos, creador, haVotado } = producto

    //* administrar y validar votos
    const votarProducto = () => {
        if(!usuario){
            return router.push('/login')
        }

        //* obtener y sumar voto
        const nuevoTotal = votos + 1;

        //* validar que el usuario actual ya voto o no 
        if(haVotado.includes(usuario.uid)) return;

        //* guardar el id del usuario que ha votado
        const nuevoVoto = [...haVotado, usuario.uid];

        //* actualizar bd
        firebase.db.collection('productos').doc(id).update({votos: nuevoTotal, haVotado: nuevoVoto})

        //* actualizar state
        guardarProducto({
            ...producto,
            votos: nuevoTotal
        })

        guardarConsultaDb(true);
    }

    //* funciones de comentarios
    const comentarioChange = e => {
        guardarComentario({
            ...comentario,
            [e.target.name] : e.target.value
        })
    }

    //* identificar si el comentario es del creador del producto
    const esCreador = id => {
        if(creador.id == id){
            return true;
        }
    }

    const agregarComentario = e => {
        e.preventDefault();

        if(!usuario){
            return router.push('/login')
        }

        //* informacion detallada del comentario
        comentario.usuarioId = usuario.uid;
        comentario.usuarioNombre = usuario.displayName;

        //* tomar copia de comentarios y agregar el nuevo
        const nuevosComentarios = [...comentarios, comentario];

        //* actualizar db
        firebase.db.collection('productos').doc(id).update({comentarios: nuevosComentarios})

        //* actualizar el state
        guardarProducto({
            ...producto,
            comentarios: nuevosComentarios
        })

        guardarConsultaDb(true);
    }

    //* revisar que el usuario autenticado sea el creador del producto para borrarlo
    const puedeBorrar = () => {
        if(!usuario) return false;

        if(creador.id === usuario.uid){
            return true;
        }
    }

    //* eliminar un producto de la bd
    const eliminarProducto = async () => {
        
        if(!usuario){
            return router.push('/login')
        }

        if(creador.id !== usuario.uid){
            return router.push('/')
        }
        
        try {
            await firebase.db.collection('productos').doc(id).delete();
            router.push('/')
        } catch (error) {
            console.log(error);
        }
    }

    return ( 
        <Layout>
            <>

            { error ? <Error404/> : (

                <div className="contenedor">
                <h1 css={css`
                    text-align: center;
                    margin-top: 5rem;
                `}> {nombre} </h1>

                <ContenedorProducto>
                    <div>
                        <p>Publicado hace: {formatDistanceToNow(new Date(creado), {locale: es})} </p>
                        <p>Por {creador.nombre} de {empresa}</p>
                        <img src={urlimagen}/>
                        <p>{descripcion}</p>

                        {usuario && (
                            <>
                                <h2>Agrega tu comentario</h2>
                                <form onSubmit={agregarComentario}>
                                <Campo>
                                    <input type="text" name="mensaje" onChange={comentarioChange}/>
                                </Campo>

                                <InputSubmit
                                        type="submit"
                                        value="Publicar Comentario"
                                />
                                </form> 
                            </>
                        )}   

                            <h2 css={css`
                                margin: 2rem 0;
                            `} 
                            >Comentarios</h2>

                            {comentarios.length === 0 ? 'Aun no hay comentarios' : (
                                <ul>    
                                {comentarios.map((comentario, i) => (
                                    <li
                                        key={`${comentario.usuarioId}-${i}`}
                                        css={css`
                                            border: 1px solid #e1e1e1;
                                            padding: 2rem;
                                        `}
                                    >
                                        <p>{comentario.mensaje}</p>
                                        <p>Publicado por:
                                            <span
                                            css={css`
                                                font-weight:bold;
                                            `}
                                            > {comentario.usuarioNombre}</span>
                                        </p>
                                        {esCreador(comentario.usuarioId) && <CreadorProducto>Es Creador</CreadorProducto>}
                                    </li>
                                ))}
                                </ul>
                            )}
                    </div>

                    <aside>
                        <Boton
                            target="_blank"
                            bgColor="true"
                            href={url}
                        >Visitar Pagina</Boton>

                        <div css={css`
                            margin-top:5rem;
                        `}
                        >
                            <p css={css`
                                text-align:center;
                            `}
                            >{votos} Votos</p>

                            {usuario && (
                                <Boton
                                    onClick={votarProducto}
                                >
                                    Votar
                                </Boton>
                            )}
                        </div>
                    </aside>
                </ContenedorProducto>
                {puedeBorrar() &&
                 <Boton onClick={eliminarProducto}>
                     Eliminar Producto</Boton>}
                </div>
            )}

            </>
        </Layout>
     );
}
 
export default Producto;