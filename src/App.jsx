import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import AddNotes from "./components/addNotes";
import { Plus, Trash2, SquarePen, X, Lock , Pin, PinOff } from "lucide-react";
import "./index.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Toaster } from "./components/Toaster";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [pendingNote, setPendingNote] = useState(null);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const isOnAddPage = location.pathname === "/add";

  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    setNotes(storedNotes);
  }, [location]);

const filteredNotes = notes
  .filter(note => {
    if (searchQuery.trim()) {
      const titleMatch = note.title.toLowerCase().includes(searchQuery.trim().toLowerCase());
      if (note.isPrivate) {
        return titleMatch;
      }
      return (
        titleMatch ||
        note.content.toLowerCase().includes(searchQuery.trim().toLowerCase())
      );
    }
    return true;
  })
  .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));



  const handleDelete = (idToDelete) => {
    const updatedNotes = notes.filter((note) => note.id !== idToDelete);
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  const handleTogglePin = (e, id) => {
  e.stopPropagation();
  const updatedNotes = notes.map((note) =>
    note.id === id ? { ...note, isPinned: !note.isPinned } : note
  );
  setNotes(updatedNotes);
  localStorage.setItem("notes", JSON.stringify(updatedNotes));

  if (selectedNote && selectedNote.id === id) {
    const updatedSelected = updatedNotes.find((note) => note.id === id);
    setSelectedNote(updatedSelected);
  }
};


  const handleNoteClick = (note) => {
    if (note.isPrivate) {
      setPendingNote(note);
      setPasscodeInput("");
      setShowPasscodeModal(true);
      setError("");
    } else {
      setSelectedNote(note);
      setIsModalOpen(true);
    }
  };

  const NoteCard = ({
  note,
  onClick,
  onDelete,
  onPinToggle,
  navigate,
  setPasscodeInput,
  setPendingNote,
  setShowPasscodeModal,
  setError,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative p-6 rounded-xl min-h-[23vh] shadow-lg border-2 ${note.color} text-gray-800 cursor-pointer hover:scale-[1.02] transition-transform duration-200 overflow-hidden`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (note.isPrivate) {
            setPendingNote({ ...note, forDelete: true });
            setPasscodeInput("");
            setShowPasscodeModal(true);
            setError("");
          } else {
            onDelete(note.id);
            Toaster("error", "Note Deleted successfully!");
          }
        }}
        className="absolute top-2 right-2 text-red-400 hover:text-red-600 hover:scale-125 cursor-pointer"
      >
        <Trash2 size={20} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          if (note.isPrivate) {
            setPendingNote({ ...note, forEdit: true });
            setPasscodeInput("");
            setShowPasscodeModal(true);
            setError("");
          } else {
            navigate("/add", { state: { note, isEdit: true } });
          }
        }}
        className="absolute top-2 right-10 text-gray-700 hover:text-gray-900 hover:scale-125 cursor-pointer"
      >
        <SquarePen size={20} />
      </button>

      <button
        onClick={(e) => onPinToggle(e, note.id)}
        className={note.isPinned ? "absolute top-2 left-3 text-black hover:text-black cursor-pointer hover:scale-125": "absolute top-2 right-17 text-black hover:text-black cursor-pointer hover:scale-125"}
      >
        {note.isPinned ? <Pin size={22} /> : <PinOff size={22} />}
      </button>

      <h2 className="text-xl font-bold mt-3 mb-2 truncate">{note.title}</h2>

      {note.isPrivate ? (
        <p className="flex text-red-600 justify-center items-center mt-7">
          <Lock size={40} />
        </p>
      ) : (
        <p className="text-base whitespace-pre-wrap line-clamp-5">{note.content}</p>
      )}

      <div className="absolute bottom-2 right-3 text-sm text-gray-600">
        {getTimeAgo(note.id)}
      </div>
    </div>
  );
};


const getTimeAgo = (timestamp) => {
  const now = Date.now();

  const diff = Math.floor((now - timestamp) / 1000);

  if (diff < 60) return `${diff} second${diff === 1 ? '' : 's'} ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minute${Math.floor(diff / 60) === 1 ? '' : 's'} ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) === 1 ? '' : 's'} ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) === 1 ? '' : 's'} ago`;
  if (diff < 2629800) return `${Math.floor(diff / 604800)} week${Math.floor(diff / 604800) === 1 ? '' : 's'} ago`;
  if (diff < 31557600) return `${Math.floor(diff / 2629800)} month${Math.floor(diff / 2629800) === 1 ? '' : 's'} ago`;

  return `${Math.floor(diff / 31557600)} year${Math.floor(diff / 31557600) === 1 ? '' : 's'} ago`;
};


  return (
    <div className="min-h-screen bg-amber-50 mb-5">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {!isOnAddPage && (
        <div className="px-6 mt-10">
          <button
            onClick={() => navigate("/add")}
            className="flex items-center gap-2 px-4 py-2 border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition rounded-full shadow-sm cursor-pointer hover:scale-105"
          >
            <Plus size={18} /> Add
          </button>
          {filteredNotes.length === 0 ? (
  <p className="text-gray-500 text-center mt-10">No notes found.</p>
) : (
  <>
    {filteredNotes.some((note) => note.isPinned) && (
      <>
        <h2 className="text-xl font-semibold mt-10 mb-4 text-gray-800">Pinned Notes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNotes
            .filter((note) => note.isPinned)
            .map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onClick={() => handleNoteClick(note)}
                onDelete={handleDelete}
                onPinToggle={handleTogglePin}
                navigate={navigate}
                setPasscodeInput={setPasscodeInput}
                setPendingNote={setPendingNote}
                setShowPasscodeModal={setShowPasscodeModal}
                setError={setError}
              />
            ))}
        </div>
      </>
    )}

    {filteredNotes.some((note) => !note.isPinned) && (
      <>
        <h2 className="text-xl font-semibold mt-10 mb-4 text-gray-800">Other Notes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 min-h-[23vh] md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNotes
            .filter((note) => !note.isPinned)
            .map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onClick={() => handleNoteClick(note)}
                onDelete={handleDelete}
                onPinToggle={handleTogglePin}
                navigate={navigate}
                setPasscodeInput={setPasscodeInput}
                setPendingNote={setPendingNote}
                setShowPasscodeModal={setShowPasscodeModal}
                setError={setError}
              />
            ))}
        </div>
      </>
    )}
  </>
)}

        </div>
      )}

      {showPasscodeModal && pendingNote && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-sm w-full relative">
            <h2 className="text-xl font-bold mb-4">Enter Passcode</h2>
            <input
              type="password"
              className="w-full border-2 p-3 rounded-3xl mb-4 focus:outline-none"
              placeholder="Passcode"
              value={passcodeInput}
              onChange={(e) => setPasscodeInput(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <div className="flex justify-end gap-3">
  <button
    onClick={() => {
      setShowPasscodeModal(false);
      setPendingNote(null);
    }}
    className="w-23 px-4 py-2 border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition rounded-full cursor-pointer"
  >
    Cancel
  </button>

  <button
    onClick={() => {
      if (passcodeInput === pendingNote.passcode) {
        setShowPasscodeModal(false);

        if (pendingNote.forEdit) {
          navigate("/add", {
            state: { note: pendingNote, isEdit: true },
          });
        } else if (pendingNote.forDelete) {
          handleDelete(pendingNote.id);
          Toaster("success", "Note Deleted successfully!");
        } else {
          setSelectedNote(pendingNote);
          setIsModalOpen(true);
        }
      } else {
        setError("Incorrect passcode");
        Toaster("error", "Incorrect passcode!");
      }
    }}
    className={`w-20 px-4 py-2 border-2 ${
      pendingNote?.forDelete
        ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
        : "border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
    } transition rounded-full cursor-pointer`}
  >
    {pendingNote?.forDelete ? "Delete" : "Open"}
  </button>
</div>

          </div>
        </div>
      )}

      {/* Note View Modal */}
      {isModalOpen && selectedNote && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
    <div
      className={`relative ${selectedNote.color} max-w-2xl w-full max-h-[90vh] rounded-xl p-6 pr-3 shadow-2xl overflow-y-auto`}
    >
      {/* Close Button */}
      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl cursor-pointer hover:scale-110 transition"
      >
        <X />
      </button>

      {/* Delete Button */}
      <button
        onClick={() => {
            handleDelete(selectedNote.id);
            setIsModalOpen(false);
            Toaster("error", "Note Deleted successfully!");
        }}
        className="absolute top-3 right-14 text-red-500 hover:text-red-700 cursor-pointer hover:scale-110 transition"
      >
        <Trash2 />
      </button>

      {/* Edit Button */}
      <button
        onClick={() => {
          if (selectedNote.isPrivate) {
            setPendingNote({ ...selectedNote, forEdit: true });
            setPasscodeInput("");
            setShowPasscodeModal(true);
            setError("");
            setIsModalOpen(false);
          } else {
            navigate("/add", { state: { note: selectedNote, isEdit: true } });
            setIsModalOpen(false);
          }
        }}
        className="absolute top-3 right-24 text-gray-700 hover:text-gray-900 cursor-pointer hover:scale-110 transition"
      >
        <SquarePen />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleTogglePin(e, selectedNote.id);
        }}
        className="absolute top-3 left-3 text-black hover:text-black cursor-pointer hover:scale-125 transition"
      >
        {selectedNote.isPinned ? <Pin size={25} /> : <PinOff size={25} />}
      </button>

      <h2 className="text-2xl font-bold mb-4 mt-8">{selectedNote.title}</h2>
      <p className="text-base whitespace-pre-wrap mb-2 pr-2">{selectedNote.content}</p>
      <div className="absolute justify-end right-3 mb-2  text-sm text-gray-600">
        {getTimeAgo(selectedNote.id)}
      </div>
    </div>
  </div>
)}

<ToastContainer
        toastClassName="bg-white border border-gray-300 rounded-xl shadow-md p-4"
        bodyClassName="text-gray-800 text-sm"
        progressClassName="bg-blue-500"
      />
      <Routes>
        <Route path="/add" element={<AddNotes />} />
      </Routes>
    </div>
  );
};

export default App;
