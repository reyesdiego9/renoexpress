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
        const [total, settotal] = useState(0);
        const [precio, setprecio] = useState(0);
        const [quantity, setquantity] = useState(0)
        const [formulario, setFormulario] = useState(false);
        const [productoSeleccionado, setproductoSeleccionado] = useState({
            "nombre": "",
            "proveedor": "",
            "nit": "",
            "direccion": "",
            "codigo_producto": "",
            "marca": "",
            "cantidad_total": "",
            "cantidad": 0,
            "descripcion": "",
            "precio_unitario": 0,
            "fecha_abastecimiento": date    
        });

        const [ventaProducto, setventaProducto] = useState({
            "nombreCliente": "", 
            "nit": "",
            "direccion": "",
            "Producto": "",
            "cantidad": "",
            "total":""
        })

        
        const cargarDatos = async() => {
            await axios.get("http://localhost:5001/articulos")
            .then(response => {
                setData(response.data)
            })
        }

        useEffect(() => {
            cargarDatos();
        }, [])

        const cambiarFormulario = function (e) {
            setFormulario(!formulario)
        }
 
        const handleChange = e => {
            const {name, value} = e.target;
            setproductoSeleccionado(prevState => ({
                ...prevState,
                [name]: value,
                "cantidad_total": productoSeleccionado.cantidad
            }));

            console.log(productoSeleccionado)
        }

        const precioProducto = (data) => {

            setprecio(data.props.value.precio_unitario)
            setquantity(data.props.value.cantidad);
            
            console.log(data.props.value.precio_unitario);
        }

        const handleQuantity = e => {
            const { name, value } = e.target;
            if(name === "cantidad"){
                
                const total = value * parseFloat(precio)
                settotal(total)
            }
            setventaProducto(prevState => ({
                ...prevState,
                [name]: value
            }))
            console.log(ventaProducto);
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

        const venta = async() => {
            if(ventaProducto.nombreCliente.length <= 0
                || ventaProducto.nit.length <= 0
                || ventaProducto.direccion.length <= 0
                || ventaProducto.Producto.length <= 0
                || ventaProducto.cantidad.length <= 0){
                alert("No puede haber ninguna casilla vacia!")
            }else{
                if (!validarNIT(ventaProducto.nit)) {
                    alert("Nit no valido!")
                }else{
                    await axios.get("http://localhost:5001/articulos", productoSeleccionado)
                    .then(response => {
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
                    <Link  to={"/"} className="cancelar">Cancelar</Link>
                    <select onChange={cambiarFormulario} className='seleccionarFormulario'>
                        <option value='true'>Venta</option>
                        <option value='false'>Compra</option>
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
                        <TextField className={styles.inputMaterial} onChange={handleChange} name="cantidad" label="Cantidad" type="number"></TextField><br></br>
                        <TextField className={styles.inputMaterial} onChange={handleChange} name="precio_unitario" label="Precio Unitario" type="number"></TextField><br></br>
                        <div align="right">
                            <Button className="botones" onClick={() => peticionPost()}>Insertar</Button>
                        </div>
                    </div>
                </div>
            )
        }else{
            console.log(data)
            return ( 
                <div className="contenedor">
                    <Link  to={"/"}  className="cancelar">Cancelar</Link>
                    <select onChange={cambiarFormulario} className='seleccionarFormulario'>
                        <option value='true'>Venta</option>
                        <option value='false'>Compra</option>
                    </select>
                    <div className={styles.modal}>
                        <h3>Venta de Producto</h3>
                        <TextField className={styles.inputMaterial} onChange={handleQuantity} name="nombreCliente" label="Cliente" required></TextField>
                        <TextField className={styles.inputMaterial} onChange={handleQuantity} name="nit" label="Nit" required></TextField>
                        <TextField className={styles.inputMaterial} onChange={handleQuantity} name="direccion" label="Dirección" required></TextField>

                        <TextField onChange={(event, rowData) => precioProducto(rowData) } select className={styles.inputMaterial} label="Produtcto" >
                            {data.map(
                                (dato) => (
                                    <option name="Producto" key={dato.id} value={dato}>{dato.nombre}</option>
                                )
                            )

                            }
                        </TextField>
                        <TextField className={styles.inputMaterial} type="number" inputProps={{ min: 0, max: parseInt(quantity) }} onChange={handleQuantity} name="cantidad" label="Cantidad" required></TextField>
                        <TextField className={styles.inputMaterial} name="total" onChange={handleQuantity} value={total} disabled>{total}</TextField>
                        <div align="right">
                            <Button color="primary" onClick={() => venta()}>Vender</Button>
                        </div>
                    </div>
                </div>
             );
        }

    
}
 
export default Transaccion;