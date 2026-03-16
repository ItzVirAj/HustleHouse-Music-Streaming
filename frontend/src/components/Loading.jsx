import "./Loading.css";

const Loading = () => {
  return (
    <div className="loading-aurora">
      <div className="loading-wrapper">
        <div className="loading-ring">
          <div className="ring-segment ring-1"></div>
          <div className="ring-segment ring-2"></div>
          <div className="ring-segment ring-3"></div>
        </div>
        <div className="loading-brand">
          <span className="loading-logo">♪</span>
        </div>
      </div>
      <p className="loading-text">Loading your music...</p>
    </div>
  );
};

export default Loading;
