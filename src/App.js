import {
  useState,
  useEffect,
  useLayoutEffect,
  useContext,
  useCallback,
  createContext,
  Fragment,
  useRef,
} from "react";
import { createClient } from "contentful";
import { createCss } from "@stitches/react";
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

// ======================================================= //

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

// stitches config
const config = {
  theme: {
    fonts: {
      fallback:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
      title: "Montserrat, $fallback",
      body: "Inter, $fallback",
    },
    fontWeights: {
      normal: 400,
      bold: 600,
    },
    colors: {
      bg0: "rgba(0, 0, 0, 0.05)",
      bg1: "#FFFFFF",
      bg2: "#A1A1AA",
      bg3: "#262626",
      text0: "#52525B",
      text1: "#3F3F46",
      text2: "#3F3F46",
      text3: "#2563EB",
      text4: "#EF4444",
    },
    space: {
      1: "5px",
      2: "10px",
      3: "15px",
      4: "20px",
      5: "25px",
      6: "30px",
      7: "35px",
      8: "40px",
      9: "45px",
      12: "60px",
    },
    lineHeights: {
      1: 1,
      2: 1.25,
      3: 1.5,
      4: 1.75,
    },
    shadows: {
      1: "0 1px 2px lightgrey",
      2: "0 2px 4px lightgrey",
      3: "0 4px 8px lightgrey",
    },
    fontSizes: {
      1: "10px",
      2: "12px",
      3: "14px",
      4: "16px",
    },
    zIndices: {
      1: 100,
      2: 200,
      3: 300,
    },
  },
  utils: {
    mt: () => (value) => ({ marginTop: value }),
    mb: () => (value) => ({ marginBottom: value }),
    ml: () => (value) => ({ marginLeft: value }),
    mr: () => (value) => ({ marginRight: value }),
    mx: () => (value) => ({ marginLeft: value, marginRight: value }),
    my: () => (value) => ({ marginTop: value, marginBottom: value }),
    m: () => (value) => ({
      marginTop: value,
      marginBottom: value,
      marginLeft: value,
      marginRight: value,
    }),
    pt: () => (value) => ({ paddingTop: value }),
    pb: () => (value) => ({ paddingBottom: value }),
    pl: () => (value) => ({ paddingLeft: value }),
    pr: () => (value) => ({ paddingRight: value }),
    px: () => (value) => ({ paddingLeft: value, paddingRight: value }),
    py: () => (value) => ({ paddingTop: value, paddingBottom: value }),
    p: () => (value) => ({
      paddingTop: value,
      paddingBottom: value,
      paddingLeft: value,
      paddingRight: value,
    }),
    bgcolor: () => (value) => ({ backgroundColor: value }),
    size: () => (value) => ({ width: value, height: value }),
    direction: () => (value) => ({ flexDirection: value }),
    justify: () => (value) => ({ justifyContent: value }),
    items: () => (value) => ({ alignItems: value }),
  },
  media: {
    bp1: "(min-width: 640px)",
  },
};

const { styled, keyframes, global, theme } = createCss(config);

// dark theme
const darkTheme = theme("dark", {
  colors: {
    bg0: "#262626",
    bg1: "#3A3A3A",
    bg2: "#3A3A3A",
    bg3: "#3A3A3A",
    text0: "#FCCA98",
    text1: "#FEEAD7",
    text2: "#FF8700",
    text3: "#529E52",
    text4: "#FF8700",
  },
});

// global styles
const globalStyles = global({
  ":root": {
    boxSizing: "border-box",
    fontSize: "$4",
    fontFamily: "$fonts$body",
    fontWeight: "$normal",
    "-webkit-font-smoothing": "antialiased",
    "-moz-osx-font-smoothing": "grayscale",
  },
  "*,*::before,*::after": {
    boxSizing: "inherit",
  },
  "html, body, div, span, object, iframe,h1, h2, h3, h4, h5, h6, p, blockquote, pre,abbr, address, cite, code,del, dfn, em, img, ins, kbd, q, samp,small, strong, sub, sup, var,b, i,dl, dt, dd, ol, ul, li,fieldset, form, label, legend,table, caption, tbody, tfoot, thead, tr, th, td,article, aside, canvas, details, figcaption, figure, footer, header, hgroup, menu, nav, section, summary,time, mark, audio, video":
    {
      m: 0,
      p: 0,
      border: 0,
      outline: 0,
      verticalAlign: "baseline",
      background: "transparent",
    },
  body: {
    lineHeight: "$3",
    color: "$text0",
    bcolor: "$bg0",
  },
  "nav ul": {
    listStyle: "none",
  },
  a: {
    m: 0,
    p: 0,
    fontSize: "100%",
    verticalAlign: "baseline",
    background: "transparent",
  },
  "input, select": {
    verticalAlign: "middle",
  },
});

// navbar height
const NAVBAR_HEIGHT = "64px";

const Box = styled("div");

const Flex = styled(Box, {
  display: "flex",
});

const ButtonLink = styled(Flex, {
  items: "center",
  fontSize: "100%",
  padding: 0,
  appearance: "none",
  border: "none",
  bgcolor: "transparent",
  color: "$text3",
});

const Text = styled("p", {
  my: "$3",
});

const Title = styled("h2", {
  mb: "$4",
  textAlign: "center",
});

const Strong = styled("strong", {
  color: "$text0",
});

const Container = styled("div", {
  size: "100%",
  margin: "0 auto",
  px: "$3",
  "@bp1": {
    "&": {
      width: "70%",
      p: 0,
    },
  },
});

const ActivityWrapper = styled(Flex, {
  justify: "center",
  items: "center",
  size: "100%",
});

const spin = keyframes({
  "100%": { transform: "rotate(360deg)" },
});

const Loader = styled("div", {
  size: "1rem",
  borderRadius: "50%",
  border: "3px solid $bg1",
  borderTopColor: "$text3",
  borderRightColor: "$text3",
  animation: `${spin} 1s linear infinite`,
});

const FooterWrapper = styled("footer", {
  width: "100vw",
  fontSize: "0.85rem",
  textAlign: "center",
  px: 0,
  py: "$4",
  bgcolor: "$bg1",
  boxShadow: "0 -1px 2px lightgrey",
});

const Link = styled("a", {
  color: "$text3",
});

const Brand = styled("div", {
  fontSize: "1.1rem",
  fontFamily: "$fonts$title",
  fontWeight: "$bold",
  letterSpacing: "1px",
});

const Wrapper = styled(Flex, {
  minHeight: `calc(100vh - ${NAVBAR_HEIGHT})`,
  py: "$9",
  bgcolor: "$bg0",
});

const Time = styled("time", {
  width: "100%",
  fontFamily: "$fonts$title",
  fontSize: "0.8rem",
});

const Heading = styled("h3", {
  color: "$text1",
  fontFamily: "$title",
  my: "$5",
});

const SubHeading = styled("h4", {
  color: "$text0",
  fontFamily: "$title",
});

const Image = styled("img", {
  size: "100%",
  objectFit: "cover",
});

const ImageWrapper = styled("div", {
  margin: "0 auto",
  size: "80px",
  borderRadius: "50%",
  overflow: "hidden",
  position: "relative",
  border: "3px solid $text0",
});

const Layout = styled(Flex, {
  direction: "column",
  minHeight: "100vh",
});

const TopBar = styled(Box, {
  minWidth: "100%",
  boxShadow: "0 2px 0 rgba(0, 0, 0, 0.05)",
  bgcolor: "white",
  left: 0,
  top: 0,
  zIndex: "$3",
});

const MarkdownContent = styled("article", {
  mt: "$12",
  "p + p": {
    mt: "$3",
  },
  "ul,ol": {
    ml: "$3",
    lineHeight: "$4",
  },
  "h3,h4": {
    fontFamily: "$fonts$title",
    margin: "$8 0 $4",
    color: "$text1",
  },
  "h3 + h4": {
    mt: "$1",
  },
  pre: {
    fontSize: "$3",
    p: "$5",
    lineHeight: "$2",
    color: "white",
    bgcolor: "$bg3",
    margin: "$4 0",
    borderRadius: "4px",
    width: "100%",
    overflow: "auto",
    position: "relative",
    zIndex: "$1",
  },
  mark: {
    fontWeight: "$bold",
    color: "$text4",
    p: "2px",
    borderRadius: "2px",
    "& code": {
      fontFamily: "$body",
    },
  },
  "& #post-img": {
    my: "$8",
    "& img": {
      width: "100%",
    },
  },
  "& #post-img-title": {
    position: "relative",
    top: "-2.2em",
  },
  "& .info": {
    border: "1px solid green",
    color: "green",
    padding: "$3",
    fontSize: "0.9rem",
    position: "relative",
  },
});

const Card = styled(Flex, {
  direction: "column",
  bgcolor: "white",
  p: "$3",
  boxShadow: "$1",
  color: "$text1",
  borderRadius: "4px",
});

const Pill = styled(Box, {
  px: "$2",
  py: "$1",
  bgcolor: "$bg0",
  borderRadius: "99999px",
  mb: "$2",
  "&:not(:last-of-type)": {
    mr: "$2",
  },
});

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

const Social = styled(Link, {
  my: 0,
  color: "$text0",
  "&:not(:last-of-type)": {
    mr: "$4",
  },
  "& *": {
    size: 24,
  },
});

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
      css={{
        p: activeRoute === Routes.HOME && "$4",
      }}
    >
      <Container>
        <ImageWrapper>
          {imageIsLoading && !image.length && (
            <ActivityIndicator css={{ mx: "auto" }} />
          )}
          {/* TODO: Image loading*/}
          <Box
            css={{
              position: "absolute",
              top: 0,
              left: 0,
            }}
          >
            <Image
              src={`https:${image}`}
              alt={hasError ? "YANKEY" : ""}
              position={hasError ? "relative" : "static"}
              top={hasError ? 28 : 0}
              left={hasError ? 11 : 0}
            />
          </Box>
        </ImageWrapper>
        <Flex
          css={{
            justify: "center",
            my: "$4",
            flexGap: "$4",
            color: "grey", // change to grey500
          }}
        >
          <Social
            href="https://github.com/papayankey"
            target="_blank"
            rel="noreferrer"
          >
            {/* <i className='fa fa-github'></i>*/}
            <FaGithub />
          </Social>
          <Social
            href="https://www.linkedin.com/in/benneth-yankey-23201232"
            target="_blank"
            rel="noreferrer"
          >
            {/* <i classname='fa fa-linkedin'></i>*/}
            <FaLinkedin />
          </Social>
          <Social
            href="https://twitter.com/benbright1"
            target="_blank"
            rel="noreferrer"
          >
            {/* <i className='fa fa-twitter'></i> */}
            <FaTwitter />
          </Social>
        </Flex>
        <Text css={{ my: 0 }}>
          Built with <Link>React</Link> & <Link>Styled-Components</Link>
        </Text>
        <Text css={{ my: 0 }}>
          &copy; 2019 &ndash; {new Date().getFullYear()} &middot; Benneth Yankey
        </Text>
      </Container>
    </FooterWrapper>
  );
}

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
    // root.current = document.documentElement;
    // root.current.classList.add("dark");
  }, []);

  // Toggle theme Light / Dark
  const toggleLightMode = () => {
    root.current.classList.toggle(`${darkTheme}`);
    setIsLight((prevTheme) => !prevTheme);
  };

  const toggleRoute = (route) => {
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
    <Box as="header" css={{ boxShadow: "$1" }}>
      <TopBar css={{ position: isReading ? "fixed" : "static" }}>
        <Container>
          <Flex
            css={{
              justify: "space-between",
              items: "center",
              py: "$4",
            }}
          >
            {isReadingMode && (
              <Flex
                css={{
                  items: "center",
                  color: "$text1",
                }}
                onClick={closeReadingMode}
              >
                <FiChevronLeft size={24} />
                <Text as="span" css={{ my: 0 }}>
                  Back
                </Text>
              </Flex>
            )}
            {!isReadingMode && (
              <Brand onClick={() => setActiveRoute(Routes.HOME)}>YANKEY</Brand>
            )}{" "}
            {/* <i data-feather='sun'></i> */}
            {/* <i data-feather='moon'></i> */}
            {isLight && <FiSun size={24} onClick={() => toggleLightMode()} />}
            {!isLight && <FiMoon size={22} onClick={() => toggleLightMode()} />}
          </Flex>
        </Container>
      </TopBar>
      {!isReadingMode && (
        <Flex
          as="nav"
          css={{
            justify: "center",
            items: "center",
            py: "$1",
            overflowX: "auto",
          }}
        >
          {navItems.map((v, i) => (
            <Box
              key={i}
              onClick={() => toggleRoute(v)}
              css={{
                letterSpacing: "1.2px",
                p: "$2",
                color: "$text1",
                "&:hover": {
                  bgcolor: "$bg0",
                },
              }}
            >
              {capitalize(v)}
            </Box>
          ))}
        </Flex>
      )}
    </Box>
  );
}

function Home({ setActiveRoute }) {
  return (
    <Flex
      as="section"
      css={{
        minHeight: `calc(100vh - ${NAVBAR_HEIGHT} - 120px)`,
        items: "center",
        bgcolor: "$bg0",
      }}
    >
      <Container>
        <Flex
          css={{
            direction: "column",
            items: "center",
          }}
        >
          <Text>Hi, I'm</Text>
          <Heading css={{ m: 0 }}>BENNETH YANKEY</Heading>
          <SubHeading>Software Engineer</SubHeading>
          <Text css={{ textAlign: "center" }}>
            I created this site to share and document everything I have learned
            and learning with you and the world!
          </Text>
          <ButtonLink as="button" css={{ mx: "auto" }}>
            <Text as="span" onClick={() => setActiveRoute(Routes.CONTACT)}>
              Get to know me better
            </Text>
            <FiArrowRight style={{ marginLeft: "var(--space-1)" }} />
          </ButtonLink>
        </Flex>
      </Container>
    </Flex>
  );
}

function About({ setActiveRoute, activeRoute }) {
  const { cached } = useAppContext();

  const handleRouteToggle = () => {
    cached.previousRoute.current = activeRoute;
    setActiveRoute(Routes.CONTACT);
  };

  return (
    <Wrapper>
      <Container>
        <Title>About me</Title>
        <Text>
          <Strong>YANKEY </Strong>is a tech blog of{" "}
          <Link href="#">Benneth Yankey</Link>, a software engineer and high
          school biology teacher from Accra, Ghana.
        </Text>
        <Text>
          He is passionate about software development and solving problems. He
          programs mostly in Javascript (Typescript) and Go.
        </Text>
        <Text>
          His primary machine is Lenovo Ideapad running Fedora Linux. Vim is his
          text editor of choice.
        </Text>
        <Heading as="h3">Other Interests</Heading>
        <Text>Aside programming here are other areas of his interest:</Text>
        <Text>
          <Strong>Teaching: </Strong>
          He likes to share and impact knowledge. He has been teaching Biology
          to high school pupils for past 5 years and counting. He aids pupils to
          understand and appreciate the beauty of nature.
        </Text>
        <Text>
          <Strong>Gaming: </Strong>
          He loves and has been gaming since he was 5, playing SEGA. He
          currently owns a PS4 Console and enjoys playing FIFA.
        </Text>
        <Heading as="h3">Get in touch</Heading>
        <Text>
          You can contact him via{" "}
          <Link onClick={handleRouteToggle}>contact page</Link>. He is happy to
          respond to projects discussion, collaborations and corrections or
          suggestions of any material.
        </Text>
      </Container>
    </Wrapper>
  );
}

function Contact() {
  return (
    <Wrapper>
      <Container>
        <Title>Contact me</Title>
        <Text>Thanks for your interest in getting in touch with me.</Text>
        <Text>
          Please contact me via the appropriate medium, but keep in mind that
          I'll only respond to legit messages.
        </Text>
        <Heading as="h3">Email</Heading>
        <Text>
          My email address is{" "}
          <Link href="mailto: yankeybenneth@gmail.com">
            yankeybenneth@gmail.com
          </Link>
          . This is the best way to grab my attention in minute literally.
        </Text>
        <Heading as="h3">Instagram</Heading>
        <Text>
          I use instagram primarily to share things including tips and tricks
          with the tech community. Kindly follow me{" "}
          <Link href="https://www.instagram.com/papayankey_">here</Link>. If you
          want to ask a question, Instagram is the right medium and will
          definitely respond ASAP.
        </Text>
        <Heading as="h3">What I will respond to</Heading>
        <Text>
          I will definitely respond and be very happy to discuss with you on
          projects and collaborations. Any questions about contents produced on
          this blog will also get a response.
        </Text>
        <Heading as="h3">What I won't respond to</Heading>
        <Text>I won't respond if message is unclear enough.</Text>
      </Container>
    </Wrapper>
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

function ArticlesFilter({ activeFilter, setActiveFilter }) {
  useEffect(() => {
    // feather.replace();
  }, []);

  return (
    <Flex css={{ direction: "column", items: "center" }}>
      <Flex
        css={{
          flexWrap: "wrap",
          justify: "center",
          mt: "$4",
        }}
      >
        {Object.values(Filters).map((filter, idx) => {
          let isActive = activeFilter === filter;
          return (
            <Pill
              key={idx}
              css={{
                border: "1px solid",
                "&:hover": {
                  cursor: "pointer",
                },
                borderColor:
                  isActive ? "transparent" : "lightgrey",
                bgcolor: isActive ? "white" : "transparent",
                boxShadow: isActive ? "$1" : "none",
              }}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </Pill>
          );
        })}
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
      <Box css={{ my: "$4" }}>
        {entry[1].map((field, idx) => {
          const { published, title } = field;
          return (
            <Card
              key={idx}
              css={{
                mb: "$2",
                "& time": {
                  fontSize: "$3",
                  color: "grey",
                },
              }}
            >
              <time datetime={published}>{formatDate(published)}</time>
              <Text
                onClick={() => handleOpenArticle(field)}
                css={{ m: 0, mt: "$1" }}
              >
                {title}
              </Text>
            </Card>
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
    <Card
      css={{
        mb: "$3",
        py: "$5",
      }}
      onClick={() => handleIsReading(post)}
    >
      <Heading as="h4" css={{m: 0}}>{title}</Heading>
      <Text>{summary}</Text>
      <ButtonLink as="button">
        {/* Read <i data-feather='arrow-right'></i> */}
        <Text as="span" css={{ my: 0 }}>
          Read more
        </Text>
        <FiArrowRight style={{ ml: "var(--space-1)" }} />
      </ButtonLink>
    </Card>
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
    <Flex
      as="section"
      css={{
        minHeight: "calc(100vh - 300px)",
        justify: "flex-start",
        direction: "column",
        pt: "$5",
        pb: "$9",
        bgcolor: "$bg0",
      }}
    >
      {isFetchingLatest && !hasError && (
        <Container>
          <ActivityIndicator />
          <Text css={{ textAlign: "center" }}>Fetching articles...</Text>
        </Container>
      )}
      {!isFetchingLatest && !hasError && latestEntries.length !== 0 && (
        <Container>
          <ArticlesFilter
            activeFilter={activeFilter}
            setActiveFilter={getEntriesByTag}
          />
          <Heading as="h3" css={{ my: "$8", color: "grey" }}>
            {activeFilter === Filters.New ? (
              <Fragment>Latest Articles</Fragment>
            ) : (
              <Fragment>All articles in {capitalize(activeFilter)}?</Fragment>
            )}
          </Heading>
        </Container>
      )}
      <Box>
        <Container>
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
        </Container>
      </Box>
      {/* offline content */}
      {hasError && (
        <Box css={{ textAlign: "center" }}>
          <Strong css={{ my: 0 }}>Oops, unable to fetch articles</Strong>
          <Text css={{ my: 0 }}>The request could not be completed</Text>
          <ButtonLink
            css={{
              mt: "$2",
              justify: "center",
            }}
            onClick={refetchArticles}
          >
            Try Again
          </ButtonLink>
        </Box>
      )}
    </Flex>
  );
}

function Resume() {
  return (
    <Wrapper>
      <Container>
        <Title>Resume</Title>
        <Heading>Work Experience</Heading>
        <Card>
          <SubHeading>Content Creator</SubHeading>
          <Text>
            I create concise code snippets, tips and tricks in javascript and
            more
          </Text>
        </Card>
        <Heading>Technical Skills</Heading>
        <Card css={{ mb: "$4" }}>
          <SubHeading>Proficient in:</SubHeading>
          <Flex
            css={{
              mt: "$4",
              flexWrap: "wrap",
            }}
          >
            {[
              "Javascript",
              "Typescript",
              "React",
              "HTML",
              "CSS",
              "Styled-Component",
              "Material-UI",
            ].map((item, idx) => (
              <Pill key={idx}>{item}</Pill>
            ))}
          </Flex>
        </Card>
        <Card css={{ mb: "$4" }}>
          <SubHeading>Experienced in:</SubHeading>
          <Flex
            css={{
              mt: "$4",
              flexWrap: "wrap",
            }}
          >
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
              <Pill key={idx}>{item}</Pill>
            ))}
          </Flex>
        </Card>
        <Card css={{ mb: "$4" }}>
          <SubHeading>Familiar with:</SubHeading>
          <Flex
            css={{
              mt: "$4",
              flexWrap: "wrap",
            }}
          >
            {["Java", "MongoDB", "Webpack", "Eslint", "SSH", "Prettier"].map(
              (item, idx) => (
                <Pill key={idx}>{item}</Pill>
              )
            )}
          </Flex>
        </Card>
        <Heading>Education</Heading>
        <Card css={{ mb: "$4" }}>
          <SubHeading>University of Cape Coast, Ghana</SubHeading>
          <Text className="content-platform">
            Department of Molecular Biology & Biotechnology
          </Text>
        </Card>
        <Heading>Hobbies</Heading>
        <Card>
          <Flex>
            {["Teaching", "Gaming", "Reading"].map((item, idx) => (
              <Pill key={idx}>{item}</Pill>
            ))}
          </Flex>
        </Card>
      </Container>
    </Wrapper>
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
    <Wrapper css={{ pb: "$12", pt: "calc($12 * 2)" }}>
      <Container>
        <Flex css={{ direction: "column", items: "center", justify: "center" }}>
          <Heading as="h2" css={{ mt: "$2", textAlign: "center" }}>
            {title}
          </Heading>
          <Flex css={{ items: "center", mt: "$2" }}>
            <FiCalendar size={18} style={{ marginRight: "var(--space-2)" }} />
            <Time datetime={published}>{formatDate(published)}</Time>
          </Flex>
        </Flex>
        <MarkdownContent dangerouslySetInnerHTML={{ __html: content }} />
      </Container>
    </Wrapper>
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
      <Layout as="main">
        {globalStyles()}
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
