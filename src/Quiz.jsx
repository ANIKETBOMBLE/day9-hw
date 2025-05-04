import React, { useEffect, useState } from 'react';

function Quiz() {
  const [index, setIndex] = useState(0);
  const [questions, setQuestions] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);

  const fetchQuestions = async () => {
    try {
      const res = await fetch(
        'https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple'
      );
      const data = await res.json();
      setQuestions(data.results);
    } catch (err) {
      console.error('Error fetching questions:', err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (questions) {
      const current = questions[index];
      const answers = [...current.incorrect_answers, current.correct_answer];
      const shuffled = answers.sort(() => Math.random() - 0.5);
      setShuffledAnswers(shuffled);
    }
  }, [index, questions]);

  const handleAnswerClick = (answer, isCorrect) => {
    setSelectedAnswer(answer);
    setIsAnswered(true);
    setCountdown(4);
  };

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      if (index < questions.length - 1) {
        setIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setCountdown(null);
      } else {
        alert('Quiz complete!');
      }
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  // if (!questions) return <div>Loading...</div>;

  const current = questions[index];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
  <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-2xl">
    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
      {index + 1}. <span dangerouslySetInnerHTML={{ __html: current.question }} />
    </h2>

    <div className="space-y-4">
      {shuffledAnswers.map((answer, i) => {
        const isCorrect = answer === current.correct_answer;
        return (
          <button
            key={i}
            onClick={() => handleAnswerClick(answer, isCorrect)}
            disabled={isAnswered}
            className={`
              w-full py-3 px-6 text-left
              rounded-xl shadow
              text-base font-medium
              transition duration-300
              border
              ${
                isAnswered
                  ? isCorrect
                    ? 'bg-green-500 text-white border-green-600'
                    : answer === selectedAnswer
                      ? 'bg-red-500 text-white border-red-600'
                      : 'bg-gray-200 text-gray-700 border-gray-300'
                  : 'bg-white text-gray-800 border-gray-300 hover:bg-blue-50 hover:border-blue-500'
              }
            `}
          >
            <span dangerouslySetInnerHTML={{ __html: answer }} />
          </button>
        );
      })}
    </div>

    {isAnswered && (
      <div className="mt-6 text-center text-gray-600 text-sm">
        Next question in <span className="font-semibold">{countdown}</span>
      </div>
    )}
  </div>
</div>

  );
}

export default Quiz;
