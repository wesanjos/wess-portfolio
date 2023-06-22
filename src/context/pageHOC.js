import CMSProvider from '../infra/cms/CMSProvider';

export default function pageHOC(Component) {
  return function Wrapper(props) {
    const { cmsContent } = props;
    return (
      <CMSProvider cmsContent={cmsContent}>
        <Component {...props} />
      </CMSProvider>
    );
  };
}
