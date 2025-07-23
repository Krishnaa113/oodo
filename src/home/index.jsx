import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/clerk-react';
import RichTextEditor from '@/components/custom/RichTextEditor';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import AnswerSection from '../components/custom/AnswerSection';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const TAGS = ["Recursion", "Array", "Linked List", "DP", "Graph", "Hashing", "Sorting", "Heap", "Trie"];

function Home({ allQuestions, setAllQuestions, currentUser, onAddAnswer, onVote, onDeleteAnswer }) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [expandedIndexes, setExpandedIndexes] = React.useState([]);
  const [showAskModal, setShowAskModal] = React.useState(false);
  const [showAnswerInputs, setShowAnswerInputs] = React.useState({});
  const [filterDropdown, setFilterDropdown] = React.useState(false);
  const [filterTag, setFilterTag] = React.useState(null);
  const [filterMode, setFilterMode] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  useEffect(() => {
    const handleClickOutside = (event) => {
      const filterEl = document.getElementById("filter-menu");
      if (filterEl && !filterEl.contains(event.target)) {
        setFilterDropdown(false);
      }
    };
    if (filterDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [filterDropdown]);

  const [newQuestion, setNewQuestion] = React.useState({
    title: '',
    description: '',
    tags: [],
    user: currentUser || "Guest",
  });

  const questionsPerPage = 6;
  const filtered = allQuestions
    .filter(q => !filterTag || q.tags.includes(filterTag))
    .filter(q => filterMode !== "unanswered" || q.answers.length === 0)
    .filter(q => !searchQuery || q.title.toLowerCase().includes(searchQuery.toLowerCase()) || q.description.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => filterMode === "newest" ? b.id.localeCompare(a.id) : 0);

  const totalPages = Math.ceil(filtered.length / questionsPerPage);
  const paginated = filtered.slice((currentPage - 1) * questionsPerPage, currentPage * questionsPerPage);

  const handleSubmitQuestion = () => {
    const { title, description, tags } = newQuestion;
    if (!title.trim() || !description.trim() || tags.length === 0) return alert("Fill all fields");
    const newQ = { ...newQuestion, id: uuidv4(), answers: [], user: currentUser || "Guest" };
    setAllQuestions([newQ, ...allQuestions]);
    setNewQuestion({ title: '', description: '', tags: [], user: currentUser || "Guest" });
    setShowAskModal(false);
    setCurrentPage(1);
  };

  const getTagColor = (tag) => {
    const colors = {
      "Recursion": "bg-purple-100 text-purple-800 border-purple-200",
      "Array": "bg-blue-100 text-blue-800 border-blue-200",
      "Linked List": "bg-green-100 text-green-800 border-green-200",
      "DP": "bg-red-100 text-red-800 border-red-200",
      "Graph": "bg-indigo-100 text-indigo-800 border-indigo-200",
      "Hashing": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Sorting": "bg-pink-100 text-pink-800 border-pink-200",
      "Heap": "bg-orange-100 text-orange-800 border-orange-200",
      "Trie": "bg-teal-100 text-teal-800 border-teal-200"
    };
    return colors[tag] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            StackIt Community
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ask questions, share knowledge, and learn from the community of developers
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap items-center mb-6 justify-between">
          <div className="relative flex-1 max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fontSize="small" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center">
            <Button
              onClick={() => {
                setFilterMode(filterMode === "newest" ? "all" : "newest");
                setCurrentPage(1);
              }}
              variant={filterMode === "newest" ? "default" : "outline"}
              className={`${filterMode === "newest" ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-xl shadow-lg' : 'border-green-200 text-green-700 hover:bg-green-50'}`}
            >
              <EditIcon fontSize="small" />
              Newest
            </Button>
            <Button
              onClick={() => {
                setFilterMode(filterMode === "unanswered" ? "all" : "unanswered");
                setCurrentPage(1);
              }}
              variant={filterMode === "unanswered" ? "default" : "outline"}
              className={`${filterMode === "unanswered" ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-xl shadow-lg' : 'border-green-200 text-green-700 hover:bg-green-50'}`}
            >
              <VisibilityIcon fontSize="small" />
              Unanswered
            </Button>
            <div className="relative" id="filter-menu">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setFilterDropdown(!filterDropdown);
                }}
                variant="outline"
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-xl shadow-lg flex items-center gap-2 min-w-[160px] justify-between"
              >
                <div className="flex items-center gap-2">
                  <FilterListIcon fontSize="small" />
                  <span className="truncate">
                    {filterTag || "Filter by Tags"}
                  </span>
                </div>
              </Button>
              {filterDropdown && (
                <div className="absolute left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl w-64 z-50">
                  <div className="p-2">
                    <button
                      onClick={() => { setFilterTag(null); setFilterDropdown(false); setCurrentPage(1); }}
                      className="block w-full px-3 py-2 text-left hover:bg-gray-50 text-sm"
                    >
                      All Tags
                    </button>
                    <div className="border-t border-gray-100 my-1" />
                    {TAGS.map(tag => (
                      <button
                        key={tag}
                        onClick={() => {
                          setFilterTag(tag);
                          setFilterDropdown(false);
                          setCurrentPage(1);
                        }}
                        className={`block w-full px-3 py-2 text-left hover:bg-gray-50 text-sm ${filterTag === tag ? 'bg-green-50 font-semibold' : ''}`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Button
              onClick={() => setShowAskModal(true)}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg ml-2"
            >
              <AddIcon fontSize="small" /> Ask Question
            </Button>
          </div>
        </div>

        {/* Questions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {paginated.map(q => (
            <div key={q.id} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2 hover:text-green-600 transition-colors">
                  {q.title}
                </h3>
                <div className="text-gray-600 mb-4 line-clamp-3 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: q.description }} />
                <div className="flex flex-wrap gap-2 mb-4">
                  {q.tags.map(t => (
                    <span key={t} className={`px-3 py-1 text-xs font-medium rounded-full border ${getTagColor(t)}`}>{t}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                      {q.user.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{q.user}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <VisibilityIcon fontSize="small" />
                      {q.answers.length} answers
                    </span>
                    {q.user === currentUser && (
                      <button
                        onClick={() => window.confirm("Delete this question?") && setAllQuestions(allQuestions.filter(item => item.id !== q.id))}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1 mb-2">
                  {q.answers.slice(0, 3).map((ans, idx) => (
                    <div key={ans.id} className="text-gray-600 text-sm truncate">
                      <span className="font-semibold">A{idx + 1}:</span> {ans.text.length > 10 ? ans.text.slice(0, 10) + '...' : ans.text}
                    </div>
                  ))}
                  {q.answers.length > 3 && (
                    <div className="text-xs text-gray-400">and {q.answers.length - 3} more answers...</div>
                  )}
                </div>
                {currentUser ? (
                  <Link to={`/question/${q.id}`}>
                    <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white mt-2">
                      View Answers
                    </Button>
                  </Link>
                ) : (
                  <Link to="/auth/sign-in">
                    <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white mt-2">
                      View Answers
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {paginated.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <SearchIcon className="w-16 h-16 mx-auto" fontSize="large" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No questions found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
            <Button
              onClick={() => { setFilterTag(null); setFilterMode("all"); setSearchQuery(""); }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <Button
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={currentPage === 1}
              variant="outline"
              className="px-4 py-2 rounded-xl shadow-lg border-green-200 text-green-700 hover:bg-green-50"
            >
              Previous
            </Button>
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  className={`px-3 py-2 rounded-xl shadow-lg ${currentPage === i + 1 ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white' : 'border-green-200 text-green-700 hover:bg-green-50'}`}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
            <Button
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
              className="px-4 py-2 rounded-xl shadow-lg border-green-200 text-green-700 hover:bg-green-50"
            >
              Next
            </Button>
          </div>
        )}

        {/* Ask Modal */}
        {showAskModal && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-green-100">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-green-600 to-blue-600 rounded-t-2xl">
                <h2 className="text-2xl font-bold text-white">Ask a Question</h2>
                <button
                  onClick={() => setShowAskModal(false)}
                  className="text-white hover:text-blue-200 transition-colors"
                >
                  <span className="sr-only">Close</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="px-6 py-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question Title</label>
                  <input
                    className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-slate-50"
                    placeholder="What's your question?"
                    value={newQuestion.title}
                    onChange={e => setNewQuestion({ ...newQuestion, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <RichTextEditor
                    value={newQuestion.description}
                    onChange={val => setNewQuestion({ ...newQuestion, description: val })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {TAGS.map(tag => (
                      <label key={tag} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          checked={newQuestion.tags.includes(tag)}
                          onChange={() => {
                            const tags = newQuestion.tags.includes(tag)
                              ? newQuestion.tags.filter(x => x !== tag)
                              : [...newQuestion.tags, tag];
                            setNewQuestion({ ...newQuestion, tags });
                          }}
                        />
                        <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getTagColor(tag)}`}>{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
                <Button
                  onClick={() => setShowAskModal(false)}
                  variant="outline"
                  className="px-6 py-2 rounded-xl shadow-lg border-green-200 text-green-700 hover:bg-green-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitQuestion}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-2 rounded-xl shadow-lg"
                >
                  Submit Question
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home; 