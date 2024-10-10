import React from 'react'

interface PersonalInfoProps {
  formData: {
    firstName: string
    lastName: string
  }
  updateFormData: (data: Partial<{ firstName: string; lastName: string }>) => void
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
          First Name
        </label>
        <input
          type="text"
          id="firstName"
          value={formData.firstName}
          onChange={(e) => updateFormData({ firstName: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
          Last Name
        </label>
        <input
          type="text"
          id="lastName"
          value={formData.lastName}
          onChange={(e) => updateFormData({ lastName: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>
    </div>
  )
}

export default PersonalInfo