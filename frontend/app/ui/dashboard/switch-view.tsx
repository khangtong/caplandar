import { useState } from 'react';

export default function SwitchView() {
  const [view, setView] = useState('month');

  return (
    <div
      onClick={() => {
        view === 'month' ? setView('week') : setView('month');
      }}
      className="relative flex bg-gray-100 rounded-lg p-1 text-sm font-medium justify-between cursor-pointer"
    >
      <span
        className={`absolute top-1/2 ${
          view === 'month' ? 'left-1' : 'left-19'
        } h-4/5 w-12/25 -translate-y-1/2 text-neutral-800 bg-white rounded duration-300`}
      ></span>
      <div className="py-1 px-2 z-10 w-18 text-center">Month</div>
      <div className="py-1 px-2 z-10 w-18 text-center">Week</div>
    </div>
  );
}
