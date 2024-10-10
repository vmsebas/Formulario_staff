import React from 'react'

interface ConfirmationProps {
  formData: {
    firstName: string
    lastName: string
    email: string
    phone: string
    preferences: string[]
  }
}

const Confirmation: React.FC<ConfirmationProps> = ({ formData }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Confirmation</h2>
      <p className="text-sm text-gray-600 mb-4">
        Please review your information before submitting:
      </p>
      <div className="bg-gray-100 p-4 rounded-md">
        <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
        <p><strong>Email:</strong> {formData.email}</p>
        <p><strong>Phone:</strong> {formData.phone}</p>
        <p><strong>Communication Preferences:</strong> {formData.preferences.join(', ')}</p>
      </div>
      <p className="text-sm text-gray-600 mt-4">
        If everything looks correct, please click the Submit button below.
      </p>
    </div>
  )
}

export default Confirmation