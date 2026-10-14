const Loader = ({ text = "Loading..." }) => (
  <div className="loader-wrap">
    <div className="spinner" />
    {text && <p className="muted">{text}</p>}
  </div>
);

export default Loader;