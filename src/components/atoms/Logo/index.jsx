export default function Logo({ logoInfo }) {
  return (
    <a href={`${logoInfo.logoLink}`} className="logo">
      <h3>{logoInfo.logoName}</h3>
    </a>
  );
}
