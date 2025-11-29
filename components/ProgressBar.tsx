type Props = {
  min: number;
  max: number;
  value: number;
  width?: number | string;
};

const ProgressBar = ({ min, max, value, width }: Props) => {
  const progressWidth = (value * (max - min)) / (max - min);
  return (
    <div
      className={`h-3 overflow-hidden rounded-full bg-site-foreground`}
      style={{
        width: typeof width === "number" ? `${width}px` : width || "100%",
      }}
    >
      <div
        className={`h-full bg-mainColor-600 transition-all`}
        style={{
          width: `${progressWidth}%`,
        }}
      ></div>
    </div>
  );
};

export default ProgressBar;
