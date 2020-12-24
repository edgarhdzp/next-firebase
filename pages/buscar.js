import React, {useEffect, useState} from 'react';
import Layout from '../components/layout/Layout';
import {useRouter} from 'next/router';
import DetalleProducto from '../components/layout/DetalleProducto';
import useProductos from '../hooks/useProductos';

export default function Buscar() {

  const router = useRouter();
  const{query: {q}} = router;

  //* todos los productos
  const {productos} = useProductos('creado');
  const [resultado, guardarResultado] = useState([]);

  useEffect(() => {
    if(!q) return;
    const busqueda = q.toLowerCase();
    const filtro = productos.filter(producto => {
      return (
        producto.nombre.toLowerCase().includes(busqueda) || 
        producto.descripcion.toLowerCase().includes(busqueda) ||
        producto.creador.nombre.toLowerCase().includes(busqueda) 

      )
    });
    guardarResultado(filtro);
  }, [q, productos]);

  return (
    <div>

     <Layout>
      <div className="listado-productos">
         <div className="contenedor">
           <div className="bg-white">
             {resultado.map(producto => (
               <DetalleProducto
                key={producto.id}
                producto={producto}
               />
             ))}
           </div>
         </div>
      </div>
     </Layout>

    </div>
  )
}
