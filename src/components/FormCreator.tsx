import React, { useState } from 'react'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'

interface FormCreatorProps {
  onBack: () => void
  formId: string
  formTitle: string
  initialQuestions: Question[]
}

interface Question {
  id: string
  type: 'text' | 'radio' | 'checkbox' | 'select' | 'date' | 'card-select' | 'number'
  text: string
  options?: string[]
  isRequired: boolean
}

const FormCreator: React.FC<FormCreatorProps> = ({ onBack, formId, formTitle, initialQuestions }) => {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions)

  const addQuestion = (type: Question['type']) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      text: '',
      options: ['text', 'date', 'number'].includes(type) ? undefined : [''],
      isRequired: false
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q))
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const addOption = (questionId: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, options: [...(q.options || []), ''] } : q
    ))
  }

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? {
        ...q,
        options: q.options?.map((opt, index) => index === optionIndex ? value : opt)
      } : q
    ))
  }

  const removeOption = (questionId: string, optionIndex: number) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? {
        ...q,
        options: q.options?.filter((_, index) => index !== optionIndex)
      } : q
    ))
  }

  const saveForm = () => {
    const formData = { id: formId, title: formTitle, questions }
    localStorage.setItem(`form_${formId}`, JSON.stringify(formData))
    console.log('Formulario guardado:', formData)
    onBack()
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-purple-600 to-indigo-800">
      <header className="bg-indigo-800 p-4 flex items-center">
        <button className="text-white mr-4" onClick={onBack}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-white">Editar Formulario: {formTitle}</h1>
      </header>

      <main className="flex-grow p-6 overflow-y-auto">
        <div className="bg-white rounded-lg p-6 text-black">
          {questions.map((question, index) => (
            <div key={question.id} className="mb-6 p-4 border rounded">
              <div className="flex justify-between items-center mb-2">
                <select
                  value={question.type}
                  onChange={(e) => updateQuestion(question.id, { type: e.target.value as Question['type'] })}
                  className="p-2 border rounded"
                >
                  <option value="text">Texto</option>
                  <option value="radio">Opción única</option>
                  <option value="checkbox">Opción múltiple</option>
                  <option value="select">Lista desplegable</option>
                  <option value="date">Fecha</option>
                  <option value="card-select">Selección con tarjetas</option>
                  <option value="number">Número</option>
                </select>
                <button onClick={() => removeQuestion(question.id)} className="text-red-500">
                  <Trash2 size={20} />
                </button>
              </div>
              <input
                type="text"
                value={question.text}
                onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
                placeholder="Pregunta"
                className="w-full p-2 mb-2 border rounded"
              />
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`required-${question.id}`}
                  checked={question.isRequired}
                  onChange={(e) => updateQuestion(question.id, { isRequired: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor={`required-${question.id}`}>Obligatorio</label>
              </div>
              {!['text', 'date', 'number'].includes(question.type) && (
                <div className="ml-4">
                  {question.options?.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                        placeholder={`Opción ${optionIndex + 1}`}
                        className="flex-grow p-2 mr-2 border rounded"
                      />
                      <button onClick={() => removeOption(question.id, optionIndex)} className="text-red-500">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addOption(question.id)}
                    className="text-blue-500 flex items-center"
                  >
                    <Plus size={16} className="mr-1" /> Añadir opción
                  </button>
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-between mb-4">
            <button
              onClick={() => addQuestion('text')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Añadir Pregunta
            </button>
          </div>

          <button
            onClick={saveForm}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Guardar Formulario
          </button>
        </div>
      </main>
    </div>
  )
}

export default FormCreator