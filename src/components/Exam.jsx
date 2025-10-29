import { useMemo, useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import exams, { examSituations } from '../data/exams'

function Exam() {
  const { examId } = useParams()
  const questions = useMemo(() => exams[examId] ?? [], [examId])
  
  // Load exam progress from localStorage
  const getSavedProgress = () => {
    const saved = localStorage.getItem(`exam-${examId}-progress`)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        return null
      }
    }
    return null
  }

  const savedProgress = getSavedProgress()
  const [currentQuestion, setCurrentQuestion] = useState(savedProgress?.currentQuestion ?? 0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [answers, setAnswers] = useState(savedProgress?.answers ?? [])
  const [isFinished, setIsFinished] = useState(false)

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (!isFinished) {
      localStorage.setItem(`exam-${examId}-progress`, JSON.stringify({
        currentQuestion,
        answers
      }))
    }
  }, [currentQuestion, answers, examId, isFinished])

  // Clear localStorage when exam is finished
  const handleFinish = () => {
    // Check if all questions are answered
    if (answers.length < questions.length) {
      alert(`Please answer all questions before finishing. You have answered ${answers.length} out of ${questions.length} questions.`)
      return
    }
    localStorage.removeItem(`exam-${examId}-progress`)
    setIsFinished(true)
  }

  const handleAnswerSelect = (index) => {
    if (!showResult && !currentAnswer) {
      setSelectedAnswer(index)
    }
  }

  const handleSubmit = () => {
    if (selectedAnswer !== null && !currentAnswer) {
      setShowResult(true)
      const q = questions[currentQuestion]
      setAnswers(prev => [
        ...prev,
        {
          questionId: q.id,
          question: q.question,
          selectedIndex: selectedAnswer,
          correctIndex: q.correctAnswer,
          correct: selectedAnswer === q.correctAnswer,
          options: q.options,
        },
      ])
    }
  }

  const handleNext = () => {
    const nextIndex = currentQuestion + 1
    const nextQuestion = questions[nextIndex]
    const existingAnswer = answers.find(a => a.questionId === nextQuestion.id)
    
    setCurrentQuestion(nextIndex)
    if (existingAnswer) {
      setSelectedAnswer(existingAnswer.selectedIndex)
      setShowResult(true)
    } else {
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  const handleQuestionJump = (questionIndex) => {
    const targetQuestion = questions[questionIndex]
    const existingAnswer = answers.find(a => a.questionId === targetQuestion.id)
    
    setCurrentQuestion(questionIndex)
    if (existingAnswer) {
      setSelectedAnswer(existingAnswer.selectedIndex)
      setShowResult(true)
    } else {
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  // Check if exam has questions
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-fuchsia-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Exam {examId} Coming Soon!</h2>
          <p className="text-xl text-gray-600 mb-6">This exam is still under development.</p>
          <Link to="/" className="text-fuchsia-700 hover:text-fuchsia-900 font-semibold text-lg">
            ← Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]

  // Check if current question has been answered
  const currentAnswer = useMemo(() => {
    return answers.find(a => a.questionId === currentQ.id)
  }, [answers, currentQ.id])

  // Get the current situation based on question number
  const currentSituation = useMemo(() => {
    if (!examSituations[examId] || !Array.isArray(examSituations[examId])) {
      return null
    }
    const questionNum = currentQuestion + 1
    return examSituations[examId].find(
      (sit) => questionNum >= sit.startQuestion && questionNum <= sit.endQuestion
    )
  }, [examId, currentQuestion])

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-fuchsia-100 p-4">
      <div className="container max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Link 
            to="/" 
            className="text-fuchsia-700 hover:text-fuchsia-900 font-semibold"
          >
            ← Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            EXAM {examId}
          </h1>
          {!isFinished && (
            <div className="text-sm text-gray-600 font-semibold">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          )}
        </div>

        {/* Question Navigation */}
        {!isFinished && (
          <div className="mb-6 bg-white rounded-xl p-4 shadow-lg">
            <p className="text-sm font-semibold text-gray-600 mb-3">Navigate to question:</p>
            <div className="overflow-x-auto">
              <div className="flex gap-2 pb-2">
                {questions.map((q, idx) => {
                  const isAnswered = answers.some(a => a.questionId === q.id)
                  const isCurrent = idx === currentQuestion
                  return (
                    <button
                      key={idx}
                      onClick={() => handleQuestionJump(idx)}
                      className={`min-w-[45px] h-10 rounded-lg font-semibold transition-all ${
                        isCurrent
                          ? 'bg-fuchsia-600 text-white scale-110 shadow-md'
                          : isAnswered
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Hall of Fame after finishing */}
        {isFinished ? (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Overview</h2>
            <div className="space-y-6">
              {Array.isArray(examSituations[examId]) && examSituations[examId].length > 0 ? (
                examSituations[examId].map((sit, sitIdx) => {
                  const situationAnswers = answers.filter((a, idx) => {
                    const questionNum = idx + 1
                    return questionNum >= sit.startQuestion && questionNum <= sit.endQuestion
                  })
                  return (
                    <div key={sitIdx} className="space-y-3">
                      <div className="p-4 rounded-lg border border-fuchsia-100 bg-fuchsia-50/40">
                        <p className="text-sm font-semibold text-fuchsia-700 mb-1">Situation {sitIdx + 1} (Questions {sit.startQuestion}-{sit.endQuestion})</p>
                        <p className="text-gray-700">{sit.text}</p>
                      </div>
                      {situationAnswers.map((a, ansIdx) => {
                        const globalIdx = answers.indexOf(a)
                        return (
                          <div key={ansIdx} className={`p-4 rounded-lg border ml-4 ${a.correct ? 'border-green-400 bg-green-50' : 'border-rose-400 bg-rose-50'}`}>
                            <div className="flex items-start justify-between">
                              <p className="font-semibold text-gray-800 pr-4">{globalIdx + 1}. {a.question}</p>
                              <span className={`text-sm font-semibold ${a.correct ? 'text-green-700' : 'text-rose-700'}`}>
                                {a.correct ? '✓ Correct' : '✗ Incorrect'}
                              </span>
                            </div>
                            <div className="mt-2 text-sm">
                              <p>
                                <span className="font-semibold text-gray-700">Your answer: </span>
                                <span className={a.correct ? 'text-green-700' : 'text-rose-700'}>
                                  {String.fromCharCode(65 + a.selectedIndex)}. {a.options[a.selectedIndex]}
                                </span>
                              </p>
                              {!a.correct && (
                                <p className="mt-1">
                                  <span className="font-semibold text-gray-700">Correct answer: </span>
                                  <span className="text-green-700">
                                    {String.fromCharCode(65 + a.correctIndex)}. {a.options[a.correctIndex]}
                                  </span>
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })
              ) : (
                <div className="space-y-4">
                  {answers.map((a, idx) => (
                    <div key={idx} className={`p-4 rounded-lg border ${a.correct ? 'border-green-400 bg-green-50' : 'border-rose-400 bg-rose-50'}`}>
                      <div className="flex items-start justify-between">
                        <p className="font-semibold text-gray-800 pr-4">{idx + 1}. {a.question}</p>
                        <span className={`text-sm font-semibold ${a.correct ? 'text-green-700' : 'text-rose-700'}`}>
                          {a.correct ? '✓ Correct' : '✗ Incorrect'}
                        </span>
                      </div>
                      <div className="mt-2 text-sm">
                        <p>
                          <span className="font-semibold text-gray-700">Your answer: </span>
                          <span className={a.correct ? 'text-green-700' : 'text-rose-700'}>
                            {String.fromCharCode(65 + a.selectedIndex)}. {a.options[a.selectedIndex]}
                          </span>
                        </p>
                        {!a.correct && (
                          <p className="mt-1">
                            <span className="font-semibold text-gray-700">Correct answer: </span>
                            <span className="text-green-700">
                              {String.fromCharCode(65 + a.correctIndex)}. {a.options[a.correctIndex]}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-6 flex gap-3">
              <Link to="/" className="px-6 py-3 bg-fuchsia-700 text-white rounded-lg font-semibold hover:bg-fuchsia-800">Back to Home</Link>
            </div>
          </div>
        ) : (
        <>
        {/* Situation (if available) */}
        {currentSituation && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-fuchsia-100">
            <h3 className="text-lg font-semibold text-fuchsia-700 mb-2">Situation</h3>
            <p className="text-gray-700">{currentSituation.text}</p>
          </div>
        )}

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {currentQ.question}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult || currentAnswer}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedAnswer === index
                    ? 'border-fuchsia-500 bg-fuchsia-50'
                    : 'border-gray-200 hover:border-fuchsia-300 hover:bg-gray-50'
                } ${
                  showResult && index === currentQ.correctAnswer
                    ? 'border-green-500 bg-green-50'
                    : ''
                } ${
                  showResult && selectedAnswer === index && index !== currentQ.correctAnswer
                    ? 'border-red-500 bg-red-50'
                    : ''
                }`}
              >
                <span className="font-semibold text-fuchsia-700 mr-2">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="text-gray-700">{option}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit/Next Button */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null || showResult || currentAnswer}
            className="px-8 py-3 bg-fuchsia-700 text-white rounded-lg font-semibold hover:bg-fuchsia-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Submit Answer
          </button>

          {showResult && currentQuestion < questions.length - 1 && (
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition-colors"
            >
              Next Question →
            </button>
          )}

          {showResult && currentQuestion === questions.length - 1 && (
            <button
              onClick={handleFinish}
              className="px-8 py-3 bg-fuchsia-700 text-white rounded-lg font-semibold hover:bg-fuchsia-800 transition-colors"
            >
              Finish Exam
            </button>
          )}
        </div>

        {/* Result Message */}
        {showResult && (
          <div className={`mt-6 p-4 rounded-lg ${
            selectedAnswer === currentQ.correctAnswer
              ? 'bg-green-100 border border-green-400'
              : 'bg-rose-100 border border-rose-400'
          }`}>
            <p className={`font-semibold ${
              selectedAnswer === currentQ.correctAnswer
                ? 'text-green-800'
                : 'text-rose-800'
            }`}>
              {selectedAnswer === currentQ.correctAnswer
                ? '✓ Correct!'
                : '✗ Incorrect. The correct answer is: ' + currentQ.options[currentQ.correctAnswer]}
            </p>
          </div>
        )}
        </>
        )}
      </div>
    </div>
  )
}

export default Exam

