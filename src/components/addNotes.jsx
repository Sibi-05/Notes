import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Toaster } from "./Toaster";
import { MoveLeft,Mic } from "lucide-react";
import Loader from "./Loader";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const AddNotes = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const editingNote = location.state?.note || null;
  const isEdit = location.state?.isEdit || false;

  const [color, setColor] = useState(editingNote?.color || "bg-white");
  const [title, setTitle] = useState(editingNote?.title || "");
  const [content, setContent] = useState(editingNote?.content || "");
  const [isPrivate, setIsPrivate] = useState(editingNote?.isPrivate || false);
  const [passcode, setPasscode] = useState(editingNote?.passcode || "");

  const [isListening, setIsListening] = useState(false);

  const handleCancel = () => navigate("/");

  const handleSave = () => {
    const existingNotes = JSON.parse(localStorage.getItem("notes")) || [];

    const newOrUpdatedNote = {
      id: isEdit ? editingNote.id : Date.now(),
      title,
      content,
      color,
      isPrivate,
      passcode: isPrivate ? passcode : "",
    };

    if (isEdit) {
      const updatedNotes = existingNotes.map((note) =>
        note.id === editingNote.id ? newOrUpdatedNote : note
      );
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
      Toaster("success", "Note Updated successfully!");
    } else {
      existingNotes.push(newOrUpdatedNote);
      localStorage.setItem("notes", JSON.stringify(existingNotes));
      Toaster("success", "Note Added successfully!");
    }

    navigate("/");
  };

  const handleColorChange = (e) => setColor(e.target.value);

  const startListening = () => {
    if (!SpeechRecognition) {
      Toaster("error", "Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setContent((prev) => prev + " " + transcript);
    };

    recognition.start();
  };
  return (
    <div className="min-h-screen bg-amber-50 py-10 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-6 px-4">
        <div>
          <label className="block text-lg font-semibold mb-2 text-gray-700">
            Enter the Title:
          </label>
          <input
            type="text"
            placeholder="My Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border-2 p-3 rounded-2xl shadow-sm focus:outline-none text-gray-800"
          />
        </div>

        <div>
          <textarea
            placeholder="Write your note here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`w-full border-2 font-sugar h-[450px] resize-none p-4 text-base rounded-xl shadow-sm focus:outline-none ${color}`}
          />
          <div className="flex items-center justify-end gap-2 mt-2 ">
            <button
              type="button"
              onClick={startListening}
              className={`flex font-bold items-center gap-2 px-3 py-1 border-2 cursor-pointer bg-gradient-to-r from-indigo-500 via-purple-400 to-pink-400 rounded-full text-sm transition ${
                isListening ? "bg-transparent" : "hover:scale-105"
              }`}
            >
              {isListening ? <Loader /> : <><Mic size={20}/><h className="scale-180">✨</h></>}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-center">
          {[
            { color: "bg-white", title: "White" },
            { color: "bg-pink-200", title: "Pink" },
            { color: "bg-green-200", title: "Green" },
            { color: "bg-orange-200", title: "Orange" },
            { color: "bg-yellow-200", title: "Yellow" },
            { color: "bg-blue-200", title: "Blue" },
            { color: "bg-violet-200", title: "Violet" },
          ].map(({ color, title }) => (
            <button
              key={color}
              value={color}
              onClick={handleColorChange}
              title={title}
              className={`${color} border-2 w-10 h-10 rounded-full hover:ring-2 hover:ring-offset-2 hover:scale-110 transition-all duration-200`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            id="private"
            checked={isPrivate}
            onChange={() => setIsPrivate(!isPrivate)}
            className="w-4 h-4 accent-black scale-120"
          />
          <label htmlFor="private" className="text-md text-gray-700 font-medium">
            Make this note private
          </label>
        </div>

        {isPrivate && (
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Set Passcode:
            </label>
            <input
              type="password"
              placeholder="Enter passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full border-2 p-2 pl-4 rounded-xl focus:outline-none"
            />
          </div>
        )}

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={handleCancel}
            className="flex w-20 items-center justify-center gap-2 px-4 py-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition rounded-full shadow-sm cursor-pointer"
          >
            <MoveLeft />
          </button>
          <button
            onClick={handleSave}
            className="flex w-20 items-center justify-center gap-2 px-4 py-2 border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition rounded-full shadow-sm cursor-pointer"
          >
            {isEdit ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNotes;
