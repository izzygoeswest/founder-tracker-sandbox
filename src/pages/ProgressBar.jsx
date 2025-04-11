const ProgressBar = ({ currentStage }) => {
  const stages = ['Ideation', 'Planning', 'Launch', 'Funding'];
  const currentIndex = stages.indexOf(currentStage);

  return (
    <div className="flex items-center space-x-2">
      {stages.map((stage, i) => (
        <span
          key={stage}
          className={px-2 py-1 rounded-full text-xs font-semibold transition ${
            i < currentIndex
              ? 'bg-green-600 text-white'
              : i === currentIndex
              ? 'bg-blue-600 text-white'
              : 'bg-gray-600 text-gray-300'
          }}
        >
          {stage}
        </span>
      ))}
    </div>
  );
};

export default ProgressBar;
