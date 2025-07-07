import React, { useState } from "react";
import axios from "axios";

const AddStudent = () => {
  const [name, setName] = useState("");

  const addStudent = async () => {
    try {
      await axios.post("http://localhost:5000/api/students/add", { name });
      alert("Estudiante agregado con éxito");
      setName("");
    } catch (error) {
      alert("Error al agregar estudiante");
    }
  };

  return (
    <div className="mb-4">
      <h3 className="text-xl font-semibold">Agregar Estudiante</h3>
      <input
        className="border border-gray-300 p-2 rounded mr-2"
        type="text"
        placeholder="Nombre del Estudiante"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white p-2 rounded"
        onClick={addStudent}
      >
        Agregar Estudiante
      </button>
    </div>
  );
};

export default AddStudent;
