import React, { useState } from 'react'
import { PlusCircle, Trash2, Upload } from 'lucide-react'

type QuestionType = 'text' | 'radio' | 'checkbox' | 'select' | 'image-select'

interface Question {
  id: string
  type: QuestionType
  text: string
  options?: Array<{ text: string; imageUrl?: string }>
}

interface AdminQuestionCreatorProps {
  addQuestion: (question: Question) => void
}

const AdminQuestionCreator: React.FC<AdminQuestionCreatorProps> = ({ addQuestion }) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: '',
    type: 'text',
    text: '',
    options: [],
  })

  const handleAddQuestion = () => {
    if (currentQuestion.text.trim() === '') return
    addQuestion({ ...currentQuestion, id: Date.now().toString() })
    setCurrentQuestion({ id: '', type: 'text', text: '', options: [] })
  }

  const addOption = () => {
    if (currentQuestion.type === 'text') return
    setCurrentQuestion({
      ...currentQuestion,
      options: [...(currentQuestion.options || []), { text: '' }],
    })
  }

  const updateOption = (index: number, value: string) => {
    const updatedOptions = [...(currentQuestion.options || [])]
    updatedOptions[index] = { ...updatedOptions[index], text: value }
    setCurrentQuestion({ ...currentQuestion, options: updatedOptions })
  }

  const updateOptionImage = (index: number, imageUrl: string) => {
    const updatedOptions = [...(currentQuestion.options || [])]
    updatedOptions[index] = { ...updatedOptions[index], imageUrl }
    setCurrentQuestion({ ...currentQuestion, options: updatedOptions })
  }

  const removeOption = (index: number) => {
    const updatedOptions = [...(currentQuestion.options || [])]
    updatedOptions.splice(index, 1)
    setCurrentQuestion({ ...currentQuestion, options: updatedOptions })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Crear Preguntas</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="questionType" className="block text-sm font-medium text-gray-700">
            Tipo de Pregunta
          </label>
          <select
            id="questionType"
            value={currentQuestion.type}
            onChange={(e) => setCurrentQuestion({ ...currentQuestion, type: e.target.value as QuestionType })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            <option value="text">Texto</option>
            <option value="radio">Opción Única</option>
            <option value="checkbox">Opción Múltiple</option>
            <option value="select">Lista Desplegable</option>
            <option value="image-select">Selección con Imágenes</option>
          </select>
        </div>
        <div>
          <label htmlFor="questionText" className="block text-sm font-medium text-gray-700">
            Texto de la Pregunta
          </label>
          <input
            type="text"
            id="questionText"
            value={currentQuestion.text}
            onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
        {currentQuestion.type !== 'text' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Opciones</label>
            {currentQuestion.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => updateOption(index, e.target.value)}
                  className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                {currentQuestion.type === 'image-select' && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={option.imageUrl || ''}
                      onChange={(e) => updateOptionImage(index, e.target.value)}
                      placeholder="URL de la imagen"
                      className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <button
                      onClick={() => {/* Implementar carga de imagen */}}
                      className="p-2 text-blue-500 hover:text-blue-700"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <button
                  onClick={() => removeOption(index)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={addOption}
              className="flex items-center text-blue-500 hover:text-blue-700"
            >
              <PlusCircle className="w-4 h-4 mr-1" /> Agregar Opción
            </button>
          </div>
        )}
        <button
          onClick={handleAddQuestion}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Agregar Pregunta
        </button>
      </div>
    </div>
  )
}

export default AdminQuestionCreator