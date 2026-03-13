const ClinicalSummary = ({ diagnosis, notes }) => {
  return (
    <div className="bg-white border rounded-xl">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="font-semibold">Clinical Summary</h3>
        <button className="text-blue-600 text-sm">Edit Note</button>
      </div>

      <div className="p-4 space-y-5">
        <div>
          <div className="text-sm text-gray-500 mb-2">DIAGNOSIS</div>

          <div className="flex gap-3 items-center">
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
              Primary
            </span>
            {diagnosis?.primary}
          </div>

          <div className="mt-2 text-sm text-gray-700">
            Secondary {diagnosis?.secondary}
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-500 mb-2">CLINICAL NOTES</div>
          <p className="text-sm text-gray-700 leading-relaxed">{notes}</p>
        </div>
      </div>
    </div>
  );
};

export default ClinicalSummary;
