const queryPageHome = `
query {
  pageHome {
    pageContent {
      section {
        componentName: __typename
        ... on ComponentHeroRecord {
          id
          heading {
            id
            titlePrimary
            subtitle
          }
          roleList {
            id
            nameRole
          }
          socialList {
            id
            icon {
              id
              url
            }
            text
            cta
            url
          }
          anchor {
            id
            icon {
              id
              url
            }
            label
            linkId
          }
        }
        ... on ComponentWorkRecord {
          id
          workHeader {
            id
            title
            subtitle
          }
          workList {
            id
            title
            serviceType
            projectTitle {
              value
            }
            projectDescription
            projectLink {
              id
              title
              buttonLabel
              buttonLink
              buttonTarget
              buttonIcon {
                id
                url
              }
            }
          }
        }
        ... on ComponentAboutRecord {
          id
          aboutHeader {
            id
            title
            subtitle
          }
          aboutImage {
            id
            title
            photo {
              id
              url
              alt
            }
          }
          aboutContent {
            id
            title
            text {
              value
            }
            resume {
              id
              title
              buttonLabel
              buttonLink
              buttonTarget
              buttonIcon {
                id
                url
                alt
              }
            }
            listSkill {
              id
              title
              skillImage {
                id
                url
                alt
              }
              skillName
            }
          }
        }
      }
    }
  }
}
`;

export default queryPageHome;
