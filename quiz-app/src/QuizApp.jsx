import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const questions = [
  { question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], answer: "Paris" },
  { question: "Which language runs in the browser?", options: ["Java", "C", "Python", "JavaScript"], answer: "JavaScript" },
  { question: "What does CSS stand for?", options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"], answer: "Cascading Style Sheets" },
  { question: "What is 5 + 3?", options: ["5", "8", "12", "7"], answer: "8" },
  { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], answer: "Mars" },
  { question: "Who wrote 'Hamlet'?", options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"], answer: "William Shakespeare" },
  { question: "Which gas do plants absorb?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], answer: "Carbon Dioxide" }
];

const BackgroundSymbols = () => {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-100">
      <div className="absolute top-10 left-10 text-6xl">📝</div>
      <div className="absolute top-20 right-20 text-6xl">📚</div>
      <div className="absolute bottom-20 left-20 text-6xl">🔬</div>
      <div className="absolute bottom-10 right-10 text-6xl">🎨</div>
      <div className="absolute top-1/2 left-1/4 text-6xl">📐</div>
      <div className="absolute top-1/3 right-1/3 text-6xl">🧮</div>
    </div>
  );
};

// Simple celebration component
const Celebration = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex gap-4">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="text-4xl"
              initial={{ y: 100, opacity: 0 }}
              animate={{ 
                y: [-20, 20],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            >
              🎉
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function QuizApp() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState({});

  useEffect(() => {
    if (timeLeft === 0) handleNextQuestion();
    const timer = setInterval(() => setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerSelection = (option) => {
    if (!(currentQuestion in answeredQuestions)) setSelectedAnswer(option);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer !== null && !(currentQuestion in answeredQuestions)) {
      setAnsweredQuestions({ ...answeredQuestions, [currentQuestion]: selectedAnswer });
      if (selectedAnswer === questions[currentQuestion].answer) setScore(score + 1);
      setSelectedAnswer(null);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(15);
      setSelectedAnswer(null);
    } else setShowResult(true);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setTimeLeft(15);
      setSelectedAnswer(null);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setTimeLeft(15);
    setAnsweredQuestions({});
    setSelectedAnswer(null);
  };

  const getScoreMessage = () => {
    if (score >= 5) return "🎉 Well Done!";
    if (score >= 3) return "😊 Good Going!";
    return "🤔 Wanna give another try?";
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
      {/* Academic pattern background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#cbd5e1_1px,transparent_0)] bg-[size:40px_40px]" />
      </div>
      
      
      <BackgroundSymbols />
      
       
      {showResult && score >= 5 && <Celebration />}

      <div className="flex flex-col items-center w-full max-w-3xl relative z-10">
        <header className="text-3xl md:text-4xl font-bold mb-6 text-center text-slate-800">
          Quiz Challenge 🎯
        </header>
        
        <motion.div
          className="bg-white/95 backdrop-blur-sm text-black p-4 md:p-6 rounded-lg shadow-2xl w-full max-w-lg text-center relative border border-slate-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute top-2 right-4 text-red-600 font-bold text-lg">⏳ {timeLeft}s</div>
          {showResult ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
              <p className="text-lg font-semibold">Your score: {score} / {questions.length}</p>
              <p className="text-xl font-bold mt-2">{getScoreMessage()}</p>

              <h3 className="text-lg font-bold mt-4">📊 Scorecard:</h3>
              <div className="text-left mt-2 bg-gray-100 p-3 rounded-lg text-black max-h-60 overflow-y-auto">
                <ul>
                  {questions.map((q, index) => {
                    const userAnswer = answeredQuestions[index];
                    const correct = userAnswer === q.answer;
                    return (
                      <li key={index} className="mb-2 text-sm">
                        <strong>Q{index + 1}:</strong> {q.question} <br />
                        <span className="text-green-600 font-semibold">✅ Correct: {q.answer}</span><br />
                        {userAnswer ? (
                          <span className={correct ? "text-green-600" : "text-red-600"}>
                            {correct ? "✅ Your Answer: " : "❌ Your Answer: "} {userAnswer}
                          </span>
                        ) : (
                          <span className="text-gray-500">⚪ Not Attempted</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <button 
                className="mt-4 px-3 py-2 bg-blue-600 text-white rounded-lg shadow-lg text-sm hover:bg-blue-700 transition-colors" 
                onClick={handleRestartQuiz}
              >
                Restart Quiz
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold mb-4 text-center">{questions[currentQuestion].question}</h2>
              <div className="flex flex-col gap-2 w-full">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    className={`p-2 rounded-lg border w-full transition-all text-sm
                      ${selectedAnswer === option ? "bg-blue-700 text-white" : "bg-white text-blue-700 border-blue-700"} 
                      ${answeredQuestions[currentQuestion] ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-100"}`}
                    disabled={answeredQuestions[currentQuestion]}
                    onClick={() => handleAnswerSelection(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <button 
                className="mt-3 p-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors" 
                onClick={handleSubmitAnswer}
              >
                Submit
              </button>

              <div className="flex justify-between mt-3">
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 p-2 rounded-lg flex items-center gap-2 text-sm transition-colors"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestion === 0}
                >
                  <ArrowLeft className="text-white" size={16} /> Previous
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 p-2 rounded-lg flex items-center gap-2 text-sm transition-colors"
                  onClick={handleNextQuestion}
                  disabled={!answeredQuestions[currentQuestion]}
                >
                  Next <ArrowRight className="text-white" size={16} />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}