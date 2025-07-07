import React, { useState } from "react";
import axios from "axios";

const AssignCoins = () => {
  const [studentId, setStudentId] = useState("");
  const [grade, setGrade] = useState("");

  const handleAssignCoins = async () => {
    try {
      await axios.post("http://localhost:5000/api/students/assign-coins", {
        studentId,
        grade,
      });
      alert("Monedas asignadas con éxito");
      setStudentId("");
      setGrade("");
    } catch (error) {
      alert("Error al asignar monedas");
    }
  };

  return (
    <div className="mb-4">
      <h3 className="text-xl font-semibold">Asignar Examcoins</h3>
      <input
        className="border border-gray-300 p-2 rounded mr-2"
        type="text"
        placeholder="ID del Estudiante"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
      />
      <input
        className="border border-gray-300 p-2 rounded mr-2"
        type="number"
        placeholder="Calificación"
        value={grade}
        onChange={(e) => setGrade(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white p-2 rounded"
        onClick={handleAssignCoins}
      >
        Asignar Monedas
      </button>
    </div>
  );
};

export default AssignCoins;
