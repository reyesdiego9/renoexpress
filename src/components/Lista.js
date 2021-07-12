import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import { Modal, Button  } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'
import { Link } from "react-router-dom"


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
    const [mostrarDatos, setmostrarDatos] = useState([]);
    const [modalDatos, setmodalDatos] = useState(false);



    const cargarDatos = async() => {
        let url = "http://localhost:5001/articulos"
        const api = new XMLHttpRequest()
        
        api.open('GET', url, true)
        api.send();

        api.onreadystatechange =  await function() {
            if(this.status === 200 && this.readyState === 4){
                setData(JSON.parse(this.responseText))
            }
        }
    }

    useEffect(() => {
        cargarDatos();
    }, [])

    const datosProducto = (datos) => {
        setmostrarDatos(datos)
        abrirCerrarModalDatos();        
    }



    const abrirCerrarModalDatos = () => {
        setmodalDatos(!modalDatos);
    }




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
            <Link to={{
                pathname:  "/transaccion"
            }} className='botones'>transaccion</Link>
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
                open={modalDatos}
                onClose={abrirCerrarModalDatos}
            >
                {mostrarDatosProductos}
            </Modal>
        </div>
    )
}
 
export default Lista;