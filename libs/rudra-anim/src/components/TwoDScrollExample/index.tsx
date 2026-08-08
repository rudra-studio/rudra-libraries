import ScrollStory from '../ScrollStory';
import ScrollProgress from '../ScrollProgress'
import ImageLayer from '../ImageLayer';
import LayeredImageScene from '../LayeredImageScene';
import ScrollChapter from '../ScrollChapter';

import {
  ImageLayer,
  LayeredImageScene,
  ScrollChapter
} from "../scroll-effects";

const EARTH_IMAGE =
  "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg";

const CLOUD_IMAGE =
  "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png";

const FLARE_IMAGE =
  "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/lensflare/lensflare0.png";

const chapterContainerStyle: React.CSSProperties = {
  color: "white",
  textShadow: "0 4px 30px rgba(0, 0, 0, 0.65)",
};

const labelStyle: React.CSSProperties = {
  margin: "0 0 12px",
  fontSize: 13,
  textTransform: "uppercase",
  letterSpacing: "0.16em",
  color: "rgba(255,255,255,0.65)",
};

const headingStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "clamp(3rem, 8vw, 7rem)",
  lineHeight: 0.92,
  letterSpacing: "-0.055em",
};

const secondaryHeadingStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "clamp(2.3rem, 6vw, 5rem)",
  lineHeight: 0.95,
  letterSpacing: "-0.045em",
};

const paragraphStyle: React.CSSProperties = {
  maxWidth: 560,
  marginTop: 24,
  fontSize: "clamp(1rem, 2vw, 1.2rem)",
  lineHeight: 1.65,
  color: "rgba(255,255,255,0.72)",
};

const buttonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  marginTop: 24,
  padding: "13px 22px",
  border: 0,
  borderRadius: 999,
  background: "white",
  color: "#08111f",
  fontWeight: 700,
  cursor: "pointer",
};

export default function TwoDScrollExample() {
  return (
    <ScrollStory
      heightVh={500}
      reducedMotion="start"
      stickyStyle={{
        background:
          "radial-gradient(circle at center, #15365d 0%, #07111f 50%, #02060d 100%)",
      }}
      scene={
        <LayeredImageScene
          perspective={1400}
          background="#02060d"
        >
          {/* Far background */}
          <ImageLayer
            src={EARTH_IMAGE}
            alt="Satellite view of Earth"
            anchor="center"
            imageStyle={{
              width: "130vw",
              maxWidth: "none",
              height: "120vh",
              objectFit: "cover",
              opacity: 0.42,
            }}
            frames={[
              {
                at: 0,
                x: 0,
                y: 0,
                z: -500,
                scale: 1.15,
                opacity: 0.35,
                blur: 2,
              },
              {
                at: 0.5,
                x: -40,
                y: -20,
                z: -320,
                scale: 1.25,
                opacity: 0.5,
                blur: 0,
              },
              {
                at: 1,
                x: 60,
                y: -80,
                z: -150,
                scale: 1.4,
                opacity: 0.2,
                blur: 5,
              },
            ]}
          />

          {/* Middle cloud layer */}
          <ImageLayer
            src={CLOUD_IMAGE}
            alt="Atmospheric cloud layer"
            anchor="center"
            imageStyle={{
              width: "125vw",
              maxWidth: "none",
              opacity: 0.38,
              mixBlendMode: "screen",
            }}
            frames={[
              {
                at: 0,
                x: -160,
                y: 100,
                z: -100,
                scale: 1.2,
                rotateZ: -4,
                opacity: 0.15,
              },
              {
                at: 0.4,
                x: 0,
                y: 10,
                z: 80,
                scale: 1.4,
                rotateZ: 0,
                opacity: 0.45,
              },
              {
                at: 0.75,
                x: 140,
                y: -60,
                z: 220,
                scale: 1.65,
                rotateZ: 4,
                opacity: 0.3,
              },
              {
                at: 1,
                x: 280,
                y: -140,
                z: 360,
                scale: 1.9,
                rotateZ: 8,
                opacity: 0,
              },
            ]}
          />

          {/* Foreground glowing object */}
          <ImageLayer
            src={FLARE_IMAGE}
            alt="Glowing light"
            anchor="center"
            imageStyle={{
              width: "min(58vw, 620px)",
              maxWidth: "none",
              mixBlendMode: "screen",
            }}
            frames={[
              {
                at: 0,
                x: 320,
                y: 180,
                z: 100,
                scale: 0.3,
                opacity: 0,
                blur: 12,
              },
              {
                at: 0.18,
                x: 170,
                y: 50,
                z: 220,
                scale: 0.65,
                opacity: 0.85,
                blur: 2,
              },
              {
                at: 0.45,
                x: -80,
                y: -20,
                z: 340,
                scale: 0.9,
                opacity: 1,
                blur: 0,
              },
              {
                at: 0.72,
                x: 160,
                y: -80,
                z: 460,
                scale: 1.15,
                opacity: 0.7,
                blur: 3,
              },
              {
                at: 1,
                x: -320,
                y: -200,
                z: 620,
                scale: 1.7,
                opacity: 0,
                blur: 16,
              },
            ]}
          />
        </LayeredImageScene>
      }
    >
      <ScrollProgress
        position="top"
        color="#7dd3fc"
      />

      <ScrollChapter
        range={[0, 0.3]}
        align="left"
        interactive
      >
        <div style={chapterContainerStyle}>
          <p style={labelStyle}>
            Rudra scroll experiences
          </p>

          <h1 style={headingStyle}>
            Build with
            <br />
            depth.
          </h1>

          <p style={paragraphStyle}>
            Create immersive landing pages using
            lightweight images, reusable layers and
            scroll-controlled keyframes.
          </p>

          <button
            type="button"
            style={buttonStyle}
          >
            Start building
          </button>
        </div>
      </ScrollChapter>

      <ScrollChapter
        range={[0.3, 0.65]}
        align="right"
      >
        <div style={chapterContainerStyle}>
          <p style={labelStyle}>
            Layered images
          </p>

          <h2 style={secondaryHeadingStyle}>
            Move each layer
            <br />
            independently.
          </h2>

          <p style={paragraphStyle}>
            Backgrounds, cloud layers, product
            images and visual effects can all move
            at different speeds.
          </p>
        </div>
      </ScrollChapter>

      <ScrollChapter
        range={[0.65, 1]}
        align="center"
      >
        <div
          style={{
            ...chapterContainerStyle,
            textAlign: "center",
          }}
        >
          <p style={labelStyle}>
            Lightweight approach
          </p>

          <h2 style={secondaryHeadingStyle}>
            3D feeling without WebGL.
          </h2>

          <p
            style={{
              ...paragraphStyle,
              marginInline: "auto",
            }}
          >
            This is the recommended default for
            most Rudra marketing websites.
          </p>
        </div>
      </ScrollChapter>
    </ScrollStory>
  );
}