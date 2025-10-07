import React, { useState } from 'react';
import { EmergencyCall, PatientCareRecord } from '../types';
import { FileTextIcon } from './icons/FileTextIcon';

interface PatientCareRecordFormProps {
  call: EmergencyCall;
  onSubmit: (pcrData: Omit<PatientCareRecord, 'id' | 'callId'>) => void;
  onCancel: () => void;
}

const PatientCareRecordForm: React.FC<PatientCareRecordFormProps> = ({ call, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    patientVitals: '',
    treatmentsAdministered: '',
    medications: '',
    transferDestination: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="container mx-auto mt-10 p-6">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6 border-b dark:border-gray-700 pb-4">
            <FileTextIcon className="h-8 w-8 text-blue-500"/>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Patient Care Record</h2>
        </div>
        
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Incident Details</h3>
            <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-700 dark:text-gray-300">
                <p><span className="font-medium">Location:</span> {call.location}</p>
                <p><span className="font-medium">Time:</span> {call.timestamp.toLocaleString()}</p>
                <p><span className="font-medium">Caller:</span> {call.callerName}</p>
                <p><span className="font-medium">Priority:</span> {call.priority}</p>
            </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="patientVitals" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Patient Vitals</label>
              <textarea name="patientVitals" id="patientVitals" rows={3} value={formData.patientVitals} onChange={handleChange} required placeholder="e.g., BP: 120/80, HR: 85, SpO2: 98%" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-200"></textarea>
            </div>
             <div>
              <label htmlFor="treatmentsAdministered" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Treatments Administered</label>
              <textarea name="treatmentsAdministered" id="treatmentsAdministered" rows={3} value={formData.treatmentsAdministered} onChange={handleChange} required placeholder="e.g., Oxygen administered via nasal cannula at 2L/min" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-200"></textarea>
            </div>
             <div>
              <label htmlFor="medications" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Medications Given</label>
              <input type="text" name="medications" id="medications" value={formData.medications} onChange={handleChange} placeholder="e.g., Aspirin 324mg PO" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-200"/>
            </div>
             <div>
              <label htmlFor="transferDestination" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Transfer Destination</label>
              <input type="text" name="transferDestination" id="transferDestination" value={formData.transferDestination} onChange={handleChange} required placeholder="e.g., Mercy General Hospital" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-200"/>
            </div>
             <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Additional Notes</label>
              <textarea name="notes" id="notes" rows={2} value={formData.notes} onChange={handleChange} placeholder="Any other relevant information" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-200"></textarea>
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-4">
            <button type="button" onClick={onCancel} className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100 font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
              Cancel
            </button>
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
              Submit Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientCareRecordForm;
