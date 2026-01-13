import React from 'react';

// Radial Blob Component
const RadialBlob = ({
                        size = 'h-72 w-72',
                        position = '-top-20 -left-24',
                        color = '#f472b6',
                        opacity = '0.6',
                        blur = 'blur-3xl',
                        animation = 'animate-float-slow',
                        transparentAt = '60%',
                    }) => (
    <div
        className={`absolute ${position} ${size} ${blur} rounded-full ${animation}`}
        style={{
            background: `radial-gradient(50% 50% at 50% 50%, ${color} 0%, transparent ${transparentAt})`,
            opacity: parseFloat(opacity),
        }}
    />
);

// Conic Gradient Component
const ConicGradient = ({
                           size = 'h-80 w-80',
                           position = '-top-28 right-10',
                           fromDeg = '140deg',
                           colors = [
                               { color: '#a78bfa', stop: '10%' },
                               { stop: '40%', transparent: true },
                               { color: '#34d399', stop: '60%' },
                               { stop: '85%', transparent: true },
                           ],
                           opacity = '0.6',
                           blur = 'blur-2xl',
                           animation = 'animate-float-rev',
                       }) => (
    <div
        className={`absolute ${position} ${size} ${blur} rounded-full ${animation}`}
        style={{
            background: `conic-gradient(from ${fromDeg}, ${colors[0].color} ${colors[0].stop}, transparent ${colors[1].stop}, ${colors[2].color} ${colors[2].stop}, transparent ${colors[3].stop})`,
            opacity: parseFloat(opacity),
        }}
    />
);

const PillShape = ({
                       size = 'h-64 w-24',
                       position = 'left-16 top-10',
                       color = '#22d3ee',
                       opacity = '0.5',
                       blur = 'blur-2xl',
                       rotation = '18deg',
                       animation = 'animate-float-slow',
                       gradientSize = '60% 120%',
                       transparentAt = '70%',
                   }) => (
    <div
        className={`absolute ${position} ${size} ${blur} rounded-full ${animation}`}
        style={{
            background: `radial-gradient(${gradientSize} at 50% 50%, ${color} 0%, transparent ${transparentAt})`,
            transform: `rotate(${rotation})`,
            opacity: parseFloat(opacity),
        }}
    />
);

// Grid Overlay Component
const GridOverlay = ({
                         opacity = '0.3',
                         color = 'rgba(234,235,239,.25)',
                         size = '28px 28px',
                         blendMode = 'mix-blend-overlay',
                     }) => (
    <div
        className={`absolute inset-0 ${blendMode}`}
        style={{
            backgroundImage: `linear-gradient(to right, ${color} 1px, transparent 1px), linear-gradient(to bottom, ${color} 1px, transparent 1px)`,
            backgroundSize: size,
            opacity: parseFloat(opacity),
        }}
    />
);

// Highlight Ring Component
const HighlightRing = ({
                           size = 'h-[520px] w-[520px]',
                           opacity = '0.3',
                           blur = 'blur-3xl',
                           color = 'rgba(255,255,255,.15)',
                           gradientStop = '70%',
                       }) => (
    <div className="absolute inset-0 flex items-center justify-center">
        <div
            className={`${size} rounded-full ${blur}`}
            style={{
                background: `radial-gradient(closest-side, ${color}, transparent ${gradientStop})`,
                opacity: parseFloat(opacity),
            }}
        />
    </div>
);

// Bottom Horizon (transisi halus ke footer)
const BottomHorizon = ({
                           height = 'h-24',
                           opacity = '0.9',
                           from = 'rgba(255,255,255,0.22)',
                           to = 'rgba(255,255,255,0)',
                       }) => (
    <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] ${height}`}
        style={{
            background: `linear-gradient(to top, ${from} 0%, ${to} 100%)`,
            filter: 'blur(6px)',
            opacity: parseFloat(opacity),
        }}
    />
);

// Animation Styles Component
const AnimationStyles = () => (
    <style jsx>{`
    @keyframes float {
      0%, 100% { transform: translateY(0) translateX(0) }
      50%      { transform: translateY(-10px) translateX(6px) }
    }
    @keyframes float-slow {
      0%, 100% { transform: translateY(0) translateX(0) }
      50%      { transform: translateY(-8px) translateX(-6px) }
    }
    @keyframes float-rev {
      0%, 100% { transform: translateY(0) translateX(0) }
      50%      { transform: translateY(10px) translateX(-8px) }
    }
    .animate-float      { animation: float 9s ease-in-out infinite; }
    .animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
    .animate-float-rev  { animation: float-rev 10s ease-in-out infinite; }
  `}</style>
);

// Main FancyBg Component
export default function FancyBg() {
    return (
        <>
            {/* Wrapper: semua shape di bawah konten */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-3xl">
                {/* Blob Radial — kiri atas */}
                <RadialBlob
                    size="h-72 w-72"
                    position="-top-20 -left-24"
                    color="#f472b6"
                    opacity="0.6"
                    blur="blur-3xl"
                    animation="animate-float-slow"
                    transparentAt="60%"
                />

                {/* Blob Radial — kanan bawah */}
                <RadialBlob
                    size="h-96 w-96"
                    position="-bottom-24 -right-20"
                    color="#60a5fa"
                    opacity="0.6"
                    blur="blur-3xl"
                    animation="animate-float"
                    transparentAt="65%"
                />

                {/* Blob Radial — tengah bawah (fokus ke footer) */}
                <RadialBlob
                    size="h-80 w-80"
                    position="bottom-2 left-1/2 -translate-x-1/2"
                    color="#fcd34d"
                    opacity="0.45"
                    blur="blur-3xl"
                    animation="animate-float"
                    transparentAt="72%"
                />

                {/* Arc Conic — kanan atas */}
                <ConicGradient
                    size="h-80 w-80"
                    position="-top-28 right-10"
                    fromDeg="140deg"
                    colors={[
                        { color: '#a78bfa', stop: '10%' },
                        { stop: '40%', transparent: true },
                        { color: '#34d399', stop: '60%' },
                        { stop: '85%', transparent: true },
                    ]}
                    opacity="0.6"
                    blur="blur-2xl"
                    animation="animate-float-rev"
                />

                {/* Pill vertical — kiri tengah */}
                <PillShape
                    size="h-64 w-24"
                    position="left-16 top-10"
                    color="#22d3ee"
                    opacity="0.5"
                    blur="blur-2xl"
                    rotation="18deg"
                    animation="animate-float-slow"
                    gradientSize="60% 120%"
                    transparentAt="70%"
                />

                {/* Grid halus di atas semua blob */}
                <GridOverlay
                    opacity="0.3"
                    color="rgba(234,235,239,.25)"
                    size="28px 28px"
                    blendMode="mix-blend-overlay"
                />

                {/* Highlight ring di tengah (subtle) */}
                <HighlightRing
                    size="h-[520px] w-[520px]"
                    opacity="0.3"
                    blur="blur-3xl"
                    color="rgba(255,255,255,.15)"
                    gradientStop="70%"
                />

                {/* Horizon bawah untuk transisi ke footer */}
                <BottomHorizon height="h-24" opacity="0.9" from="rgba(255,255,255,0.22)" to="rgba(255,255,255,0)" />
            </div>

            {/* Animation Styles */}
            <AnimationStyles />
        </>
    );
}
