import React from 'react';

interface Props {
  log: string[];
}

const Journal: React.FC<Props> = ({ log }) => {
  return (
    <div className="h-48 overflow-y-auto bg-gray-800 p-2 rounded mt-2">
      {log.map((entry, idx) => (
        <div key={idx} className="text-sm mb-1">
          - {entry}
        </div>
      ))}
    </div>
  );
};

export default Journal;
