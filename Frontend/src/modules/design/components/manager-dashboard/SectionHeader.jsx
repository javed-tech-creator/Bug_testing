const SectionHeader = ({ title, actionText, onAction }) => {
  return (
    <div className="flex items-center justify-between mt-5 border-2 px-4 py-2 rounded-t-sm">
      <h2 className="text-lg font-semibold text-gray-800">
        {title}
      </h2>

      {actionText && (
        <button
          onClick={onAction}
          className="text-blue-600 font-medium hover:underline"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default SectionHeader;
