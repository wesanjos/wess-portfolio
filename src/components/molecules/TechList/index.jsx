export default function TechList({ techList }) {
  return (
    <ul className="techList">
      {techList.map((name) => (
        <li key={name} className="techList__item">
          {name}
        </li>
      ))}
    </ul>
  );
}
