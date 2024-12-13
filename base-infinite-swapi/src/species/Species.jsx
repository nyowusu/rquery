export function Species({
  name,
  language,
  averageLifespan,
  classification,
  averageHeight,
}) {
  return (
    <li>
      {name}
      <ul>
        <li>language: {language}</li>
        <li>average lifespan: {averageLifespan}</li>
        <li>average height: {averageHeight}</li>
        <li>classification: {classification}</li>
      </ul>
    </li>
  );
}
