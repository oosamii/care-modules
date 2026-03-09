// DoctorVoiceNoteModal.jsx
import React, { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";

const DoctorVoiceNoteModal = ({ onClose, onTranscriptChange }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser doesn’t support Speech Recognition. Try Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onresult = (event) => {
      const text = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setTranscript(text);
      onTranscriptChange(text);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [onTranscriptChange]);

  const startListening = () => {
    recognitionRef.current?.start();
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const handleClose = () => {
    stopListening();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          🎙️ Add Doctor Voice Note
        </h2>

        <textarea
          rows="6"
          value={transcript}
          readOnly
          className="w-full border rounded-md p-3 text-sm mb-4"
          placeholder="Speak now... your words will appear here."
        />

        <div className="flex justify-center gap-4">
          {!isListening ? (
            <button
              onClick={startListening}
              className="bg-[#2FAAA1] text-white px-5 py-2 rounded-md text-sm"
            >
              Start Listening 🎤
            </button>
          ) : (
            <button
              onClick={stopListening}
              className="bg-red-500 text-white px-5 py-2 rounded-md text-sm"
            >
              Stop Listening ⏹️
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorVoiceNoteModal;
