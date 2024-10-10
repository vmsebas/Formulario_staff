import React, { useState, useEffect } from 'react'
import FormViewer from './components/FormViewer'
import FormCreator from './components/FormCreator'
import DataDashboard from './components/DataDashboard'
import { PlusCircle, ClipboardList, BarChart3, Save, RotateCcw } from 'lucide-react'

interface Form {
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

function App() {
  const [view, setView] = useState<'list' | 'create' | 'view' | 'dashboard'>('list')
  const [forms, setForms] = useState<Form[]>([])
  const [currentForm, setCurrentForm] = useState<Form | null>(null)

  useEffect(() => {
    const storedForms = Object.keys(localStorage)
      .filter(key => key.startsWith('form_'))
      .map(key => JSON.parse(localStorage.getItem(key) || '{}'))
    setForms(storedForms)
  }, [])

  const handleCreateForm = () => {
    const newForm: Form = {
      id: Date.now().toString(),
      title: 'Nuevo Formulario',
      questions: []
    }
    setCurrentForm(newForm)
    setView('create')
  }

  const handleViewForm = (form: Form) => {
    setCurrentForm(form)
    setView('view')
  }

  const handleBackToList = () => {
    setView('list')
    setCurrentForm(null)
    const storedForms = Object.keys(localStorage)
      .filter(key => key.startsWith('form_'))
      .map(key => JSON.parse(localStorage.getItem(key) || '{}'))
    setForms(storedForms)
  }

  const saveCurrentVersion = () => {
    const currentState = {
      forms,
      currentForm,
      view
    }
    localStorage.setItem('app_backup_state', JSON.stringify(currentState))
    alert('Versión actual guardada correctamente')
  }

  const restoreLastVersion = () => {
    const savedState = localStorage.getItem('app_backup_state')
    if (savedState) {
      const parsedState = JSON.parse(savedState)
      setForms(parsedState.forms)
      setCurrentForm(parsedState.currentForm)
      setView(parsedState.view)
      alert('Última versión restaurada correctamente')
    } else {
      alert('No hay versión guardada para restaurar')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-indigo-800 text-white">
      <div className="container mx-auto p-4">
        <div className="flex justify-end space-x-2 mb-4">
          <button
            onClick={saveCurrentVersion}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors flex items-center"
          >
            <Save className="mr-2" size={18} />
            Guardar Versión
          </button>
          <button
            onClick={restoreLastVersion}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors flex items-center"
          >
            <RotateCcw className="mr-2" size={18} />
            Restaurar Última Versión
          </button>
        </div>
        
        {view === 'list' && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Gestión de Formularios</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {forms.map(form => (
                <div key={form.id} className="bg-white rounded-lg shadow-md p-4 text-gray-800">
                  <h2 className="text-xl font-semibold mb-2">{form.title}</h2>
                  <p className="text-sm text-gray-600 mb-4">{form.questions.length} preguntas</p>
                  <button
                    onClick={() => handleViewForm(form)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    Ver Formulario
                  </button>
                </div>
              ))}
              <div className="bg-white rounded-lg shadow-md p-4 text-gray-800 flex flex-col items-center justify-center">
                <button
                  onClick={handleCreateForm}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors flex items-center"
                >
                  <PlusCircle className="mr-2" />
                  Crear Nuevo Formulario
                </button>
              </div>
            </div>
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setView('dashboard')}
                className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition-colors flex items-center"
              >
                <BarChart3 className="mr-2" />
                Ver Dashboard de Datos
              </button>
            </div>
          </div>
        )}
        {view === 'create' && currentForm && (
          <FormCreator
            onBack={handleBackToList}
            formId={currentForm.id}
            formTitle={currentForm.title}
            initialQuestions={currentForm.questions}
          />
        )}
        {view === 'view' && currentForm && (
          <FormViewer
            form={currentForm}
            onBack={handleBackToList}
          />
        )}
        {view === 'dashboard' && (
          <DataDashboard onBack={handleBackToList} />
        )}
      </div>
    </div>
  )
}

export default App