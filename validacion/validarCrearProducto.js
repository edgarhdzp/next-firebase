export default function validarCrearCuenta(valores){

    let errores = {};

    //* validar el nombre del usuario
    if(!valores.nombre){
        errores.nombre = "El nombre es obligatorio";
    }

    //* validar empresa
    if(!valores.empresa){
        errores.empresa = "Empresa es obligatorio"
    }

    //* validaar url
    if(!valores.url){
        errores.url = "Es necesario una url"
    }else if(!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)){
        errores.url = "Url no valida"
    }

    //* validar descripcion
    if(!valores.descripcion){
        errores.imagen = "Agrega una descripcion a tu producto"
    }

    return errores;
}