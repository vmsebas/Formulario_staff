import React, { useState } from 'react'
import { ArrowLeft, Send, Check, Edit, RefreshCw } from 'lucide-react'

interface FormSummaryProps {
  form: {
    title: string
    questions: Array<{
      id: string
      text: string
      type: string
      options?: string[]
    }>
  }
  answers: Record<string, string | string[]>
  onBack: () => void
  onEdit: () => void
}

const FormSummary: React.FC<FormSummaryProps> = ({ form, answers, onBack, onEdit }) => {
  const [isSending, setIsSending] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)

  const renderAnswer = (question: { type: string; options?: string[] }, answer: string | string[]) => {
    switch (question.type) {
      case 'checkbox':
        return (Array.isArray(answer) ? answer : []).join(', ')
      case 'radio':
      case 'select':
      case 'card-select':
        return question.options?.find(option => option === answer) || 'Sin respuesta'
      case 'date':
        return answer || 'Sin fecha seleccionada'
      default:
        return answer as string || 'Sin respuesta'
    }
  }

  const handleSend = async () => {
    setIsSending(true)
    const data = {
      formTitle: form.title,
      answers: form.questions.map(q => ({
        question: q.text,
        answer: renderAnswer(q, answers[q.id])
      })),
      timestamp: new Date().toISOString()
    }

    // Guardar en localStorage
    const key = `formData_${Date.now()}`
    localStorage.setItem(key, JSON.stringify(data))

    // Simulamos una llamada a API
    await new Promise(resolve => setTimeout(resolve, 2000))

    console.log('Datos enviados:', JSON.stringify(data, null, 2))
    setIsSending(false)
    setIsConfirmed(true)
  }

  if (isConfirmed) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-b from-purple-600 to-indigo-800">
        <header className="bg-indigo-800 p-4">
          <h1 className="text-2xl font-bold text-white text-center">Tintoreria</h1>
        </header>
        <main className="flex-grow flex flex-col items-center justify-center p-6">
          <div className="bg-white rounded-lg p-8 text-center max-w-md w-full">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={40} color="white" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Obrigado!</h2>
              <p className="text-gray-600">¡Recebemos seus datos!</p>
            </div>
            <div className="space-y-4">
              <button
                onClick={onBack}
                className="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition duration-200 flex items-center justify-center"
              >
                <RefreshCw size={20} className="mr-2" /> Outro Apartamento
              </button>
              <button
                onClick={onEdit}
                className="w-full py-2 px-4 bg-white text-indigo-600 border border-indigo-600 rounded hover:bg-indigo-50 transition duration-200 flex items-center justify-center"
              >
                <Edit size={20} className="mr-2" /> Editar Envio
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-purple-600 to-indigo-800">
      <header className="bg-indigo-800 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <button className="text-white mr-4" onClick={onBack}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-white">Resumen de Respuestas: {form.title}</h1>
        </div>
        <button
          onClick={handleSend}
          disabled={isSending}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 flex items-center"
        >
          <Send size={20} className="mr-2" />
          {isSending ? 'Enviando...' : 'Enviar Datos'}
        </button>
      </header>

      <main className="flex-grow p-6 overflow-y-auto">
        <div className="bg-white rounded-lg p-6 text-black">
          {form.questions.map((question) => (
            <div key={question.id} className="mb-6 border-b pb-4">
              <h3 className="font-semibold mb-2">{question.text}</h3>
              <p>{renderAnswer(question, answers[question.id])}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default FormSummary