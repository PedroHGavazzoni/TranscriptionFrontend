"use client";
import { useEffect, useState } from "react";

export default function Page() {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`http://localhost:3000/audio`);
      const json = await res.json();
      console.log(json);
      setDados(json);
    };

    fetchData();
  }, []);

  return (
    <div className="p-10 text-white">
      <h1>Últimas transcrições</h1>
      {dados.map((item, index) => (
        <pre key={index}>{JSON.stringify(item, null, 2)}</pre>
      ))}
      {dados.length === 0 && <p>Carregando dados...</p>}
    </div>
  );
}
