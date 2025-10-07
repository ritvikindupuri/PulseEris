import React, { useState, useEffect, useRef } from 'react';
import { EmergencyCall, Priority } from '../types';
import { GoogleGenAI } from "@google/genai";
import { SparklesIcon } from './icons/SparklesIcon';

type CallFormData = Omit<EmergencyCall, 'id' | 'timestamp' | 'status' | 'pcrId' | 'assignedTo'>;

interface LogCallFormProps {
  onSubmit: (callData: CallFormData) => void;
  onCancel: () => void;
}

const LogCallForm: React.FC<LogCallFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<CallFormData>({
    callerName: '',
    phone: '',
    location: '',
    landmark: '',
    description: '',
    priority: 3,
  });
  const [isSuggesting, setIsSuggesting] = useState(false);
  const debounceTimeout = useRef<number | null>(null);

  const fetchPrioritySuggestion = async (description: string) => {
    if (description.trim().length < 10) { // Don't run on very short descriptions
        setIsSuggesting(false);
        return;
    }
    setIsSuggesting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Analyze the following emergency description and classify it into one of four priority levels. 
      Priority 1: Life-threatening (e.g., cardiac arrest, not breathing, severe bleeding, chest pain). 
      Priority 2: Serious, not immediately life-threatening (e.g., broken bones, fall, deep cut). 
      Priority 3: Urgent, not life-threatening (e.g., minor car accident, sprain, fever). 
      Priority 4: Non-urgent. 
      Only respond with a single digit: 1, 2, 3, or 4.
      Description: "${description}"`;
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });

      const suggestedPriorityText = response.text.trim();
      const suggestedPriority = parseInt(suggestedPriorityText, 10);

      if (!isNaN(suggestedPriority) && suggestedPriority >= 1 && suggestedPriority <= 4) {
        setFormData(prev => ({ ...prev, priority: suggestedPriority as Priority }));
      }
    } catch (error) {
      console.error("Error fetching priority suggestion:", error);
    } finally {
      setIsSuggesting(false);
    }
  };

  useEffect(() => {
    if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
    }
    // Set loading to true as soon as the user starts typing
    if (formData.description.trim().length > 10) {
        setIsSuggesting(true);
    }
    debounceTimeout.current = window.setTimeout(() => {
        fetchPrioritySuggestion(formData.description);
    }, 1000); // 1-second debounce

    return () => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
    };
  }, [formData.description]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'priority' ? parseInt(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="container mx-auto mt-10 p-6">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 border-b dark:border-gray-700 pb-4">Log New Emergency Call</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="callerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Caller Name</label>
              <input type="text" name="callerName" id="callerName" value={formData.callerName} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-200"/>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
              <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-200"/>
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
            <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-200"/>
          </div>

          <div className="mt-6">
            <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nearest Landmark <span className="text-xs text-gray-500">(Optional)</span></label>
            <input type="text" name="landmark" id="landmark" value={formData.landmark || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-200"/>
          </div>

          <div className="mt-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description of Emergency</label>
            <textarea name="description" id="description" rows={4} value={formData.description} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-200"></textarea>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <SparklesIcon className="h-3 w-3 text-blue-400" />
              Priority is automatically suggested by AI based on the description.
            </p>
          </div>
          
          <div className="mt-6">
            <label htmlFor="priority" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Priority
              {isSuggesting && <SparklesIcon className="h-4 w-4 text-blue-500 animate-pulse" />}
            </label>
            <select id="priority" name="priority" value={formData.priority} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              <option value={1}>1 (Highest)</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4 (Lowest)</option>
            </select>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button type="button" onClick={onCancel} className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100 font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
              Cancel
            </button>
            <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
              Log Call
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogCallForm;