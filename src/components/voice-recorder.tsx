"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

export default function VoiceRecorder() {
  const route = useRouter();
  const [id, setId] = useState("");
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    audioChunks.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.current.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.webm");

      console.log("Audio Blob:", formData);
      try {
        const res = await fetch("http://localhost:3000/audio/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error(`Erro na resposta do servidor: ${res.status}`);
        }

        const data = await res.json();
        setId(data.id);
        setTranscript(data.transcript);
        setResponse(data.reply);
      } catch (error: unknown) {
        setError(`Erro ao processar o áudio ou transcrição: ${error}`);
      }
    };

    mediaRecorder.start();
    setTranscript("");
    setResponse("");
    setTimeout(() => mediaRecorder.stop(), 5000); //grava por 5 segundos);
  };

  return (
    <div className="flex flex-col p-12 bg-black rounded-lg border-amber-100 border-[0.05px] gap-4">
      <h1 className="font-bold text-2xl text-white">
        Assistente de voz com OpenAI
      </h1>

      <div className="bg-cyan-300 p-4">
        <h3>Transcrição:</h3>
        <p>{transcript}</p>
        <h3>Resposta:</h3>
        <p>{response}</p>
        <p>{error}</p>
      </div>

      <div className="flex w-full pl-4 min-h-10 bg-amber-200 items-center justify-start">
        {transcript && (
          <ul>
            <li>
              <Link
                className="text-blue-700"
                href={`/audio/${id}`}
              >{`http://localhost:3001/audio/${id}`}</Link>
            </li>
          </ul>
        )}
      </div>

      <div className="flex flex-col gap-2 pt-4">
        <button
          onClick={startRecording}
          className="bg-emerald-600 text-white px-4 py-2 rounded"
        >
          Iniciar Gravação
        </button>
      </div>
      <div className="flex flex-col gap-2 pt-4">
        <button
          onClick={() => route.push("/audio")}
          className="bg-sky-500 text-white px-4 py-2 rounded"
        >
          Buscar todas transcriçoes
        </button>
      </div>
    </div>
  );
}
