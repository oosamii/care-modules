const Section = ({ title, button, onButtonClick, columns, rows }) => {
  return (
    <div className="bg-white border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">{title}</h3>

        {button && (
          <button
            onClick={onButtonClick}
            className="text-sm border rounded-lg px-3 py-1 hover:bg-gray-50"
          >
            {button}
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="p-3 text-left">
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                {row.map((cell, j) => (
                  <td key={j} className="p-3">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Section;
