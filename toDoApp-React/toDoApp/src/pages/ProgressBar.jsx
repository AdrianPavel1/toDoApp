function ProgressBar({ progress }) {
  const colors = [
    "rgb(34, 34, 34)",
    "rgb(67, 97, 115)",
    "rgb(101, 67, 33)",
    "rgb(55, 86, 107)",
    "rgb(72, 61, 139)",
    "rgb(64, 64, 64)",
    "rgb(0, 48, 73)",
    "rgb(83, 104, 114)",
    "rgb(93, 153, 129)",
    "rgb(128, 128, 0)",
  ];

  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  return (
    <>
      <div className="outer-bar">
        <div
          className="inner-bar"
          style={{ width: `${progress}%`, backgroundColor: randomColor }}
        ></div>
      </div>
    </>
  );
}

export default ProgressBar;
