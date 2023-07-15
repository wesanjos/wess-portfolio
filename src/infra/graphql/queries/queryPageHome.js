const queryPageHome = `
query {
  pageHome {
    pageContent {
      section {
        componentName: __typename
        ... on ComponentMenuRecord {
          id
          menuLogo {
            id
            logoImage {
              id
              url
              alt
              width
              height
            }
            logoName
            logoLink
          }
          menuLinks {
            id
            label
            link
            target
          }
        }
        ... on ComponentHeroRecord {
          id
          content {
            id
            title
            name
            text {
              value
            }
            work {
              id
              title
              content {
                value
              }
            }
          }
          photo {
            id
            photo {
              id
              url
              alt
              width
              height
            }
          }
          anchor {
            id
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
            projectImage {
              id
              url
              alt
              width
              height
            }
            serviceType
            client
            projectTitle
            projectDescription
            projectLink {
              id
              title
              buttonLabel
              buttonLink
              buttonTarget
            }
          }
        }
        ... on ComponentFooterRecord {
          id
          footerLogo {
            id
            logoImage {
              url
              alt
              width
              height
            }
            logoName
            logoLink
          }
          footerText
          footerSocial {
            id
            icon {
              id
              url
              alt
              width
              height
            }
            text
            cta
            url
          }
        }
      }
    }
  }
}
`;

export default queryPageHome;
