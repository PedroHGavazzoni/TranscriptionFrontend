import VoiceRecorder from "@/components/voice-recorder";

export default function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-center p-4">
      <VoiceRecorder />
    </div>
  );
}
