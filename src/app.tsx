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
    if (hovered) {
      window.addEventListener("mousemove", handleMouse);
    }
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [hovered]);

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
        `inset(0 ${parentWidth - verticalLinePos - lineWidth * -1}px 0 0)`,
      );
    } else {
      console.warn("refs not loaded.");
    }
  }, [pos]);

  const pathDefinition: string =
    "M1 135L7.14477 124.536C8.69073 121.903 12.4974 121.903 14.0433 124.536L16.7388 129.126C18.2848 131.759 22.0914 131.759 23.6374 129.126L45.6922 91.5674C47.2382 88.9347 51.0448 88.9347 52.5908 91.5674L72.9325 126.208C74.4784 128.841 78.2851 128.841 79.831 126.208L135.122 32.0495C136.668 29.4167 140.475 29.4167 142.021 32.0495L179.838 96.4495C181.383 99.0822 185.19 99.0822 186.736 96.4495L241.685 2.87398C243.231 0.241262 247.037 0.24126 248.583 2.87398L318.266 121.54C319.812 124.173 323.618 124.173 325.164 121.54L339.681 96.819C341.227 94.1863 345.034 94.1863 346.58 96.819L369 135";

  const gradientDefinition: string =
    "M7.14477 124.536L4.53823 128.975C2.97239 131.641 4.89521 135 7.98752 135H362.013C365.105 135 367.028 131.641 365.462 128.975L346.58 96.819C345.034 94.1863 341.227 94.1863 339.681 96.819L325.164 121.54C323.618 124.173 319.812 124.173 318.266 121.54L248.583 2.87398C247.037 0.24126 243.231 0.241262 241.685 2.87398L186.736 96.4495C185.19 99.0822 181.383 99.0822 179.838 96.4495L142.021 32.0495C140.475 29.4167 136.668 29.4167 135.122 32.0495L79.831 126.208C78.2851 128.841 74.4784 128.841 72.9325 126.208L52.5908 91.5674C51.0448 88.9347 47.2382 88.9347 45.6922 91.5674L23.6374 129.126C22.0914 131.759 18.2848 131.759 16.7388 129.126L14.0433 124.536C12.4974 121.903 8.69073 121.903 7.14477 124.536Z";

  return (
    <main className="flex bg-[#212121] items-center justify-center h-svh w-full">
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
            borderRadius: "2px",
            height: divPos.height,
            opacity: "20%",
            backgroundColor: "#e0e0e0",
            transform: `translateX(${verticalLineX}px)`,
          }}
        />

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
            border: 3,
            borderStyle: "solid",
            borderColor: "#fafafa",
            backgroundColor: "#1E90FF",
          }}
        />

        {/* the graph */}
        <svg width="364" height="135" viewBox="0 0 364 135">
          <defs>
            <linearGradient
              id="grayscale"
              x1="185"
              y1="-3"
              x2="185"
              y2="135"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#BDBDBD" />
              <stop offset="1" stopColor="#212121" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="color"
              x1="185"
              y1="-3"
              x2="185"
              y2="135"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#1E90FF" />
              <stop offset="1" stopColor="#1E90FF" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={gradientDefinition} fill="url(#grayscale)" />
          <path
            d={gradientDefinition}
            fill="url(#color)"
            style={{ clipPath }}
          />
          <g strokeWidth={2} strokeLinecap="round">
            <path
              fill="none"
              d={pathDefinition}
              stroke="#bdbdbd"
              opacity="20%"
            />

            <path
              fill="none"
              d={pathDefinition}
              style={{ clipPath }}
              stroke="#1E90FF"
            />
          </g>
        </svg>
      </div>
    </main>
  );
};

export default App;
