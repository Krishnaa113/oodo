import { Navigate, Outlet, useLocation } from 'react-router-dom';
import './App.css'
import './index.css';
import { useUser } from '@clerk/clerk-react';
import Header from './components/custom/Header';
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Home from './home';
import QuestionPage from './questions';

function getDefaultQuestions() {
  return [
    { title: "What is recursion?", description: "How does recursion work and where is it useful?", tags: ["Recursion"] },
    { title: "Difference between Array and Linked List?", description: "Which one is better for insertions?", tags: ["Array", "Linked List"] },
    { title: "What is Dynamic Programming?", description: "How is it different from recursion?", tags: ["DP"] },
    { title: "Explain Hash Tables", description: "How do hash functions work?", tags: ["Hashing"] },
    { title: "What is a Graph?", description: "Explain BFS and DFS with use-cases.", tags: ["Graph"] },
    { title: "Sorting Algorithms", description: "Compare Merge Sort and Quick Sort.", tags: ["Sorting"] },
    { title: "What is Backtracking?", description: "How is it used in N-Queens problem?", tags: ["Recursion"] },
    { title: "Best data structure for LRU cache?", description: "How to implement LRU efficiently?", tags: ["Hashing", "Linked List"] },
    { title: "When to use Dynamic Programming?", description: "Identify DP from problem statement.", tags: ["DP"] },
    { title: "Difference between Stack and Queue?", description: "When to use which one?", tags: ["Array"] },
    { title: "Advantages of Linked Lists", description: "Over arrays and when to use them?", tags: ["Linked List"] },
    { title: "Cycle detection in Graph", description: "Using DFS and Union-Find approach.", tags: ["Graph"] },
    { title: "Heap vs Binary Search Tree", description: "Which is better for priority queue?", tags: ["Sorting"] },
    { title: "Kadane's Algorithm", description: "How to find max subarray sum?", tags: ["DP"] },
    { title: "What is a Trie?", description: "Explain trie data structure and usage.", tags: ["Hashing"] },
    { title: "Quick Sort worst case?", description: "Explain pivot strategies to avoid it.", tags: ["Sorting"] },
    { title: "What is Topological Sort?", description: "Use-cases of topological ordering.", tags: ["Graph"] },
    { title: "Sliding Window Technique", description: "When and how to apply it?", tags: ["Array"] },
    { title: "Two Pointer Technique", description: "Explain its application in problems.", tags: ["Array"] },
    { title: "Floyd's Cycle Detection", description: "Detect cycle in linked list.", tags: ["Linked List"] },
    { title: "0/1 Knapsack Problem", description: "Classic DP approach explained.", tags: ["DP"] },
    { title: "Minimum Spanning Tree", description: "Prim's vs Kruskal's algorithm.", tags: ["Graph"] }
  ].map(q => ({
    ...q,
    id: uuidv4(),
    user: "Admin",
    answers: []
  }));
}

function App() {
  const { user } = useUser();
  const currentUser = user?.emailAddresses?.[0]?.emailAddress || user?.username || user?.id || null;

  // Load from localStorage or use default
  const [allQuestions, setAllQuestions] = useState(() => {
    const saved = localStorage.getItem('questions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return getDefaultQuestions();
      }
    }
    return getDefaultQuestions();
  });

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('questions', JSON.stringify(allQuestions));
  }, [allQuestions]);

  // Handlers for answers (unchanged)
  const handleAddAnswer = (qid, text, user) => {
    if (!text.trim()) return;
    setAllQuestions(prev => prev.map(q => {
      if (q.id === qid) {
        const updatedAnswers = [
          ...q.answers,
          {
            id: Date.now().toString(),
            text,
            user: user || 'Guest',
            likes: 0,
            dislikes: 0,
            voters: {}
          }
        ];
        return { ...q, answers: updatedAnswers };
      }
      return q;
    }));
  };

  const handleVote = (qid, aId, type, user) => {
    setAllQuestions(prev => prev.map(q => {
      if (q.id !== qid) return q;
      const updatedAnswers = q.answers.map(a => {
        if (a.id !== aId) return a;
        const voters = { ...a.voters };
        const prevVote = voters[user];
        let likes = a.likes;
        let dislikes = a.dislikes;
        if (prevVote === type) {
          if (type === 'like') likes--; else dislikes--;
          delete voters[user];
        } else {
          if (prevVote === 'like') likes--;
          if (prevVote === 'dislike') dislikes--;
          if (type === 'like') likes++; else dislikes++;
          voters[user] = type;
        }
        return { ...a, likes, dislikes, voters };
      });
      return { ...q, answers: updatedAnswers };
    }));
  };

  const handleDeleteAnswer = (qid, aId, user) => {
    setAllQuestions(prev => prev.map(q => {
      if (q.id !== qid) return q;
      const updatedAnswers = q.answers.filter(a => a.id !== aId || a.user !== user);
      return { ...q, answers: updatedAnswers };
    }));
  };

  const location = useLocation();

  return (
    <>
      <Header />
      {/* Route-aware rendering: pass props to Home and QuestionPage */}
      {location.pathname.startsWith('/question/') ? (
        <QuestionPage
          questions={allQuestions}
          currentUser={currentUser}
          onAddAnswer={handleAddAnswer}
          onVote={handleVote}
          onDeleteAnswer={handleDeleteAnswer}
        />
      ) : (
        <Home
          allQuestions={allQuestions}
          setAllQuestions={setAllQuestions}
          currentUser={currentUser}
          onAddAnswer={handleAddAnswer}
          onVote={handleVote}
          onDeleteAnswer={handleDeleteAnswer}
        />
      )}
    </>
  );
}

export default App; 