import { useState, cloneElement } from 'react';

export default function CustomToolTip({ title, children }) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {cloneElement(children, { className: `${children.props.className || ''} relative z-10` })}

      {visible && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs rounded py-1 px-2 shadow-lg z-50">
          {title}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45 mt-0.5"></div>
        </div>
      )}
    </div>
  );
}
