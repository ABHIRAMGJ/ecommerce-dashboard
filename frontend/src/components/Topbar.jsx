export default function Topbar({ title, sub, children }) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
  return (
    <header className="topbar">
      <div>
        <h1>{title}</h1>
        <div className="sub">{sub || today.toUpperCase()}</div>
      </div>
      <div className="topbar-right">{children}</div>
    </header>
  );
}
