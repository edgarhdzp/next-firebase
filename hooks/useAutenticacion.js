import React, {useEffect, useState} from 'react';
import firebase from '../firebase';

function useAutenticacion(){
    const [usuarioAuth, guardarUsarioAuth] = useState(null);

    useEffect(() => {
        const unsuscribe = firebase.auth.onAuthStateChanged(usuario => {
            if(usuario) {
                guardarUsarioAuth(usuario);
            }else{
                guardarUsarioAuth(null);
            }
        });
        return () => unsuscribe();
    }, []);

    return usuarioAuth;
}

export default useAutenticacion;