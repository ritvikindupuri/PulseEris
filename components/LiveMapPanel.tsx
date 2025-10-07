
import React from 'react';
import { GpsIcon } from './icons/GpsIcon';

interface LiveMapPanelProps {
  location: string;
}

const LiveMapPanel: React.FC<LiveMapPanelProps> = ({ location }) => {
  return (
    <div className="relative w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <GpsIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto" />
        <p className="mt-2 font-semibold text-gray-600 dark:text-gray-300">Map of: {location}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">(Live map feature placeholder)</p>
      </div>
    </div>
  );
};

export default LiveMapPanel;
