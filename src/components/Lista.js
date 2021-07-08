import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table';
import { Modal, TextField, Button  } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import axios from 'axios';
import validarNIT from 'validar-nit-gt'


const useStyle = makeStyles((theme) => ({
    modal: {
        position: 'absolute',
        width: 300,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 3, 4),
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    iconos: {
        cursor: 'pointer'
    },
    inputMaterial: {
        width: '100%'
    }
}))



function Lista() {
    const styles = useStyle();
    const [data, setData] = useState([]);
    const [insertar, setInsertar] = useState(false);
    const [mostrarDatos, setmostrarDatos] = useState([]);
    const [modalDatos, setmodalDatos] = useState(false);

    var today = new Date(),
    date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
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

    const handleChange = e => {
        const {name, value} = e.target;
        setproductoSeleccionado(prevState => ({
            ...prevState,
            [name]: value
        }));
        console.log(productoSeleccionado)
    }

    const cargarDatos = async() => {
        await axios.get("http://localhost:5001/articulos")
        .then(response => {
            setData(response.data)
        })
    }


    const datosProducto = (datos) => {
        setmostrarDatos(datos)
        abrirCerrarModalDatos();        
    }


    const peticionPost = async() => {
        await axios.post("http://localhost:5001/articulos", productoSeleccionado)
        .then(response => {
            if(response.data.nombre.length <= 0
            || response.data.proveedor.length <= 0
            || response.data.nit.length <= 0
            || response.data.direccion.length <= 0
            || response.data.codigo_producto.length <= 0
            || response.data.marca.length <= 0
            || response.data.cantidad.length <= 0
            || response.data.descripcion.length <= 0
            || response.data.precio_unitario.length <= 0
            || response.data.fecha_abastecimiento.length <= 0){
                    alert("No puede haber ninguna casilla vacia!")
            }else{
                if (!validarNIT(response.data.nit)) {
                    alert("Nit no valido!")
                }else{
                    setData(data.concat(response.data));
                    abrirCerrarModalInsertar();
                }
            }
            
        })
    }

    const abrirCerrarModalInsertar = () => {
        setInsertar(!insertar);
    }

    const abrirCerrarModalDatos = () => {
        setmodalDatos(!modalDatos);
    }


    useEffect(() => {
        cargarDatos();
    }, [])

    const agregarCompra = (
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
                <Button onClick={() => abrirCerrarModalInsertar()} color="primary">Cancelar</Button>
            </div>
        </div>
    )

    const mostrarDatosProductos = (
        <div className={styles.modal}>
            <h2>Producto</h2>
            <p>Nombre del Produto: {mostrarDatos.nombre}</p>
            <p>Descripción: {mostrarDatos.descripcion}</p>
            <p>Codigo: {mostrarDatos.codigo_producto}</p>
            <p>Precio Unitario: {mostrarDatos.precio_unitario}</p>
            <p>Cantidad: {mostrarDatos.cantidad_total}</p>
            <p>Fecha de abastecimiento: {mostrarDatos.fecha_abastecimiento}</p>
            <p>Cantidad adquirida en el último abastecimiento: {mostrarDatos.cantidad}</p>
            <div align="right">
                <Button onClick={() => abrirCerrarModalDatos()} color="primary">Cancelar</Button>
            </div>
        </div>
    )


    // const{datosCargado, productos} = this.state
    const columnas = [
        {
            title: "Nombre",
            field: "nombre"
        },
        {
            title: "Codigo",
            field: "codigo_producto"
        },
        {
            title: "Categoria",
            field: "categoria"
        }
    ]
    const totalCantidadProductos = data.reduce((sum, value) => ( sum + parseInt(value.cantidad) ), 0);
    const totalPrecio = data.reduce((sum, value) => ( sum + parseInt(value.precio_unitario) ), 0);
    const promedio = (totalPrecio / totalCantidadProductos).toFixed(2)
    return (
        <div className="contenedor">
            <p>Cantidad de Juguetes Totales: {totalCantidadProductos}</p>
            <p>Total: Q.{totalPrecio}</p>
            <p>Promedio de precio unitario: Q.{promedio}</p>
            <Button onClick={() => abrirCerrarModalInsertar()} className='botones'>Transaccion</Button>
            <MaterialTable
                columns={columnas}
                data={data}
                title = "Productos"
                actions = {[
                    {
                        icon: 'search',
                        tooltip: 'Mostrar',
                        onClick: (event, rowData) => datosProducto(rowData)
                    }
                ]}
                options = {{
                    actionsColumnIndex: -1,
                    paging: false
                }}
            />

            <Modal
                open={insertar}
                onClose={abrirCerrarModalInsertar}
            >
                {agregarCompra}
            </Modal>

            <Modal
                open={modalDatos}
                onClose={abrirCerrarModalDatos}
            >
                {mostrarDatosProductos}
            </Modal>
        </div>
    )
}
 
export default Lista;