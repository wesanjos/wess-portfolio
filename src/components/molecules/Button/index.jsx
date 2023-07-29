import { useContext } from 'react';
import { AppContext } from '../../../infra/cms/CMSProvider';

export default function Button({ btnInfo }) {
  const { viewProjects, setViewProjects } = useContext(AppContext);

  return (
    <a
      href={`${btnInfo.buttonLink}`}
      className="main-button"
      onClick={() => setViewProjects(!viewProjects)}
    >
      {btnInfo.buttonLabel}
    </a>
  );
}
