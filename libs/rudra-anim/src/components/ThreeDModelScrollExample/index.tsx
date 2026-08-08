import ModelScene from '../ModalScene';
import ScrollCamera from '../ScrollCamera'
import ScrollChapter from '../ScrollChapter';
import ScrollModel from '../ScrollModel';
import ScrollProgress from '../ScrollProgress';
import ScrollStory from '../ScrollStory';

const AVOCADO_MODEL =
  "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Avocado/glTF-Binary/Avocado.glb";

const chapterContainerStyle: React.CSSProperties = {
  color: "white",
  textShadow: "0 4px 30px rgba(0, 0, 0, 0.7)",
};

const labelStyle: React.CSSProperties = {
  margin: "0 0 12px",
  fontSize: 13,
  textTransform: "uppercase",
  letterSpacing: "0.16em",
  color: "rgba(255,255,255,0.6)",
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
  maxWidth: 540,
  marginTop: 24,
  fontSize: "clamp(1rem, 2vw, 1.2rem)",
  lineHeight: 1.65,
  color: "rgba(255,255,255,0.7)",
};

export default function ThreeDModelScrollExample() {
  return (
    <ScrollStory
      heightVh={500}
      reducedMotion="start"
      stickyStyle={{
        background: "#07100b",
      }}
      scene={
        <ModelScene
          background="#07100b"
          environment={false}
          cameraPosition={[0, 0, 5]}
          fov={45}
          ambientIntensity={1.2}
          directionalIntensity={3}
          directionalPosition={[4, 5, 4]}
          dpr={[1, 1.5]}
          shadows
        >
          <ScrollCamera
            lookAt={[0, 0, 0]}
            frames={[
              {
                at: 0,
                position: [0, 0.1, 5],
              },
              {
                at: 0.3,
                position: [1.1, 0.4, 4.2],
              },
              {
                at: 0.6,
                position: [-1.2, 0.2, 3.8],
              },
              {
                at: 1,
                position: [0, 0.6, 3.2],
              },
            ]}
            fovFrames={[
              {
                at: 0,
                value: 48,
              },
              {
                at: 0.5,
                value: 42,
              },
              {
                at: 1,
                value: 36,
              },
            ]}
          />

          <ScrollModel
            src={AVOCADO_MODEL}
            name="avocado-product"
            easing="smoothstep"
            castShadow
            receiveShadow
            frames={[
              {
                at: 0,
                position: [1.2, -0.7, 0],
                rotation: [-0.3, -0.8, -0.1],
                scale: 14,
                opacity: 0,
              },
              {
                at: 0.16,
                position: [0.65, -0.25, 0],
                rotation: [-0.15, 0, 0],
                scale: 18,
                opacity: 1,
              },
              {
                at: 0.42,
                position: [-0.6, 0, 0],
                rotation: [0.1, 2.2, 0.1],
                scale: 21,
                opacity: 1,
              },
              {
                at: 0.7,
                position: [0.55, 0.2, -0.2],
                rotation: [0.25, 4.5, -0.1],
                scale: 23,
                opacity: 1,
              },
              {
                at: 1,
                position: [0, 0.5, -0.5],
                rotation: [0.35, 6.28, 0],
                scale: 27,
                opacity: 1,
              },
            ]}
          />
        </ModelScene>
      }
    >
      <ScrollProgress
        position="top"
        color="#86efac"
      />

      <ScrollChapter
        range={[0, 0.3]}
        align="left"
      >
        <div style={chapterContainerStyle}>
          <p style={labelStyle}>
            Real 3D model
          </p>

          <h1 style={headingStyle}>
            Inspect every
            <br />
            detail.
          </h1>

          <p style={paragraphStyle}>
            Bind model position, rotation, scale,
            opacity and camera movement directly to
            scroll progress.
          </p>
        </div>
      </ScrollChapter>

      <ScrollChapter
        range={[0.3, 0.65]}
        align="right"
      >
        <div style={chapterContainerStyle}>
          <p style={labelStyle}>
            Camera storytelling
          </p>

          <h2 style={secondaryHeadingStyle}>
            Move around
            <br />
            the product.
          </h2>

          <p style={paragraphStyle}>
            Each chapter can introduce a new camera
            angle while the model continues its own
            animation.
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
            WebGL experience
          </p>

          <h2 style={secondaryHeadingStyle}>
            Real depth. Real geometry.
          </h2>

          <p
            style={{
              ...paragraphStyle,
              marginInline: "auto",
            }}
          >
            Use this version for product
            visualisation, games and experiences
            where users need to see every angle.
          </p>
        </div>
      </ScrollChapter>
    </ScrollStory>
  );
}