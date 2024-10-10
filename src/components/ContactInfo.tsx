import React from 'react'

interface ContactInfoProps {
  formData: {
    email: string
    phone: string
  }
  updateFormData: (data: Partial<{ email: string; phone: string }>) => void
}

const ContactInfo: React.FC<ContactInfoProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => updateFormData({ email: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) => updateFormData({ phone: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>
    </div>
  )
}

export default ContactInfo