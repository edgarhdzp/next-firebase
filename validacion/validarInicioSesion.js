export default function validarInicioSesion(valores){

    let errores = {};

    //* validar el email
    if(!valores.email){
        errores.email = "El email es obligatorio";
    }else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(valores.email)){
        errores.email = "Email no valido";
    }

    //* validar el password
    if(!valores.password){
        errores.password = "El passsword es obligatorio";
    } else if(valores.password.length < 6) {
        errores.password = 'El password debe ser minimo de 6 caracteres';
    }
    return errores;
}