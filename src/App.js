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
import "highlight.js/styles/vs.css";

// icons
import { FiArrowLeft } from "react-icons/fi";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

import { data } from "./Data";
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
      default: "'Source Sans Pro', $fallback",
    },
    fontWeights: {
      light: 300,
      regular: 400,
      semiBold: 600,
      bold: 700,
    },
    colors: {
      blue1: "hsl(206 100% 99.2%)",
      blue2: "hsl(210 100% 98.0%)",
      blue3: "hsl(209 100% 96.5%)",
      blue4: "hsl(210 98.8% 94.0%)",
      blue5: "hsl(209 95.0% 90.1%)",
      blue6: "hsl(209 81.2% 84.5%)",
      blue7: "hsl(208 77.5% 76.9%)",
      blue8: "hsl(206 81.9% 65.3%)",
      blue9: "hsl(206 100% 50.0%)",
      blue10: "hsl(208 100% 47.3%)",
      blue11: "hsl(211 100% 43.2%)",
      blue12: "hsl(211 100% 15.0%)",
      slate1: "hsl(206 30.0% 98.8%)",
      slate2: "hsl(210 16.7% 97.6%)",
      slate3: "hsl(209 13.3% 95.3%)",
      slate4: "hsl(209 12.2% 93.2%)",
      slate5: "hsl(208 11.7% 91.1%)",
      slate6: "hsl(208 11.3% 88.9%)",
      slate7: "hsl(207 11.1% 85.9%)",
      slate8: "hsl(205 10.7% 78.0%)",
      slate9: "hsl(206 6.0% 56.1%)",
      slate10: "hsl(206 5.8% 52.3%)",
      slate11: "hsl(206 6.0% 43.5%)",
      slate12: "hsl(206 24.0% 9.0%)",
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
      1: "1px 1px 0 $colors$slate3, -1px -1px 0 $colors$slate3",
      2: "1.2px 1.2px 0 $colors$slate6, -1.2px -1.2px 0 $colors$slate6",
      3: "1.4px 1.4px 0 $colors$slate6, -1.4px -1.4px 0 $colors$slate6",
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
    mt: () => (v) => ({ marginTop: v }),
    mb: () => (v) => ({ marginBottom: v }),
    ml: () => (v) => ({ marginLeft: v }),
    mr: () => (v) => ({ marginRight: v }),
    mx: () => (v) => ({ marginLeft: v, marginRight: v }),
    my: () => (v) => ({ marginTop: v, marginBottom: v }),
    m: () => (v) => ({
      marginTop: v,
      marginBottom: v,
      marginLeft: v,
      marginRight: v,
    }),
    pt: () => (v) => ({ paddingTop: v }),
    pb: () => (v) => ({ paddingBottom: v }),
    pl: () => (v) => ({ paddingLeft: v }),
    pr: () => (v) => ({ paddingRight: v }),
    px: () => (v) => ({ paddingLeft: v, paddingRight: v }),
    py: () => (v) => ({ paddingTop: v, paddingBottom: v }),
    p: () => (v) => ({
      paddingTop: v,
      paddingBottom: v,
      paddingLeft: v,
      paddingRight: v,
    }),
    bgcolor: () => (v) => ({ backgroundColor: v }),
    size: () => (v) => ({ width: v, height: v }),
    direction: () => (v) => ({ flexDirection: v }),
    justify: () => (v) => ({ justifyContent: v }),
    items: () => (v) => ({ alignItems: v }),
  },
  media: {
    bp1: "(min-width: 640px)",
  },
};

const { styled, keyframes, global } = createCss(config);

// =============== GLOBALS ================= //

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
  "h1, h2, h3, h4, h5, h6": {
    fontWeight: "$normal",
  },
  body: {
    lineHeight: "$2",
    fontSize: "$4",
    fontFamily: "$default",
    fontWeight: "$normal",
    color: "$slate12",
    bgcolor: "$slate3",
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

// =============== END GLOBALS ================= //

// Navbar height
const NAVBAR_HEIGHT = 60;
const MEDIUM_SCREEN_HEIGHT = "720";

// =============== STITCHES COMPONENTS ================= //

const Box = styled("div");

const Flex = styled(Box, {
  display: "flex",
});

const Button = styled("button", {
  fontFamily: "$default",
  fontSize: "$4",
  appearance: "none",
  border: "1px solid $colors$blue10",
  borderRadius: 9999,
  bgcolor: "$blue3",
  p: "$2",
  m: 0,
  color: "$blue10",
});

const Text = styled("p", {
  my: "$3",
});

const Title = styled("h2", {
  mb: "$4",
  fontWeight: "$bold",
  textAlign: "center",
  textTransform: "uppercase",
  letterSpacing: 1.5,
});

const SubTitle = styled("h4", {
  mt: "$4",
  letterSpacing: 1.2,
  textTransform: "uppercase",
});

const SubTitleBold = styled(SubTitle, {
  px: 0,
  color: "$slate12",
  fontWeight: "$semiBold",
});

const Container = styled(Box, {
  height: "100%",
  width: "100%",
  maxWidth: 680,
  margin: "0 auto",
  px: "$3",
});

const ActivityLayout = styled(Flex, {
  justify: "center",
  items: "center",
  size: "100%",
});

const rotate = keyframes({
  "100%": { transform: "rotate(360deg)" },
});

const ActivityIndicator = styled(Box, {
  size: 30,
  borderRadius: 99999,
  border: "3px solid $colors$slate3",
  borderTopColor: "$colors$slate7",
  borderBottomColor: "$colors$slate7",
  borderRightColor: "$colors$slate7",
  animation: `${rotate} 1s linear infinite`,
});

const FooterLayout = styled("footer", {
  width: "100vw",
  textAlign: "center",
  px: 0,
  py: "$4",
  bgcolor: "$slate6",
  boxShadow: "$1",
  position: "relative",
});

const Link = styled("a", {
  color: "$blue9",
});

const Layout = styled(Flex, {
  direction: "column",
  py: "$9",
});

const Time = styled("time", {
  fontSize: "$1",
  color: "$slate11",
  letterSpacing: 1,
});

const Heading = styled("h3", {
  my: "$5",
  fontSize: "$6",
});

const SubHeading = styled("h4", {
  mt: "$4",
  fontSize: "calc($6 - 4px)",
});

const ImageLayout = styled(Box, {
  m: "0 auto",
  size: 80,
  borderRadius: 99999,
  overflow: "hidden",
  position: "absolute",
  top: "-40px",
  left: "calc(50vw - 40px)",
  boxShadow: "0 0 0 8px $colors$slate3",
});

const MarkdownContent = styled("article", {
  pb: "calc($12 * 3)",
  "p + p": {
    mt: "$3",
  },
  "ul,ol": {
    ml: "$3",
    lineHeight: "$4",
  },
  h3: {
    fontWeight: "$bold",
  },
  "h3, h4": {
    margin: "$8 0 $4",
  },
  "h3 + h4": {
    mt: "$1",
  },
  pre: {
    p: "$3",
    lineHeight: "$2",
    color: "$slate12",
    bgcolor: "$slate3",
    margin: "$4 0",
    width: "100%",
    overflow: "auto",
    borderRadius: 4,
  },
  mark: {
    // bgcolor: "$gray1", // TODO
    px: "$1",
    borderRadius: 4,
  },
  "& #post-img": {
    my: "$8",
    "& img": {
      width: "100%",
      boxShadow: "0 0 4px $colors$slate9",
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
  p: "$3",
  boxShadow: "0 0 0 1px $colors$slate6",
  bgcolor: "white",
  borderRadius: 4,
});

const CardTitle = styled(SubTitleBold, {
  m: 0,
  textTransform: "capitalizeFirst",
  fontWeight: "$semiBold",
  color: "$slate11",
});

const Pills = styled(Flex, {
  mt: "$4",
  flexWrap: "wrap",
});

const Pill = styled(Box, {
  px: "$2",
  py: "$1",
  bgcolor: "$slate3",
  border: "1px solid $colors$slate7",
  borderRadius: 99999,
  mb: "$2",
  "&:not(:last-of-type)": {
    mr: "$2",
  },
});

const Social = styled(Link, {
  color: "$slate9",
  "& *": {
    size: 24,
  },
});

// =============== END STITCHES COMPONENTS ================ //

// =============== HOOKS ================ //

// Parse markdown contents to html
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
  // enable features
  md.inline.ruler.enable(["footnote_inline", "ins", "mark", "sub", "sup"]);
  return md.render(props);
}

// =============== END HOOKS ================ //

// =============== COMMON  ================ //

// Formats date
const formatDate = (dateString) => {
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
        return number < 10 ? `0${number}` : number;
      }
      if (type === "month") {
        return capitalizeFirst(value.substring(0, 3));
      }
      return value;
    })
    .join("");
};

// capitalizeFirst first
const capitalizeFirst = (v) => {
  return v[0].toUpperCase() + v.slice(1);
};

// =============== END COMMON  ================ //

// =============== REACT COMPONENTS ================ //

const IMAGE_ASSETS = "2dmBvE3pqzChaplVyTqdtw";
const IMAGE_STATUS = {
  LOADING: "loading",
  LOADED: "loaded",
  FAILED: "failed",
};

// Footer
function Footer({ postIsActive }) {
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

  // fetch profile image
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
    <FooterLayout
      css={{
        p: "$5",
        px: "$3",
      }}
    >
      {/* <ImageLayout css={{ boxShadow: postIsActive && "0 0 0 8px white" }}> */}
      {/*   {imageStatus === IMAGE_STATUS.LOADING && ( */}
      {/*     <ActivityLayout css={{ bgcolor: "$slate3" }}> */}
      {/*       <ActivityIndicator /> */}
      {/*     </ActivityLayout> */}
      {/*   )} */}
      {/*   <Flex */}
      {/*     css={{ */}
      {/*       size: "100%", */}
      {/*       position: "absolute", */}
      {/*       top: 0, */}
      {/*       left: 0, */}
      {/*       bgcolor: "$slate6", */}
      {/*     }} */}
      {/*   > */}
      {/*     {imageStatus === IMAGE_STATUS.FAILED && ( */}
      {/*       <Text css={{ m: "auto" }}>YANKEY</Text> */}
      {/*     )} */}
      {/*     {imageStatus === IMAGE_STATUS.LOADED && ( */}
      {/*       <Box */}
      {/*         as="img" */}
      {/*         src={`https:${image}`} */}
      {/*         alt="YANKEY" */}
      {/*         onLoad={onImageLoaded} */}
      {/*         onError={onImageError} */}
      {/*         css={{ */}
      {/*           size: "100%", */}
      {/*           objectFit: "cover", */}
      {/*           bgcolor: "$slate3", */}
      {/*         }} */}
      {/*       /> */}
      {/*     )} */}
      {/*   </Flex> */}
      {/* </ImageLayout> */}
      <Text>Learning, Building & Mentoring</Text>
      <Flex
        css={{
          mb: "$3",
          justify: "center",
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
      <Text css={{ my: 0, fontSize: "$2", color: "$slate11" }}>
        Built with React & Stitches JS
      </Text>
      <Text css={{ my: 0, fontSize: "$2", color: "$slate11" }}>
        &copy; 2019 &ndash; {new Date().getFullYear()} &middot; Benneth Yankey
      </Text>
    </FooterLayout>
  );
}

// Navigation

var Routes = {
  HOME: "home",
  ARTICLES: "articles",
  RESUME: "resume",
  ABOUT: "about",
  CONTACT: "contact",
};

// Navigation items
const navItems = [Routes.ARTICLES, Routes.RESUME, Routes.ABOUT, Routes.CONTACT];

function AppBar({
  activeRoute,
  setActiveRoute,
  setPostIsActive,
  postIsActive,
}) {
  const toggleRoute = (route) => {
    setActiveRoute(route);
  };

  return (
    <Flex
      as="nav"
      css={{
        position: "fixed",
        width: "100vw",
        justify: postIsActive ? "flex-start" : "center",
        items: "center",
        height: NAVBAR_HEIGHT,
        bgcolor: "white",
        boxShadow: "0 0 0 1px $colors$slate6",
        zIndex: "$3",
      }}
    >
      {!postIsActive &&
        navItems.map((v, i) => (
          <Flex
            key={`${v}-${i}`}
            onClick={() => toggleRoute(v)}
            css={{
              direction: "column",
              justify: "space-between",
              height: "100%",
              fontSize: "$3",
              textTransform: "uppercase",
              letterSpacing: 1.2,
              px: "$2",
            }}
          >
            <Box />
            {capitalizeFirst(v)}
            <Box
              css={{
                width: "100%",
                height: 3,
                backgroundColor: activeRoute === v ? "$blue9" : "transparent",
                borderTopLeftRadius: 99999,
                borderTopRightRadius: 99999,
              }}
            />
          </Flex>
        ))}
      {postIsActive && (
        <Container>
          <Flex
            css={{
              items: "center",
              py: "calc($1 / 2)",
              borderRadius: 2,
            }}
            onClick={() => setPostIsActive(false)}
          >
            <FiArrowLeft size={24} />
            <Text css={{ pl: "$1" }}>Back</Text>
          </Flex>
        </Container>
      )}
    </Flex>
  );
}

// Home
function Home({ setActiveRoute }) {
  return (
    <Layout
      as="main"
      css={{
        py: 0,
      }}
    >
      <Container
        css={{
          "@bp1": {
            maxWidth: 420,
          },
        }}
      >
        <Flex
          css={{
            height: "100%",
            width: "100%",
            justify: "center",
            items: "center",
            mb: "$3",
          }}
        >
          <Box
            css={{
              width: 125,
              height: 125,
              borderRadius: 99999,
              bgcolor: "$slate6",
            }}
          />
        </Flex>
        <Box css={{ textAlign: "center" }}>
          <Text css={{ fontSize: "$6" }}>BENNETH YANKEY</Text>
          <Text>
            Hi, I'm a Software Enginner based in Ghana and a high school biology
            teacher. This is my space, where I keep notes on everything I have
            learned and learning with you.
          </Text>
        </Box>
      </Container>
    </Layout>
  );
}

// About
function About({ setActiveRoute, activeRoute }) {
  const { cached } = useAppContext();

  const handleRouteToggle = () => {
    cached.previousRoute.current = activeRoute;
    setActiveRoute(Routes.CONTACT);
  };

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <Layout>
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
        <SubTitleBold>Other Interests</SubTitleBold>
        <Text>Aside programming here are other areas of his interest:</Text>
        <Box>
          <Text css={{ fontWeight: "$semiBold" }}>Teaching</Text>
          <Text>
            {" "}
            He likes to share and impact knowledge. He has been teaching Biology
            to high school pupils for past 5 years and counting. He aids pupils
            to understand and appreciate the beauty of nature.
          </Text>
        </Box>
        <Box>
          <Text css={{ fontWeight: "$semiBold" }}>Gaming</Text>
          <Text>
            {" "}
            He loves and has been gaming since he was 5, playing SEGA. He
            currently owns a PS4 Console and enjoys playing FIFA.
          </Text>
        </Box>
        <SubTitleBold>Get in touch</SubTitleBold>
        <Text>
          You can contact him via{" "}
          <Link href="#" onClick={handleRouteToggle}>
            contact page
          </Link>
          . He is happy to respond to projects discussion, collaborations and
          corrections or suggestions of any material.
        </Text>
      </Container>
    </Layout>
  );
}

// Contact
function Contact() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <Layout>
      <Container>
        <Title>Contact me</Title>
        <Text css={{ m: 0 }}>
          Thanks for your interest in getting in touch with me.
        </Text>
        <Text>
          Please contact me via the appropriate medium, but keep in mind that
          I'll only respond to legit messages.
        </Text>
        <SubTitleBold>Email</SubTitleBold>
        <Text>
          My email address is{" "}
          <Link href="mailto: yankeybenneth@gmail.com">
            yankeybenneth@gmail.com
          </Link>
          . This is the best way to grab my attention in minute literally.
        </Text>
        <SubTitleBold>Linkedin</SubTitleBold>
        <Text>
          I use Linkedin primarily to share things including tips and tricks
          with the tech community. Kindly connect with me{" "}
          <Link href="https://www.linkedin.com/in/benneth-yankey-23201232/">
            here
          </Link>
          . If you want to ask a question, Linkedin is the right medium and will
          definitely respond ASAP.
        </Text>
        <SubTitleBold>What I will respond to</SubTitleBold>
        <Text>
          I will definitely respond and be very happy to discuss with you on
          projects and collaborations. Any questions about contents produced on
          this blog will also get a response.
        </Text>
        <SubTitleBold>What I won't respond to</SubTitleBold>
        <Text>I won't respond if message is unclear enough.</Text>
      </Container>
    </Layout>
  );
}

// Articles filter

const Filters = {
  CSS: "css",
  React: "react",
  Javascript: "javascript",
  Go: "golang",
  Typescript: "typescript",
  Java: "java",
};

const cardStripes = {
  javascript: "hsl(39 100% 57.0%)",
  react: "hsl(206 100% 50.0%)",
  go: "hsl(252 56.0% 57.5%)",
  typescript: "hsl(193 98.0% 70.0%)",
  java: "hsl(131 41.0% 46.5%)",
};

// Tags
function ArticleFilter({ setActiveFilter }) {
  return (
    <Flex
      css={{
        mt: "$4",
        flexWrap: "wrap",
        justify: "center",
      }}
    >
      {Object.values(Filters).map((filter, idx) => {
        return (
          <Box
            key={idx}
            css={{
              fontSize: "$3",
              letterSpacing: 1.1,
              border: "1px solid $colors$slate8",
              bgcolor: "$slate4",
              borderRadius: 99999,
              px: "$2",
              py: "$1",
              mb: "$2",
              "&:not(:last-of-type)": {
                mr: "$2",
              },
              "&:hover": {
                bgcolor: "$slate5",
              },
            }}
            onClick={() => setActiveFilter(filter)}
          >
            {filter.toUpperCase()}
          </Box>
        );
      })}
    </Flex>
  );
}

const MINIMUM_CARD_DISPLAY_LENGTH = 6;

// Filter entries
function FilteredEntries({
  // activeFilter,
  posts,
  // sortedEntries,
  // latestEntries,
  setReaderMode,
}) {
  // const handleOpenArticle = (article) => {
  //   setReaderMode(article);
  // };

  return (
    <Box>
      {Object.entries(posts).map(({ 0: tag, 1: entries }) => {
        return (
          <Box>
            <Flex
              css={{
                my: "$7",
                mt: "calc($5 * 2)",
                direction: "column",
                items: "center",
              }}
            >
              <Text css={{ m: 0, fontSize: "$5" }}>{capitalizeFirst(tag)}</Text>
              <Box
                css={{
                  width: 15,
                  height: 3,
                  bgcolor: cardStripes[tag],
                  borderRadius: 9999,
                }}
              />
            </Flex>
            <Box
              css={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "$3",
              }}
            >
              {entries.length &&
                entries.slice(0, 6).map((entry) => {
                  const { id, published, title } = entry;
                  return (
                    <Card
                      key={id}
                      onClick={() => setReaderMode(entry)}
                      css={{
                        textAlign: "center",
                        borderLeft: "3px solid",
                        borderLeftColor: `${cardStripes[tag]}`,
                      }}
                    >
                      <Time dateTime={published}>{formatDate(published)}</Time>
                      <Text
                        css={{
                          m: 0,
                        }}
                      >
                        {title}
                      </Text>
                    </Card>
                  );
                })}
            </Box>
            {entries.length > MINIMUM_CARD_DISPLAY_LENGTH && (
              <Flex
                css={{
                  direction: "row",
                  justify: "center",
                  mt: "calc($5 * 1.2)",
                }}
              >
                <Button
                  css={{
                    borderColor: "$slate8",
                    borderRadius: 99999,
                    color: "$slate12",
                    bgcolor: "transparent",
                    px: "$2",
                    py: "$1",
                    "&:hover": {
                      bgcolor: "$slate3",
                    },
                  }}
                >
                  View More
                </Button>
              </Flex>
            )}
          </Box>
        );
      })}
    </Box>
  );
}

// Articles
function Articles({ setReaderMode }) {
  const { cached } = useAppContext();
  const [isFetching, setIsFetching] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [activeFilter, setActiveFilter] = useState();
  const [posts, setPosts] = useState(() => cached.sortedPosts.current);

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, []);

  function sortPostsByTag(posts) {
    let sorted = posts.reduce((accum, curr) => {
      let tag = curr.tag;
      if (!accum[tag]) {
        accum[tag] = [];
      }
      accum[tag].push(curr);
      return accum;
    }, {});
    setPosts(sorted);
  }

  const getPosts = useCallback(async () => {
    try {
      setIsFetching(true);
      const entries = await client.getEntries({
        content_type: "blogPost",
      });
      let e = [];
      entries.items.forEach((entry) => e.push(entry.fields));
      sortPostsByTag(e);
      setIsFetching(false);
      cached.sortedPosts.current = e;
    } catch (error) {
      setHasError(true);
    }
  }, [cached.sortedPosts]);

  // fetch all posts
  useEffect(() => {
    if (!Object.entries(cached.sortedPosts.current).length) {
      getPosts();
    }
  }, [getPosts, cached.sortedPosts]);

  const refetchPosts = () => {
    setHasError(false);
    getPosts();
  };

  return (
    <Flex
      as="section"
      css={{
        flex: 1,
        justify: isFetching ? "center" : "flex-start",
        direction: "column",
        pt: "$5",
        pb: "calc($12 * 3)",
      }}
    >
      <Container>
        {isFetching && (
          <Fragment>
            <ActivityLayout>
              <ActivityIndicator />
            </ActivityLayout>
            <Text css={{ textAlign: "center" }}>Fetching articles...</Text>
          </Fragment>
        )}
        {!isFetching && (
          <Fragment>
            <Box>
              <Text css={{ textAlign: "center", fontSize: "$5" }}>TAGS</Text>
              <ArticleFilter setActiveFilter={setActiveFilter} />
            </Box>
            <FilteredEntries setReaderMode={setReaderMode} posts={posts} />
          </Fragment>
        )}
        {hasError && (
          <Box css={{ textAlign: "center" }}>
            <Text css={{ my: 0 }}>Oops, unable to fetch articles</Text>
            <Text css={{ my: 0, color: "$slate11" }}>
              The request could not be completed
            </Text>
            <Button
              css={{
                mt: "$3",
                fontSize: "$3",
                letterSpacing: 1.2,
              }}
              onClick={refetchPosts}
            >
              Try AGAIN
            </Button>
          </Box>
        )}
      </Container>
    </Flex>
  );
}

// Resume
function Resume() {
  // useLayoutEffect(() => {
  //   window.scrollTo(0, 0);
  // });

  return (
    <Layout>
      <Container>
        <Title>Resume</Title>
        <SubTitle>Experience</SubTitle>
        <Card css={{ my: "$4" }}>
          <Text
            css={{
              letterSpacing: 1,
              fontSize: "$1",
              m: 0,
              color: "$slate11",
            }}
          >
            2019 &middot; PRESENT
          </Text>
          <CardTitle>Content Creator</CardTitle>
          <Text css={{ m: 0, mt: "$1" }}>
            I create concise programming articles, code snippets, tips and
            tricks in wide variety of languages, libraries and tools
          </Text>
        </Card>
        <SubTitle>Skills</SubTitle>
        <Box
          css={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "$3",
            mt: "$4",
          }}
        >
          <Card>
            <CardTitle>Proficient in</CardTitle>
            <Pills>
              {[
                "Javascript",
                "Typescript",
                "React",
                "HTML5",
                "CSS3",
                "Material-UI",
                "Styled-Component",
              ].map((item, idx) => (
                <Pill key={idx}>{item}</Pill>
              ))}
            </Pills>
          </Card>
          <Card>
            <CardTitle>Experienced in</CardTitle>
            <Pills>
              {[
                "SQL",
                "Node",
                "Git & Github",
                "Bootstrap",
                "Tailwind",
                "Postgres",
                "SQLite",
                "SASS",
              ].map((item, idx) => (
                <Pill key={idx}>{item}</Pill>
              ))}
            </Pills>
          </Card>
          <Card>
            <CardTitle>Familiar with</CardTitle>
            <Pills>
              {[
                "Java",
                "Golang",
                "NoSQL",
                "MongoDB",
                "Webpack",
                "ESLint",
                "SSH",
                "Prettier",
              ].map((item, idx) => (
                <Pill key={idx}>{item}</Pill>
              ))}
            </Pills>
          </Card>
        </Box>
        <SubTitle>Education</SubTitle>
        <Card css={{ my: "$4" }}>
          <Text
            css={{
              m: 0,
              fontSize: "$1",
              color: "$slate11",
            }}
          >
            2008 &middot; 2012
          </Text>
          <CardTitle>University of Cape Coast</CardTitle>
          <Text css={{ m: 0, mt: "$1" }}>
            Department of Molecular Biology & Biotechnology
          </Text>
        </Card>
        <SubTitle>Hobbies</SubTitle>
        <Card css={{ my: "$4" }}>
          <Pills css={{ mt: 0 }}>
            {["Teaching", "Gaming", "Reading"].map((item, idx) => (
              <Pill css={{ mb: 0 }} key={idx}>
                {item}
              </Pill>
            ))}
          </Pills>
        </Card>
      </Container>
    </Layout>
  );
}

// Post contents
function PostContent({ post }) {
  let { body, title, published, tag } = post;
  const content = useRemarkable(body);

  // useLayoutEffect(() => {
  //   window.scrollTo(0, 0);
  // }, []);

  return (
    <Container css={{ flex: "1 0 auto" }}>
      <Layout css={{ pb: 0 }}>
        <Text
          as="h2"
          css={{ m: 0, fontWeight: "$semiBold", fontSize: "$6", mb: "$1" }}
        >
          {title}
        </Text>
        <Time dateTime={published} css={{ fontSize: "$2" }}>
          Last Modified: {formatDate(published)}
        </Time>
        <Box
          css={{
            px: "$3",
            pt: "$5",
            mt: "calc($5 * 1.5)",
            bgcolor: "white",
            borderTop: `2px solid ${cardStripes[tag]}`,
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
            boxShadow: "0 0 0 1px $colors$slate6",
          }}
        >
          <MarkdownContent dangerouslySetInnerHTML={{ __html: content }} />
        </Box>
      </Layout>
    </Container>
  );
}

// Main / Root App
export default function App() {
  const [post, setPost] = useState(null);
  const [postIsActive, setPostIsActive] = useState(false);
  const [activeRoute, setActiveRoute] = useState(Routes.HOME);

  // caches
  let previousRoute = useRef("");
  let profileImage = useRef("");
  let sortedPosts = useRef({});
  let activeFilter = useRef(Filters.Javascript);
  let pageYOffset = useRef(0);

  const setReaderMode = (content) => {
    setPost(content);
    setPostIsActive(true);
  };

  // adds global styles
  globalStyles();

  return (
    <AppContext.Provider
      value={{
        cached: {
          previousRoute,
          profileImage,
          sortedPosts,
          activeFilter,
          pageYOffset,
        },
      }}
    >
      <Flex
        css={{
          direction: "column",
          justify: activeRoute === Routes.HOME ? "space-between" : "flex-start",
          minHeight: "100vh",
        }}
      >
        <AppBar
          activeRoute={activeRoute}
          setActiveRoute={setActiveRoute}
          postIsActive={postIsActive}
          setPostIsActive={setPostIsActive}
        />
        <Box css={{ height: NAVBAR_HEIGHT }} />
        {postIsActive && <PostContent post={post} />}
        {!postIsActive &&
          (function (route) {
            switch (route) {
              case Routes.ARTICLES:
                return (
                  <Articles
                    activeRoute={activeRoute}
                    setActiveRoute={setActiveRoute}
                    postIsActive={postIsActive}
                    setReaderMode={setReaderMode}
                  />
                );
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
                return (
                  <Home
                    activeRoute={activeRoute}
                    setActiveRoute={setActiveRoute}
                    postIsActive={postIsActive}
                    setPostIsActive={setPostIsActive}
                  />
                );
            }
          })(activeRoute)}
        <Footer postIsActive={postIsActive} activeRoute={activeRoute} />
      </Flex>
    </AppContext.Provider>
  );
}
