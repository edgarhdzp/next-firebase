import React, {useState} from 'react';
import {css} from '@emotion/react';
import Router from 'next/router';
import Layout from '../components/layout/Layout';
import {Formulario, Campo, InputSubmit, Error} from '../components/ui/Formulario';

import firebase from '../firebase';

import useValidacion from '../hooks/useValidacion';
import validarCrearCuenta from '../validacion/validarCrearCuenta';

const STATE_INICIAL = {
  nombre: '',
  email: '',
  password: '' 
}

export default function CrearCuenta() {

  const [error, guardarError] = useState(false);

  const {valores, errores, handleChange, handleSubmit} = useValidacion(STATE_INICIAL, validarCrearCuenta,crearCuenta);

  const {nombre, email,password} = valores;

  async function crearCuenta(){
    try {
      await firebase.registrar(nombre, email, password);
      Router.push('/');
    } catch (error) {
      console.log('No se creo el usuario', error.message);
      guardarError(error.message);
    }
  }

  return (
    <div>

     <Layout>
       <>
        <h1
          css={css`
            text-align: center;
            margin-top: 5rem;
          `}
        >Crear Cuenta</h1>
        <Formulario
          onSubmit={handleSubmit}
          noValidate
        >
          <Campo>
            <label htmlFor="nombre">Nombre</label>
            <input 
              type="text" 
              id="nombre" 
              placeholder="Ingresa tu nombre" 
              name="nombre"
              value={nombre}
              onChange={handleChange}
            />
          </Campo>

          {errores.nombre && <Error>{errores.nombre}</Error>}

          <Campo>
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="Ingresa tu email" 
              name="email"
              value={email}
              onChange={handleChange}
            />
          </Campo>

          {errores.email && <Error>{errores.email}</Error>}

          <Campo>
            <label htmlFor="password">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Ingresa tu password" 
              name="password"
              value={password}
              onChange={handleChange}
            />
          </Campo>

          {errores.password && <Error>{errores.password}</Error>}

          {error && <Error>{error}</Error>}

          <InputSubmit type="submit" value="Crear Cuenta"/>
        </Formulario>
      </>
     </Layout>

    </div>
  )
}
