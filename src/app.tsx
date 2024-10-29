import { useEffect, useState, useRef } from "react";

const App = () => {
  /**
   * States to set the positions of relative elements
   * */
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [divPos, setDivPos] = useState<{
    left: number;
    width: number;
    height: number;
  }>({
    left: 0,
    width: 0,
    height: 0,
  });
  const [verticalLineX, setVerticalLineX] = useState<number | null>(null);
  const [clipPath, setClipPath] = useState<string | undefined>(undefined);

  // handles the tooltip visiblity
  const [hovered, setHovered] = useState<boolean>(false);

  /**
   * Refs to grab the positions of relative elements
   * */
  const trackerRef = useRef<HTMLDivElement | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);
  const verticalLineRef = useRef<HTMLDivElement | null>(null);

  const handleMouse = (e: MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    if (divRef.current && trackerRef.current) {
      const { left, width, height } = divRef.current.getBoundingClientRect();
      setDivPos({
        left,
        width,
        height,
      });
    }
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  useEffect(() => {
    if (trackerRef.current && divRef.current && verticalLineRef.current) {
      const dotX = trackerRef.current.getBoundingClientRect().x;
      const parentX = divRef.current.getBoundingClientRect().x;
      const parentWidth = divRef.current.getBoundingClientRect().width;
      const dotWidth = trackerRef.current.getBoundingClientRect().width;
      const lineWidth = verticalLineRef.current.getBoundingClientRect().width;

      const verticalLinePos = dotX - parentX + dotWidth / 2 - lineWidth / 2;
      setVerticalLineX(verticalLinePos);
      setClipPath(
        `inset(0 ${parentWidth - verticalLinePos - lineWidth * 15}px 0 0)`,
      );
    } else {
      console.warn("refs not loaded.");
    }
  }, [pos]);

  const pathDefinition: string =
    "M1 118L4.02397 114.173C5.56703 112.22 8.52887 112.22 10.0719 114.173V114.173C11.615 116.126 14.5768 116.126 16.1199 114.173L46.1788 76.1311C50.1826 71.0641 57.8675 71.0641 61.8713 76.1311L87.108 108.07C91.1117 113.137 98.7967 113.137 102.8 108.07L130.147 73.4611C134.151 68.3941 141.836 68.3941 145.839 73.4611L146.04 73.7155C150.044 78.7825 157.729 78.7825 161.733 73.7155L202.34 22.3234C206.18 17.464 213.55 17.464 217.39 22.3234V22.3234C221.23 27.1829 228.6 27.1829 232.44 22.3234L246.183 4.92997C250.187 -0.137043 257.872 -0.137043 261.876 4.92997L265 8.88423";

  return (
    <main className="flex items-center justify-center h-svh w-full">
      <div
        ref={divRef}
        className="cursor-none"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* the vertical line */}
        <div
          ref={verticalLineRef}
          data-vertical-indicator
          className="flex items-start justify-center"
          style={{
            position: "absolute",
            width: 2,
            height: divPos.height,
            backgroundColor: "#e0e0e0",
            transform: `translateX(${verticalLineX}px)`,
          }}
        >
          <div
            className="relative px-2 py-1 rounded-md"
            style={{
              backgroundColor: "#e0e0e0",
              width: "fit-content",
              transform: `translateY(${divPos.height}px)`,
            }}
          >
            {hovered && (
              <p className="text-sm font-mono text-[#757575] tracking-wide">
                {pos.x}
              </p>
            )}
          </div>
        </div>

        {/* the dot */}
        <div
          ref={trackerRef}
          data-dot-indicator
          style={{
            position: "absolute",
            offsetPath: `path("${pathDefinition}")`,
            offsetDistance: ((pos.x - divPos.left) / divPos.width) * 100 + "%",
            width: 20,
            height: 20,
            borderRadius: "50%",
            border: 2,
            borderStyle: "solid",
            borderColor: "#bdbdbd",
            backgroundColor: "#212121",
          }}
        />

        {/* the graph */}
        <svg>
          <path
            strokeWidth={2}
            strokeLinecap="round"
            fill="none"
            d={pathDefinition}
            stroke="#bdbdbd"
          />

          <path
            strokeWidth={2}
            strokeLinecap="round"
            fill="none"
            d={pathDefinition}
            style={{ clipPath }}
            stroke="#1E90FF"
          />
        </svg>
      </div>
    </main>
  );
};

export default App;
