import React, { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import FormSummary from './FormSummary'

interface FormViewerProps {
  form: {
    id: string
    title: string
    questions: Array<{
      id: string
      type: 'text' | 'radio' | 'checkbox' | 'select' | 'date' | 'card-select' | 'number'
      text: string
      options?: string[]
      isRequired: boolean
    }>
  }
  onBack: () => void
}

const FormViewer: React.FC<FormViewerProps> = ({ form, onBack }) => {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showSummary, setShowSummary] = useState(false)

  useEffect(() => {
    // Inicializar la fecha actual para todas las preguntas de tipo 'date'
    const initialAnswers = { ...answers }
    form.questions.forEach(question => {
      if (question.type === 'date' && !initialAnswers[question.id]) {
        initialAnswers[question.id] = new Date().toISOString().split('T')[0]
      }
    })
    setAnswers(initialAnswers)
  }, [form.questions])

  const handleAnswer = (questionId: string, answer: string | string[]) => {
    setAnswers({ ...answers, [questionId]: answer })
  }

  const handleNext = () => {
    if (currentQuestionIndex < form.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = () => {
    const unansweredRequired = form.questions.filter(
      q => q.isRequired && !answers[q.id]
    )
    if (unansweredRequired.length > 0) {
      alert('Por favor, responda todas las preguntas obligatorias.')
      return
    }
    setShowSummary(true)
  }

  const handleEdit = () => {
    setShowSummary(false)
    setCurrentQuestionIndex(0)
  }

  if (showSummary) {
    return <FormSummary form={form} answers={answers} onBack={onBack} onEdit={handleEdit} />
  }

  const currentQuestion = form.questions[currentQuestionIndex]

  const renderQuestionInput = () => {
    switch (currentQuestion.type) {
      case 'text':
        return (
          <input
            type="text"
            value={answers[currentQuestion.id] as string || ''}
            onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
            className="w-full p-2 border rounded"
          />
        )
      case 'radio':
      case 'card-select':
        return (
          <div className="space-y-2">
            {currentQuestion.options?.map((option, index) => (
              <label key={index} className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-100">
                <input
                  type="radio"
                  name={currentQuestion.id}
                  value={option}
                  checked={(answers[currentQuestion.id] as string) === option}
                  onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        )
      case 'checkbox':
        return (
          <div className="space-y-2">
            {currentQuestion.options?.map((option, index) => (
              <label key={index} className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  value={option}
                  checked={(answers[currentQuestion.id] as string[] || []).includes(option)}
                  onChange={(e) => {
                    const currentAnswers = answers[currentQuestion.id] as string[] || []
                    const newAnswers = e.target.checked
                      ? [...currentAnswers, option]
                      : currentAnswers.filter(a => a !== option)
                    handleAnswer(currentQuestion.id, newAnswers)
                  }}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        )
      case 'select':
        return (
          <select
            value={answers[currentQuestion.id] as string || ''}
            onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Seleccione una opción</option>
            {currentQuestion.options?.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        )
      case 'date':
        return (
          <input
            type="date"
            value={answers[currentQuestion.id] as string || ''}
            onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
            className="w-full p-2 border rounded"
          />
        )
      case 'number':
        return (
          <input
            type="number"
            value={answers[currentQuestion.id] as string || ''}
            onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
            className="w-full p-2 border rounded"
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-purple-600 to-indigo-800">
      <header className="bg-indigo-800 p-4 flex items-center">
        <button className="text-white mr-4" onClick={onBack}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-white">{form.title}</h1>
      </header>

      <main className="flex-grow p-6 overflow-y-auto">
        <div className="bg-white rounded-lg p-6 text-black">
          <h2 className="text-xl font-semibold mb-4">
            {currentQuestion.text}
            {currentQuestion.isRequired && <span className="text-red-500 ml-1">*</span>}
          </h2>
          {renderQuestionInput()}
        </div>
      </main>

      <footer className="bg-indigo-800 p-4 flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          {currentQuestionIndex === form.questions.length - 1 ? 'Enviar' : <ArrowRight size={20} />}
        </button>
      </footer>
    </div>
  )
}

export default FormViewer