import { ReactNode } from "react";
import { Tooltip } from "react-leaflet";

interface BearingIndicatorProps {
  direction?: string | null;
  children: ReactNode;
  arrowColor?: string;
  strokeWidth?: number;
}

const bearingAngles: Record<string, number> = {
  N: 0,
  NE: 45,
  E: 90,
  SE: 135,
  S: 180,
  SW: 225,
  W: 270,
  NW: 315,
};

export function BearingIndicator({ direction, children, arrowColor = "#555", strokeWidth = 3 }: BearingIndicatorProps) {
  const angle = bearingAngles[direction?.toUpperCase() ?? ""];

  if (angle === undefined) {
    return <>{children}</>;
  }

  const ringSize = 48;
  const cx = ringSize / 2;
  const cy = ringSize / 2;
  const r = 18; // distance from center to arrow

  return (
    <>
      <Tooltip
        permanent
        direction="center"
        className="bearing-arrow"
        offset={[0, -14]} // adjust to center on the busStop icon (which is 28x28 and anchored at [14, 28])
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={ringSize}
          height={ringSize}
          viewBox={`0 0 ${ringSize} ${ringSize}`}
          style={{ pointerEvents: "none" }}
        >
          <g transform={`translate(${cx} ${cy}) rotate(${angle}) translate(0 ${-r})`}>
            <path
              d="M 0 4 L 0 -4 M -3 -1 L 0 -4 L 3 -1"
              stroke={arrowColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </g>
        </svg>
      </Tooltip>
      {children}
    </>
  );
}
