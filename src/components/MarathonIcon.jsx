// SVG recreation of the Marathon circle/runner icon
// Replace the src prop with your PNG path once assets are in /public
export default function MarathonIcon({ size = 40, color = '#c8ff00' }) {
  // NOTE: To use the official PNG instead, place Marathon_Logo_WordMark_Green_ALT.png
  // in /public and swap this component for:
  // <img src="/marathon-icon.png" width={size} height={size} alt="Marathon" />
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Marathon icon"
    >
      {/* Outer ring with gap at bottom — approximating the official mark */}
      <path
        d="M50 8
           A42 42 0 1 1 28 87"
        stroke={color}
        strokeWidth="14"
        strokeLinecap="square"
        fill="none"
      />
      <path
        d="M72 87
           A42 42 0 0 1 71 88"
        stroke={color}
        strokeWidth="14"
        strokeLinecap="square"
        fill="none"
      />
      {/* Inner circle / head */}
      <circle cx="50" cy="34" r="10" fill={color} />
      {/* Stem drop to gap */}
      <line x1="50" y1="44" x2="50" y2="68" stroke={color} strokeWidth="10" strokeLinecap="square" />
    </svg>
  )
}
