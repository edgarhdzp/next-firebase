import React, {useState, useEffect} from 'react';

const useValidacion = (stateInicial, validar, fn) => {

    //* los 3 states que necesitaremos para nuestros formularios
    const [valores, guardarValores] = useState(stateInicial);
    const [errores, guardarErrores] = useState({});
    const [submitForm, guardarSubmitForm] = useState(false); 

    //* verificamos que al enviar el submit no tengamos errores, continuamos con la funcion y volvemos a recetear el formulario
    useEffect(() => {
        if(submitForm){
            const noErrores = Object.keys(errores).length === 0;

            if(noErrores){
                fn();
            }
            guardarSubmitForm(false);
        }
    }, [errores]);

    //* funcion que se ejectua conforme el usuario escribe algo
    const handleChange = e => {
        guardarValores({
            ...valores,
            [e.target.name] : e.target.value
        })
    }

    //* funcion que se ejecuta cuando el usuario hace el submit
    const handleSubmit = e => {
        e.preventDefault();
        const erroresValidacion = validar(valores);
        guardarErrores(erroresValidacion);
        guardarSubmitForm(true);
    }

    return{
        valores,
        errores,
        handleChange,
        handleSubmit
    }

}

export default useValidacion;