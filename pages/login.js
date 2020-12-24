import React, {useState} from 'react';
import {css} from '@emotion/react';
import Router from 'next/router';
import Layout from '../components/layout/Layout';
import {Formulario, Campo, InputSubmit, Error} from '../components/ui/Formulario';

import firebase from '../firebase';

import useValidacion from '../hooks/useValidacion';
import validarInicioSesion from '../validacion/validarInicioSesion';

const STATE_INICIAL = {
  email: '',
  password: '' 
}

export default function Login() {

  const [error, guardarError] = useState(false);

  const {valores, errores, handleChange, handleSubmit} = useValidacion(STATE_INICIAL, validarInicioSesion,iniciarSesion);

  const {email,password} = valores;

  async function iniciarSesion(){
    try {
      await firebase.login(email,password);
      Router.push('/');
    } catch (error) {
      console.log('Hubo un error al acceder', error.message);
      guardarError(error.message)
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
        >Iniciar Sesión</h1>
        <Formulario
          onSubmit={handleSubmit}
          noValidate
        >

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

          <InputSubmit type="submit" value="Acceder"/>
        </Formulario>
      </>
     </Layout>

    </div>
  )
}