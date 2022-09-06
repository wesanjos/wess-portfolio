import Marquee from 'react-fast-marquee';

import Skill from '../../atoms/Skill';

export default function SkillsList() {
  return (
    <div className="skillsList">
      <div className="skillsList__overlay" />
      <div className="skillsList__container">
        <Marquee gradient="" speed={80}>
          <Skill skillName="JavaScript" srcIcon="/assets/icons/icon-js.svg" />
          <Skill skillName="TypeScript" srcIcon="/assets/icons/icon-ts.svg" />
          <Skill skillName="React" srcIcon="/assets/icons/icon-react.svg" />
          <Skill skillName="Nextjs" srcIcon="/assets/icons/icon-nextjs.svg" />
          <Skill skillName="Nodejs" srcIcon="/assets/icons/icon-nodejs.svg" />
          <Skill skillName="MongoDb" srcIcon="/assets/icons/icon-mongodb.svg" />
          <Skill skillName="SASS" srcIcon="/assets/icons/icon-sass.svg" />
          <Skill skillName="Wordpress" srcIcon="/assets/icons/icon-wp.svg" />
          <Skill
            skillName="Adobe XD"
            srcIcon="/assets/icons/icon-adobexd.svg"
          />
          <Skill skillName="Figma" srcIcon="/assets/icons/icon-figma.svg" />
        </Marquee>
      </div>
    </div>
  );
}
