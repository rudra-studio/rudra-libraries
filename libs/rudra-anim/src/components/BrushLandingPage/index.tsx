"use client";

import { useState } from "react";

import ScrollStory from "../ScrollStory";
import ScrollProgress from "../ScrollProgress";
import ScrollStoryLink from "../ScrollStoryLink";
import ScrollChapter from "../ScrollChapter";
import LayeredImageScene from "../LayeredImageScene";
import DepthLayer from "../DepthLayer";

const FLARE_IMAGE =
  "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/lensflare/lensflare0.png";

const storyNavigation = [
  {
    id: "brush-intro",
    label: "Introducing",
  },
  {
    id: "brush-cleaning",
    label: "Cleaning",
  },
  {
    id: "brush-pressure",
    label: "Pressure",
  },
  {
    id: "brush-battery",
    label: "Battery",
  },
  {
    id: "brush-design",
    label: "Design",
  },
  {
    id: "brush-buy",
    label: "Launch",
  },
];

const features = [
  {
    number: "01",
    title: "40,000 sonic movements",
    description:
      "High-frequency movement helps clean difficult areas while remaining gentle on teeth and gums.",
  },
  {
    number: "02",
    title: "Pressure intelligence",
    description:
      "The light ring warns you when too much pressure is applied and helps encourage a gentler routine.",
  },
  {
    number: "03",
    title: "Six-week battery",
    description:
      "A long-lasting battery designed for daily use, weekend travel and fewer charging interruptions.",
  },
  {
    number: "04",
    title: "Adaptive cleaning",
    description:
      "Five brushing modes provide different intensity levels for everyday cleaning and sensitive routines.",
  },
];

const cleaningModes = [
  {
    name: "Daily",
    intensity: "Balanced",
    description:
      "A balanced two-minute clean for your everyday routine.",
  },
  {
    name: "Deep",
    intensity: "Powerful",
    description:
      "A stronger pattern intended for a more thorough clean.",
  },
  {
    name: "Sensitive",
    intensity: "Gentle",
    description:
      "Reduced intensity for sensitive teeth and gums.",
  },
  {
    name: "Polish",
    intensity: "Focused",
    description:
      "Variable movement focused on visible surface polishing.",
  },
  {
    name: "Massage",
    intensity: "Rhythmic",
    description:
      "A gentle pulsing pattern designed around gum comfort.",
  },
];

const includedItems = [
  "Nova One electric toothbrush",
  "Two precision brush heads",
  "Magnetic charging base",
  "Travel protection case",
  "USB-C charging cable",
  "Two-year limited warranty",
];

const reviews = [
  {
    quote:
      "It feels like a premium product without making the daily routine complicated.",
    name: "Maya R.",
    role: "Verified early customer",
  },
  {
    quote:
      "The pressure indicator completely changed how aggressively I used to brush.",
    name: "Daniel K.",
    role: "Verified early customer",
  },
  {
    quote:
      "The design is clean, the battery lasts forever and the travel case is genuinely useful.",
    name: "Aarav S.",
    role: "Verified early customer",
  },
];

const faqs = [
  {
    question: "How long does the battery last?",
    answer:
      "Nova One is designed to provide up to six weeks of regular use between charges, depending on mode and brushing frequency.",
  },
  {
    question: "Can I use other brush heads?",
    answer:
      "Nova One uses its own click-fit head system. Replacement precision and sensitive heads are available separately.",
  },
  {
    question: "Is the toothbrush waterproof?",
    answer:
      "The handle is designed for normal bathroom use, rinsing and use in the shower. The charging base should remain dry.",
  },
  {
    question: "Does it require an application?",
    answer:
      "No. Every essential function works directly from the toothbrush. The experience is intentionally application-free.",
  },
  {
    question: "What is included with the warranty?",
    answer:
      "The two-year limited warranty covers manufacturing defects affecting the handle or charging base.",
  },
];

function ProductBrush() {
  return (
    <div className="product-brush" aria-label="Nova One electric toothbrush">
      <div className="brush-head">
        <div className="brush-bristles">
          {Array.from({ length: 24 }).map((_, index) => (
            <span key={index} />
          ))}
        </div>

        <div className="brush-neck" />
      </div>

      <div className="brush-body">
        <div className="pressure-ring" />

        <div className="brush-logo">
          NOVA
        </div>

        <div className="power-button">
          <span />
        </div>

        <div className="mode-indicators">
          <span className="active" />
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className="battery-indicator">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className="brush-base" />
    </div>
  );
}

function BubbleField() {
  return (
    <div className="bubble-field" aria-hidden="true">
      {Array.from({ length: 28 }).map((_, index) => (
        <span
          key={index}
          style={{
            "--bubble-index": index,
            "--bubble-size": `${8 + (index % 7) * 5}px`,
            "--bubble-left": `${(index * 17) % 100}%`,
            "--bubble-delay": `${(index % 10) * -0.7}s`,
            "--bubble-duration": `${8 + (index % 6) * 1.4}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

function FeatureOrbit() {
  return (
    <div className="feature-orbit" aria-hidden="true">
      <div className="orbit-ring orbit-ring-one" />
      <div className="orbit-ring orbit-ring-two" />

      <div className="orbit-chip orbit-chip-one">
        40K
        <small>movements</small>
      </div>

      <div className="orbit-chip orbit-chip-two">
        6 weeks
        <small>battery</small>
      </div>

      <div className="orbit-chip orbit-chip-three">
        IPX7
        <small>water resistant</small>
      </div>
    </div>
  );
}

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <article className={`faq-item ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className="faq-question"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{question}</span>
        <span className="faq-icon">+</span>
      </button>

      <div className="faq-answer">
        <p>{answer}</p>
      </div>
    </article>
  );
}

export default function SonicBrushLaunchPage() {
  const [selectedMode, setSelectedMode] = useState(0);

  return (
    <main className="launch-page">
      <style>
        {`
          :root {
            color-scheme: dark;
          }

          html {
            scroll-behavior: smooth;
            scroll-padding-top: 80px;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            background: #031019;
          }

          button,
          a {
            font: inherit;
          }

          .launch-page {
            min-height: 100vh;
            overflow-x: hidden;

            background:
              radial-gradient(
                circle at 50% 0%,
                rgba(48, 190, 214, 0.16),
                transparent 30%
              ),
              #031019;

            color: #f4fbff;

            font-family:
              Inter,
              ui-sans-serif,
              system-ui,
              -apple-system,
              BlinkMacSystemFont,
              "Segoe UI",
              sans-serif;
          }

          /* Header */

          .launch-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 500;

            display: flex;
            align-items: center;
            justify-content: space-between;

            min-height: 72px;
            padding: 0 clamp(1.25rem, 5vw, 5rem);

            border-bottom:
              1px solid rgba(255, 255, 255, 0.08);

            background:
              rgba(3, 16, 25, 0.62);

            backdrop-filter: blur(22px);
          }

          .launch-brand {
            display: flex;
            align-items: center;
            gap: 11px;

            color: white;
            font-weight: 780;
            letter-spacing: -0.04em;
            text-decoration: none;
          }

          .brand-symbol {
            position: relative;

            width: 35px;
            height: 35px;

            border:
              1px solid rgba(143, 232, 245, 0.4);

            border-radius: 13px;

            background:
              linear-gradient(
                145deg,
                rgba(143, 232, 245, 0.22),
                rgba(143, 232, 245, 0.04)
              );
          }

          .brand-symbol::before,
          .brand-symbol::after {
            content: "";

            position: absolute;
            left: 50%;

            width: 5px;

            border-radius: 99px;

            background: #9eeaf4;

            transform: translateX(-50%);
          }

          .brand-symbol::before {
            top: 7px;
            height: 12px;
          }

          .brand-symbol::after {
            bottom: 6px;
            height: 8px;
            opacity: 0.6;
          }

          .launch-nav {
            display: flex;
            align-items: center;
            gap: 25px;
          }

          .launch-nav > a,
          .launch-nav > .nav-story-link {
            color:
              rgba(255, 255, 255, 0.66);

            font-size: 14px;
            text-decoration: none;

            transition:
              color 180ms ease,
              transform 180ms ease;
          }

          .launch-nav > a:hover,
          .launch-nav > .nav-story-link:hover {
            color: white;
            transform: translateY(-1px);
          }

          .buy-button,
          .primary-button,
          .secondary-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 9px;

            min-height: 46px;
            padding: 0 21px;

            border-radius: 999px;

            text-decoration: none;
            cursor: pointer;

            transition:
              transform 180ms ease,
              background 180ms ease,
              border-color 180ms ease;
          }

          .buy-button,
          .primary-button {
            border: 1px solid #c8f6fb;

            background: #c8f6fb;
            color: #031019;

            font-weight: 780;
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

          .buy-button:hover,
          .primary-button:hover,
          .secondary-button:hover {
            transform: translateY(-3px);
          }

          /* Scroll story */

          .story-copy {
            max-width: 735px;

            color: white;

            text-shadow:
              0 8px 42px rgba(0, 0, 0, 0.72);
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
            gap: 10px;

            margin: 0 0 18px;

            color: #9eeaf4;

            font-size: 12px;
            font-weight: 820;

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
            max-width: 940px;
            margin: 0;

            font-size:
              clamp(4.2rem, 10vw, 9.5rem);

            font-weight: 620;
            line-height: 0.84;
            letter-spacing: -0.08em;
          }

          .story-title .accent {
            color: #9eeaf4;
          }

          .story-heading {
            margin: 0;

            font-size:
              clamp(2.8rem, 6vw, 6rem);

            font-weight: 620;
            line-height: 0.92;
            letter-spacing: -0.065em;
          }

          .story-description {
            max-width: 610px;
            margin: 25px 0 0;

            color:
              rgba(255, 255, 255, 0.7);

            font-size:
              clamp(1rem, 1.6vw, 1.2rem);

            line-height: 1.72;
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

          .launch-price {
            display: flex;
            align-items: baseline;
            gap: 8px;

            margin-top: 26px;
          }

          .launch-price strong {
            font-size: 2.1rem;
            letter-spacing: -0.05em;
          }

          .launch-price span {
            color:
              rgba(255, 255, 255, 0.54);

            font-size: 14px;
          }

          .story-stat-row {
            display: flex;
            flex-wrap: wrap;
            gap: 28px;

            margin-top: 38px;
          }

          .story-stat {
            padding-left: 15px;

            border-left:
              1px solid rgba(158, 234, 244, 0.45);
          }

          .story-stat strong {
            display: block;
            font-size: 1.45rem;
          }

          .story-stat span {
            color:
              rgba(255, 255, 255, 0.5);

            font-size: 13px;
          }

          /* Toothbrush */

          .product-brush {
            position: relative;

            width: 180px;
            height: 650px;

            filter:
              drop-shadow(
                0 50px 70px rgba(0, 0, 0, 0.45)
              );

            transform-style: preserve-3d;
          }

          .brush-head {
            position: absolute;
            top: 0;
            left: 50%;

            width: 92px;
            height: 165px;

            transform: translateX(-50%);
          }

          .brush-bristles {
            position: relative;

            width: 92px;
            height: 74px;

            overflow: hidden;

            border-radius:
              32px 32px 22px 22px;

            background:
              linear-gradient(
                180deg,
                #e9fdff,
                #a7e9f1
              );

            box-shadow:
              inset 0 -10px 18px
              rgba(35, 153, 174, 0.14);
          }

          .brush-bristles span {
            position: absolute;

            width: 5px;
            height: 35px;

            border-radius: 99px;

            background:
              linear-gradient(
                180deg,
                #d8fbff,
                #5ed0e2
              );

            transform-origin: bottom;
          }

          .brush-bristles span:nth-child(4n + 1) {
            left: 15%;
            top: 10px;
          }

          .brush-bristles span:nth-child(4n + 2) {
            left: 38%;
            top: 7px;
          }

          .brush-bristles span:nth-child(4n + 3) {
            left: 61%;
            top: 8px;
          }

          .brush-bristles span:nth-child(4n) {
            left: 80%;
            top: 12px;
          }

          .brush-bristles span:nth-child(n + 5) {
            transform:
              translateX(
                calc(
                  ((var(--index, 1) - 1) * 2px)
                )
              );
          }

          .brush-neck {
            width: 31px;
            height: 105px;

            margin: -2px auto 0;

            border-radius:
              0 0 16px 16px;

            background:
              linear-gradient(
                90deg,
                #d6f8fb,
                #ffffff 45%,
                #a8dde5
              );
          }

          .brush-body {
            position: absolute;
            top: 145px;
            left: 50%;

            width: 126px;
            height: 465px;

            overflow: hidden;

            border:
              1px solid rgba(255, 255, 255, 0.65);

            border-radius:
              58px 58px 43px 43px;

            background:
              linear-gradient(
                100deg,
                #d9f7fa 0%,
                #ffffff 35%,
                #e0f5f7 64%,
                #a8d7df 100%
              );

            box-shadow:
              inset -18px 0 30px
                rgba(24, 121, 142, 0.12),
              inset 12px 0 24px
                rgba(255, 255, 255, 0.8);

            transform: translateX(-50%);
          }

          .pressure-ring {
            position: absolute;
            top: 0;
            left: 50%;

            width: 105px;
            height: 15px;

            border-radius:
              0 0 16px 16px;

            background: #64d8e8;

            box-shadow:
              0 0 25px
              rgba(100, 216, 232, 0.95);

            transform: translateX(-50%);
          }

          .brush-logo {
            position: absolute;
            top: 86px;
            left: 50%;

            color: #164d58;

            font-size: 13px;
            font-weight: 850;
            letter-spacing: 0.24em;

            transform: translateX(-50%);
          }

          .power-button {
            position: absolute;
            top: 145px;
            left: 50%;

            width: 45px;
            height: 45px;

            display: grid;
            place-items: center;

            border:
              1px solid rgba(9, 77, 91, 0.2);

            border-radius: 50%;

            background:
              rgba(255, 255, 255, 0.62);

            box-shadow:
              0 8px 20px
              rgba(15, 91, 105, 0.13);

            transform: translateX(-50%);
          }

          .power-button span {
            position: relative;

            width: 15px;
            height: 15px;

            border:
              2px solid #1a6673;

            border-top-color: transparent;
            border-radius: 50%;
          }

          .power-button span::before {
            content: "";

            position: absolute;
            left: 50%;
            top: -5px;

            width: 2px;
            height: 9px;

            border-radius: 2px;
            background: #1a6673;

            transform: translateX(-50%);
          }

          .mode-indicators {
            position: absolute;
            top: 225px;
            left: 50%;

            display: flex;
            flex-direction: column;
            gap: 12px;

            transform: translateX(-50%);
          }

          .mode-indicators span {
            width: 5px;
            height: 5px;

            border-radius: 50%;

            background:
              rgba(21, 95, 108, 0.22);
          }

          .mode-indicators span.active {
            background: #30b9cd;

            box-shadow:
              0 0 9px
              rgba(48, 185, 205, 0.9);
          }

          .battery-indicator {
            position: absolute;
            bottom: 42px;
            left: 50%;

            display: flex;
            gap: 5px;

            transform: translateX(-50%);
          }

          .battery-indicator span {
            width: 5px;
            height: 15px;

            border-radius: 4px;

            background: #62cbd9;
          }

          .brush-base {
            position: absolute;
            bottom: 0;
            left: 50%;

            width: 150px;
            height: 45px;

            border-radius: 50%;

            background:
              radial-gradient(
                ellipse at center,
                #d5f6fa,
                #4a919c 62%,
                rgba(8, 34, 41, 0.4)
              );

            box-shadow:
              0 22px 45px
              rgba(0, 0, 0, 0.45);

            transform: translateX(-50%);
          }

          /* Decorative bubbles */

          .bubble-field {
            position: absolute;
            inset: 0;

            overflow: hidden;
          }

          .bubble-field span {
            position: absolute;

            left: var(--bubble-left);
            bottom: -10%;

            width: var(--bubble-size);
            height: var(--bubble-size);

            border:
              1px solid rgba(192, 247, 255, 0.35);

            border-radius: 50%;

            background:
              radial-gradient(
                circle at 32% 28%,
                rgba(255, 255, 255, 0.8),
                rgba(126, 226, 239, 0.14) 35%,
                transparent 70%
              );

            animation:
              bubble-rise
              var(--bubble-duration)
              linear
              infinite;

            animation-delay:
              var(--bubble-delay);
          }

          @keyframes bubble-rise {
            from {
              opacity: 0;
              transform:
                translate3d(0, 0, 0)
                scale(0.6);
            }

            15% {
              opacity: 0.7;
            }

            to {
              opacity: 0;
              transform:
                translate3d(
                  calc(
                    (var(--bubble-index) % 2) *
                    45px
                  ),
                  -120vh,
                  0
                )
                scale(1.15);
            }
          }

          /* Feature orbit */

          .feature-orbit {
            position: relative;

            width: min(620px, 80vw);
            height: min(620px, 80vw);

            border-radius: 50%;
          }

          .orbit-ring {
            position: absolute;
            inset: 10%;

            border:
              1px solid rgba(159, 235, 245, 0.16);

            border-radius: 50%;
          }

          .orbit-ring-two {
            inset: 25%;

            border-style: dashed;

            animation:
              orbit-rotate
              22s linear infinite;
          }

          @keyframes orbit-rotate {
            to {
              transform: rotate(360deg);
            }
          }

          .orbit-chip {
            position: absolute;

            min-width: 116px;
            min-height: 116px;

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            border:
              1px solid rgba(255, 255, 255, 0.16);

            border-radius: 50%;

            background:
              rgba(7, 35, 46, 0.64);

            color: white;
            font-size: 1.2rem;
            font-weight: 780;

            backdrop-filter: blur(18px);
          }

          .orbit-chip small {
            margin-top: 4px;

            color:
              rgba(255, 255, 255, 0.52);

            font-size: 10px;
            font-weight: 500;
          }

          .orbit-chip-one {
            top: 3%;
            left: 48%;
          }

          .orbit-chip-two {
            right: 2%;
            bottom: 20%;
          }

          .orbit-chip-three {
            left: 2%;
            bottom: 24%;
          }

          /* Story navigation */

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
              rgba(255, 255, 255, 0.35);

            font-size: 11px;
            letter-spacing: 0.08em;
            text-decoration: none;
            text-transform: uppercase;

            transition:
              color 220ms ease,
              transform 220ms ease;
          }

          .story-section-link::before {
            content: "";

            position: absolute;
            left: -13px;

            width: 5px;
            height: 5px;

            border-radius: 50%;

            background: currentColor;

            transition:
              transform 220ms ease,
              box-shadow 220ms ease;
          }

          .story-section-link:hover {
            color:
              rgba(255, 255, 255, 0.8);

            transform: translateX(-4px);
          }

          .story-section-link.is-active {
            color: #9eeaf4;
            transform: translateX(-6px);
          }

          .story-section-link.is-active::before {
            transform: scale(1.7);

            box-shadow:
              0 0 14px
              rgba(158, 234, 244, 0.9);
          }

          .story-nav-number {
            font-variant-numeric:
              tabular-nums;
          }

          /* Shared sections */

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

            gap:
              clamp(2rem, 8vw, 8rem);

            align-items: end;

            margin-bottom:
              clamp(3rem, 6vw, 6rem);
          }

          .section-number {
            margin: 0 0 12px;

            color: #9eeaf4;

            font-size: 13px;
            font-weight: 820;
            letter-spacing: 0.14em;
          }

          .section-title {
            margin: 0;

            font-size:
              clamp(2.8rem, 6vw, 5.8rem);

            font-weight: 610;
            line-height: 0.95;
            letter-spacing: -0.067em;
          }

          .section-description {
            max-width: 650px;
            margin: 0;

            color:
              rgba(255, 255, 255, 0.6);

            font-size: 1.05rem;
            line-height: 1.8;
          }

          /* Feature cards */

          .features-section {
            background:
              linear-gradient(
                180deg,
                #031019,
                #062531 50%,
                #031019
              );
          }

          .feature-grid {
            display: grid;

            grid-template-columns:
              repeat(2, minmax(0, 1fr));

            gap: 20px;
          }

          .feature-card {
            min-height: 320px;
            padding: 32px;

            border:
              1px solid rgba(255, 255, 255, 0.1);

            border-radius: 30px;

            background:
              linear-gradient(
                145deg,
                rgba(255, 255, 255, 0.055),
                rgba(255, 255, 255, 0.015)
              );

            transition:
              transform 220ms ease,
              border-color 220ms ease;
          }

          .feature-card:hover {
            transform: translateY(-7px);

            border-color:
              rgba(158, 234, 244, 0.34);
          }

          .feature-number {
            color: #9eeaf4;

            font-size: 13px;
            font-weight: 820;
          }

          .feature-card h3 {
            margin: 100px 0 14px;

            font-size: 1.65rem;
            letter-spacing: -0.04em;
          }

          .feature-card p {
            margin: 0;

            color:
              rgba(255, 255, 255, 0.55);

            line-height: 1.75;
          }

          /* Cleaning modes */

          .modes-section {
            background:
              radial-gradient(
                circle at 80% 30%,
                rgba(56, 195, 214, 0.15),
                transparent 34%
              ),
              #031019;
          }

          .modes-layout {
            display: grid;

            grid-template-columns:
              0.8fr 1.2fr;

            gap:
              clamp(2rem, 7vw, 7rem);

            align-items: center;
          }

          .mode-list {
            display: grid;
            gap: 10px;
          }

          .mode-button {
            display: grid;

            grid-template-columns:
              38px 1fr auto;

            align-items: center;
            gap: 15px;

            width: 100%;
            padding: 20px 22px;

            border:
              1px solid rgba(255, 255, 255, 0.08);

            border-radius: 20px;

            background:
              rgba(255, 255, 255, 0.025);

            color: white;
            text-align: left;
            cursor: pointer;

            transition:
              background 180ms ease,
              border-color 180ms ease,
              transform 180ms ease;
          }

          .mode-button:hover,
          .mode-button.is-active {
            border-color:
              rgba(158, 234, 244, 0.32);

            background:
              rgba(158, 234, 244, 0.07);

            transform: translateX(5px);
          }

          .mode-number {
            color: #9eeaf4;
            font-size: 12px;
          }

          .mode-button strong {
            display: block;
            font-size: 1rem;
          }

          .mode-button small {
            color:
              rgba(255, 255, 255, 0.43);
          }

          .mode-arrow {
            color:
              rgba(255, 255, 255, 0.35);
          }

          .mode-preview {
            position: relative;

            min-height: 560px;
            overflow: hidden;

            display: flex;
            flex-direction: column;
            justify-content: flex-end;

            padding:
              clamp(2rem, 5vw, 4rem);

            border:
              1px solid rgba(158, 234, 244, 0.13);

            border-radius: 34px;

            background:
              radial-gradient(
                circle at 50% 25%,
                rgba(112, 226, 240, 0.22),
                transparent 38%
              ),
              linear-gradient(
                160deg,
                #0b4050,
                #04151e
              );
          }

          .mode-preview-orb {
            position: absolute;
            top: 12%;
            left: 50%;

            width: 240px;
            height: 240px;

            border:
              1px solid rgba(180, 245, 252, 0.18);

            border-radius: 50%;

            box-shadow:
              0 0 80px
              rgba(64, 207, 226, 0.12);

            transform: translateX(-50%);
          }

          .mode-preview-orb::before,
          .mode-preview-orb::after {
            content: "";

            position: absolute;
            inset: 18%;

            border:
              1px solid rgba(180, 245, 252, 0.15);

            border-radius: 50%;
          }

          .mode-preview-orb::after {
            inset: 36%;

            background:
              rgba(158, 234, 244, 0.18);

            box-shadow:
              0 0 35px
              rgba(158, 234, 244, 0.25);
          }

          .mode-preview-content {
            position: relative;
            z-index: 2;
          }

          .mode-preview-label {
            color: #9eeaf4;

            font-size: 12px;
            font-weight: 800;
            letter-spacing: 0.14em;
            text-transform: uppercase;
          }

          .mode-preview h3 {
            margin: 14px 0 0;

            font-size:
              clamp(2.5rem, 5vw, 4.8rem);

            line-height: 0.95;
            letter-spacing: -0.06em;
          }

          .mode-preview p {
            max-width: 520px;
            margin: 18px 0 0;

            color:
              rgba(255, 255, 255, 0.62);

            line-height: 1.75;
          }

          /* Technology */

          .technology-section {
            background:
              linear-gradient(
                180deg,
                #031019,
                #061e28
              );
          }

          .technology-visual {
            position: relative;

            min-height: 700px;
            overflow: hidden;

            border:
              1px solid rgba(255, 255, 255, 0.09);

            border-radius: 36px;

            background:
              radial-gradient(
                circle at 50% 45%,
                rgba(76, 216, 235, 0.17),
                transparent 35%
              ),
              #04151d;
          }

          .technology-line {
            position: absolute;
            left: 50%;
            top: 8%;
            bottom: 8%;

            width: 1px;

            background:
              linear-gradient(
                transparent,
                rgba(158, 234, 244, 0.5),
                transparent
              );
          }

          .technology-node {
            position: absolute;

            width: min(360px, 38vw);
            padding: 24px;

            border:
              1px solid rgba(255, 255, 255, 0.1);

            border-radius: 24px;

            background:
              rgba(4, 24, 32, 0.78);

            backdrop-filter: blur(16px);
          }

          .technology-node::before {
            content: "";

            position: absolute;
            top: 50%;

            width: 55px;
            height: 1px;

            background:
              rgba(158, 234, 244, 0.4);
          }

          .technology-node-left {
            left: 6%;
          }

          .technology-node-left::before {
            right: -55px;
          }

          .technology-node-right {
            right: 6%;
          }

          .technology-node-right::before {
            left: -55px;
          }

          .technology-node-one {
            top: 12%;
          }

          .technology-node-two {
            top: 38%;
          }

          .technology-node-three {
            top: 64%;
          }

          .technology-node h3 {
            margin: 0;

            font-size: 1.35rem;
            letter-spacing: -0.035em;
          }

          .technology-node p {
            margin: 12px 0 0;

            color:
              rgba(255, 255, 255, 0.53);

            line-height: 1.65;
          }

          .technology-node span {
            display: block;

            margin-bottom: 13px;

            color: #9eeaf4;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.12em;
          }

          /* Included */

          .included-section {
            background: #031019;
          }

          .included-layout {
            display: grid;

            grid-template-columns:
              1fr 1fr;

            gap:
              clamp(2rem, 7vw, 7rem);

            align-items: center;
          }

          .included-product {
            position: relative;

            min-height: 600px;

            display: grid;
            place-items: center;

            border:
              1px solid rgba(255, 255, 255, 0.09);

            border-radius: 34px;

            background:
              radial-gradient(
                circle at center,
                rgba(74, 208, 226, 0.2),
                transparent 42%
              ),
              #041922;
          }

          .included-product .product-brush {
            transform: scale(0.76);
          }

          .included-list {
            display: grid;
            gap: 0;

            border-top:
              1px solid rgba(255, 255, 255, 0.1);
          }

          .included-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;

            padding: 23px 0;

            border-bottom:
              1px solid rgba(255, 255, 255, 0.1);
          }

          .included-item span:first-child {
            color:
              rgba(255, 255, 255, 0.73);
          }

          .included-check {
            width: 26px;
            height: 26px;

            display: grid;
            place-items: center;

            border:
              1px solid rgba(158, 234, 244, 0.25);

            border-radius: 50%;

            color: #9eeaf4;
            font-size: 12px;
          }

          /* Reviews */

          .reviews-section {
            background:
              radial-gradient(
                circle at 20% 50%,
                rgba(55, 189, 207, 0.12),
                transparent 30%
              ),
              #06212b;
          }

          .reviews-grid {
            display: grid;

            grid-template-columns:
              repeat(3, minmax(0, 1fr));

            gap: 20px;
          }

          .review-card {
            min-height: 330px;
            padding: 30px;

            display: flex;
            flex-direction: column;
            justify-content: space-between;

            border:
              1px solid rgba(255, 255, 255, 0.1);

            border-radius: 28px;

            background:
              rgba(255, 255, 255, 0.035);
          }

          .review-stars {
            color: #9eeaf4;
            letter-spacing: 4px;
          }

          .review-card blockquote {
            margin: 50px 0 0;

            font-size: 1.25rem;
            line-height: 1.6;
            letter-spacing: -0.025em;
          }

          .review-author {
            margin-top: 30px;
          }

          .review-author strong {
            display: block;
          }

          .review-author span {
            color:
              rgba(255, 255, 255, 0.45);

            font-size: 13px;
          }

          /* Pricing */

          .pricing-section {
            background: #031019;
          }

          .pricing-card {
            display: grid;

            grid-template-columns:
              1.15fr 0.85fr;

            overflow: hidden;

            border:
              1px solid rgba(158, 234, 244, 0.16);

            border-radius: 36px;

            background:
              linear-gradient(
                140deg,
                #0a3543,
                #04151d
              );
          }

          .pricing-copy {
            padding:
              clamp(2.5rem, 7vw, 6rem);
          }

          .pricing-copy h2 {
            max-width: 750px;
            margin: 0;

            font-size:
              clamp(3.2rem, 6vw, 6.2rem);

            line-height: 0.92;
            letter-spacing: -0.07em;
          }

          .pricing-copy > p {
            max-width: 600px;
            margin: 24px 0 0;

            color:
              rgba(255, 255, 255, 0.62);

            line-height: 1.75;
          }

          .pricing-value {
            display: flex;
            align-items: baseline;
            gap: 10px;

            margin-top: 34px;
          }

          .pricing-value strong {
            font-size:
              clamp(3rem, 5vw, 5rem);

            letter-spacing: -0.06em;
          }

          .pricing-value span {
            color:
              rgba(255, 255, 255, 0.48);
          }

          .pricing-visual {
            position: relative;

            min-height: 650px;

            display: grid;
            place-items: center;

            background:
              radial-gradient(
                circle,
                rgba(133, 229, 241, 0.2),
                transparent 52%
              );
          }

          .pricing-visual .product-brush {
            transform: scale(0.82);
          }

          /* FAQ */

          .faq-section {
            background:
              linear-gradient(
                180deg,
                #031019,
                #061e28
              );
          }

          .faq-list {
            border-top:
              1px solid rgba(255, 255, 255, 0.1);
          }

          .faq-item {
            border-bottom:
              1px solid rgba(255, 255, 255, 0.1);
          }

          .faq-question {
            width: 100%;
            padding: 26px 0;

            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 24px;

            border: 0;
            background: transparent;

            color: white;
            text-align: left;
            cursor: pointer;

            font-size:
              clamp(1.1rem, 2vw, 1.4rem);
          }

          .faq-icon {
            font-size: 1.7rem;

            color: #9eeaf4;

            transition:
              transform 220ms ease;
          }

          .faq-item.is-open .faq-icon {
            transform: rotate(45deg);
          }

          .faq-answer {
            display: grid;

            grid-template-rows: 0fr;

            transition:
              grid-template-rows 260ms ease;
          }

          .faq-answer p {
            min-height: 0;
            overflow: hidden;

            max-width: 720px;
            margin: 0;

            color:
              rgba(255, 255, 255, 0.55);

            line-height: 1.75;

            transition:
              padding-bottom 260ms ease;
          }

          .faq-item.is-open .faq-answer {
            grid-template-rows: 1fr;
          }

          .faq-item.is-open .faq-answer p {
            padding-bottom: 26px;
          }

          /* Final CTA */

          .final-section {
            background:
              radial-gradient(
                circle at 50% 30%,
                rgba(90, 216, 232, 0.22),
                transparent 38%
              ),
              #031019;
          }

          .final-card {
            position: relative;

            min-height: 700px;
            overflow: hidden;

            display: flex;
            align-items: flex-end;

            padding:
              clamp(2.5rem, 8vw, 7rem);

            border:
              1px solid rgba(158, 234, 244, 0.16);

            border-radius: 38px;

            background:
              linear-gradient(
                150deg,
                #0b4151,
                #04151c
              );
          }

          .final-card::before {
            content: "";

            position: absolute;
            top: -210px;
            left: 50%;

            width: 560px;
            height: 560px;

            border:
              1px solid rgba(176, 241, 249, 0.18);

            border-radius: 50%;

            transform: translateX(-50%);
          }

          .final-card::after {
            content: "";

            position: absolute;
            top: -90px;
            left: 50%;

            width: 310px;
            height: 310px;

            border-radius: 50%;

            background:
              rgba(142, 231, 242, 0.12);

            filter: blur(30px);

            transform: translateX(-50%);
          }

          .final-content {
            position: relative;
            z-index: 2;

            max-width: 900px;
          }

          .final-content h2 {
            margin: 0;

            font-size:
              clamp(3.6rem, 8vw, 8rem);

            line-height: 0.87;
            letter-spacing: -0.075em;
          }

          .final-content p {
            max-width: 580px;
            margin: 25px 0 0;

            color:
              rgba(255, 255, 255, 0.62);

            line-height: 1.75;
          }

          /* Footer */

          .launch-footer {
            display: grid;

            grid-template-columns:
              1fr auto;

            gap: 30px;

            padding:
              45px clamp(1.25rem, 6vw, 6rem);

            border-top:
              1px solid rgba(255, 255, 255, 0.08);

            color:
              rgba(255, 255, 255, 0.43);

            font-size: 13px;
          }

          .footer-links {
            display: flex;
            flex-wrap: wrap;
            gap: 22px;
          }

          .footer-links a {
            color: inherit;
            text-decoration: none;
          }

          /* Responsive */

          @media (max-width: 980px) {
            .section-intro,
            .modes-layout,
            .included-layout,
            .pricing-card {
              grid-template-columns: 1fr;
            }

            .technology-visual {
              min-height: auto;
              padding: 30px;

              display: grid;
              gap: 20px;
            }

            .technology-line {
              display: none;
            }

            .technology-node {
              position: relative;
              inset: auto;

              width: 100%;
            }

            .technology-node::before {
              display: none;
            }

            .reviews-grid {
              grid-template-columns: 1fr;
            }

            .pricing-visual {
              min-height: 570px;
            }
          }

          @media (max-width: 760px) {
            .launch-nav > a:not(.buy-button),
            .launch-nav > .nav-story-link {
              display: none;
            }

            .feature-grid {
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
                rgba(255, 255, 255, 0.23);

              color: transparent;
            }

            .story-section-link::before {
              display: none;
            }

            .story-section-link.is-active {
              background: #9eeaf4;

              box-shadow:
                0 0 12px
                rgba(158, 234, 244, 0.75);

              transform: scale(1.25);
            }

            .product-brush {
              transform: scale(0.72);
            }

            .launch-footer {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 540px) {
            .launch-header {
              min-height: 66px;
            }

            .buy-button {
              min-height: 40px;
              padding-inline: 15px;
              font-size: 13px;
            }

            .story-title {
              font-size:
                clamp(3.6rem, 19vw, 5.8rem);
            }

            .story-stat-row {
              gap: 17px;
            }

            .mode-preview {
              min-height: 500px;
            }

            .pricing-copy {
              padding: 30px 22px;
            }

            .final-card {
              min-height: 620px;
            }
          }
        `}
      </style>

      <header className="launch-header">
        <ScrollStoryLink
          storyId="nova-launch-story"
          sectionId="brush-intro"
          className="launch-brand"
        >
          <span className="brand-symbol" />
          <span>NOVA</span>
        </ScrollStoryLink>

        <nav className="launch-nav" aria-label="Product navigation">
          <ScrollStoryLink
            storyId="nova-launch-story"
            sectionId="brush-intro"
            className="nav-story-link"
          >
            Product
          </ScrollStoryLink>

          <a href="#features">Features</a>
          <a href="#technology">Technology</a>
          <a href="#reviews">Reviews</a>

          <a href="#buy" className="buy-button">
            Pre-order
          </a>
        </nav>
      </header>

      <section id="product">
        <ScrollStory
          storyId="nova-launch-story"
          sectionHeightVh={118}
          viewportHeight="100vh"
          reducedMotion="allow"
          hideScrollbar
          smoothScroll
          updateHash
          viewportStyle={{
            background: "#031019",
            overscrollBehavior: "auto",
          }}
          stickyStyle={{
            background:
              "radial-gradient(circle at 50% 45%, #0b4f60 0%, #062a37 38%, #031019 75%)",
          }}
          scene={
            <LayeredImageScene
              perspective={1500}
              background="#031019"
            >
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
                    at: 0.2,
                    opacity: 1,
                  },
                  {
                    at: 0.4,
                    opacity: 0.92,
                  },
                  {
                    at: 0.6,
                    opacity: 0.9,
                  },
                  {
                    at: 0.8,
                    opacity: 0.94,
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
                      "radial-gradient(circle at 65% 45%, rgba(93,223,239,0.23), transparent 34%), linear-gradient(140deg, rgba(3,16,25,0.15), rgba(3,16,25,0.8))",
                  }}
                />
              </DepthLayer>

              <DepthLayer
                anchor="center"
                easing="smoothstep"
                frames={[
                  {
                    at: 0,
                    x: 320,
                    y: 85,
                    z: 150,
                    rotateZ: 7,
                    rotateY: -16,
                    scale: 0.84,
                    opacity: 1,
                  },
                  {
                    at: 0.16,
                    x: 220,
                    y: 20,
                    z: 220,
                    rotateZ: 3,
                    rotateY: -8,
                    scale: 0.92,
                    opacity: 1,
                  },
                  {
                    at: 0.33,
                    x: -260,
                    y: 30,
                    z: 300,
                    rotateZ: -5,
                    rotateY: 13,
                    scale: 1.02,
                    opacity: 1,
                  },
                  {
                    at: 0.5,
                    x: 220,
                    y: -20,
                    z: 390,
                    rotateZ: 4,
                    rotateY: -12,
                    scale: 1.09,
                    opacity: 1,
                  },
                  {
                    at: 0.67,
                    x: -230,
                    y: -30,
                    z: 450,
                    rotateZ: -4,
                    rotateY: 11,
                    scale: 1.15,
                    opacity: 1,
                  },
                  {
                    at: 0.84,
                    x: 0,
                    y: -50,
                    z: 540,
                    rotateZ: 0,
                    rotateY: 0,
                    scale: 1.25,
                    opacity: 1,
                  },
                  {
                    at: 1,
                    x: 0,
                    y: -90,
                    z: 650,
                    rotateZ: 0,
                    rotateY: 0,
                    scale: 1.4,
                    opacity: 0.35,
                    blur: 5,
                  },
                ]}
              >
                <ProductBrush />
              </DepthLayer>

              <DepthLayer
                anchor="center"
                easing="smoothstep"
                frames={[
                  {
                    at: 0,
                    x: -230,
                    y: -40,
                    z: -100,
                    scale: 0.75,
                    opacity: 0,
                  },
                  {
                    at: 0.26,
                    x: -230,
                    y: -40,
                    z: 100,
                    scale: 0.9,
                    opacity: 0,
                  },
                  {
                    at: 0.39,
                    x: -110,
                    y: 0,
                    z: 250,
                    scale: 1,
                    opacity: 1,
                  },
                  {
                    at: 0.56,
                    x: -30,
                    y: -20,
                    z: 350,
                    scale: 1.06,
                    opacity: 0.6,
                  },
                  {
                    at: 0.65,
                    x: 80,
                    y: -60,
                    z: 430,
                    scale: 1.15,
                    opacity: 0,
                  },
                ]}
              >
                <FeatureOrbit />
              </DepthLayer>

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
                    opacity: 0.6,
                  },
                  {
                    at: 0.5,
                    opacity: 1,
                  },
                  {
                    at: 1,
                    opacity: 0.5,
                  },
                ]}
              >
                <BubbleField />
              </DepthLayer>

              <DepthLayer
                anchor="center"
                easing="smoothstep"
                frames={[
                  {
                    at: 0,
                    x: -400,
                    y: 230,
                    z: 80,
                    scale: 0.2,
                    opacity: 0,
                    blur: 12,
                  },
                  {
                    at: 0.25,
                    x: -220,
                    y: 80,
                    z: 280,
                    scale: 0.5,
                    opacity: 0.35,
                    blur: 3,
                  },
                  {
                    at: 0.55,
                    x: 70,
                    y: -30,
                    z: 480,
                    scale: 0.9,
                    opacity: 0.6,
                    blur: 0,
                  },
                  {
                    at: 0.8,
                    x: 290,
                    y: -100,
                    z: 610,
                    scale: 1.2,
                    opacity: 0.28,
                    blur: 5,
                  },
                  {
                    at: 1,
                    x: 430,
                    y: -220,
                    z: 760,
                    scale: 1.6,
                    opacity: 0,
                    blur: 16,
                  },
                ]}
              >
                <img
                  src={FLARE_IMAGE}
                  alt=""
                  style={{
                    width: "min(60vw, 760px)",
                    maxWidth: "none",
                    mixBlendMode: "screen",
                    pointerEvents: "none",
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
            progressColor="#9eeaf4"
            style={{
              boxShadow:
                "0 0 18px rgba(158,234,244,0.8)",
            }}
          />

          <nav
            className="story-section-nav"
            aria-label="Nova product story navigation"
          >
            {storyNavigation.map((section, index) => (
              <ScrollStoryLink
                key={section.id}
                sectionId={section.id}
                className="story-section-link"
                activeClassName="is-active"
              >
                <span className="story-nav-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span>{section.label}</span>
              </ScrollStoryLink>
            ))}
          </nav>

          <ScrollChapter
            id="brush-intro"
            range={[0, 0.166]}
            align="left"
            verticalAlign="center"
            width="min(900px, 90vw)"
            interactive
          >
            <div className="story-copy">
              <p className="eyebrow">
                Introducing Nova One
              </p>

              <h1 className="story-title">
                A better clean,
                <br />
                <span className="accent">
                  beautifully simple.
                </span>
              </h1>

              <p className="story-description">
                An intelligent sonic toothbrush built
                around powerful cleaning, gentler
                habits and a design that belongs in
                your space.
              </p>

              <div className="launch-price">
                <strong>₹7,999</strong>
                <span>Launch edition</span>
              </div>

              <div className="story-actions">
                <a href="#buy" className="primary-button">
                  Pre-order Nova One
                </a>

                <ScrollStoryLink
                  sectionId="brush-cleaning"
                  className="secondary-button"
                >
                  Explore the technology
                </ScrollStoryLink>
              </div>
            </div>
          </ScrollChapter>

          <ScrollChapter
            id="brush-cleaning"
            range={[0.166, 0.333]}
            align="right"
            verticalAlign="center"
            width="min(710px, 90vw)"
          >
            <div className="story-copy story-copy-right">
              <p className="eyebrow">
                Sonic cleaning
              </p>

              <h2 className="story-heading">
                40,000 movements.
                <br />
                Two quiet minutes.
              </h2>

              <p className="story-description">
                High-frequency movement creates
                dynamic fluid action around each
                tooth while the two-minute timer
                keeps your routine simple.
              </p>

              <div className="story-stat-row">
                <div className="story-stat">
                  <strong>40K</strong>
                  <span>movements per minute</span>
                </div>

                <div className="story-stat">
                  <strong>2 min</strong>
                  <span>guided clean</span>
                </div>

                <div className="story-stat">
                  <strong>30 sec</strong>
                  <span>zone reminders</span>
                </div>
              </div>
            </div>
          </ScrollChapter>

          <ScrollChapter
            id="brush-pressure"
            range={[0.333, 0.5]}
            align="left"
            verticalAlign="center"
            width="min(720px, 90vw)"
          >
            <div className="story-copy">
              <p className="eyebrow">
                Pressure intelligence
              </p>

              <h2 className="story-heading">
                Powerful does not have to mean
                aggressive.
              </h2>

              <p className="story-description">
                The pressure ring responds when you
                push too hard, helping you develop a
                gentler and more consistent brushing
                technique.
              </p>
            </div>
          </ScrollChapter>

          <ScrollChapter
            id="brush-battery"
            range={[0.5, 0.666]}
            align="right"
            verticalAlign="center"
            width="min(720px, 90vw)"
          >
            <div className="story-copy story-copy-right">
              <p className="eyebrow">
                Travel without the charger
              </p>

              <h2 className="story-heading">
                Six weeks between charges.
              </h2>

              <p className="story-description">
                The high-density battery is designed
                to keep going through daily routines,
                work trips and longer journeys.
              </p>

              <div className="story-stat-row">
                <div className="story-stat">
                  <strong>6 weeks</strong>
                  <span>estimated battery</span>
                </div>

                <div className="story-stat">
                  <strong>USB-C</strong>
                  <span>universal charging</span>
                </div>
              </div>
            </div>
          </ScrollChapter>

          <ScrollChapter
            id="brush-design"
            range={[0.666, 0.833]}
            align="left"
            verticalAlign="center"
            width="min(720px, 90vw)"
          >
            <div className="story-copy">
              <p className="eyebrow">
                Designed for your routine
              </p>

              <h2 className="story-heading">
                Less interface.
                <br />
                More intention.
              </h2>

              <p className="story-description">
                One button, subtle indicators and
                tactile feedback. Nova One avoids
                unnecessary screens and keeps every
                essential control on the handle.
              </p>
            </div>
          </ScrollChapter>

          <ScrollChapter
            id="brush-buy"
            range={[0.833, 1]}
            align="center"
            verticalAlign="center"
            width="min(920px, 90vw)"
            interactive
          >
            <div className="story-copy story-copy-center">
              <p className="eyebrow">
                Launch edition
              </p>

              <h2 className="story-heading">
                Your routine,
                <br />
                thoughtfully redesigned.
              </h2>

              <p className="story-description">
                Nova One includes two brush heads,
                magnetic charging, a travel case and
                a two-year warranty.
              </p>

              <div className="story-actions">
                <a href="#buy" className="primary-button">
                  Pre-order for ₹7,999
                </a>

                <ScrollStoryLink
                  sectionId="brush-intro"
                  className="secondary-button"
                >
                  Replay launch story
                </ScrollStoryLink>
              </div>
            </div>
          </ScrollChapter>
        </ScrollStory>
      </section>

      <section
        id="features"
        className="content-section features-section"
      >
        <div className="section-inner">
          <div className="section-intro">
            <div>
              <p className="section-number">
                01 — Essential technology
              </p>

              <h2 className="section-title">
                Everything you need.
                Nothing you do not.
              </h2>
            </div>

            <p className="section-description">
              Nova One focuses on the parts of an
              electric toothbrush that meaningfully
              improve the daily experience.
            </p>
          </div>

          <div className="feature-grid">
            {features.map((feature) => (
              <article
                key={feature.number}
                className="feature-card"
              >
                <span className="feature-number">
                  {feature.number}
                </span>

                <h3>{feature.title}</h3>

                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="modes"
        className="content-section modes-section"
      >
        <div className="section-inner">
          <div className="section-intro">
            <div>
              <p className="section-number">
                02 — Cleaning modes
              </p>

              <h2 className="section-title">
                One toothbrush.
                Five different routines.
              </h2>
            </div>

            <p className="section-description">
              Select a cleaning pattern directly
              from the handle. No account, mobile
              application or complicated setup.
            </p>
          </div>

          <div className="modes-layout">
            <div className="mode-list">
              {cleaningModes.map((mode, index) => (
                <button
                  key={mode.name}
                  type="button"
                  className={`mode-button ${
                    selectedMode === index
                      ? "is-active"
                      : ""
                  }`}
                  onClick={() => setSelectedMode(index)}
                >
                  <span className="mode-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span>
                    <strong>{mode.name}</strong>
                    <small>{mode.intensity}</small>
                  </span>

                  <span className="mode-arrow">→</span>
                </button>
              ))}
            </div>

            <div className="mode-preview">
              <div className="mode-preview-orb" />

              <div className="mode-preview-content">
                <span className="mode-preview-label">
                  {cleaningModes[selectedMode].intensity}
                </span>

                <h3>
                  {cleaningModes[selectedMode].name}
                  <br />
                  mode
                </h3>

                <p>
                  {
                    cleaningModes[selectedMode]
                      .description
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="technology"
        className="content-section technology-section"
      >
        <div className="section-inner">
          <div className="section-intro">
            <div>
              <p className="section-number">
                03 — Inside Nova
              </p>

              <h2 className="section-title">
                Precision from top to bottom.
              </h2>
            </div>

            <p className="section-description">
              Every part of the handle is designed
              around efficient movement, quiet
              operation and a more comfortable grip.
            </p>
          </div>

          <div className="technology-visual">
            <div className="technology-line" />

            <article className="technology-node technology-node-left technology-node-one">
              <span>BRUSH HEAD</span>
              <h3>High-density bristle geometry</h3>
              <p>
                Angled bristle groups help reach
                around tooth surfaces and difficult
                spaces.
              </p>
            </article>

            <article className="technology-node technology-node-right technology-node-two">
              <span>SONIC DRIVE</span>
              <h3>Quiet magnetic motor</h3>
              <p>
                High-frequency motion with reduced
                mechanical noise and vibration
                through the handle.
              </p>
            </article>

            <article className="technology-node technology-node-left technology-node-three">
              <span>POWER SYSTEM</span>
              <h3>High-density lithium battery</h3>
              <p>
                Efficient power management supports
                long battery life without increasing
                handle size.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section
        id="included"
        className="content-section included-section"
      >
        <div className="section-inner">
          <div className="section-intro">
            <div>
              <p className="section-number">
                04 — In the box
              </p>

              <h2 className="section-title">
                Ready from the first morning.
              </h2>
            </div>

            <p className="section-description">
              The launch edition includes the
              essentials for home and travel without
              unnecessary accessories.
            </p>
          </div>

          <div className="included-layout">
            <div className="included-product">
              <ProductBrush />
            </div>

            <div className="included-list">
              {includedItems.map((item) => (
                <div
                  key={item}
                  className="included-item"
                >
                  <span>{item}</span>

                  <span className="included-check">
                    ✓
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="reviews"
        className="content-section reviews-section"
      >
        <div className="section-inner">
          <div className="section-intro">
            <div>
              <p className="section-number">
                05 — Early impressions
              </p>

              <h2 className="section-title">
                Designed to disappear into your
                routine.
              </h2>
            </div>

            <p className="section-description">
              Feedback from early testers who used
              Nova One as part of their everyday
              brushing routine.
            </p>
          </div>

          <div className="reviews-grid">
            {reviews.map((review) => (
              <article
                key={review.name}
                className="review-card"
              >
                <div>
                  <div className="review-stars">
                    ★★★★★
                  </div>

                  <blockquote>
                    “{review.quote}”
                  </blockquote>
                </div>

                <div className="review-author">
                  <strong>{review.name}</strong>
                  <span>{review.role}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="buy"
        className="content-section pricing-section"
      >
        <div className="section-inner">
          <div className="pricing-card">
            <div className="pricing-copy">
              <p className="eyebrow">
                Nova One launch edition
              </p>

              <h2>
                Upgrade the routine you repeat every
                day.
              </h2>

              <p>
                Includes Nova One, two brush heads,
                magnetic charging base, travel case,
                USB-C cable and a two-year limited
                warranty.
              </p>

              <div className="pricing-value">
                <strong>₹7,999</strong>
                <span>including taxes</span>
              </div>

              <div className="story-actions">
                <button
                  type="button"
                  className="primary-button"
                >
                  Pre-order Nova One
                </button>

                <a
                  href="#included"
                  className="secondary-button"
                >
                  See what is included
                </a>
              </div>
            </div>

            <div className="pricing-visual">
              <ProductBrush />
            </div>
          </div>
        </div>
      </section>

      <section
        id="faq"
        className="content-section faq-section"
      >
        <div className="section-inner">
          <div className="section-intro">
            <div>
              <p className="section-number">
                06 — Questions
              </p>

              <h2 className="section-title">
                Everything before you switch.
              </h2>
            </div>

            <p className="section-description">
              Practical answers about charging,
              compatibility, waterproofing and
              warranty coverage.
            </p>
          </div>

          <div className="faq-list">
            {faqs.map((faq) => (
              <FAQItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="content-section final-section">
        <div className="section-inner">
          <div className="final-card">
            <div className="final-content">
              <p className="eyebrow">
                Nova One
              </p>

              <h2>
                Start and end your day better.
              </h2>

              <p>
                Powerful sonic cleaning, pressure
                guidance and six-week battery life
                inside a toothbrush designed to stay
                beautifully simple.
              </p>

              <div className="story-actions">
                <a href="#buy" className="primary-button">
                  Pre-order for ₹7,999
                </a>

                <ScrollStoryLink
                  storyId="nova-launch-story"
                  sectionId="brush-intro"
                  className="secondary-button"
                >
                  Watch the launch again
                </ScrollStoryLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="launch-footer">
        <span>
          © 2026 Nova Oral Care. Concept product
          launch demo.
        </span>

        <div className="footer-links">
          <a href="#features">Features</a>
          <a href="#technology">Technology</a>
          <a href="#included">In the box</a>
          <a href="#faq">FAQ</a>
        </div>
      </footer>
    </main>
  );
}