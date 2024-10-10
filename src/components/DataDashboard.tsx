import React, { useState, useEffect } from 'react'
import { ArrowLeft, Download, PieChart, BarChart, List } from 'lucide-react'

interface FormEntry {
  formTitle: string
  timestamp: string
  [key: string]: string
}

const DataDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [formEntries, setFormEntries] = useState<FormEntry[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table')

  useEffect(() => {
    const loadData = () => {
      const entries: FormEntry[] = []
      const allColumns = new Set<string>(['formTitle', 'timestamp'])

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('formData_')) {
          const item = JSON.parse(localStorage.getItem(key) || '{}')
          const entry: FormEntry = {
            formTitle: item.formTitle,
            timestamp: item.timestamp,
          }
          item.answers.forEach((answer: { question: string; answer: string }) => {
            entry[answer.question] = answer.answer
            allColumns.add(answer.question)
          })
          entries.push(entry)
        }
      }

      setFormEntries(entries)
      setColumns(Array.from(allColumns))
    }

    loadData()
  }, [])

  const downloadCSV = () => {
    let csv = columns.join(',') + '\n'
    formEntries.forEach(entry => {
      csv += columns.map(column => `"${entry[column] || ''}"`).join(',') + '\n'
    })

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'datos_formularios.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const renderTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            {columns.map(column => (
              <th key={column} className="px-4 py-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {formEntries.map((entry, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              {columns.map(column => (
                <td key={column} className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                  {entry[column] || ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderChart = () => {
    // Aquí podrías implementar una visualización de datos simple
    // Por ejemplo, un gráfico que muestre la cantidad de entradas por formulario
    const formCounts = formEntries.reduce((acc, entry) => {
      acc[entry.formTitle] = (acc[entry.formTitle] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Entradas por Formulario</h3>
        <div className="space-y-2">
          {Object.entries(formCounts).map(([formTitle, count]) => (
            <div key={formTitle} className="flex items-center">
              <div className="w-1/2 text-sm">{formTitle}</div>
              <div className="w-1/2 bg-blue-200 rounded">
                <div
                  className="bg-blue-500 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded"
                  style={{ width: `${(count / formEntries.length) * 100}%` }}
                >
                  {count}
                </div>
              </div>
            </div>
          ))}
        </div>
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
          <h1 className="text-2xl font-bold text-white">Dashboard de Datos</h1>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1 rounded ${viewMode === 'table' ? 'bg-white text-indigo-800' : 'bg-indigo-700 text-white'}`}
          >
            <List size={20} />
          </button>
          <button
            onClick={() => setViewMode('chart')}
            className={`px-3 py-1 rounded ${viewMode === 'chart' ? 'bg-white text-indigo-800' : 'bg-indigo-700 text-white'}`}
          >
            <BarChart size={20} />
          </button>
          <button
            onClick={downloadCSV}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
          >
            <Download size={20} className="mr-2" />
            CSV
          </button>
        </div>
      </header>

      <main className="flex-grow p-6 overflow-y-auto">
        <div className="bg-white rounded-lg p-6 text-black">
          {viewMode === 'table' ? renderTable() : renderChart()}
        </div>
      </main>
    </div>
  )
}

export default DataDashboard