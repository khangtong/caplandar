import { useEffect, useState } from 'react';

export default function Display({ active }: { active: string }) {
  const [lunar, setLunar] = useState(true);

  useEffect(() => {
    setLunar(localStorage.getItem('lunar') === 'true' ? true : false);
  }, []);

  return (
    <form
      action=""
      id="display"
      className={`${
        active === 'display' ? '' : 'hidden'
      } max-h- py-6 px-16 ml-64`}
      style={{ maxHeight: 'calc(100vh - 151.2px)' }}
    >
      <div className="form-check form-switch">
        <div className="flex items-center">
          <label className="relative inline-flex items-center cursor-pointer mr-2">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={lunar}
              onChange={() => {
                setLunar(!lunar);
                localStorage.setItem('lunar', (!lunar).toString());
              }}
            />
            <div className="group peer bg-white rounded-full duration-300 w-8 h-4 ring-2 ring-red-500 after:duration-300 after:bg-red-500 peer-checked:after:bg-green-500 peer-checked:ring-green-500 after:rounded-full after:absolute after:h-2 after:w-2 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-hover:after:scale-95"></div>
          </label>
          <label className="form-check-label" htmlFor="display-lunar-days">
            Lunar days
          </label>
        </div>
        <div className="text-sm text-gray-400 font-light">
          Turn on to display lunar days on your calendar.
        </div>
      </div>
    </form>
  );
}
