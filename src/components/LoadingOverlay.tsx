const LoadingOverlay = ({ show }: { show: boolean }) => {
  return show ? (
    <div className="loading-overlay">
      <div className="loading-spinner-aspect" />
      <div>Please don't close or reload the window.</div>
    </div>
  ) : (
    <></>
  );
};

export default LoadingOverlay;
