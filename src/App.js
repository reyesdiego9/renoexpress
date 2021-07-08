import Logo from './img/logo.svg';
import Lista from './components/Lista';
import Transaccion from './components/Transaccion';
import { Route, BrowserRouter as Router } from "react-router-dom";
import { Link } from "react-router-dom";
import estilos from './style/style.scss';


function App() {
  return (
    <Router>
      {/* <Route exact path='/' component={ Lista }></Route> */}
      <nav className="navbar">
        <div className="navbar__container">
          <img src={ Logo } className="logo"></img>
          <Link to={"/"} className="inicio">
            <h1>Renoexpress</h1>
          </Link>
          
          {/* <Link to={"/"}>Sistema</Link>
          <Link to={"/compra"}>Compra</Link>
          <Link to={"/venta"}>Ventas</Link> */}
        </div>
      </nav>
      <Route exact path='/' component={ Lista }></Route>
      <Route exact path='/transaccion' component={ Transaccion }></Route>
    
    </Router>
  );
}

export default App;
