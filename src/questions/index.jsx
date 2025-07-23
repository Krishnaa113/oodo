import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AnswerSection from '../components/custom/AnswerSection';
import { Button } from '../components/ui/button';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function QuestionPage({ questions, currentUser, onAddAnswer, onVote, onDeleteAnswer }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const question = questions.find(q => q.id === id);
  const [likes, setLikes] = useState(question ? (question.likes || 0) : 0);
  const [liked, setLiked] = useState(false);

  // Persist like state per question per user in localStorage
  useEffect(() => {
    if (!question) return;
    const likedQuestions = JSON.parse(localStorage.getItem('likedQuestions') || '{}');
    setLiked(!!likedQuestions[question.id]);
    setLikes(question.likes || 0);
  }, [question]);

  if (!question) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Question not found</h2>
        <button onClick={() => navigate(-1)} className="text-blue-600 underline flex items-center gap-2 justify-center"><ArrowBackIcon fontSize="small" /> Go Back</button>
      </div>
    );
  }

  const handleLike = () => {
    const likedQuestions = JSON.parse(localStorage.getItem('likedQuestions') || '{}');
    let newLikes = likes;
    if (liked) {
      newLikes = Math.max(0, likes - 1);
      delete likedQuestions[question.id];
    } else {
      newLikes = likes + 1;
      likedQuestions[question.id] = true;
    }
    setLikes(newLikes);
    setLiked(!liked);
    localStorage.setItem('likedQuestions', JSON.stringify(likedQuestions));
    // Optionally, update likes in parent/global state
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      {/* Question Card */}
      <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">{question.title}</h1>
            <div className="mb-2 flex flex-wrap gap-2">
              {question.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-gradient-to-r from-green-100 to-blue-100 text-green-700 rounded-full text-xs font-semibold border border-green-200">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center md:justify-end justify-start w-full md:w-auto">
            <Button
              onClick={handleLike}
              variant="outline"
              className="flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50"
            >
              <ThumbUpIcon fontSize="small" />
              <span className="font-semibold">{likes}</span>
            </Button>
          </div>
        </div>
        <div className="text-gray-700 text-lg leading-relaxed border-t border-gray-100 pt-4">{question.description}</div>
      </div>

      {/* Answers Section */}
      <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Answers</h2>
        <AnswerSection
          questionId={question.id}
          answers={question.answers}
          currentUser={currentUser}
          onAddAnswer={onAddAnswer}
          onVote={onVote}
          onDeleteAnswer={onDeleteAnswer}
        />
      </div>
    </div>
  );
}

export default QuestionPage; 