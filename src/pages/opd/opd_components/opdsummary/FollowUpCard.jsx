const FollowUpCard = ({ followup }) => {
  return (
    <div className="bg-white border rounded-xl">
      <div className="p-4 border-b font-semibold">Follow-up</div>

      <div className="p-4 flex gap-4">
        <div className="bg-blue-100 w-full text-blue-700 font-semibold rounded-lg text-lg flex items-center justify-center">
          OCT 19
        </div>

        <div className="text-sm text-gray-700">
          <div className="font-semibold mb-1">In 1 Week ({followup?.date})</div>
          {followup?.text}
        </div>
      </div>
    </div>
  );
};

export default FollowUpCard;
