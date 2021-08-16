import React, { useEffect, useState } from "react";
import { firebase } from "./firebase";

function App() {
  const [tareas, setTareas] = useState([]);
  const [tarea, setTarea] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);

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
      return
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

  return (
    <div className="container mt-3">
      <div className="row">
        <h3>{modoEdicion ? "Editar" : "Nueva tarea"}</h3>
        <form onSubmit={agregar}>
          <input
            type="text"
            placeholder="Ingrese una tarea"
            className="form-control mb-2"
            onChange={(e) => setTarea(e.target.value)}
            value={tarea}
          />

          <div className="d-grid gap-2">
            <button className={ modoEdicion ? "btn btn-primary" : "btn btn-success"}>
              {
              modoEdicion ? 'Editar': "Agregar"
            } 
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
                <button className="btn btn-warning btn-sm  float-end">
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
