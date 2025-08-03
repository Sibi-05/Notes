import Searcher from './Search';
import { NotebookPen} from "lucide-react";

const Header = ({ searchQuery, setSearchQuery }) => {
  return (
    <header className="w-full bg-amber-900 py-4 shadow-md">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center  justify-center gap-5">
        <h1 className="flex text-4xl font-bold text-white "> <NotebookPen  size={40}/> Notes</h1>
        <Searcher searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>
    </header>
  );
};

export default Header;
