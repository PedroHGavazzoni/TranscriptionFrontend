"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function AudioPage() {
  const { id } = useParams(); // ← destrutura e captura o ID da URL
  const [dados, setDados] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`http://localhost:3000/audio/${id}`);
      const json = await res.json();
      setDados(json);
    };

    if (id) fetchData();
  }, [id]);

  return (
    <div className="p-10 text-white">
      <h1>Áudio ID: {id}</h1>
      {dados ? (
        <pre>{JSON.stringify(dados, null, 2)}</pre>
      ) : (
        <p>Carregando dados...</p>
      )}
    </div>
  );
}
