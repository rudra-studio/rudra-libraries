import {
  useState,
  type CSSProperties,
} from "react";

import {
  useMotionValueEvent,
} from "motion/react";

import DepthLayer from '../DepthLayer';
import LayeredImageScene from '../LayeredImageScene';
import ScrollChapter from '../ScrollChapter';
import ScrollProgress from '../ScrollProgress';
import ScrollStory from '../ScrollStory';
import useScrollStory from '../../hooks/useScrollStory';

const headingStyle: CSSProperties = {
  margin: 0,

  color: "white",

  fontSize:
    "clamp(2.5rem, 6vw, 5.5rem)",

  lineHeight: 1,

  letterSpacing: "-0.05em",
};

function ProgressDebugger() {
  const { progress } = useScrollStory();

  const [percentage, setPercentage] =
    useState(() => {
      return Math.round(
        progress.get() * 100,
      );
    });

  useMotionValueEvent(
    progress,
    "change",
    (currentProgress) => {
      setPercentage(
        Math.round(
          currentProgress * 100,
        ),
      );
    },
  );

  return (
    <div
      style={{
        position: "absolute",

        top: 28,
        right: 28,

        zIndex: 100,

        padding: "12px 20px",

        borderRadius: 999,

        background: "white",
        color: "#020617",

        fontSize: 18,
        fontWeight: 800,

        pointerEvents: "none",
      }}
    >
      Progress: {percentage}%
    </div>
  );
}

export default function ScrollAnimationTest() {
  return (
    <ScrollStory
      heightVh={400}
      viewportHeight="80vh"
      reducedMotion="allow"
      viewportStyle={{
        border: "3px solid #38bdf8",
        background: "#020617",
      }}
      stickyStyle={{
        background: "#020617",
      }}
      scene={
        <LayeredImageScene
          perspective={1000}
          background="#020617"
        >
          <DepthLayer
            anchor="center"
            easing="linear"
            frames={[
              {
                at: 0,

                x: -350,
                y: 140,
                z: 0,

                rotateY: -50,

                scale: 0.65,
                opacity: 1,
              },

              {
                at: 0.5,

                x: 0,
                y: 0,
                z: 150,

                rotateY: 0,

                scale: 1,
                opacity: 1,
              },

              {
                at: 1,

                x: 350,
                y: -140,
                z: 300,

                rotateY: 50,

                scale: 1.4,
                opacity: 1,
              },
            ]}
          >
            <div
              style={{
                width: 220,
                height: 220,

                display: "grid",
                placeItems: "center",

                borderRadius: 32,

                background:
                  "linear-gradient(135deg, #7c3aed, #06b6d4)",

                color: "white",

                fontSize: 30,
                fontWeight: 800,

                boxShadow:
                  "0 30px 90px rgba(0,0,0,0.55)",
              }}
            >
              RUDRA
            </div>
          </DepthLayer>
        </LayeredImageScene>
      }
    >
      <ScrollProgress
        position="top"
        height={6}
        color="#38bdf8"
      />

      <ProgressDebugger />

      <ScrollChapter
        range={[0, 0.32]}
        align="left"
        verticalAlign="center"
        fade={false}
      >
        <div>
          <p
            style={{
              color: "#38bdf8",
              fontWeight: 800,
            }}
          >
            FIRST CHAPTER
          </p>

          <h1 style={headingStyle}>
            Scroll inside
            <br />
            this container
          </h1>
        </div>
      </ScrollChapter>

      <ScrollChapter
        range={[0.34, 0.66]}
        align="right"
        verticalAlign="center"
        fade={false}
      >
        <div>
          <p
            style={{
              color: "#38bdf8",
              fontWeight: 800,
            }}
          >
            SECOND CHAPTER
          </p>

          <h2 style={headingStyle}>
            Moving through
            <br />
            the centre
          </h2>
        </div>
      </ScrollChapter>

      <ScrollChapter
        range={[0.68, 1]}
        align="left"
        verticalAlign="end"
        fade={false}
      >
        <div>
          <p
            style={{
              color: "#38bdf8",
              fontWeight: 800,
            }}
          >
            FINAL CHAPTER
          </p>

          <h2 style={headingStyle}>
            Animation
            <br />
            completed
          </h2>
        </div>
      </ScrollChapter>
    </ScrollStory>
  );
}