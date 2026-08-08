"use client";

import ScrollStory from "../ScrollStory";
import ScrollProgress from "../ScrollProgress";
import ScrollStoryLink from "../ScrollStoryLink";
import ScrollChapter from "../ScrollChapter";
import LayeredImageScene from "../LayeredImageScene";
import ImageLayer from "../ImageLayer";
import DepthLayer from "../DepthLayer";

/* -------------------------------------------------------------------------- */
/*                                  Assets                                    */
/* -------------------------------------------------------------------------- */

const SPACE_IMAGE =
  "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=2000&q=80";

const CODE_IMAGE =
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=2000&q=80";

const CIRCUIT_IMAGE =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=80";

const SERVER_IMAGE =
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=2000&q=80";

const TEAM_IMAGE =
  "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=2000&q=80";

const BUILDER_IMAGE =
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=2000&q=80";

const FLARE_IMAGE =
  "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/lensflare/lensflare0.png";

/* -------------------------------------------------------------------------- */
/*                                   Data                                     */
/* -------------------------------------------------------------------------- */

const storyNavigation = [
  {
    id: "story-intro",
    label: "Introduction",
  },
  {
    id: "story-interface",
    label: "Interfaces",
  },
  {
    id: "story-systems",
    label: "Systems",
  },
  {
    id: "story-cloud",
    label: "Cloud",
  },
  {
    id: "story-rudra",
    label: "Rudra",
  },
  {
    id: "story-future",
    label: "Future",
  },
];

const projects = [
  {
    index: "01",
    title: "Rudra Visual Builder",
    description:
      "A reusable visual-development platform for composing libraries, modules, application interfaces, logic workflows and collaborative experiences.",
    image: BUILDER_IMAGE,
    tags: [
      "React",
      "TypeScript",
      "Next.js",
      "Yjs",
      "Three.js",
    ],
    link: "https://rudraapp.in",
  },
  {
    index: "02",
    title: "Real-time Collaboration",
    description:
      "A multiplayer editing system with shared state, presence, collaborative cursors and conflict-free updates.",
    image: TEAM_IMAGE,
    tags: [
      "Yjs",
      "WebSocket",
      "Firebase",
      "Node.js",
    ],
    link: "#contact",
  },
  {
    index: "03",
    title: "Cloud Application Platform",
    description:
      "A scalable application architecture with reusable interfaces, APIs, event-driven services and cloud integrations.",
    image: SERVER_IMAGE,
    tags: [
      "AWS",
      "Node.js",
      "PostgreSQL",
      "Docker",
    ],
    link: "#contact",
  },
  {
    index: "04",
    title: "Interactive Web Experiences",
    description:
      "Immersive browser experiences combining reusable components, layered depth, responsive animation and 3D rendering.",
    image: SPACE_IMAGE,
    tags: [
      "Motion",
      "Three.js",
      "React Three Fiber",
      "WebGL",
    ],
    link: "#contact",
  },
];

const experiences = [
  {
    period: "2025 — Present",
    role: "Full-stack Engineer",
    company: "Synechron · American Express",
    description:
      "Building and modernising React and Node.js applications, improving frontend architecture, application reliability and web performance.",
  },
  {
    period: "2022 — 2025",
    role: "Software Engineer",
    company: "Wipro Technologies",
    description:
      "Developed cloud-native services and enterprise interfaces using Node.js, TypeScript, React, GraphQL, AWS and event-driven architecture.",
  },
  {
    period: "2020 — 2022",
    role: "Software Engineer",
    company: "HCL Technologies",
    description:
      "Worked on enterprise banking and compliance applications using Java, Spring Boot, React and server-side web technologies.",
  },
  {
    period: "Independent",
    role: "Creator and Product Engineer",
    company: "Rudra",
    description:
      "Designing and building a reusable visual-development platform covering component libraries, modules, applications, logic and collaboration.",
  },
];

const skills = [
  {
    number: "01",
    title: "Frontend Engineering",
    description:
      "React, Next.js, TypeScript, responsive systems, accessibility, design systems and performance optimisation.",
  },
  {
    number: "02",
    title: "Backend Engineering",
    description:
      "Node.js, Express, Java, Spring Boot, GraphQL, REST APIs, microservices and asynchronous workflows.",
  },
  {
    number: "03",
    title: "Cloud Architecture",
    description:
      "AWS Lambda, SQS, SNS, API Gateway, PostgreSQL, Docker, serverless systems and deployment workflows.",
  },
  {
    number: "04",
    title: "Interactive Experiences",
    description:
      "Motion, Three.js, React Three Fiber, GSAP, WebSockets, Yjs and collaborative interfaces.",
  },
  {
    number: "05",
    title: "Product Engineering",
    description:
      "Converting unclear requirements into reusable systems with practical workflows and maintainable boundaries.",
  },
  {
    number: "06",
    title: "Developer Platforms",
    description:
      "Visual builders, reusable modules, component metadata, code generation and AI-assisted application workflows.",
  },
];

const engineeringPrinciples = [
  {
    number: "01",
    title: "Understand before building",
    description:
      "Clarify the user problem, system constraints and expected outcomes before selecting an implementation.",
  },
  {
    number: "02",
    title: "Design for change",
    description:
      "Prefer reusable boundaries and understandable contracts over tightly coupled short-term fixes.",
  },
  {
    number: "03",
    title: "Measure real behaviour",
    description:
      "Use performance metrics, production feedback and user behaviour instead of relying entirely on assumptions.",
  },
  {
    number: "04",
    title: "Own the complete result",
    description:
      "A feature is not finished when the code compiles. Reliability, usability, accessibility and maintenance also matter.",
  },
];

const currentExplorations = [
  {
    title: "Visual development",
    description:
      "Reusable modules, component metadata and developer-owned visual-development systems.",
  },
  {
    title: "Collaborative interfaces",
    description:
      "Yjs, CRDT state, presence, multiplayer editing and conflict-free updates.",
  },
  {
    title: "AI-assisted workflows",
    description:
      "MCP tools, function builders, agent actions and safe application-level automation.",
  },
  {
    title: "Immersive web",
    description:
      "Scroll storytelling, layered 2D depth, Three.js and browser-based 3D experiences.",
  },
];

/* -------------------------------------------------------------------------- */
/*                                Component                                   */
/* -------------------------------------------------------------------------- */

export default function SoftwareEngineerPortfolio() {
  return (
    <main className="portfolio-page">
      <style>
        {`
          :root {
            color-scheme: dark;
          }

          html {
            scroll-behavior: smooth;
            scroll-padding-top: 82px;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            background: #02050a;
          }

          button,
          a {
            font: inherit;
          }

          img {
            max-width: 100%;
          }

          .portfolio-page {
            min-height: 100vh;
            overflow-x: hidden;
            background:
              radial-gradient(
                circle at 50% 0%,
                rgba(27, 89, 124, 0.16),
                transparent 34%
              ),
              #02050a;
            color: #f8fafc;
            font-family:
              Inter,
              ui-sans-serif,
              system-ui,
              -apple-system,
              BlinkMacSystemFont,
              "Segoe UI",
              sans-serif;
          }

          /* ---------------------------------------------------------------- */
          /* Header                                                           */
          /* ---------------------------------------------------------------- */

          .portfolio-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 500;

            display: flex;
            align-items: center;
            justify-content: space-between;

            min-height: 76px;
            padding: 0 clamp(1.25rem, 5vw, 5rem);

            border-bottom:
              1px solid rgba(255, 255, 255, 0.08);

            background: rgba(2, 5, 10, 0.62);
            backdrop-filter: blur(20px);
          }

          .portfolio-brand {
            display: flex;
            align-items: center;
            gap: 12px;

            color: white;
            font-weight: 750;
            letter-spacing: -0.03em;
            text-decoration: none;
          }

          .brand-mark {
            width: 36px;
            height: 36px;

            display: grid;
            place-items: center;

            border:
              1px solid rgba(125, 211, 252, 0.45);

            border-radius: 12px;

            background:
              rgba(125, 211, 252, 0.1);

            color: #7dd3fc;
          }

          .portfolio-nav {
            display: flex;
            align-items: center;
            gap: 26px;
          }

          .portfolio-nav > a,
          .portfolio-nav > .header-story-link {
            color: rgba(255, 255, 255, 0.68);
            font-size: 14px;
            text-decoration: none;

            transition:
              color 180ms ease,
              transform 180ms ease;
          }

          .portfolio-nav > a:hover,
          .portfolio-nav > .header-story-link:hover {
            color: white;
            transform: translateY(-1px);
          }

          .header-cta,
          .primary-button,
          .secondary-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 9px;

            min-height: 46px;
            padding: 0 20px;

            border-radius: 999px;
            text-decoration: none;

            transition:
              transform 180ms ease,
              background 180ms ease,
              border-color 180ms ease;
          }

          .header-cta,
          .primary-button {
            border: 1px solid white;
            background: white;
            color: #02050a;
            font-weight: 750;
          }

          .secondary-button {
            border:
              1px solid rgba(255, 255, 255, 0.18);

            background:
              rgba(255, 255, 255, 0.06);

            color: white;
            font-weight: 650;
            backdrop-filter: blur(16px);
          }

          .header-cta:hover,
          .primary-button:hover,
          .secondary-button:hover {
            transform: translateY(-3px);
          }

          /* ---------------------------------------------------------------- */
          /* Scroll story                                                     */
          /* ---------------------------------------------------------------- */

          .story-copy {
            max-width: 720px;
            color: white;
            text-shadow:
              0 8px 38px rgba(0, 0, 0, 0.72);
          }

          .story-copy-right {
            margin-left: auto;
          }

          .story-copy-center {
            max-width: 920px;
            margin-inline: auto;
            text-align: center;
          }

          .eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 9px;

            margin: 0 0 18px;

            color: #7dd3fc;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 0.17em;
            text-transform: uppercase;
          }

          .eyebrow::before {
            content: "";

            width: 28px;
            height: 1px;

            background: currentColor;
          }

          .story-title {
            max-width: 930px;
            margin: 0;

            font-size:
              clamp(3.8rem, 9vw, 8.7rem);

            font-weight: 650;
            line-height: 0.88;
            letter-spacing: -0.075em;
          }

          .story-title .accent {
            color: #7dd3fc;
          }

          .story-heading {
            margin: 0;

            font-size:
              clamp(2.8rem, 6vw, 6rem);

            font-weight: 620;
            line-height: 0.94;
            letter-spacing: -0.06em;
          }

          .story-description {
            max-width: 610px;
            margin: 25px 0 0;

            color:
              rgba(255, 255, 255, 0.72);

            font-size:
              clamp(1rem, 1.6vw, 1.22rem);

            line-height: 1.7;
          }

          .story-copy-center .story-description {
            margin-inline: auto;
          }

          .story-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;

            margin-top: 30px;
          }

          .story-copy-center .story-actions {
            justify-content: center;
          }

          .story-stats {
            display: flex;
            flex-wrap: wrap;
            gap: 30px;

            margin-top: 42px;
          }

          .story-stat {
            padding-left: 16px;

            border-left:
              1px solid rgba(125, 211, 252, 0.5);
          }

          .story-stat strong {
            display: block;
            font-size: 1.4rem;
          }

          .story-stat span {
            color:
              rgba(255, 255, 255, 0.55);

            font-size: 13px;
          }

          .technology-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;

            max-width: 620px;
            margin-top: 28px;
          }

          .technology-chip {
            padding: 9px 14px;

            border:
              1px solid rgba(255, 255, 255, 0.14);

            border-radius: 999px;

            background:
              rgba(3, 8, 18, 0.5);

            color:
              rgba(255, 255, 255, 0.82);

            font-size: 13px;
            backdrop-filter: blur(14px);
          }

          /* ---------------------------------------------------------------- */
          /* Story navigation                                                 */
          /* ---------------------------------------------------------------- */

          .story-section-nav {
            position: absolute;
            top: 50%;
            right: clamp(1rem, 3vw, 2.5rem);
            z-index: 180;

            display: flex;
            flex-direction: column;
            gap: 10px;

            transform: translateY(-50%);

            pointer-events: auto;
          }

          .story-section-link {
            position: relative;

            display: grid;
            grid-template-columns: 26px auto;
            align-items: center;
            gap: 10px;

            min-height: 30px;

            color:
              rgba(255, 255, 255, 0.38);

            font-size: 11px;
            letter-spacing: 0.08em;
            text-decoration: none;
            text-transform: uppercase;

            transition:
              color 220ms ease,
              transform 220ms ease,
              opacity 220ms ease;
          }

          .story-section-link::before {
            content: "";

            position: absolute;
            left: -13px;

            width: 5px;
            height: 5px;

            border-radius: 999px;

            background: currentColor;

            transition:
              transform 220ms ease,
              box-shadow 220ms ease;
          }

          .story-section-link:hover {
            color:
              rgba(255, 255, 255, 0.82);

            transform: translateX(-4px);
          }

          .story-section-link.is-active {
            color: #7dd3fc;
            transform: translateX(-6px);
          }

          .story-section-link.is-active::before {
            transform: scale(1.7);

            box-shadow:
              0 0 14px
              rgba(125, 211, 252, 0.9);
          }

          .story-nav-number {
            font-variant-numeric: tabular-nums;
          }

          .story-nav-label {
            white-space: nowrap;
          }

          /* ---------------------------------------------------------------- */
          /* Shared content sections                                          */
          /* ---------------------------------------------------------------- */

          .content-section {
            position: relative;

            padding:
              clamp(6rem, 11vw, 10rem)
              clamp(1.25rem, 6vw, 6rem);
          }

          .section-inner {
            width: min(1180px, 100%);
            margin-inline: auto;
          }

          .section-intro {
            display: grid;
            grid-template-columns:
              minmax(0, 0.75fr)
              minmax(0, 1.25fr);

            gap: clamp(2rem, 8vw, 8rem);

            align-items: end;

            margin-bottom:
              clamp(3rem, 6vw, 6rem);
          }

          .section-number {
            margin: 0 0 12px;

            color: #7dd3fc;

            font-size: 13px;
            font-weight: 800;
            letter-spacing: 0.14em;
          }

          .section-title {
            margin: 0;

            font-size:
              clamp(2.7rem, 6vw, 5.6rem);

            font-weight: 600;
            line-height: 0.96;
            letter-spacing: -0.065em;
          }

          .section-description {
            max-width: 650px;
            margin: 0;

            color:
              rgba(255, 255, 255, 0.62);

            font-size: 1.05rem;
            line-height: 1.8;
          }

          /* ---------------------------------------------------------------- */
          /* About                                                            */
          /* ---------------------------------------------------------------- */

          .about-section {
            margin-top: -1px;

            background:
              linear-gradient(
                180deg,
                #02060d 0%,
                #06101b 38%,
                #03070d 100%
              );
          }

          .about-grid {
            display: grid;
            grid-template-columns: 1.25fr 0.75fr;
            gap: 24px;
          }

          .about-card,
          .metric-card,
          .skill-card {
            border:
              1px solid rgba(255, 255, 255, 0.1);

            background:
              rgba(255, 255, 255, 0.035);

            backdrop-filter: blur(18px);
          }

          .about-card {
            min-height: 390px;

            padding:
              clamp(2rem, 5vw, 4rem);

            border-radius: 32px;
          }

          .about-card p {
            max-width: 770px;
            margin: 0;

            color:
              rgba(255, 255, 255, 0.76);

            font-size:
              clamp(1.25rem, 2.3vw, 2rem);

            line-height: 1.55;
            letter-spacing: -0.025em;
          }

          .metric-grid {
            display: grid;
            gap: 18px;
          }

          .metric-card {
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            min-height: 118px;
            padding: 24px;

            border-radius: 24px;
          }

          .metric-card strong {
            font-size: 2rem;
            letter-spacing: -0.04em;
          }

          .metric-card span {
            color:
              rgba(255, 255, 255, 0.5);

            font-size: 13px;
          }

          /* ---------------------------------------------------------------- */
          /* Projects                                                         */
          /* ---------------------------------------------------------------- */

          .projects-section {
            background:
              radial-gradient(
                circle at 80% 20%,
                rgba(14, 116, 144, 0.15),
                transparent 30%
              ),
              #03070d;
          }

          .projects-grid {
            display: grid;
            grid-template-columns:
              repeat(12, minmax(0, 1fr));

            gap: 24px;
          }

          .project-card {
            position: relative;

            grid-column: span 6;

            min-height: 540px;
            overflow: hidden;

            border:
              1px solid rgba(255, 255, 255, 0.1);

            border-radius: 30px;

            background: #080d15;
            color: white;
            text-decoration: none;
          }

          .project-card:first-child {
            grid-column: span 12;
            min-height: 640px;
          }

          .project-card img {
            width: 100%;
            height: 100%;
            min-height: inherit;

            object-fit: cover;

            transition:
              transform 700ms
              cubic-bezier(0.2, 0.8, 0.2, 1);
          }

          .project-card:hover img {
            transform: scale(1.055);
          }

          .project-overlay {
            position: absolute;
            inset: 0;

            display: flex;
            flex-direction: column;
            justify-content: flex-end;

            padding:
              clamp(1.5rem, 4vw, 3rem);

            background:
              linear-gradient(
                180deg,
                rgba(2, 5, 10, 0.02) 12%,
                rgba(2, 5, 10, 0.28) 50%,
                rgba(2, 5, 10, 0.98) 100%
              );
          }

          .project-index {
            margin-bottom: auto;

            color:
              rgba(255, 255, 255, 0.72);

            font-size: 13px;
            letter-spacing: 0.15em;
          }

          .project-title {
            margin: 0;

            font-size:
              clamp(2rem, 4vw, 4rem);

            line-height: 1;
            letter-spacing: -0.05em;
          }

          .project-description {
            max-width: 690px;
            margin: 18px 0 0;

            color:
              rgba(255, 255, 255, 0.68);

            line-height: 1.65;
          }

          .project-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;

            margin-top: 22px;
          }

          .project-tag {
            padding: 7px 11px;

            border:
              1px solid rgba(255, 255, 255, 0.16);

            border-radius: 999px;

            background:
              rgba(0, 0, 0, 0.3);

            font-size: 12px;
          }

          /* ---------------------------------------------------------------- */
          /* Experience                                                       */
          /* ---------------------------------------------------------------- */

          .experience-section {
            background:
              linear-gradient(
                180deg,
                #03070d,
                #06101a 48%,
                #02050a
              );
          }

          .timeline {
            border-top:
              1px solid rgba(255, 255, 255, 0.11);
          }

          .timeline-item {
            display: grid;
            grid-template-columns:
              0.32fr 0.68fr 1fr;

            gap: 30px;

            padding: 36px 0;

            border-bottom:
              1px solid rgba(255, 255, 255, 0.11);
          }

          .timeline-period {
            color: #7dd3fc;

            font-size: 13px;
            font-weight: 750;
          }

          .timeline-role {
            margin: 0;
            font-size: 1.2rem;
          }

          .timeline-company {
            margin-top: 8px;

            color:
              rgba(255, 255, 255, 0.5);

            font-size: 14px;
          }

          .timeline-description {
            margin: 0;

            color:
              rgba(255, 255, 255, 0.62);

            line-height: 1.7;
          }

          /* ---------------------------------------------------------------- */
          /* Skills                                                           */
          /* ---------------------------------------------------------------- */

          .skills-section {
            background: #02050a;
          }

          .skills-grid {
            display: grid;
            grid-template-columns:
              repeat(2, minmax(0, 1fr));

            gap: 20px;
          }

          .skill-card {
            min-height: 270px;
            padding: 30px;

            border-radius: 26px;

            transition:
              transform 220ms ease,
              border-color 220ms ease;
          }

          .skill-card:hover {
            transform: translateY(-6px);

            border-color:
              rgba(125, 211, 252, 0.35);
          }

          .skill-number {
            color: #7dd3fc;

            font-size: 13px;
            font-weight: 800;
          }

          .skill-card h3 {
            margin: 66px 0 12px;

            font-size: 1.55rem;
            letter-spacing: -0.035em;
          }

          .skill-card p {
            margin: 0;

            color:
              rgba(255, 255, 255, 0.56);

            line-height: 1.7;
          }

          /* ---------------------------------------------------------------- */
          /* Process                                                          */
          /* ---------------------------------------------------------------- */

          .process-section {
            background:
              linear-gradient(
                180deg,
                #02050a,
                #06101a
              );
          }

          .principles-grid {
            display: grid;
            grid-template-columns:
              repeat(2, minmax(0, 1fr));

            gap: 20px;
          }

          .principle-card {
            min-height: 295px;
            padding: 32px;

            border:
              1px solid rgba(255, 255, 255, 0.1);

            border-radius: 28px;

            background:
              rgba(255, 255, 255, 0.035);

            transition:
              transform 220ms ease,
              border-color 220ms ease,
              background 220ms ease;
          }

          .principle-card:hover {
            transform: translateY(-7px);

            border-color:
              rgba(125, 211, 252, 0.32);

            background:
              rgba(125, 211, 252, 0.055);
          }

          .principle-number {
            color: #7dd3fc;

            font-size: 13px;
            font-weight: 800;
          }

          .principle-card h3 {
            margin: 82px 0 14px;

            font-size: 1.55rem;
            letter-spacing: -0.035em;
          }

          .principle-card p {
            margin: 0;

            color:
              rgba(255, 255, 255, 0.57);

            line-height: 1.7;
          }

          /* ---------------------------------------------------------------- */
          /* Explorations                                                     */
          /* ---------------------------------------------------------------- */

          .exploring-section {
            background:
              radial-gradient(
                circle at 80% 20%,
                rgba(14, 116, 144, 0.14),
                transparent 32%
              ),
              #06101a;
          }

          .exploration-grid {
            display: grid;
            grid-template-columns:
              repeat(4, minmax(0, 1fr));

            gap: 18px;
          }

          .exploration-card {
            min-height: 325px;
            padding: 28px;

            border:
              1px solid rgba(255, 255, 255, 0.09);

            border-radius: 26px;

            background:
              rgba(2, 5, 10, 0.52);

            backdrop-filter: blur(16px);

            transition:
              transform 220ms ease,
              border-color 220ms ease;
          }

          .exploration-card:hover {
            transform: translateY(-6px);

            border-color:
              rgba(125, 211, 252, 0.28);
          }

          .exploration-orb {
            width: 44px;
            height: 44px;

            border-radius: 50%;

            background:
              radial-gradient(
                circle at 35% 35%,
                #bae6fd,
                #0ea5e9 45%,
                #082f49 75%
              );

            box-shadow:
              0 0 34px rgba(14, 165, 233, 0.34);
          }

          .exploration-card h3 {
            margin: 88px 0 14px;

            font-size: 1.35rem;
            letter-spacing: -0.03em;
          }

          .exploration-card p {
            margin: 0;

            color:
              rgba(255, 255, 255, 0.55);

            line-height: 1.7;
          }

          /* ---------------------------------------------------------------- */
          /* Rudra spotlight                                                  */
          /* ---------------------------------------------------------------- */

          .rudra-section {
            background: #02050a;
          }

          .rudra-spotlight {
            position: relative;

            min-height: 700px;
            overflow: hidden;

            border:
              1px solid rgba(125, 211, 252, 0.16);

            border-radius: 34px;

            background: #02050a;
          }

          .rudra-spotlight img {
            position: absolute;
            inset: 0;

            width: 100%;
            height: 100%;

            object-fit: cover;

            filter:
              saturate(0.65)
              contrast(1.15);
          }

          .rudra-spotlight-overlay {
            position: absolute;
            inset: 0;

            display: flex;
            flex-direction: column;
            justify-content: flex-end;

            padding:
              clamp(2rem, 6vw, 6rem);

            background:
              linear-gradient(
                90deg,
                rgba(2, 5, 10, 0.98) 0%,
                rgba(2, 5, 10, 0.86) 46%,
                rgba(2, 5, 10, 0.3) 100%
              );
          }

          .rudra-spotlight-overlay h2 {
            max-width: 820px;
            margin: 0;

            font-size:
              clamp(3rem, 6vw, 6rem);

            line-height: 0.94;
            letter-spacing: -0.065em;
          }

          .rudra-spotlight-overlay p:not(.eyebrow) {
            max-width: 650px;
            margin: 24px 0 0;

            color:
              rgba(255, 255, 255, 0.66);

            font-size: 1.05rem;
            line-height: 1.75;
          }

          /* ---------------------------------------------------------------- */
          /* Contact                                                          */
          /* ---------------------------------------------------------------- */

          .contact-section {
            padding-bottom:
              clamp(6rem, 12vw, 11rem);

            background:
              radial-gradient(
                circle at center,
                rgba(14, 116, 144, 0.23),
                transparent 45%
              ),
              #02050a;
          }

          .contact-card {
            position: relative;
            overflow: hidden;

            padding:
              clamp(3rem, 8vw, 7rem);

            border:
              1px solid rgba(125, 211, 252, 0.18);

            border-radius: 36px;

            background:
              linear-gradient(
                135deg,
                rgba(9, 26, 42, 0.95),
                rgba(4, 10, 18, 0.95)
              );

            text-align: center;
          }

          .contact-card::before {
            content: "";

            position: absolute;

            width: 430px;
            height: 430px;

            top: -270px;
            left: 50%;

            border-radius: 50%;

            background:
              rgba(125, 211, 252, 0.18);

            filter: blur(80px);
            transform: translateX(-50%);
          }

          .contact-title {
            position: relative;

            max-width: 920px;
            margin: 0 auto;

            font-size:
              clamp(3rem, 7vw, 6.5rem);

            font-weight: 600;
            line-height: 0.94;
            letter-spacing: -0.065em;
          }

          .contact-text {
            position: relative;

            max-width: 610px;
            margin: 24px auto 0;

            color:
              rgba(255, 255, 255, 0.62);

            line-height: 1.7;
          }

          .contact-actions {
            position: relative;

            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 12px;

            margin-top: 32px;
          }

          /* ---------------------------------------------------------------- */
          /* Footer                                                           */
          /* ---------------------------------------------------------------- */

          .portfolio-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 24px;

            padding:
              30px clamp(1.25rem, 6vw, 6rem);

            border-top:
              1px solid rgba(255, 255, 255, 0.08);

            color:
              rgba(255, 255, 255, 0.46);

            font-size: 13px;
          }

          .footer-links {
            display: flex;
            gap: 20px;
          }

          .footer-links a {
            color: inherit;
            text-decoration: none;
          }

          /* ---------------------------------------------------------------- */
          /* Responsive                                                       */
          /* ---------------------------------------------------------------- */

          @media (max-width: 1050px) {
            .exploration-grid {
              grid-template-columns:
                repeat(2, minmax(0, 1fr));
            }
          }

          @media (max-width: 900px) {
            .portfolio-nav > a:not(.header-cta),
            .portfolio-nav > .header-story-link {
              display: none;
            }

            .section-intro,
            .about-grid {
              grid-template-columns: 1fr;
            }

            .projects-grid {
              grid-template-columns: 1fr;
            }

            .project-card,
            .project-card:first-child {
              grid-column: auto;
              min-height: 510px;
            }

            .timeline-item {
              grid-template-columns: 1fr;
              gap: 14px;
            }

            .skills-grid {
              grid-template-columns: 1fr;
            }

            .story-copy-right {
              margin-left: 0;
            }

            .story-section-nav {
              right: 14px;
            }

            .story-section-link {
              display: block;

              width: 9px;
              min-height: 9px;
              overflow: hidden;

              border-radius: 50%;

              background:
                rgba(255, 255, 255, 0.24);

              color: transparent;
            }

            .story-section-link::before {
              display: none;
            }

            .story-section-link.is-active {
              background: #7dd3fc;

              box-shadow:
                0 0 12px
                rgba(125, 211, 252, 0.75);

              transform: scale(1.25);
            }
          }

          @media (max-width: 700px) {
            .principles-grid,
            .exploration-grid {
              grid-template-columns: 1fr;
            }

            .rudra-spotlight {
              min-height: 630px;
            }

            .rudra-spotlight-overlay {
              background:
                linear-gradient(
                  180deg,
                  rgba(2, 5, 10, 0.2),
                  rgba(2, 5, 10, 0.98) 58%
                );
            }
          }

          @media (max-width: 560px) {
            .portfolio-header {
              min-height: 68px;
            }

            .header-cta {
              min-height: 40px;
              padding-inline: 15px;
              font-size: 13px;
            }

            .story-title {
              font-size:
                clamp(3.3rem, 18vw, 5.4rem);
            }

            .story-stats {
              gap: 18px;
            }

            .project-card,
            .project-card:first-child {
              min-height: 470px;
            }

            .portfolio-footer {
              flex-direction: column;
              align-items: flex-start;
            }
          }
        `}
      </style>

      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <header className="portfolio-header">
        <ScrollStoryLink
          storyId="portfolio-story"
          sectionId="story-intro"
          className="portfolio-brand"
        >
          <span className="brand-mark">S</span>
          <span>Sivasankar</span>
        </ScrollStoryLink>

        <nav
          className="portfolio-nav"
          aria-label="Portfolio navigation"
        >
          <ScrollStoryLink
            storyId="portfolio-story"
            sectionId="story-intro"
            className="header-story-link"
          >
            Home
          </ScrollStoryLink>

          <a href="#about">About</a>
          <a href="#projects">Work</a>
          <a href="#experience">Experience</a>
          <a href="#skills">Skills</a>

          <a href="#contact" className="header-cta">
            Let&apos;s talk
          </a>
        </nav>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Scroll story                                                       */}
      {/* ------------------------------------------------------------------ */}

      <section id="home">
        <ScrollStory
          storyId="portfolio-story"
          sectionHeightVh={115}
          viewportHeight="100vh"
          reducedMotion="allow"
          hideScrollbar
          smoothScroll
          updateHash
          viewportStyle={{
            background: "#02050a",
            overscrollBehavior: "auto",
          }}
          stickyStyle={{
            background: "#02050a",
          }}
          scene={
            <LayeredImageScene
              perspective={1500}
              background="#02050a"
            >
              {/* Space background */}

              <ImageLayer
                src={SPACE_IMAGE}
                alt="Deep space background"
                anchor="center"
                loading="eager"
                imageStyle={{
                  width: "115vw",
                  maxWidth: "none",
                  height: "115vh",
                  objectFit: "cover",
                  filter:
                    "saturate(0.75) contrast(1.1)",
                }}
                frames={[
                  {
                    at: 0,
                    x: 0,
                    y: 0,
                    z: -350,
                    scale: 1.08,
                    opacity: 0.72,
                    blur: 0,
                  },
                  {
                    at: 0.16,
                    x: -30,
                    y: -20,
                    z: -240,
                    scale: 1.15,
                    opacity: 0.58,
                    blur: 1,
                  },
                  {
                    at: 0.28,
                    x: 30,
                    y: -45,
                    z: -100,
                    scale: 1.26,
                    opacity: 0,
                    blur: 8,
                  },
                ]}
              />

              {/* Frontend background */}

              <ImageLayer
                src={CODE_IMAGE}
                alt="Software source code"
                anchor="center"
                loading="lazy"
                imageStyle={{
                  width: "115vw",
                  maxWidth: "none",
                  height: "115vh",
                  objectFit: "cover",
                  filter:
                    "saturate(0.7) contrast(1.15)",
                }}
                frames={[
                  {
                    at: 0,
                    opacity: 0,
                    blur: 12,
                    scale: 1.08,
                  },
                  {
                    at: 0.12,
                    x: 80,
                    y: 30,
                    z: -150,
                    opacity: 0,
                    blur: 10,
                    scale: 1.08,
                  },
                  {
                    at: 0.21,
                    x: 0,
                    y: 0,
                    z: -70,
                    opacity: 0.58,
                    blur: 0,
                    scale: 1.15,
                  },
                  {
                    at: 0.34,
                    x: -70,
                    y: -30,
                    z: 80,
                    opacity: 0.5,
                    blur: 1,
                    scale: 1.23,
                  },
                  {
                    at: 0.43,
                    x: -130,
                    y: -60,
                    z: 180,
                    opacity: 0,
                    blur: 10,
                    scale: 1.32,
                  },
                ]}
              />

              {/* Systems background */}

              <ImageLayer
                src={CIRCUIT_IMAGE}
                alt="Electronic circuit architecture"
                anchor="center"
                loading="lazy"
                imageStyle={{
                  width: "115vw",
                  maxWidth: "none",
                  height: "115vh",
                  objectFit: "cover",
                  filter:
                    "saturate(0.6) contrast(1.2)",
                }}
                frames={[
                  {
                    at: 0,
                    opacity: 0,
                    blur: 12,
                  },
                  {
                    at: 0.28,
                    x: -80,
                    y: 40,
                    z: -120,
                    scale: 1.08,
                    opacity: 0,
                    blur: 10,
                  },
                  {
                    at: 0.38,
                    x: 0,
                    y: 0,
                    z: -30,
                    scale: 1.16,
                    opacity: 0.62,
                    blur: 0,
                  },
                  {
                    at: 0.5,
                    x: 70,
                    y: -30,
                    z: 100,
                    scale: 1.25,
                    opacity: 0.52,
                    blur: 1,
                  },
                  {
                    at: 0.59,
                    x: 140,
                    y: -70,
                    z: 190,
                    scale: 1.34,
                    opacity: 0,
                    blur: 11,
                  },
                ]}
              />

              {/* Cloud background */}

              <ImageLayer
                src={SERVER_IMAGE}
                alt="Cloud server infrastructure"
                anchor="center"
                loading="lazy"
                imageStyle={{
                  width: "115vw",
                  maxWidth: "none",
                  height: "115vh",
                  objectFit: "cover",
                  filter:
                    "saturate(0.68) contrast(1.15)",
                }}
                frames={[
                  {
                    at: 0,
                    opacity: 0,
                    blur: 12,
                  },
                  {
                    at: 0.44,
                    x: 90,
                    y: 30,
                    z: -130,
                    scale: 1.07,
                    opacity: 0,
                    blur: 11,
                  },
                  {
                    at: 0.54,
                    x: 0,
                    y: 0,
                    z: -20,
                    scale: 1.16,
                    opacity: 0.64,
                    blur: 0,
                  },
                  {
                    at: 0.66,
                    x: -80,
                    y: -30,
                    z: 100,
                    scale: 1.25,
                    opacity: 0.52,
                    blur: 1,
                  },
                  {
                    at: 0.75,
                    x: -140,
                    y: -70,
                    z: 220,
                    scale: 1.36,
                    opacity: 0,
                    blur: 12,
                  },
                ]}
              />

              {/* Rudra background */}

              <ImageLayer
                src={BUILDER_IMAGE}
                alt="Developer building a web product"
                anchor="center"
                loading="lazy"
                imageStyle={{
                  width: "115vw",
                  maxWidth: "none",
                  height: "115vh",
                  objectFit: "cover",
                  filter:
                    "saturate(0.68) contrast(1.14)",
                }}
                frames={[
                  {
                    at: 0,
                    opacity: 0,
                    blur: 12,
                  },
                  {
                    at: 0.6,
                    x: -80,
                    y: 40,
                    z: -120,
                    scale: 1.06,
                    opacity: 0,
                    blur: 10,
                  },
                  {
                    at: 0.7,
                    x: 0,
                    y: 0,
                    z: -20,
                    scale: 1.15,
                    opacity: 0.6,
                    blur: 0,
                  },
                  {
                    at: 0.82,
                    x: 80,
                    y: -30,
                    z: 100,
                    scale: 1.24,
                    opacity: 0.5,
                    blur: 1,
                  },
                  {
                    at: 0.89,
                    x: 140,
                    y: -70,
                    z: 180,
                    scale: 1.31,
                    opacity: 0,
                    blur: 10,
                  },
                ]}
              />

              {/* Future background */}

              <ImageLayer
                src={TEAM_IMAGE}
                alt="Software engineering team"
                anchor="center"
                loading="lazy"
                imageStyle={{
                  width: "115vw",
                  maxWidth: "none",
                  height: "115vh",
                  objectFit: "cover",
                  filter:
                    "saturate(0.62) contrast(1.12)",
                }}
                frames={[
                  {
                    at: 0,
                    opacity: 0,
                    blur: 12,
                  },
                  {
                    at: 0.76,
                    x: 80,
                    y: 30,
                    z: -120,
                    scale: 1.07,
                    opacity: 0,
                    blur: 10,
                  },
                  {
                    at: 0.86,
                    x: 0,
                    y: 0,
                    z: -20,
                    scale: 1.15,
                    opacity: 0.62,
                    blur: 0,
                  },
                  {
                    at: 1,
                    x: -50,
                    y: -40,
                    z: 130,
                    scale: 1.28,
                    opacity: 0.54,
                    blur: 1,
                  },
                ]}
              />

              {/* Moving light */}

              <ImageLayer
                src={FLARE_IMAGE}
                alt=""
                anchor="center"
                loading="lazy"
                imageStyle={{
                  width: "min(62vw, 780px)",
                  maxWidth: "none",
                  mixBlendMode: "screen",
                }}
                frames={[
                  {
                    at: 0,
                    x: -380,
                    y: 180,
                    z: 100,
                    scale: 0.25,
                    opacity: 0,
                    blur: 14,
                  },
                  {
                    at: 0.22,
                    x: -160,
                    y: 60,
                    z: 240,
                    scale: 0.48,
                    opacity: 0.35,
                    blur: 4,
                  },
                  {
                    at: 0.5,
                    x: 80,
                    y: -30,
                    z: 420,
                    scale: 0.82,
                    opacity: 0.55,
                    blur: 1,
                  },
                  {
                    at: 0.78,
                    x: 250,
                    y: -100,
                    z: 560,
                    scale: 1.15,
                    opacity: 0.26,
                    blur: 5,
                  },
                  {
                    at: 1,
                    x: 430,
                    y: -220,
                    z: 720,
                    scale: 1.6,
                    opacity: 0,
                    blur: 18,
                  },
                ]}
              />

              {/* Persistent readability overlay */}

              <DepthLayer
                anchor="top-left"
                easing="linear"
                style={{
                  width: "100vw",
                  height: "100vh",
                }}
                frames={[
                  {
                    at: 0,
                    opacity: 1,
                  },
                  {
                    at: 1,
                    opacity: 1,
                  },
                ]}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background:
                      "linear-gradient(90deg, rgba(2,5,10,0.95) 0%, rgba(2,5,10,0.7) 42%, rgba(2,5,10,0.3) 72%, rgba(2,5,10,0.74) 100%)",
                  }}
                />
              </DepthLayer>
            </LayeredImageScene>
          }
        >
          <ScrollProgress
            position="top"
            offset={0}
            inset={0}
            height={3}
            showTrack={false}
            progressColor="#7dd3fc"
            style={{
              boxShadow:
                "0 0 18px rgba(125,211,252,0.8)",
            }}
          />

          <nav
            className="story-section-nav"
            aria-label="Portfolio story navigation"
          >
            {storyNavigation.map(
              (section, index) => (
                <ScrollStoryLink
                  key={section.id}
                  sectionId={section.id}
                  className="story-section-link"
                  activeClassName="is-active"
                >
                  <span className="story-nav-number">
                    {String(index + 1).padStart(
                      2,
                      "0",
                    )}
                  </span>

                  <span className="story-nav-label">
                    {section.label}
                  </span>
                </ScrollStoryLink>
              ),
            )}
          </nav>

          {/* Story section 1 */}

          <ScrollChapter
            id="story-intro"
            range={[0, 0.166]}
            align="left"
            verticalAlign="center"
            width="min(930px, 90vw)"
            interactive
          >
            <div className="story-copy">
              <p className="eyebrow">
                Full-stack software engineer
              </p>

              <h1 className="story-title">
                Engineering ideas into{" "}
                <span className="accent">
                  products.
                </span>
              </h1>

              <p className="story-description">
                I create scalable web products,
                cloud systems and thoughtful
                interactive experiences using
                React, Node.js, TypeScript and AWS.
              </p>

              <div className="story-actions">
                <a
                  href="#projects"
                  className="primary-button"
                >
                  Explore my work <span>↗</span>
                </a>

                <ScrollStoryLink
                  sectionId="story-interface"
                  className="secondary-button"
                >
                  Begin the journey
                </ScrollStoryLink>
              </div>

              <div className="story-stats">
                <div className="story-stat">
                  <strong>6+ years</strong>
                  <span>
                    Engineering experience
                  </span>
                </div>

                <div className="story-stat">
                  <strong>Full stack</strong>
                  <span>Frontend to cloud</span>
                </div>

                <div className="story-stat">
                  <strong>Product first</strong>
                  <span>Built for real users</span>
                </div>
              </div>
            </div>
          </ScrollChapter>

          {/* Story section 2 */}

          <ScrollChapter
            id="story-interface"
            range={[0.166, 0.333]}
            align="right"
            verticalAlign="center"
            width="min(730px, 90vw)"
          >
            <div className="story-copy story-copy-right">
              <p className="eyebrow">
                Frontend engineering
              </p>

              <h2 className="story-heading">
                Interfaces should feel simple,
                even when the system is not.
              </h2>

              <p className="story-description">
                React, Next.js, TypeScript,
                design systems, accessibility and
                performance-focused application
                architecture.
              </p>

              <div className="technology-list">
                {[
                  "React",
                  "Next.js",
                  "TypeScript",
                  "Responsive UI",
                  "Accessibility",
                  "Performance",
                ].map((technology) => (
                  <span
                    key={technology}
                    className="technology-chip"
                  >
                    {technology}
                  </span>
                ))}
              </div>
            </div>
          </ScrollChapter>

          {/* Story section 3 */}

          <ScrollChapter
            id="story-systems"
            range={[0.333, 0.5]}
            align="left"
            verticalAlign="center"
            width="min(730px, 90vw)"
          >
            <div className="story-copy">
              <p className="eyebrow">
                Backend systems
              </p>

              <h2 className="story-heading">
                Reliable foundations behind
                every interaction.
              </h2>

              <p className="story-description">
                Node.js, Java, Spring Boot,
                GraphQL, REST APIs, PostgreSQL,
                messaging systems and distributed
                workflows.
              </p>

              <div className="technology-list">
                {[
                  "Node.js",
                  "Java",
                  "Spring Boot",
                  "GraphQL",
                  "PostgreSQL",
                  "Microservices",
                ].map((technology) => (
                  <span
                    key={technology}
                    className="technology-chip"
                  >
                    {technology}
                  </span>
                ))}
              </div>
            </div>
          </ScrollChapter>

          {/* Story section 4 */}

          <ScrollChapter
            id="story-cloud"
            range={[0.5, 0.666]}
            align="right"
            verticalAlign="center"
            width="min(730px, 90vw)"
          >
            <div className="story-copy story-copy-right">
              <p className="eyebrow">
                Cloud engineering
              </p>

              <h2 className="story-heading">
                Systems designed to scale,
                recover and evolve.
              </h2>

              <p className="story-description">
                AWS Lambda, SQS, SNS, API Gateway,
                Docker, serverless architecture,
                deployment workflows and
                production observability.
              </p>

              <div className="technology-list">
                {[
                  "AWS",
                  "Lambda",
                  "SQS",
                  "SNS",
                  "Docker",
                  "Serverless",
                ].map((technology) => (
                  <span
                    key={technology}
                    className="technology-chip"
                  >
                    {technology}
                  </span>
                ))}
              </div>
            </div>
          </ScrollChapter>

          {/* Story section 5 */}

          <ScrollChapter
            id="story-rudra"
            range={[0.666, 0.833]}
            align="left"
            verticalAlign="center"
            width="min(770px, 90vw)"
            interactive
          >
            <div className="story-copy">
              <p className="eyebrow">
                Creator of Rudra
              </p>

              <h2 className="story-heading">
                Building tools that help other
                people build.
              </h2>

              <p className="story-description">
                Rudra combines reusable modules,
                collaborative editing, visual
                development and developer-owned
                React components.
              </p>

              <div className="story-actions">
                <a
                  href="https://rudraapp.in"
                  target="_blank"
                  rel="noreferrer"
                  className="primary-button"
                >
                  Visit Rudra <span>↗</span>
                </a>
              </div>
            </div>
          </ScrollChapter>

          {/* Story section 6 */}

          <ScrollChapter
            id="story-future"
            range={[0.833, 1]}
            align="center"
            verticalAlign="center"
            width="min(930px, 90vw)"
            interactive
          >
            <div className="story-copy story-copy-center">
              <p className="eyebrow">
                What comes next
              </p>

              <h2 className="story-heading">
                Better products through curiosity,
                ownership and iteration.
              </h2>

              <p className="story-description">
                I am interested in product
                engineering, developer tools,
                ambitious frontend systems and
                difficult problems worth solving.
              </p>

              <div className="story-actions">
                <a
                  href="#contact"
                  className="primary-button"
                >
                  Let&apos;s work together
                </a>

                <ScrollStoryLink
                  sectionId="story-intro"
                  className="secondary-button"
                >
                  Replay story
                </ScrollStoryLink>
              </div>
            </div>
          </ScrollChapter>
        </ScrollStory>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* About                                                              */}
      {/* ------------------------------------------------------------------ */}

      <section
        id="about"
        className="content-section about-section"
      >
        <div className="section-inner">
          <div className="section-intro">
            <div>
              <p className="section-number">
                01 — About
              </p>

              <h2 className="section-title">
                I enjoy solving the difficult
                parts.
              </h2>
            </div>

            <p className="section-description">
              My work sits between product thinking
              and engineering. I enjoy taking
              unclear requirements, finding the
              real problem and turning it into
              maintainable software that people can
              actually use.
            </p>
          </div>

          <div className="about-grid">
            <div className="about-card">
              <p>
                I started with enterprise Java
                systems, expanded into React and
                Node.js, and gradually moved deeper
                into cloud architecture, visual
                builders, collaboration systems and
                interactive experiences. Today I
                focus on combining reliable
                engineering with interfaces that
                feel simple and intentional.
              </p>
            </div>

            <div className="metric-grid">
              <div className="metric-card">
                <strong>6+ years</strong>
                <span>Software engineering</span>
              </div>

              <div className="metric-card">
                <strong>React + Node</strong>
                <span>Primary product stack</span>
              </div>

              <div className="metric-card">
                <strong>AWS</strong>
                <span>Cloud architecture</span>
              </div>

              <div className="metric-card">
                <strong>Rudra</strong>
                <span>Independent product</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Projects                                                           */}
      {/* ------------------------------------------------------------------ */}

      <section
        id="projects"
        className="content-section projects-section"
      >
        <div className="section-inner">
          <div className="section-intro">
            <div>
              <p className="section-number">
                02 — Selected work
              </p>

              <h2 className="section-title">
                Products, systems and experiments.
              </h2>
            </div>

            <p className="section-description">
              A selection of projects focused on
              reusable architecture, collaborative
              workflows, cloud engineering and
              practical developer experience.
            </p>
          </div>

          <div className="projects-grid">
            {projects.map((project) => {
              const opensExternally =
                project.link.startsWith("http");

              return (
                <a
                  key={project.title}
                  href={project.link}
                  className="project-card"
                  target={
                    opensExternally
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    opensExternally
                      ? "noreferrer"
                      : undefined
                  }
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                  />

                  <div className="project-overlay">
                    <span className="project-index">
                      {project.index}
                    </span>

                    <h3 className="project-title">
                      {project.title}
                    </h3>

                    <p className="project-description">
                      {project.description}
                    </p>

                    <div className="project-tags">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="project-tag"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Experience                                                         */}
      {/* ------------------------------------------------------------------ */}

      <section
        id="experience"
        className="content-section experience-section"
      >
        <div className="section-inner">
          <div className="section-intro">
            <div>
              <p className="section-number">
                03 — Experience
              </p>

              <h2 className="section-title">
                Built through real-world
                complexity.
              </h2>
            </div>

            <p className="section-description">
              Experience across financial
              services, enterprise platforms,
              frontend systems, cloud services and
              independent product development.
            </p>
          </div>

          <div className="timeline">
            {experiences.map((experience) => (
              <article
                key={`${experience.period}-${experience.company}`}
                className="timeline-item"
              >
                <div className="timeline-period">
                  {experience.period}
                </div>

                <div>
                  <h3 className="timeline-role">
                    {experience.role}
                  </h3>

                  <div className="timeline-company">
                    {experience.company}
                  </div>
                </div>

                <p className="timeline-description">
                  {experience.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Skills                                                             */}
      {/* ------------------------------------------------------------------ */}

      <section
        id="skills"
        className="content-section skills-section"
      >
        <div className="section-inner">
          <div className="section-intro">
            <div>
              <p className="section-number">
                04 — Capabilities
              </p>

              <h2 className="section-title">
                Complete product engineering.
              </h2>
            </div>

            <p className="section-description">
              I prefer understanding the full
              system instead of treating the
              frontend, backend and infrastructure
              as unrelated pieces.
            </p>
          </div>

          <div className="skills-grid">
            {skills.map((skill) => (
              <article
                key={skill.number}
                className="skill-card"
              >
                <span className="skill-number">
                  {skill.number}
                </span>

                <h3>{skill.title}</h3>

                <p>{skill.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Process                                                            */}
      {/* ------------------------------------------------------------------ */}

      <section
        id="process"
        className="content-section process-section"
      >
        <div className="section-inner">
          <div className="section-intro">
            <div>
              <p className="section-number">
                05 — How I work
              </p>

              <h2 className="section-title">
                Engineering with context, not just
                code.
              </h2>
            </div>

            <p className="section-description">
              My approach combines product
              understanding, reusable architecture,
              measurable outcomes and ownership
              after release.
            </p>
          </div>

          <div className="principles-grid">
            {engineeringPrinciples.map(
              (principle) => (
                <article
                  key={principle.number}
                  className="principle-card"
                >
                  <span className="principle-number">
                    {principle.number}
                  </span>

                  <h3>{principle.title}</h3>

                  <p>{principle.description}</p>
                </article>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Explorations                                                       */}
      {/* ------------------------------------------------------------------ */}

      <section
        id="exploring"
        className="content-section exploring-section"
      >
        <div className="section-inner">
          <div className="section-intro">
            <div>
              <p className="section-number">
                06 — Currently exploring
              </p>

              <h2 className="section-title">
                Curiosity outside the project
                requirements.
              </h2>
            </div>

            <p className="section-description">
              I regularly build experiments to
              understand technologies before
              deciding where they genuinely add
              value.
            </p>
          </div>

          <div className="exploration-grid">
            {currentExplorations.map((item) => (
              <article
                key={item.title}
                className="exploration-card"
              >
                <div className="exploration-orb" />

                <h3>{item.title}</h3>

                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Rudra spotlight                                                    */}
      {/* ------------------------------------------------------------------ */}

      <section
        id="rudra"
        className="content-section rudra-section"
      >
        <div className="section-inner">
          <div className="rudra-spotlight">
            <img
              src={BUILDER_IMAGE}
              alt="Developer building a visual application"
              loading="lazy"
            />

            <div className="rudra-spotlight-overlay">
              <p className="eyebrow">
                Independent product
              </p>

              <h2>
                Rudra is where all these ideas come
                together.
              </h2>

              <p>
                Reusable React libraries, visual
                modules, function building,
                application composition and
                real-time collaboration in one
                developer-friendly platform.
              </p>

              <div className="story-actions">
                <a
                  href="https://rudraapp.in"
                  target="_blank"
                  rel="noreferrer"
                  className="primary-button"
                >
                  Explore Rudra <span>↗</span>
                </a>

                <ScrollStoryLink
                  storyId="portfolio-story"
                  sectionId="story-rudra"
                  className="secondary-button"
                >
                  Replay Rudra story
                </ScrollStoryLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Contact                                                            */}
      {/* ------------------------------------------------------------------ */}

      <section
        id="contact"
        className="content-section contact-section"
      >
        <div className="section-inner">
          <div className="contact-card">
            <p className="eyebrow">
              Have something interesting?
            </p>

            <h2 className="contact-title">
              Let&apos;s build something useful.
            </h2>

            <p className="contact-text">
              I am interested in product
              engineering, ambitious frontend
              systems, developer tools and projects
              that solve real problems.
            </p>

            <div className="contact-actions">
              <a
                href="mailto:your-email@example.com"
                className="primary-button"
              >
                Send an email <span>↗</span>
              </a>

              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
                className="secondary-button"
              >
                LinkedIn
              </a>

              <ScrollStoryLink
                storyId="portfolio-story"
                sectionId="story-intro"
                className="secondary-button"
              >
                Back to story
              </ScrollStoryLink>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Footer                                                             */}
      {/* ------------------------------------------------------------------ */}

      <footer className="portfolio-footer">
        <span>
          © 2026 Sivasankar Selvasundar
        </span>

        <div className="footer-links">
          <a
            href="https://rudraapp.in"
            target="_blank"
            rel="noreferrer"
          >
            Rudra
          </a>

          <a href="#projects">Projects</a>
          <a href="#experience">Experience</a>
          <a href="#contact">Contact</a>
        </div>
      </footer>
    </main>
  );
}