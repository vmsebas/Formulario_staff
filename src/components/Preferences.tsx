import React from 'react'

interface PreferencesProps {
  formData: {
    preferences: string[]
  }
  updateFormData: (data: Partial<{ preferences: string[] }>) => void
}

const Preferences: React.FC<PreferencesProps> = ({ formData, updateFormData }) => {
  const options = ['Email', 'Phone', 'SMS', 'Mail']

  const handleCheckboxChange = (option: string) => {
    const updatedPreferences = formData.preferences.includes(option)
      ? formData.preferences.filter((pref) => pref !== option)
      : [...formData.preferences, option]
    updateFormData({ preferences: updatedPreferences })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Communication Preferences</h2>
      <p className="text-sm text-gray-600 mb-4">
        How would you like us to contact you? (Select all that apply)
      </p>
      {options.map((option) => (
        <div key={option} className="flex items-center">
          <input
            type="checkbox"
            id={option}
            checked={formData.preferences.includes(option)}
            onChange={() => handleCheckboxChange(option)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor={option} className="ml-2 block text-sm text-gray-900">
            {option}
          </label>
        </div>
      ))}
    </div>
  )
}

export default Preferences