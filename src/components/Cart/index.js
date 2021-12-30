import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ADD_TO_CART, UPDATE_CART, REMOVE_FROM_CART } from "../../consts";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";
import { Error } from "../Error";
import _isEmpty from "lodash/isEmpty";
import axios from "axios";

const formatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

export const Cart = () => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state);
  const [totalCart, setTotalCart] = useState(0);
  const [productos, setProductos] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    const total = Object.values(cart).reduce((acc, curr) => {
      return curr.price * curr.quantity + acc;
    }, 0);
    setTotalCart(total);
  }, [cart]);

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const { data: products } = await axios.get(
          "http://localhost:4242/products"
        );
        const { data: prices } = await axios.get(
          "http://localhost:4242/prices"
        );
        const updatedPrices = prices.data.reduce(
          (a, v) => ({ ...a, [v.product]: v.unit_amount / 100 }),
          {}
        );
        const newProducts = products.data.map((p) => ({
          ...p,
          price: updatedPrices[p.id],
        }));
        setProductos(newProducts);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    loadCatalog();
  }, []);

  return (
    <Fragment>
      <div className="container">
        {isLoading && <Loader />}
        {!isLoading && isError && (
          <Error
            message={
              " Hubo un error al cargar el catálogo, intenta de nuevo más tarde."
            }
          />
        )}
        {!isLoading && productos.length > 0 && !isError && (
          <div className="columns">
            <div className="column is-two-thirds">
              <h1 className="title">Clinkin marketplace</h1>
              <p>
                En Clinkin te ayudamos a identificar cuáles son las carreras
                profesionales en las que, dadas tus destrezas, habilidades,
                inclinaciones y gustos, podrás tener mayor éxito tanto en el
                ámbito académico como profesional.
              </p>
              <h3 className="subtitle">Productos</h3>
              <div className="columns">
                {productos.map((p) => {
                  return (
                    <div className="column" key={p.id}>
                      <div className="card">
                        <div className="card-image">
                          <figure className="image is-4by3">
                            <img src={p.images[0]} alt={p.name} />
                          </figure>
                        </div>
                        <div className="card-content">
                          <div className="content">{p.name}</div>
                          <div className="content is-flex is-justify-content-space-between">
                            {formatter.format(p.price)}
                            <button
                              className="pull-right button is-primary"
                              onClick={() => {
                                dispatch({
                                  type: ADD_TO_CART,
                                  payload: p,
                                });
                              }}
                            >
                              Agregar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="column">
              {_isEmpty(cart) && (
                <div className="card">
                  <div className="card-content">
                    <div className="content">Carrito Vacio</div>
                  </div>
                </div>
              )}
              {!_isEmpty(cart) && (
                <Fragment>
                  <h3 className="title">Carrito</h3>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Precio Unitario</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.values(cart).map((p) => {
                        const precioTotalProducto = p.quantity * p.price;
                        return (
                          <tr key={`cart-item-${p.id}`}>
                            <td>{p.titulo}</td>
                            <td>{formatter.format(p.price)}</td>
                            <td className="is-flex is-align-items-center">
                              <button
                                className="material-icons has-text-danger button is-ghost"
                                onClick={() => {
                                  dispatch({
                                    type: UPDATE_CART,
                                    payload: {
                                      type: "remove",
                                      ...p,
                                    },
                                  });
                                }}
                              >
                                remove
                              </button>
                              {p.quantity}
                              <button
                                className="material-icons has-text-success button is-ghost"
                                onClick={() => {
                                  dispatch({
                                    type: UPDATE_CART,
                                    payload: {
                                      type: "add",
                                      ...p,
                                    },
                                  });
                                }}
                              >
                                add
                              </button>
                            </td>
                            <td>{formatter.format(precioTotalProducto)}</td>
                            <td>
                              <button
                                className="material-icons has-text-danger button is-ghost"
                                onClick={() => {
                                  dispatch({
                                    type: REMOVE_FROM_CART,
                                    payload: p.id,
                                  });
                                }}
                              >
                                delete_outline
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={3}>Total:</td>
                        <td>{formatter.format(totalCart)}</td>
                        <td>
                          <button
                            className="button is-small is-primary is-rounded"
                            onClick={() => navigate("pago")}
                          >
                            Pagar
                          </button>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </Fragment>
              )}
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
};
