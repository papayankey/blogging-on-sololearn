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
import { FiSun, FiChevronLeft, FiMoon } from "react-icons/fi";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

// ======================================================= //

// app_context
const AppContext = createContext();
const useAppContext = () => useContext(AppContext);

// contentful_client
const client = createClient({
  space: process.env.REACT_APP_SPACE_ID,
  environment: process.env.REACT_APP_ENVIRONMENT_ID,
  accessToken: process.env.REACT_APP_ACCESS_TOKEN,
});

// stitches config
const config = {
  theme: {
    fonts: {
      fallback:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
      sans: "Roboto, $fallback",
    },
    fontWeights: {
      light: 300,
      normal: 400,
      medium: 500,
      bold: 700,
    },
    colors: {
      gray1: "rgb(252, 252, 252)",
      gray2: "rgb(248, 248, 248)",
      gray3: "rgb(243, 243, 243)",
      gray4: "rgb(237, 237, 237)",
      gray5: "rgb(232, 232, 232)",
      gray6: "rgb(226, 226, 226)",
      gray7: "rgb(219, 219, 219)",
      gray8: "rgb(199, 199, 199)",
      gray9: "rgb(143, 143, 143)",
      gray10: "rgb(133, 133, 133)",
      gray11: "rgb(111, 111, 111)",
      gray12: "rgb(23, 23, 23)",
      blue1: "rgb(251, 253, 255)",
      blue2: "rgb(245, 250, 255)",
      blue3: "rgb(237, 246, 255)",
      blue4: "rgb(225, 240, 255)",
      blue5: "rgb(206, 231, 254)",
      blue6: "rgb(183, 217, 248)",
      blue7: "rgb(150, 199, 242)",
      blue8: "rgb(94, 176, 239)",
      blue9: "rgb(0, 145, 255)",
      blue10: "rgb(0, 120, 241)",
      blue11: "rgb(0, 106, 220)",
      blue12: "rgb(0, 37, 77)",

      // semantic names
      bg0: "$gray3",
      bg1: "white",
      bg2: "$gray5",
      bg3: "$gray7",
      text0: "$gray12",
      text1: "$gray11",
      text2: "$blue11",
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
      1: "1px 1px 0 $colors$bg3, -1px -1px 0 $colors$bg3",
      2: "1.2px 1.2px 0 $colors$bg3, -1.2px -1.2px 0 $colors$bg3",
      3: "1.4px 1.4px 0 $colors$bg3, -1.4px -1.4px 0 $colors$bg3",
    },
    fontSizes: {
      1: "10px",
      2: "12px",
      3: "14px",
      4: "16px",
      5: "18px",
      6: "24px",
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
};

const { styled, keyframes, global, theme } = createCss(config);

// dark theme
const darkTheme = theme("dark-ui", {
  colors: {
    bg0: "rgb(21, 23, 24)",
    bg1: "rgb(32, 36, 37)",
    bg2: "rgb(43, 47, 49)",
    bg3: "rgb(26, 29, 30)",
    text0: "rgb(236, 237, 238)",
    text1: "rgb(155, 161, 166)",
    // text2: "$blue11",
  },
});

// global styles
const globalStyles = global({
  ":root": {
    boxSizing: "border-box",
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
    fontSize: "$4",
    fontFamily: "$sans",
    fontWeight: "$normal",
    bgcolor: "$bg0",
  },
  "nav ul": {
    listStyle: "none",
  },
  a: {
    m: 0,
    p: 0,
    fontSize: "100%",
    verticalAlign: "baseline",
  },
  "input, select": {
    verticalAlign: "middle",
  },
});

// navbar height
const NAVBAR_HEIGHT = "64px";
const MEDIUM_SCREEN_HEIGHT = "720";

// =============== STITCHES COMPONENTS ================= //

const Box = styled("div");

const Flex = styled(Box, {
  display: "flex",
});

const Button = styled("button", {
  appearance: "none",
  border: "none",
  bgcolor: "transparent",
  fontSize: "$3",
  m: 0,
  py: "$1",
  pl: 0,
  pr: "$2",
  color: "$text3",
  textAlign: "left",
});

const Text = styled("p", {
  fontSize: "$4",
  my: "$3",
});

const Title = styled("h2", {
  mb: "$4",
  textAlign: "center",
  textTransform: "uppercase",
  letterSpacing: "2px",
});

const SubTitle = styled("h3", {
  mt: "$4",
  fontSize: "calc($6 - 4px)",
  letterSpacing: 1,
});

const Strong = styled("strong", {
  color: "$text0",
});

const Container = styled(Box, {
  width: "100%",
  maxWidth: 375, // iphoneX-galaxyS9
  margin: "0 auto",
  px: "$3",
});

const ActivityWrapper = styled(Flex, {
  justify: "center",
  items: "center",
  size: "100%",
});

const spin = keyframes({
  "100%": { transform: "rotate(360deg)" },
});

const Loader = styled(Box, {
  size: "30px",
  borderRadius: "99999px",
  border: "3px solid $colors$gray6",
  borderTopColor: "$colors$gray9",
  borderBottomColor: "$colors$gray9",
  borderRightColor: "$colors$gray9",
  animation: `${spin} 1s linear infinite`,
});

const FooterWrapper = styled("footer", {
  width: "100vw",
  textAlign: "center",
  px: 0,
  py: "$4",
  bgcolor: "$bg1",
  boxShadow: "$1",
});

const Link = styled("a", {
  color: "$text2",
});

const Brand = styled("h3", {
  fontWeight: "$medium",
  letterSpacing: 1
});

const Wrapper = styled(Flex, {
  direction: "column",
  py: "$9",
  px: "$3"
});

const Time = styled("time", {
  fontSize: "$2",
  color: "$text1",
});

const Heading = styled("h3", {
  my: "$5",
  fontSize: "$6"
});

const SubHeading = styled("h4", {
  mt: "$4",
  fontSize: "calc($6 - 4px)",
});

const ImageWrapper = styled(Box, {
  margin: "0 auto",
  size: 80,
  borderRadius: 99999,
  overflow: "hidden",
  position: "relative",
  boxShadow: "0 4px 8px $colors$bg3",
});

const TopBar = styled(Box, {
  minWidth: "100%",
  bgcolor: "$bg1",
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
    margin: "$8 0 $4",
  },
  "h3 + h4": {
    mt: "$1",
  },
  pre: {
    p: "$5",
    lineHeight: "$2",
    color: "white",
    bgcolor: "$bg1",
    margin: "$4 0",
    borderRadius: "8px",
    width: "100%",
    overflow: "auto",
    position: "relative",
    zIndex: "$1",
  },
  mark: {
    bgcolor: "$bg2",
    "& code": {
      p: 3
    }
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
    border: "1px solid $colors$text2",
    borderRadius: "4px",
    color: "$text2",
    padding: "$3",
    position: "relative",
  },
});

const Card = styled(Flex, {
  direction: "column",
  bgcolor: "$bg1",
  p: "$3",
  boxShadow: "$1",
  borderRadius: 4
});

const CardTitle = styled("h4", {
  fontSize: "$4",
  color: "$gray11"
});

const Pill = styled(Box, {
  px: "$2",
  py: "$1",
  bgcolor: "$bg2",
  borderRadius: "99999px",
  mb: "$2",
  "&:not(:last-of-type)": {
    mr: "$2",
  },
});

const Social = styled(Link, {
  color: "$gray9",
  "& *": {
    size: 24,
  },
});

// =============== END STITCHES COMPONENTS ================ //

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

// usePageScroll keeps track of articles page scroll
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

const IMAGE_ASSETS = "2dmBvE3pqzChaplVyTqdtw";
const IMAGE_STATUS = {
  LOADING: "loading",
  LOADED: "loaded",
  FAILED: "failed",
};

function Footer() {
  const { cached } = useAppContext();
  const [image, setImage] = useState(() => cached.profileImage.current);
  const [imageStatus, setImageStatus] = useState(IMAGE_STATUS.LOADING);
  const count = useRef(1);

  const fetchProfilePic = useCallback(async () => {
    try {
      const assets = await client.getAsset(IMAGE_ASSETS);
      const url = assets.fields.file.url;
      setImage(url);
      setImageStatus(IMAGE_STATUS.LOADED);
      cached.profileImage.current = url;
      count.current = 0;
    } catch (e) {
      setImageStatus(IMAGE_STATUS.FAILED);
    }
  }, [cached.profileImage]);

  const onImageLoaded = () => {
    setImageStatus(IMAGE_STATUS.LOADED);
  };

  const onImageError = () => {
    setImageStatus(IMAGE_STATUS.FAILED);
  };

  // get profile image
  useEffect(() => {
    if (imageStatus === IMAGE_STATUS.LOADING) {
      fetchProfilePic();
      return;
    }

    let timer;
    if (imageStatus === IMAGE_STATUS.FAILED) {
      if (count.current <= 3) {
        timer = setTimeout(function getPic() {
          count.current += 1;
          fetchProfilePic();
        }, 10000);
      }
    }

    // clean up! timer if set
    if (timer) {
      return () => {
        clearTimeout(timer);
      };
    }
  }, [fetchProfilePic, imageStatus]);

  return (
    <FooterWrapper
      css={{
        p: "$5",
      }}
    >
      <Container>
        <ImageWrapper>
          {imageStatus === IMAGE_STATUS.LOADING && (
            <ActivityIndicator css={{ mx: "auto" }} />
          )}
          <Flex
            css={{
              size: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          >
            {imageStatus === IMAGE_STATUS.FAILED && (
              <Text css={{ m: "auto" }}>YANKEY</Text>
            )}
            {imageStatus === IMAGE_STATUS.LOADED && (
              <Box
                as="img"
                src={`https:${image}`}
                alt="YANKEY"
                onLoad={onImageLoaded}
                onError={onImageError}
                css={{
                  size: "100%",
                  objectFit: "cover",
                }}
              />
            )}
          </Flex>
        </ImageWrapper>
        <Flex
          css={{
            justify: "center",
            my: "$5",
            "& *:not(:last-of-type)": {
              mr: "$3",
            },
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
        <Text css={{ my: 0, fontSize: "$3", color: "$text1" }}>
          Built with React & Stitches JS
        </Text>
        <Text css={{ my: 0, fontSize: "$3", color: "$text1" }}>
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
    <Box as="header" css={{ boxShadow: "$2" }}>
      <TopBar
        css={{
          position: isReading ? "fixed" : "static",
          boxShadow: "$2",
        }}
      >
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
            height: "auto",
            overflowX: "auto",
            bgcolor: "$bg1",
            borderTop: "2px solid $bg0",
          }}
        >
          {navItems.map((v, i) => (
            <Box
              key={i}
              onClick={() => toggleRoute(v)}
              css={{
                fontSize: "$3",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                p: "$2",
                py: "$3",
                "&:hover, &:active": {
                  bgcolor: "$gray4",
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
    <Wrapper
      as="main"
      css={{
        minHeight: `calc(100vh - 375px)`,
        py: 0,
        justify: "center",
        items: "center",
      }}
    >
      <Text css={{ m: 0 }}>Hi, I'm</Text>
      <Heading css={{ m: 0, fontSize: "$6", letterSpacing: "1.2px" }}>
        BENNETH YANKEY
      </Heading>
      <SubHeading css={{ m: 0 }}>Software Engineer</SubHeading>
      <Text css={{ textAlign: "center" }}>
        Welcome to my space and garden on the internet, where I keep notes, and
        documents everything I have learned and learning with you and the world!
      </Text>
      <Link
        href="#"
        css={{ mx: "auto" }}
        onClick={() => setActiveRoute(Routes.ABOUT)}
      >
        Get to know me better
      </Link>
    </Wrapper>
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
          This is a tech blog of <Link href="#">Benneth Yankey</Link>, a
          software engineer and high school biology teacher from Accra, Ghana.
        </Text>
        <Text>
          He is passionate about software development and solving problems. He
          programs mostly in JavaScript (TypeScript), Go and Java.
        </Text>
        <Text>
          His primary machine is Lenovo Ideapad running Fedora Linux. His editor
          of choice, Vim, always hacking the juices out of it.
        </Text>
        <SubTitle>Other Interests</SubTitle>
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
        <SubTitle>Get in touch</SubTitle>
        <Text>
          You can contact him via{" "}
          <Link href="#" onClick={handleRouteToggle}>contact page</Link>. He is happy to
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
        <Text css={{ m: 0 }}>
          Thanks for your interest in getting in touch with me.
        </Text>
        <Text>
          Please contact me via the appropriate medium, but keep in mind that
          I'll only respond to legit messages.
        </Text>
        <SubTitle>Email</SubTitle>
        <Text>
          My email address is{" "}
          <Link href="mailto: yankeybenneth@gmail.com">
            yankeybenneth@gmail.com
          </Link>
          . This is the best way to grab my attention in minute literally.
        </Text>
        <SubTitle>Instagram</SubTitle>
        <Text>
          I use instagram primarily to share things including tips and tricks
          with the tech community. Kindly follow me{" "}
          <Link href="https://www.instagram.com/papayankey_">here</Link>. If you
          want to ask a question, Instagram is the right medium and will
          definitely respond ASAP.
        </Text>
        <SubTitle>What I will respond to</SubTitle>
        <Text>
          I will definitely respond and be very happy to discuss with you on
          projects and collaborations. Any questions about contents produced on
          this blog will also get a response.
        </Text>
        <SubTitle>What I won't respond to</SubTitle>
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
                bgcolor: isActive ? "$bg1" : "$bg2",
                // boxShadow: isActive ? "$2" : "none",
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
  let formatter = new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return formatter
    .formatToParts(new Date(dateString))
    .map(({type, value}) => {
      if (type === "day") {
        let number = Number(value);
        return number < 10 ? `0${number}` : number;
      }
      if (type === "month") {
        return value.toUpperCase();
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
      <Heading
        css={{
          m: 0,
          fontSize: "calc($6 * 1.5)",
          color: "$text1",
          letterSpacing: 1,
        }}
      >
        {entry[0]}
      </Heading>
      <Box />
      <Box css={{ my: "$4" }}>
        {entry[1].map((field, idx) => {
          const { published, title } = field;
          return (
            <Card
              key={idx}
              css={{
                mb: "$2",
              }}
            >
              <Time dateTime={published}>{formatDate(published)}</Time>
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
  const { title, summary, published } = post;
  let date = formatDate(published);

  return (
    <Card
      css={{
        mb: "$3",
        py: "$5",
      }}
      onClick={() => handleIsReading(post)}
    >
      <Text
        css={{
          m: 0,
          letterSpacing: 0.5,
          fontSize: "$2",
          color: "$text1",
        }}
      >
        {date}
      </Text>
      <Text
        css={{
          m: 0,
          fontWeight: "$medium",
          letterSpacing: 0.8,
          fontSize: "$5",
        }}
      >
        {title}
      </Text>
      <Text>{summary}</Text>
      <Text css={{ m: 0, fontSize: "$3", color: "$text1" }}>Read more</Text>
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
        justify: isFetchingLatest ? "center" : "flex-start",
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
          <Heading as="h4" css={{ my: "$8", fontWeight: "$normal" }}>
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
              <Fragment key={entry[0]}>
                <FilteredEntries
                  entry={entry}
                  handleIsReading={handleIsReading}
                />
                {/** spacer */}
                <Box css={{ my: "$8" }} />{" "}
              </Fragment>
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
          <Button
            css={{
              mt: "$2",
              justify: "center",
              color: "$text2"
            }}
            onClick={refetchArticles}
         >
            Try again
          </Button>
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
        <SubTitle>Work Experience</SubTitle>
        <Card css={{ my: "$4" }}>
          <Text
            css={{
              fontSize: "$2",
              m: 0,
              mb: "$1",
              color: "$text1",
            }}
          >
            2019 &middot; Present
          </Text>
          <CardTitle>Content Creator</CardTitle>
          <Text css={{ m: 0, mt: "$2" }}>
            I create concise programming articles, code snippets, tips and
            tricks in wide variety of languages, libraries and tools
          </Text>
        </Card>
        <SubTitle>Technical Skills</SubTitle>
        <Card css={{ my: "$4" }}>
          <CardTitle>Proficient in</CardTitle>
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
              "HTML5",
              "CSS3",
              "Styled-Component",
              "Material-UI",
            ].map((item, idx) => (
              <Pill key={idx}>{item}</Pill>
            ))}
          </Flex>
        </Card>
        <Card css={{ my: "$4" }}>
          <CardTitle>Experienced in</CardTitle>
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
        <Card css={{ my: "$4" }}>
          <CardTitle>Familiar with</CardTitle>
          <Flex
            css={{
              mt: "$4",
              flexWrap: "wrap",
            }}
          >
            {[
              "Java",
              "Golang",
              "MongoDB",
              "Webpack",
              "Eslint",
              "SSH",
              "Prettier",
            ].map((item, idx) => (
              <Pill key={idx}>{item}</Pill>
            ))}
          </Flex>
        </Card>
        <SubTitle>Education</SubTitle>
        <Card css={{ my: "$4" }}>
          <Text
            css={{
              fontSize: "$2",
              m: 0,
              mb: "$1",
              color: "$text1",
            }}
          >
            2008 &middot; 2012
          </Text>
          <CardTitle>University of Cape Coast</CardTitle>
          <Text css={{ m: 0, mt: "$2" }}>
            Department of Molecular Biology & Biotechnology
          </Text>
        </Card>
        <SubTitle>Hobbies</SubTitle>
        <Card css={{ my: "$4" }}>
          <Flex css={{ direction: "row" }}>
            {["Teaching", "Gaming", "Reading"].map((item, idx) => (
              <Pill css={{ mb: 0 }} key={idx}>
                {item}
              </Pill>
            ))}
          </Flex>
        </Card>
      </Container>
    </Wrapper>
  );
}

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
        <Card css={{ items: "center", justify: "center", py: "$5" }}>
          <Time
            dateTime={published}
            css={{ textAlign: "center", fontSize: "$2" }}
          >
            {formatDate(published).toUpperCase()}
          </Time>
          <Heading
            as="h2"
            css={{
              m: 0,
              mt: "$2",
              letterSpacing: 1,
              textAlign: "center",
              fontSize: "$6"
            }}
          >
            {title}
          </Heading>
        </Card>
        <MarkdownContent dangerouslySetInnerHTML={{ __html: content }} />
      </Container>
    </Wrapper>
  );
}

// Root app
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

  const [isSunset, setIsSunset] = useState(() => {
    let hrs = new Date().getHours();
    if (hrs > 7 && hrs < 19) {
      return true;
    }
    return false;
  });

  // automatic theme toggle
  useEffect(() => {
    if (!isSunset) {
      document.body.classList.add(darkTheme);
    }
  }, [isSunset]);

  const handleIsReading = (post) => {
    setPost(post);
    setIsReading(true);
  };

  const getArticlesProps = () => ({
    activeRoute,
    setActiveRoute,
    handleIsReading,
  });

  const getNavbarProps = () => ({
    activeRoute,
    setActiveRoute,
    setIsReading,
    isReading,
    isPortfolio,
    setIsPortfolio,
  });
 

  // adds global styles
  globalStyles();

  return (
    <AppContext.Provider
      value={{
        cached: {
          previousRoute,
          profileImage,
          latestRef,
          sortedRef,
          activeFilter,
          pageYOffset,
        },
        setIsSunset,
        isSunset,
      }}
    >
        <NavigationBar {...getNavbarProps()} />
        {isReading && <PostContent post={post} />}
        {!isReading &&
            (function (route) {
              switch (route) {
                case Routes.ARTICLES:
                  return <Articles {...getArticlesProps()} />;
                case Routes.RESUME:
                  return <Resume />;
                case Routes.ABOUT:
                  return (
                    <About
                      activeRoute={activeRoute}
                      setActiveRoute={setActiveRoute}
                    />
                  );
                case Routes.CONTACT:
                  return <Contact />;
                default:
                  return <Home {...getArticlesProps()} />;
              }
            })(activeRoute)}
        <Footer activeRoute={activeRoute} />
    </AppContext.Provider>
  );
}

