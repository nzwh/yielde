"use client";

import React from "react";
import type { Prize } from "./prizes";

interface WheelGeometryProps {
  prizes: Prize[];
  size: number;
  innerRef: React.RefObject<HTMLDivElement | null>;
  onClick?: () => void;
  isInteractive: boolean;
}

function round(n: number) {
  return Math.round(n * 1000) / 1000;
}

function polarToCartesian(angleInDegrees: number, r: number, center: number) {
  const rad = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: round(center + r * Math.cos(rad)),
    y: round(center + r * Math.sin(rad)),
  };
}

function buildWedgePath(
  startAngle: number,
  endAngle: number,
  center: number,
  radius: number,
) {
  const pStart = polarToCartesian(endAngle, radius, center);
  const pEnd = polarToCartesian(startAngle, radius, center);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${center} ${center} L ${pStart.x} ${pStart.y} A ${radius} ${radius} 0 ${largeArc} 0 ${pEnd.x} ${pEnd.y} Z`;
}

function buildLipStripPath(
  startAngle: number,
  endAngle: number,
  outerR: number,
  innerR: number,
  center: number,
) {
  const outerStart = polarToCartesian(endAngle, outerR, center);
  const outerEnd = polarToCartesian(startAngle, outerR, center);
  const innerStart = polarToCartesian(startAngle, innerR, center);
  const innerEnd = polarToCartesian(endAngle, innerR, center);

  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;

  return `
    M ${outerStart.x} ${outerStart.y}
    A ${outerR} ${outerR} 0 ${largeArc} 0 ${outerEnd.x} ${outerEnd.y}
    L ${innerStart.x} ${innerStart.y}
    A ${innerR} ${innerR} 0 ${largeArc} 1 ${innerEnd.x} ${innerEnd.y}
    Z
  `.trim();
}

function buildNotchPath(
  boundaryAngle: number,
  radius: number,
  center: number,
  notchDepth: number,
  notchWidth: number,
) {
  const innerPoint = polarToCartesian(
    boundaryAngle,
    radius - notchDepth,
    center,
  );
  const sideA = polarToCartesian(
    boundaryAngle - (notchWidth / radius) * (180 / Math.PI),
    radius,
    center,
  );
  const sideB = polarToCartesian(
    boundaryAngle + (notchWidth / radius) * (180 / Math.PI),
    radius,
    center,
  );
  return `M ${sideA.x} ${sideA.y} L ${innerPoint.x} ${innerPoint.y} L ${sideB.x} ${sideB.y} Z`;
}

interface SliceGeometry {
  prize: Prize;
  index: number;
  wedgePath: string;
  lipStripPath: string;
  rimPoint: { x: number; y: number };
  lipStart: { x: number; y: number };
  lipEnd: { x: number; y: number };
  rectPos: { x: number; y: number };
  rectSize: number;
  iconPos: { x: number; y: number };
  iconBoxSize: number;
  midAngle: number;
  boundaryAngle: number;
  boundaryPos: { x: number; y: number };
  notchPath: string;
}

function WheelGeometryImpl({
  prizes,
  size,
  innerRef,
  onClick,
  isInteractive,
}: WheelGeometryProps) {
  const count = prizes.length;

  const { center, radius, slices } = React.useMemo(() => {
    const sliceAngle = 360 / count;
    const center = size / 2;
    const radius = center - 8;

    const stripOuterR = radius - 1;
    const stripInnerR = radius * 0.92;
    const notchDepth = 20;
    const notchWidth = 16;

    const iconBoxSize = radius * 0.5;

    const slices: SliceGeometry[] = prizes.map((prize, index) => {
      const startAngle = index * sliceAngle;
      const endAngle = startAngle + sliceAngle;
      const midAngle = startAngle + sliceAngle / 2;
      const boundaryAngle = startAngle;

      return {
        prize,
        index,
        wedgePath: buildWedgePath(startAngle, endAngle, center, radius),
        lipStripPath: buildLipStripPath(
          startAngle,
          endAngle,
          stripOuterR,
          stripInnerR,
          center,
        ),
        rimPoint: polarToCartesian(midAngle, radius, center),
        lipStart: polarToCartesian(
          midAngle - sliceAngle * 0.42,
          radius * 0.78,
          center,
        ),
        lipEnd: polarToCartesian(
          midAngle + sliceAngle * 0.42,
          radius * 0.78,
          center,
        ),

        rectPos: polarToCartesian(midAngle, radius * 0.45, center),
        rectSize: radius * 0.45,
        iconPos: polarToCartesian(midAngle, radius * 0.4, center),
        iconBoxSize,

        midAngle,
        boundaryAngle,
        boundaryPos: polarToCartesian(boundaryAngle, radius * 0.98, center),
        notchPath: buildNotchPath(
          boundaryAngle,
          radius,
          center,
          notchDepth,
          notchWidth,
        ),
      };
    });

    return { center, radius, slices };
  }, [prizes, size, count]);

  return (
    <div
      ref={innerRef}
      onClick={isInteractive ? onClick : undefined}
      style={{ width: size, height: size }}
      className={`relative rounded-full will-change-transform select-none ${
        isInteractive
          ? "cursor-pointer transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
          : "cursor-not-allowed"
      }`}
    >
      <span className="sr-only">
        Prize wheel with {prizes.length} options:{" "}
        {prizes.map((p) => p.label).join(", ")}.
      </span>

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 rounded-full border border-[#D9D9D9] bg-[#f0f0f0] p-1 shadow-[0_0_30px_rgba(0,0,0,0.05),inset_0_0_0_4px_#fff]"
        style={{ shapeRendering: "geometricPrecision" }}
        aria-hidden="true"
      >
        {/* gradients */}
        <defs>
          {slices.map((s) => (
            <linearGradient
              key={s.prize.id}
              id={`gradient-${s.index}`}
              x1={center}
              y1={center}
              x2={s.rimPoint.x}
              y2={s.rimPoint.y}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={"#455EFF"} />
              <stop offset="100%" stopColor={"#001077"} />
            </linearGradient>
          ))}

          {slices.map((s) => (
            <clipPath
              key={`clip-${s.prize.id}`}
              id={`slice-clip-${s.prize.id}`}
            >
              <path d={s.wedgePath} />
            </clipPath>
          ))}
        </defs>

        {/* slice wedges */}
        {slices.map((s) => (
          <path
            key={s.prize.id}
            d={s.wedgePath}
            fill={`url(#gradient-${s.index})`}
            strokeLinejoin="round"
          />
        ))}

        {/* alternate overlays */}
        {slices.map((s) => {
          if (s.index % 2 === 0) return null;
          return (
            <path
              key={`overlay-${s.prize.id}`}
              d={s.wedgePath}
              fill="#8A9AFF"
              opacity="0.6"
              strokeLinejoin="round"
            />
          );
        })}

        {/* lip strip */}
        {slices.map((s) => (
          <path
            key={`lip-strip-${s.prize.id}`}
            d={s.lipStripPath}
            fill="#131D5D"
            opacity="0.5"
          />
        ))}

        {/* lip text  */}
        {slices.map((s) => {
          const pathId = `lip-${s.prize.id}`;
          return (
            <React.Fragment key={`lip-${s.prize.id}`}>
              <path
                id={pathId}
                d={`M ${s.lipStart.x} ${s.lipStart.y} A ${radius * 0.78} ${radius * 0.78} 0 0 1 ${s.lipEnd.x} ${s.lipEnd.y}`}
                fill="none"
              />
              <text
                fill="white"
                fontSize="14"
                fontWeight="500"
                textAnchor="middle"
                className="lowercase"
              >
                <textPath href={`#${pathId}`} startOffset="50%">
                  {s.prize.label.toUpperCase()}
                </textPath>
              </text>
            </React.Fragment>
          );
        })}

        {/* slice contents */}
        {slices.map((s) => {
          const Icon = s.prize.icon;
          return (
            <g
              key={`body-${s.prize.id}`}
              clipPath={`url(#slice-clip-${s.prize.id})`}
            >
              {/* rectangle */}
              <rect
                x={s.rectPos.x - s.rectSize / 2}
                y={s.rectPos.y - s.rectSize / 2}
                width={s.rectSize}
                height={s.rectSize}
                rx={s.rectSize * 0.1}
                transform={`rotate(${s.midAngle}, ${s.rectPos.x}, ${s.rectPos.y})`}
                fill="#909FF9"
                fillOpacity={0.2}
              />

              {/* react icon */}
              <foreignObject
                x={s.iconPos.x - s.iconBoxSize / 2}
                y={s.iconPos.y - s.iconBoxSize / 2}
                width={s.iconBoxSize}
                height={s.iconBoxSize}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: `rotate(${s.midAngle}deg) scale(1.2)`,
                    transformOrigin: "center",
                  }}
                  className="opacity-100 [&>svg]:text-[#C4CCFF]"
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </foreignObject>
            </g>
          );
        })}

        {/* slice boundary */}
        {slices.map((s) => (
          <path
            key={`border-${s.prize.id}`}
            d={s.wedgePath}
            fill="none"
            stroke="#f0f0f0"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        ))}

        {/* rim pins & notch triangles */}
        {slices.map((s) => (
          <React.Fragment key={`boundary-${s.prize.id}`}>
            <path d={s.notchPath} fill="#F1F5F9" />
            <circle
              cx={s.boundaryPos.x}
              cy={s.boundaryPos.y}
              r="4"
              fill="#f0f0f0"
              stroke="#485CE0"
              strokeWidth="4"
            />
            <circle cx={s.rimPoint.x} cy={s.rimPoint.y} r="6" fill="#f0f0f0" />
          </React.Fragment>
        ))}
      </svg>
    </div>
  );
}

export const WheelGeometry = React.memo(WheelGeometryImpl);
