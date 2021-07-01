import {
  useState,
  useEffect,
  useLayoutEffect,
  useContext,
  useCallback,
  createContext,
  Fragment,
  useRef,
  Children,
  cloneElement,
} from "react";
import { createClient } from "contentful";
import styled, { keyframes, createGlobalStyle, css } from "styled-components";
import { Remarkable } from "remarkable";
import hljs from "highlight.js";
import "highlight.js/styles/agate.css";

// icons
import {
  FiCalendar,
  FiSun,
  FiChevronLeft,
  FiArrowRight,
  FiMoon,
} from "react-icons/fi";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

// app_context
const AppContext = createContext();
const useAppContext = () => useContext(AppContext);

const SPACE_ID = "jzi320sswukf";
const ENVIRONMENT_ID = "master";
const ACCESS_TOKEN =
  "ea152cee3c2d857297230cc68e141647ee9cbc5bf7cd178fea6e2c58940f86ca";

// contentful_client
const client = createClient({
  space: SPACE_ID,
  environment: ENVIRONMENT_ID,
  accessToken: ACCESS_TOKEN,
});

// tablet breakpoint
const tablet = "768px";

// global_styles
const GlobalStyles = createGlobalStyle`
  html {
    // Light colors
    --bg-0: #F4F4F5;
    --bg-1: #FFFFFF;
    --bg-2: #A1A1AA;
    --bg-3: #262626;
    --txt-0: #52525B;
    --txt-1: #3F3F46;
    --txt-2: #3F3F46;
    --txt-3: #2563EB;
    --txt-4: #EF4444;
   
    /* fonts */
    --fallbacks:  -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    --font-brand: 'Dancing Script', var(--fallbacks);
    --font-title: 'Montserrat', var(--fallbacks);   
    --font-body: 'Inter', var(--fallbacks);
    --font-normal: 400;
    --font-bold: 600;

    /* spacing */
    --space-0: 0;
    --space-1: 5px;
    --space-2: 10px;
    --space-3: 15px;
    --space-4: 20px;

    /* line heights */
    --line-height-1: 1;
    --line-height-2: 1.25;
    --line-height-3: 1.5;
    --line-height-4: 1.75;

    /* zindices */
    --z-index-1: 100;
    --z-index-2: 200;
    --z-index-3: 300;


    font-size: 100%;
    box-sizing: border-box;
    font-family: var(--font-body);
    font-weight: var(--font-normal);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  html, body, div, span, object, iframe,h1, h2, h3, h4, h5, h6, p, blockquote, pre,abbr, address, cite, code,del, dfn, em, img, ins, kbd, q, samp,small, strong, sub, sup, var,b, i,dl, dt, dd, ol, ul, li,fieldset, form, label, legend,table, caption, tbody, tfoot, thead, tr, th, td,article, aside, canvas, details, figcaption, figure, footer, header, hgroup, menu, nav, section, summary,time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    outline: 0;
    vertical-align: baseline;
    background: transparent;
  }

  nav ul {
    list-style: none;
  }

  a {
    margin: 0;
    padding: 0;
    font-size: 100%;
    vertical-align: baseline;
    background: transparent;
  }

  input, select {
    vertical-align: middle;
  }

  body {
    line-height: var(--line-height-3);
    color: var(--txt-0);
    background-color: var(--bg-0);
  }
 
   // Dark colors
  .dark {
    --bg-0: #262626;
    --bg-1: #3A3A3A;
    --bg-2: #3A3A3A;
    --bg-3: #3A3A3A;
    --txt-0: #FCCA98;
    --txt-1: #FEEAD7;
    --txt-3: #FF8700;
    --txt-3: #529E52;
    --txt-4: transparent;
    --txt-4: #FF8700;
   }
`;

// navbar height
const NAVBAR_HEIGHT = "64px";

// margins
const marginProps = (props) => {
  const { mt, mb, ml, mr, mx, my } = props;
  let mgs = "";

  if (mt) mgs += `margin-top: ${mt};`;
  if (mb) mgs += `margin-bottom: ${mb};`;
  if (ml) mgs += `margin-left: ${ml};`;
  if (mr) mgs += `margin-right: ${mr};`;
  if (mx) mgs += `margin-left: ${mx}; margin-right: ${mx};`;
  if (my) mgs += `margin-top: ${my}; margin-bottom: ${my};`;

  return css`
    ${mgs}
  `;
};

// paddings
const paddingProps = (props) => {
  const { pt, pb, pl, pr, px, py } = props;
  let pds = "";

  if (pt) pds += `padding-top: ${pt};`;
  if (pb) pds += `padding-bottom: ${pb};`;
  if (pl) pds += `padding-left ${pl};`;
  if (pr) pds += `padding-right ${pr};`;
  if (px) pds += `padding-left : ${px}; padding-right : ${px};`;
  if (py) pds += `padding-top: ${py}; padding-bottom: ${py};`;

  return css`
    ${pds}
  `;
};

const flexProps = (props) => {
  const { items, justify, direction, wrap, gap } = props;
  let flx = "";

  if (direction) flx += `flex-direction: ${direction};`;
  if (items) flx += `align-items: ${items};`;
  if (justify) flx += `justify-content: ${justify};`;
  if (wrap) flx += `flex-wrap: ${wrap};`;
  if (gap) flx += `gap: ${gap};`;

  return css`
    ${flx}
  `;
};

const colorProps = (props) => {
  const { color, bgcolor } = props;
  let clr = "";
  if (color) clr += `color: ${color}`;
  if (bgcolor) clr += `background-color: ${bgcolor}`;
  return css`
    ${clr}
  `;
};

const Box = styled.div`
  ${(props) => marginProps(props)}
  ${(props) => paddingProps(props)}
  ${(props) => colorProps(props)}
`;

const Flex = styled(Box)`
  ${(props) => flexProps(props)}
  display: flex;
`;

const HomeWrapper = ({ children, ...props }) => {
  return (
    <Flex
      style={{ minHeight: `calc(100vh - ${NAVBAR_HEIGHT} - 100px)` }}
      {...props}
    >
      {children}
    </Flex>
  );
};

const ArticlesWrapper = ({ children, style, ...props }) => {
  return (
    <Flex
      justify="flex-start"
      direction="column"
      pt="calc(var(--space-4) * 1.5)"
      pb="calc(var(--space-4) * 5)"
      pl="var(--space-3)"
      pr="var(--space-3)"
      style={{ minHeight: "calc(100vh - 300px)", ...style }}
      {...props}
    >
      {children}
    </Flex>
  );
};

const ButtonLink = styled(Flex)`
  align-items: center;
  font-size: 100%;
  padding: 0;
  appearance: none;
  border: none;
  background-color: transparent;
  color: var(--txt-3);
`;

const Typography = ({ children, ...props }) => {
  return (
    <Box as="p" my="var(--space-3)" {...props}>
      {children}
    </Box>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding-left: var(--space-3);
  padding-right: var(--space-3);

  @media (min-width: ${tablet}) {
    & {
      width: 70%;
      padding: var(--space-0);
    }
  }
`;

const ActivityWrapper = styled(Flex)`
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const spin = keyframes`
  to { transform: rotate(360deg);}
`;

const Loader = styled.div`
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  border: 3px solid var(--bg-1);
  border-top-color: var(--txt-3);
  border-right-color: var(--txt-3);
  animation: ${spin} 1s linear infinite;
`;

const FooterWrapper = styled.footer`
  width: 100vw;
  font-size: 0.85rem;
  text-align: center;
  padding: calc(var(--space-4) * 2) 0;
  background-color: var(--bg-1);
`;

const TextLink = ({ children, style, ...props }) => {
  return (
    <Typography
      as="a"
      href="#"
      color="var(--txt-3)"
      style={{ ...style }}
      {...props}
    >
      {children}
    </Typography>
  );
};

const Brand = styled.div`
  font-size: 1.1rem;
  font-family: var(--font-title);
  font-weight: var(--font-bold);
  letter-spacing: 1px;
`;

const ContentWrapper = ({ children, ...props }) => {
  return (
    <Flex
      mt={`${NAVBAR_HEIGHT}`}
      pt="calc(var(--space-4) * 2)"
      pb="calc(var(--space-4) * 5)"
      style={{ minHeight: `calc(100vh - ${NAVBAR_HEIGHT})` }}
      {...props}
    >
      {children}
    </Flex>
  );
};

const Time = styled.time`
  width: 100%;
  font-family: var(--font-title);
  font-size: 0.8rem;
`;

const Heading = ({ children, style, ...props }) => {
  return (
    <Typography
      color="var(--txt-1)"
      style={{ fontFamily: "var(--font-title)", ...style }}
      {...props}
    >
      {children}
    </Typography>
  );
};

const ImageWrapper = styled(Box)`
  margin: 0 auto;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  border: 3px solid var(--txt-0);
`;

const MarkdownContent = styled.article`
  margin-top: calc(var(--space-4) * 3);

  p + p {
    margin-top: var(--space-3);
  }

  ul,
  ol {
    margin-left: var(--space-3);
    line-height: var(--line-height-4);
  }

  h3,
  h4 {
    font-family: var(--font-title);
    margin: calc(var(--space-4) * 2) 0 var(--space-4);
    color: var(--txt-1);
  }

  h3 + h4 {
    margin-top: var(--space-1);
  }

  pre {
    font-size: 0.9rem;
    padding: calc(var(--space-4) * 1.5);
    line-height: var(--line-height-2);
    color: var(--white);
    background-color: var(--bg-3);
    margin: var(--space-4) 0;
    border-radius: 4px;
    min-width: 100%;
    overflow: auto;
  }

  mark {
    font-weight: bold;
    color: var(--txt-4);
    padding: 2px;
    border-radius: 2px;

    code {
      font-family: var(--font-body);
    }
  }

  #post-img {
    margin: calc(var(--space-4) * 2) 0;
    img {
      width: 100%;
    }
  }

  #post-img-title {
    position: relative;
    top: -2.2em;
  }

  .info {
    border: 1px solid var(--codify);
    color: var(--codify);
    padding: var(--space-3);
    font-size: 0.9rem;
    position: relative;
  }
`;

// useRemarkable converts markdown to html contents
function useRemarkable(props) {
  const md = new Remarkable({
    html: true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value;
        } catch (error) {}
      }

      try {
        return hljs.highlightAuto(str).value;
      } catch (error) {}

      return "";
    },
  });
  // enable more capabilities
  md.inline.ruler.enable(["footnote_inline", "ins", "mark", "sub", "sup"]);
  return md.render(props);
}

// usePageScroll dynamically reads changes to
// how much page has been scrolled
function usePageScroll() {
  const [offsetTop, setOffsetTop] = useState(0);

  useEffect(() => {
    const handleOffsetTop = () => {
      setOffsetTop(window.pageYOffset);
    };

    window.addEventListener("scroll", handleOffsetTop);
    return () => window.removeEventListener("scroll", handleOffsetTop);
  }, [offsetTop]);

  return offsetTop;
}

const SocialContact = ({ children, url, ...props }) => {
  let render = Children.map(children, (child) => {
    return cloneElement(child, { size: 24 });
  });

  return (
    <TextLink
      href={url}
      target="_blank"
      rel="noreferrer"
      color="var(--txt-0)"
      my="0"
      {...props}
    >
      {render}
    </TextLink>
  );
};

const IMAGE_ASSETS = "2dmBvE3pqzChaplVyTqdtw";

function Footer({ activeRoute }) {
  const { cached } = useAppContext();
  const [image, setImage] = useState(() => cached.profileImage.current);
  const [imageIsLoading, setImageIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const fetchCount = useRef(0);

  const fetchProfilePic = useCallback(async () => {
    setImageIsLoading(true);
    try {
      const assets = await client.getAsset(IMAGE_ASSETS);
      setImage(assets.fields.file.url);
      setImageIsLoading(false);
    } catch (error) {
      setImageIsLoading(false);
      setHasError(true);
    }
  }, []);

  // retrieve profile image from
  // contentful assets
  useEffect(() => {
    let timer;
    const delay = 10000;

    if (image.length === 0) {
      fetchProfilePic();
      return;
    }

    function clearTimer() {
      fetchCount.current = 0;
      clearTimeout(timer);
    }

    if (fetchCount.current <= 3) {
      timer = setTimeout(function getPic() {
        fetchCount.current += 1;
        fetchProfilePic();
        timer = setTimeout(getPic, delay);
      }, delay);
    } else {
      return clearTimer();
    }
  }, [fetchProfilePic, image]);

  return (
    <FooterWrapper
      style={{ padding: activeRoute === Routes.HOME && "var(--space-4)" }}
    >
      <Container>
        <ImageWrapper>
          {imageIsLoading && !image.length && <ActivityIndicator mx="auto" />}
          <Box
            style={{
              position: "absolute",
              top: 0,
              left: 0,
            }}
          >
            <img
              src={`https:${image}`}
              alt={hasError && "YANKEY"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: hasError ? "relative" : "static",
                top: hasError ? 28 : 0,
                left: hasError ? 11 : 0,
              }}
            />
          </Box>
        </ImageWrapper>
        <Flex
          justify="center"
          my="var(--space-4)"
          gap="var(--space-4)"
          color="var(--gray500)"
        >
          <SocialContact href="">
            {/* <i className="fa fa-github"></i>*/}
            <FaGithub />
          </SocialContact>
          <SocialContact href="https://www.linkedin.com/in/benneth-yankey-23201232">
            {/* <i classname="fa fa-linkedin"></i>*/}
            <FaLinkedin />
          </SocialContact>
          <SocialContact href="https://twitter.com/benbright1">
            {/* <i className="fa fa-twitter"></i> */}
            <FaTwitter />
          </SocialContact>
        </Flex>
        <Typography my="0">
          Built with <TextLink>React</TextLink> &{" "}
          <TextLink>Styled-Components</TextLink>
        </Typography>
        <Typography my="0">
          &copy; 2019 &ndash; {new Date().getFullYear()} &middot; Benneth Yankey
        </Typography>
      </Container>
    </FooterWrapper>
  );
}

function Layout({ children }) {
  return (
    <Flex as="main" direction="column" style={{ minHeight: "100vh" }}>
      {children}
    </Flex>
  );
}

const NavList = styled(Flex)`
  border-top: 2px solid var(--bg-0);
  overflow-x: auto;
`;

const NavItem = styled(Box)`
  letter-spacing: 1px;
`;

const TopBar = styled(Box)`
  ${({ isReading }) =>
    isReading &&
    css`
      position: fixed;
      top: 0;
      left: 0;
      min-width: 100vw;
      z-index: var(--z-index-3);
    `}
`;

const capitalize = (v) => {
  return v[0].toUpperCase() + v.slice(1);
};

var Routes = {
  HOME: "home",
  ARTICLES: "articles",
  RESUME: "resume",
  ABOUT: "about",
  CONTACT: "contact",
};

// navigation list
const navItems = [Routes.ARTICLES, Routes.RESUME, Routes.ABOUT, Routes.CONTACT];

function NavigationBar({
  activeRoute,
  setActiveRoute,
  setIsReading,
  isReading,
  setIsPortfolio,
  isPortfolio,
}) {
  const { cached } = useAppContext();
  const root = useRef();
  const [isLight, setIsLight] = useState(false);
  const isContentRoute = [Routes.RESUME, Routes.ABOUT, Routes.CONTACT].includes(
    activeRoute
  );
  const isReadingMode = isContentRoute || isReading || isPortfolio;

  // Activate feather icons
  useEffect(() => {
    // feather.replace();
  }, []);

  // Automatic theme switch
  useEffect(() => {
    root.current = document.documentElement;
    root.current.classList.add("dark");
  }, []);

  // Toggle theme Light / Dark
  const toggleLightMode = () => {
    root.current.classList.toggle("dark");
    setIsLight((prevTheme) => !prevTheme);
  };

  const handleRouteToggle = (route) => {
    if (isContentRoute) {
      setIsPortfolio(true);
    }
    setActiveRoute(route);
  };

  const closeReadingMode = () => {
    if (isContentRoute) {
      setActiveRoute(Routes.ARTICLES);
      setIsPortfolio(false);
      return;
    }
    setIsReading(false);
    window.scrollTo(0, cached.pageYOffset.current);
  };

  return (
    <header>
      <TopBar bgcolor="var(--bg-1)" isReading={isReadingMode}>
        <Container>
          <Flex justify="space-between" items="center" py="var(--space-4)">
            {isReadingMode && (
              <Flex
                items="center"
                color="var(--txt-1)"
                onClick={closeReadingMode}
              >
                <FiChevronLeft size={24} />
                <Typography as="span" my="0">
                  Back
                </Typography>
              </Flex>
            )}
            {!isReadingMode && (
              <Brand onClick={() => setActiveRoute(Routes.HOME)}>YANKEY</Brand>
            )}{" "}
            {/* <i data-feather="sun"></i> */}
            {/* <i data-feather="moon"></i> */}
            {isLight && <FiSun size={24} onClick={() => toggleLightMode()} />}
            {!isLight && <FiMoon size={22} onClick={() => toggleLightMode()} />}
          </Flex>
        </Container>
      </TopBar>
      {!isReadingMode && (
        <NavList
          justify="center"
          items="center"
          gap="var(--space-4)"
          bgcolor="var(--bg-1)"
        >
          {navItems.map((v, i) => (
            <NavItem
              key={i}
              onClick={() => handleRouteToggle(v)}
              py="var(--space-3)"
              color="var(--txt-1)"
            >
              {capitalize(v)}
            </NavItem>
          ))}
        </NavList>
      )}
    </header>
  );
}

function Home({ setActiveRoute }) {
  return (
    <HomeWrapper as="section" items="center">
      <Container>
        <Box style={{ textAlign: "center" }}>
          <Typography>Hi, I'm</Typography>
          <Heading as="h1" my="0">
            BENNETH YANKEY
          </Heading>
          <Heading as="h4" my="0">
            Software Engineer
          </Heading>
          <Typography>
            I created this site to share and document everything I have learned
            and learning with you and the world!
          </Typography>
          <ButtonLink as="button" mx="auto">
            <Typography
              as="span"
              onClick={() => setActiveRoute(Routes.CONTACT)}
            >
              Get to know me better
            </Typography>
            <FiArrowRight style={{ marginLeft: "var(--space-1)" }} />
          </ButtonLink>
        </Box>
      </Container>
    </HomeWrapper>
  );
}

const StrongTypography = ({ children, ...props }) => {
  return (
    <Typography as="strong" color="var(--txt-0)" {...props}>
      {children}
    </Typography>
  );
};

function About({ setActiveRoute, activeRoute }) {
  const { cached } = useAppContext();

  const handleRouteToggle = () => {
    cached.previousRoute.current = activeRoute;
    setActiveRoute(Routes.CONTACT);
  };

  return (
    <ContentWrapper>
      <Container>
        <Heading as="h2" style={{ textAlign: "center" }}>
          About me
        </Heading>
        <Typography>
          <StrongTypography>YANKEY </StrongTypography>is a tech blog of{" "}
          <TextLink href="#">Benneth Yankey</TextLink>, a software engineer and
          high school biology teacher from Accra, Ghana.
        </Typography>
        <Typography>
          He is passionate about software development and solving problems. He
          programs mostly in Javascript (Typescript) and Go.
        </Typography>
        <Typography>
          His primary machine is Lenovo Ideapad running Fedora Linux. Vim is his
          text editor of choice.
        </Typography>
        <Heading as="h3">Other Interests</Heading>
        <Typography>
          Aside programming here are other areas of his interest:
        </Typography>
        <Typography>
          <StrongTypography>Teaching: </StrongTypography>
          He likes to share and impact knowledge. He has been teaching Biology
          to high school pupils for past 5 years and counting. He aids pupils to
          understand and appreciate the beauty of nature.
        </Typography>
        <Typography>
          <StrongTypography>Gaming: </StrongTypography>
          He loves and has been gaming since he was 5, playing SEGA. He
          currently owns a PS4 Console and enjoys playing FIFA.
        </Typography>
        <Heading as="h3">Get in touch</Heading>
        <Typography>
          You can contact him via{" "}
          <TextLink onClick={handleRouteToggle}>contact page</TextLink>. He is
          happy to respond to projects discussion, collaborations and
          corrections or suggestions of any material.
        </Typography>
      </Container>
    </ContentWrapper>
  );
}

function Contact() {
  return (
    <ContentWrapper>
      <Container>
        <Heading as="h2" style={{ textAlign: "center" }}>
          Contact me
        </Heading>
        <Typography>
          Thanks for your interest in getting in touch with me.
        </Typography>
        <Typography>
          Please contact me via the appropriate medium, but keep in mind that
          I'll only respond to legit messages.
        </Typography>
        <Heading as="h3">Email</Heading>
        <Typography>
          My email address is{" "}
          <TextLink href="mailto: yankeybenneth@gmail.com">
            yankeybenneth@gmail.com
          </TextLink>
          . This is the best way to grab my attention in minute literally.
        </Typography>
        <Heading as="h3">Instagram</Heading>
        <Typography>
          I use instagram primarily to share things including tips and tricks
          with the tech community. Kindly follow me{" "}
          <TextLink href="https://www.instagram.com/papayankey_">here</TextLink>
          . If you want to ask a question, Instagram is the right medium and
          will definitely respond ASAP.
        </Typography>
        <Heading as="h3">What I will respond to</Heading>
        <Typography>
          I will definitely respond and be very happy to discuss with you on
          projects and collaborations. Any questions about contents produced on
          this blog will also get a response.
        </Typography>
        <Heading as="h3">What I won't respond to</Heading>
        <Typography>I won't respond if message is unclear enough.</Typography>
      </Container>
    </ContentWrapper>
  );
}

const Filters = {
  New: "new",
  React: "react",
  Node: "node",
  Go: "go",
  Javascript: "javascript",
  CSS: "css",
  Typescript: "typescript",
  NextJS: "nextjs",
  GraphQL: "graphql",
  "Computer Science": "computer science",
};

const FilterIndicator = styled.div`
  width: 4px;
  height: 50%;
  position: absolute;
  top: 0;
  left: 0;
`;

function ArticlesFilter({ activeFilter, setActiveFilter }) {
  useEffect(() => {
    // feather.replace();
  }, []);

  return (
    <Flex direction="column" items="center">
      <Flex
        wrap="wrap"
        justify="center"
        gap="var(--space-2)"
        mt="var(--space-4)"
      >
        {Object.values(Filters).map((filter, idx) => (
          <Box
            key={idx}
            px="var(--space-2)"
            py="var(--space-1)"
            style={{
              border: "1px solid var(--bg-2)",
              position: "relative",
              overflow: "hidden",
            }}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
            <FilterIndicator
              style={{
                backgroundColor: activeFilter === filter && "var(--txt-3)",
              }}
            />
          </Box>
        ))}
      </Flex>
    </Flex>
  );
}

// formats date
const formatDate = (dateString) => {
  const ordinals = {
    one: "st",
    two: "nd",
    few: "rd",
    many: "th",
    zero: "th",
    other: "th",
  };

  let formatter = new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return formatter
    .formatToParts(new Date(dateString))
    .map(({ type, value }) => {
      if (type === "day") {
        let number = Number(value);
        let ordinal = new Intl.PluralRules("en-US", { type: "ordinal" }).select(
          number
        );
        return `${number}${ordinals[ordinal]}`;
      }
      return value;
    })
    .join("");
};

const FilteredEntry = styled(Flex)`
  flex-direction: column;
  @media (min-width: ${tablet}) {
    & {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }

    & ${Time} {
      order: 2;
      justify-self: flex-end;
    }
  }
`;

function FilteredEntries({ entry, handleIsReading }) {
  useEffect(() => {
    // feather.replace();
  });

  const handleOpenArticle = (article) => {
    handleIsReading(article);
  };

  return (
    <Box>
      <Heading as="h2">{entry[0]}</Heading>
      <Box my="var(--space-4)">
        {entry[1].map((field, idx) => {
          const { published, title } = field;
          return (
            <FilteredEntry
              key={idx}
              style={{ marginTop: idx !== 0 && "var(--space-3)" }}
            >
              <Time datetime={published}>{formatDate(published)}</Time>
              <Typography
                my="0"
                mt="0"
                color="var(--txt-1)"
                onClick={() => handleOpenArticle(field)}
              >
                {title}
              </Typography>
            </FilteredEntry>
          );
        })}
      </Box>
    </Box>
  );
}

function Article({ post, handleIsReading }) {
  const { title, summary } = post;

  useEffect(() => {
    // feather.replace();
  });

  return (
    <Box mb="calc(var(--space-4) * 2)" onClick={() => handleIsReading(post)}>
      <Heading as="h3">{title}</Heading>
      <Typography>{summary}</Typography>
      <ButtonLink as="button" justify="space-between">
        {/* Read <i data-feather="arrow-right"></i> */}
        <Typography as="span" my="0">
          Read more
        </Typography>
        <FiArrowRight style={{ marginLeft: "var(--space-1)" }} />
      </ButtonLink>
    </Box>
  );
}

function ActivityIndicator() {
  return (
    <ActivityWrapper>
      <Loader />
    </ActivityWrapper>
  );
}

// Aricles displays recent articles and also
// filters all articles by tags
function Articles({ handleIsReading }) {
  const { cached } = useAppContext();
  const [isFetchingLatest, setIsFetchingLatest] = useState(false);
  const [isFetchingByTag, setIsFetchingByTag] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [activeFilter, setActiveFilter] = useState(
    () => cached.activeFilter.current
  );
  const [latestEntries, setLatestEntries] = useState(
    () => cached.latestRef.current
  );
  const [sortedEntries, setSortedEntries] = useState(() =>
    cached.sortedRef.current.get(activeFilter)
  );

  // gets page scroll number and caches
  cached.pageYOffset.current = usePageScroll();

  const getLatestEntries = useCallback(async () => {
    setIsFetchingLatest(true);
    let source = [];
    try {
      const entries = await client.getEntries({
        content_type: "blogPost",
        order: "-fields.published",
        limit: 5,
      });
      entries.items.forEach((entry) => source.push(entry.fields));
      setLatestEntries(source);
      cached.latestRef.current = source;
      setIsFetchingLatest(false);
    } catch (error) {
      setHasError(true);
    }
  }, [cached.latestRef]);

  // get recent articles
  useEffect(() => {
    if (!cached.latestRef.current.length) {
      getLatestEntries();
    }
  }, [getLatestEntries, cached.latestRef]);

  // sort article tag by year
  function sortEntriesByYear(entries, tag) {
    const sorted = entries.reduce((accum, curr) => {
      const pubYear = new Date(curr.published).getFullYear();
      if (!accum[pubYear]) {
        accum[pubYear] = [];
      }
      accum[pubYear].push(curr);
      return accum;
    }, {});
    const sortedInDescOrder = Object.entries(sorted).reverse();
    setSortedEntries(sortedInDescOrder);
    cached.sortedRef.current.set(tag, sortedInDescOrder);
    setIsFetchingByTag(false);
  }

  // TODO: add pagination
  const getEntriesByTag = async (tag) => {
    let isSorted = cached.sortedRef.current.get(tag) || null;
    if (isSorted) {
      if (tag === Filters.new) {
        setLatestEntries(cached.latestRef.current);
      } else {
        setSortedEntries(cached.sortedRef.current.get(tag));
        setActiveFilter(tag);
        cached.activeFilter.current = tag;
      }
    } else {
      setIsFetchingByTag(true);
      let data = [];
      try {
        const entries = await client.getEntries({
          content_type: "blogPost",
          "metadata.tags.sys.id[all]": `${tag}`,
          order: "-fields.published",
        });
        entries.items.forEach((entry) => data.push(entry.fields));
        sortEntriesByYear(data, tag);
        setActiveFilter(tag);
        cached.activeFilter.current = tag;
      } catch (error) {}
    }
  };

  const refetchArticles = () => {
    setHasError(false);
    getLatestEntries();
  };

  return (
    <ArticlesWrapper
      as="section"
      justify={(isFetchingLatest || hasError) && "center"}
    >
      {isFetchingLatest && !hasError && (
        <Box>
          <ActivityIndicator />
          <Typography style={{ textAlign: "center" }}>
            Fetching articles...
          </Typography>
        </Box>
      )}
      {!isFetchingLatest && !hasError && latestEntries.length !== 0 && (
        <Fragment>
          <ArticlesFilter
            activeFilter={activeFilter}
            setActiveFilter={getEntriesByTag}
          />
          <Heading
            as="h4"
            style={{
              marginTop: "50px",
            }}
          >
            What is in {capitalize(activeFilter)}?
          </Heading>
        </Fragment>
      )}
      <Box>
        {isFetchingByTag && <ActivityIndicator />}
        {!isFetchingByTag &&
          activeFilter !== Filters.New &&
          sortedEntries.map((entry) => (
            <FilteredEntries
              key={entry[0]}
              entry={entry}
              handleIsReading={handleIsReading}
            />
          ))}
        {!isFetchingLatest &&
          !isFetchingByTag &&
          activeFilter === Filters.New &&
          latestEntries.map((entry) => {
            return (
              <Article
                key={entry.id}
                post={entry}
                handleIsReading={handleIsReading}
              />
            );
          })}
      </Box>
      {/* offline content */}
      {hasError && (
        <Box style={{ textAlign: "center" }}>
          <StrongTypography my="0">
            Oops, unable to fetch articles
          </StrongTypography>
          <Typography my="0">The request could not be completed</Typography>
          <ButtonLink
            mt="var(--space-2)"
            justify="center"
            onClick={refetchArticles}
          >
            Try Again
          </ButtonLink>
        </Box>
      )}
    </ArticlesWrapper>
  );
}

const Tools = ({ children, ...props }) => {
  return (
    <Flex gap="var(--space-2)" my="var(--space-4)" wrap="wrap" {...props}>
      {children}
    </Flex>
  );
};

const Tool = styled.p`
  border: 1px solid var(--bg-2);
  padding: var(--space-1) var(--space-2);
`;

const SubHeading = ({ children, ...props }) => {
  return (
    <Heading as="h4" color="var(--txt-0)" {...props}>
      {children}
    </Heading>
  );
};

// Resume renders resume page
function Resume() {
  return (
    <ContentWrapper>
      <Container>
        <Heading
          as="h2"
          style={{ textAlign: "center", marginBottom: "var(--space-4)" }}
        >
          Resume
        </Heading>
        <Heading as="h3">Work Experience</Heading>
        <SubHeading>Content Creator</SubHeading>
        <p>
          I create concise code snippets, tips and tricks in javascript and more
        </p>
        <Heading as="h3">Technical Skills</Heading>
        <SubHeading>Proficient in:</SubHeading>
        <Tools>
          {[
            "Javascript",
            "Typescript",
            "React",
            "HTML",
            "CSS",
            "Styled-Component",
            "Material-UI",
          ].map((item, idx) => (
            <Tool key={idx}>{item}</Tool>
          ))}
        </Tools>
        <SubHeading>Experienced in:</SubHeading>
        <Tools>
          {[
            "SQL",
            "Node",
            "NoSQL",
            "Golang",
            "Git & Github",
            "Bootstrap",
            "Tailwind",
            "Postgres",
            "SQLite",
            "SASS",
          ].map((item, idx) => (
            <Tool key={idx}>{item}</Tool>
          ))}
        </Tools>
        <SubHeading>Familiar with:</SubHeading>
        <Tools>
          {["Java", "MongoDB", "Webpack", "Eslint", "SSH", "Prettier"].map(
            (item, idx) => (
              <Tool key={idx}>{item}</Tool>
            )
          )}
        </Tools>
        <Heading as="h3">Education</Heading>
        <p>University of Cape Coast, Ghana</p>
        <p className="content-platform">
          Department of Molecular Biology & Biotechnology
        </p>
        <Heading as="h3">Hobbies</Heading>
        <Tools>
          {["Teaching", "Gaming", "Reading"].map((item, idx) => (
            <Tool key={idx}>{item}</Tool>
          ))}
        </Tools>
      </Container>
    </ContentWrapper>
  );
}

// handle pages
function Router({ setActiveRoute, activeRoute, handleIsReading }) {
  const { cached } = useAppContext();
  const getContentProps = { activeRoute, setActiveRoute, handleIsReading };
  const getAboutProps = { setActiveRoute, activeRoute };

  useLayoutEffect(() => {
    if (activeRoute === Routes.ARTICLES) {
      window.scrollTo(0, cached.pageYOffset.current);
    } else {
      window.scrollTo(0, 0);
    }
  }, [activeRoute, cached.pageYOffset]);

  const routes = () => {
    switch (activeRoute) {
      case Routes.ARTICLES:
        return <Articles {...getContentProps} />;
      case Routes.RESUME:
        return <Resume />;
      case Routes.ABOUT:
        return <About {...getAboutProps} />;
      case Routes.CONTACT:
        return <Contact />;
      default:
        return <Home {...getContentProps} />;
    }
  };

  return <Fragment>{routes()}</Fragment>;
}

// Post contents
function PostContent({ post }) {
  let { body, title, published } = post;
  const content = useRemarkable(body);

  // reset layout scroll to top
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ContentWrapper pb="calc(var(--space-4) * 5)">
      <Container>
        <Flex direction="column" items="center" justify="center">
          <Heading as="h2" mt="var(--space-2)" style={{ textAlign: "center" }}>
            {title}
          </Heading>
          <Flex items="center" mt="var(--space-2)">
            <FiCalendar size={18} style={{ marginRight: "var(--space-2)" }} />
            <Time datetime={published}>{formatDate(published)}</Time>
          </Flex>
        </Flex>
        <MarkdownContent dangerouslySetInnerHTML={{ __html: content }} />
      </Container>
    </ContentWrapper>
  );
}

// App is the root of the whole application
export default function App() {
  const [isReading, setIsReading] = useState(false);
  const [isPortfolio, setIsPortfolio] = useState(false);
  const [post, setPost] = useState(null);
  const [activeRoute, setActiveRoute] = useState(Routes.HOME);

  // caches
  let previousRoute = useRef("");
  let profileImage = useRef("");
  let latestRef = useRef([]);
  let sortedRef = useRef(new Map());
  let activeFilter = useRef(Filters.New);
  let pageYOffset = useRef(0);

  const handleIsReading = (post) => {
    setPost(post);
    setIsReading(true);
  };

  const cached = {
    previousRoute,
    profileImage,
    latestRef,
    sortedRef,
    activeFilter,
    pageYOffset,
  };

  const commonProps = { activeRoute, setActiveRoute };
  const navbarProps = {
    ...commonProps,
    setIsReading,
    isReading,
    isPortfolio,
    setIsPortfolio,
  };
  const routerProps = { ...commonProps, handleIsReading };

  return (
    <AppContext.Provider value={{ cached }}>
      <Layout>
        <GlobalStyles />
        <NavigationBar {...navbarProps} />
        {isReading && <PostContent post={post} />}
        {!isReading && <Router {...routerProps} />}
        <Footer activeRoute={activeRoute} />
      </Layout>
    </AppContext.Provider>
  );
}

// // contentful
// const client = contentful.createClient({
//   space: 'jzi320sswukf',
//   environment: 'master',
//   accessToken:
//     'ea152cee3c2d857297230cc68e141647ee9cbc5bf7cd178fea6e2c58940f86ca',
// });
