import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table';
import { Modal, TextField, Button, Input  } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import axios from 'axios';


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
            setData(data.concat(response.data));
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
            <TextField className={styles.inputMaterial} onChange={handleChange} name="nombre" placeholder="Nombre"></TextField>
            <TextField className={styles.inputMaterial} onChange={handleChange} name="proveedor" placeholder="Proveedor"></TextField>
            <TextField className={styles.inputMaterial} onChange={handleChange} name="nit" placeholder="Nit"></TextField>
            <TextField className={styles.inputMaterial} onChange={handleChange} name="direccion" placeholder="Dirección"></TextField>
            <TextField className={styles.inputMaterial} onChange={handleChange} name="categoria" placeholder="Categoria"></TextField>
            <TextField className={styles.inputMaterial} onChange={handleChange} name="codigo_producto" placeholder="Codigo del Producto"></TextField>
            <TextField className={styles.inputMaterial} onChange={handleChange} name="marca" placeholder="Marca"></TextField><br></br>
            <TextField className={styles.inputMaterial} onChange={handleChange} name="descripcion" placeholder="Descripción"></TextField><br></br>
            <Input className={styles.inputMaterial} onChange={handleChange} name="cantidad" placeholder="Cantidad" type="number"></Input><br></br>
            <Input className={styles.inputMaterial} onChange={handleChange} name="precio_unitario" placeholder="Precio Unitario" type="number"></Input><br></br>
            <div align="right">
                <Button color="primary" onClick={() => peticionPost()}>Insertar</Button>
                <Button onClick={() => abrirCerrarModalInsertar()} color="primary">Cancelar</Button>
            </div>
        </div>
    )

    const mostrarDatosProductos = (
        <div className={styles.modal}>
            <h2>Producto</h2>
            <p>{mostrarDatos.nombre}</p>
            <p>{mostrarDatos.descripcion}</p>
            <p>{mostrarDatos.codigo_producto}</p>
            <p>{mostrarDatos.precio_unitario}</p>
            <p>{mostrarDatos.cantidad_total}</p>
            <p>{mostrarDatos.fecha_abastecimiento}</p>
            <p>{mostrarDatos.cantidad}</p>
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

    return (
        <div className="contenedor">
            <Button onClick={() => abrirCerrarModalInsertar()} className='botones'>Transaccion</Button>
            {/* <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Código</th>
                        <th>Categoría</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map(
                        (producto) => {
                            <tr key={producto.id}>
                                <td>producto.nombre</td>
                                <td>producto.codigo_producto</td>
                                <td>producto.categoria</td>
                            </tr>
                        }
                    )}
                </tbody>
            </table> */}
            <MaterialTable
                columns={columnas}
                data={data}
                actions = {[
                    {
                        icon: 'search',
                        tooltip: 'Mostrar',
                        onClick: (event, rowData) => datosProducto(rowData)
                    }
                ]}
                options = {{
                    actionsColumnIndex: -1
                }}
            ></MaterialTable>

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