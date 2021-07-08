import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { TextField, Button  } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import axios from 'axios';
import validarNIT from 'validar-nit-gt'
import { useHistory } from "react-router-dom";

const useStyle = makeStyles((theme) => ({
    modal: {
        margin: '20px auto 20px auto',
        maxWidth: 450,
        minWidth: 160,
        borderRadius: 8,
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 3, 4),
    },
    iconos: {
        cursor: 'pointer'
    },
    inputMaterial: {
        width: '100%'
    }
}))



function Transaccion() {
        let history = useHistory()
        const styles = useStyle();
        var today = new Date(),
        date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
        const [data, setData] = useState([]);
        const [formulario, setFormulario] = useState('false');
        const [productoSeleccionado, setproductoSeleccionado] = useState({
            "nombre": "",
            "proveedor": "",
            "nit": "",
            "direccion": "",
            "codigo_producto": "",
            "marca": "",
            "cantidad": 0,
            "descripcion": "",
            "precio_unitario": 0,
            "fecha_abastecimiento": date    
        });

        const cambiarFormulario = function (e) {
            const ff = e.target.value;
            setFormulario(!formulario)
        }

        const handleChange = e => {
            const {name, value} = e.target;
            setproductoSeleccionado(prevState => ({
                ...prevState,
                [name]: value
            }));

            console.log(productoSeleccionado)
        }

        const peticionPost = async() => {
            if(productoSeleccionado.nombre.length <= 0
                || productoSeleccionado.proveedor.length <= 0
                || productoSeleccionado.nit.length <= 0
                || productoSeleccionado.direccion.length <= 0
                || productoSeleccionado.codigo_producto.length <= 0
                || productoSeleccionado.marca.length <= 0
                || productoSeleccionado.cantidad.length <= 0
                || productoSeleccionado.descripcion.length <= 0
                || productoSeleccionado.precio_unitario.length <= 0
                || productoSeleccionado.fecha_abastecimiento.length <= 0){
                        alert("No puede haber ninguna casilla vacia!")
            }else{
                if (!validarNIT(productoSeleccionado.nit)) {
                    alert("Nit no valido!")
                }else{
                    await axios.post("http://localhost:5001/articulos", productoSeleccionado)
                    .then(response => {
                        setData(data.concat(response.data));
                        history.push('/');
                    }).catch(error => {
                        console.log(error)
                    })
                }
            }
        }

        if(formulario){
            return (
                <div className="contenedor">
                    <Link  to={"/"}>Cancelar</Link>
                    <select onChange={cambiarFormulario} className='seleccionarFormulario'>
                        <option value='true'>Compra</option>
                        <option value='false'>Venta</option>
                    </select>
                    <div className={styles.modal}>
                        <h3>Compra de Producto</h3>
                        <TextField className={styles.inputMaterial} onChange={handleChange} name="nombre" label="Nombre" required></TextField>
                        <TextField className={styles.inputMaterial} onChange={handleChange} name="proveedor" label="Proveedor"></TextField>
                        <TextField className={styles.inputMaterial} onChange={handleChange} name="nit" label="Nit"></TextField>
                        <TextField className={styles.inputMaterial} onChange={handleChange} name="direccion" label="Dirección"></TextField>
                        <TextField className={styles.inputMaterial} onChange={handleChange} name="categoria" label="Categoria"></TextField>
                        <TextField className={styles.inputMaterial} onChange={handleChange} name="codigo_producto" label="Codigo del Producto"></TextField>
                        <TextField className={styles.inputMaterial} onChange={handleChange} name="marca" label="Marca"></TextField><br></br>
                        <TextField className={styles.inputMaterial} onChange={handleChange} name="descripcion" label="Descripción"></TextField><br></br>
                        <TextField className={styles.inputMaterial} type="number" onChange={handleChange} name="cantidad" label="Cantidad" type="number"></TextField><br></br>
                        <TextField className={styles.inputMaterial} type="number" onChange={handleChange} name="precio_unitario" label="Precio Unitario" type="number"></TextField><br></br>
                        <div align="right">
                            <Button color="primary" onClick={() => peticionPost()}>Insertar</Button>
                        </div>
                    </div>
                </div>
            )
        }else{
            console.log(data)
            return ( 
                <div className="contenedor">
                    <Link  to={"/"}>Cancelar</Link>
                    <select onChange={cambiarFormulario} className='seleccionarFormulario'>
                        <option value='true'>Compra</option>
                        <option value='false'>Venta</option>
                    </select>
                    <div>
                        <select>
                            {data.map(
                                (dato) => (
                                    <option key={dato.codigo_producto}>{dato.nombre}</option>
                                )
                            )

                            }
                        </select>
                    </div>
                </div>
             );
        }

    
}
 
export default Transaccion;