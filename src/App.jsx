import React, { useEffect, useState } from "react";
import { firebase } from "./firebase";

function App() {
  const [tareas, setTareas] = useState([]);
  const [tarea, setTarea] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [id, setId] = useState("");

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const db = firebase.firestore();
        const data = await db.collection("tareas").get();
        const arrayData = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTareas(arrayData);
      } catch (error) {
        console.log(error);
      }
    };

    obtenerDatos();
  }, []);

  const agregar = async (e) => {
    e.preventDefault();

    if (!tarea.trim()) {
      console.log("Esta vacío");
      return;
    }

    try {
      const db = firebase.firestore();
      const nuevaTarea = {
        name: tarea,
        fecha: Date.now(),
      };
      const data = await db.collection("tareas").add(nuevaTarea);
      setTareas([...tareas, { ...nuevaTarea, id: data.id }]);
      setTarea("");
    } catch (error) {
      console.log(error);
    }

    console.log(tarea);
  };

  const eliminar = async (id) => {
    try {
      const db = firebase.firestore();
      db.collection("tareas").doc(id).delete();
      const arrayFiltrado = tareas.filter((item) => item.id !== id);
      setTareas(arrayFiltrado);
    } catch (error) {
      console.log(error);
    }
  };

  const activarEdicion = (item) => {
    setModoEdicion(true);
    setTarea(item.name);
    setId(item.id);
  };

  const editar = async (e) => {
    e.preventDefault();
    if (!tarea.trim()) {
      console.log("log editar: campo vacio");
      return;
    }

    try {
      const db = firebase.firestore();
      await db.collection("tareas").doc(id).update({
        name: tarea,
      });
      const arrayEditado = tareas.map((item) =>
        item.id === id ? { id: item.id, fecha: item.fecha, name: tarea } : item
      );
      setTareas(arrayEditado);
      setModoEdicion(false);
      setTarea("");
      setId("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-3">
      <div className="row">
        <h3>{modoEdicion ? "Editar" : "Agregar una nueva tarea"}</h3>
        <form onSubmit={modoEdicion ? editar : agregar}>
          <input
            type="text"
            placeholder="Ingrese una tarea"
            className="form-control mb-2"
            onChange={(e) => setTarea(e.target.value)}
            value={tarea}
          />

          <div className="d-grid gap-2">
            <button
              className={modoEdicion ? "btn btn-primary" : "btn btn-success"}
            >
              {modoEdicion ? "Editar" : "Agregar"}
            </button>
          </div>
        </form>

        <h3>Lista de Tareas</h3>

        <div className="col-12 mt-3">
          <ul className="list-group">
            {tareas.map((item) => (
              <li className="list-group-item" key={item.id}>
                {item.name}
                <button
                  className="btn btn-danger btn-sm float-end ms-3 "
                  onClick={() => eliminar(item.id)}
                >
                  Eliminar
                </button>
                <button
                  className="btn btn-warning btn-sm  float-end"
                  onClick={() => activarEdicion(item)}
                >
                  Editar
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
