import React from 'react';
import Layout from '../components/layout/Layout';
import DetalleProducto from '../components/layout/DetalleProducto';
import useProductos from '../hooks/useProductos';

export default function Home() {

  const {productos} = useProductos('creado');

  return (
    <div>
     <Layout>
       <div className="listado-productos">
         <div className="contenedor">
           <div className="bg-white">
             {productos.map(producto => (
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
