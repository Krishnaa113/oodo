import React, { useState } from 'react';
import { Button } from '../ui/button';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Link } from 'react-router-dom';

function AnswerSection({ questionId, answers, currentUser, onAddAnswer, onVote, onDeleteAnswer, hideAddAnswer }) {
  const [showAnswers, setShowAnswers] = useState(true); // Always show answers on question page
  const [showAnswerInput, setShowAnswerInput] = useState(false);
  const [answerText, setAnswerText] = useState('');

  const handleAdd = () => {
    onAddAnswer(questionId, answerText, currentUser);
    setAnswerText('');
    setShowAnswerInput(false);
  };

  return (
    <div className="mt-4">
      <div className="border-t border-green-100 bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 p-6 rounded-b-2xl">
        {answers.length > 0 ? (
          <div className="space-y-6 mb-4">
            {answers.map(ans => (
              <div key={ans.id} className="bg-white/90 rounded-xl shadow border border-green-100 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 max-w-full">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {ans.user.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-green-700 truncate">{ans.user}</span>
                  </div>
                  <p className="text-gray-700 mb-2 text-base break-words whitespace-pre-line max-w-full">
                    {ans.text}
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2 md:gap-4 self-center md:self-auto">
                  <button
                    onClick={() => onVote(questionId, ans.id, 'like', currentUser)}
                    className="flex items-center gap-1 text-green-600 hover:text-green-700 transition-colors px-2 py-1 rounded-lg bg-green-50 hover:bg-green-100"
                    disabled={!currentUser}
                  >
                    <ThumbUpIcon fontSize="small" />
                    <span className="font-medium">{ans.likes}</span>
                  </button>
                  <button
                    onClick={() => onVote(questionId, ans.id, 'dislike', currentUser)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100"
                    disabled={!currentUser}
                  >
                    <ThumbDownIcon fontSize="small" />
                    <span className="font-medium">{ans.dislikes}</span>
                  </button>
                  {ans.user === currentUser && (
                    <button
                      onClick={() => onDeleteAnswer(questionId, ans.id, currentUser)}
                      className="text-red-500 hover:text-red-700 transition-colors px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100"
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-green-400 mb-2">
              <VisibilityIcon className="w-12 h-12 mx-auto" fontSize="large" />
            </div>
            <p className="text-green-700 font-medium">No answers yet</p>
            <p className="text-sm text-green-500">Be the first to answer this question!</p>
          </div>
        )}
        {!hideAddAnswer && currentUser ? (
          !showAnswerInput ? (
            <Button
              onClick={() => setShowAnswerInput(true)}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white mt-4"
            >
              <AddIcon fontSize="small" /> Add Answer
            </Button>
          ) : (
            <div className="space-y-3 mt-4">
              <textarea
                value={answerText}
                onChange={e => setAnswerText(e.target.value)}
                className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none bg-slate-50"
                rows="3"
                placeholder="Write your answer..."
              />
              <div className="flex gap-2 justify-end">
                <Button
                  onClick={handleAdd}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-2 rounded-xl shadow-lg"
                >
                  Submit Answer
                </Button>
                <Button
                  onClick={() => setShowAnswerInput(false)}
                  variant="outline"
                  className="px-6 py-2 rounded-xl shadow-lg border-green-200 text-green-700 hover:bg-green-50"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )
        ) : null}
        {!hideAddAnswer && !currentUser && (
          <div className="text-center py-8">
            <Link to="/auth/sign-in">
              <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white">
                Sign in to answer
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnswerSection; 