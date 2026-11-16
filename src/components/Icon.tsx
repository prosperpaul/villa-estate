// A tiny inline icon set, drawn as 24x24 line icons.
// Usage: <Icon name="pin" className="h-4 w-4 text-brand" />
// Each icon is just SVG path data, so there's no icon font to download.

const paths = {
  pin: "M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  shield: "M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6L12 3Z",
  verified: "M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6L12 3Zm-3.5 9 2.5 2.5 4.5-5",
  check: "m5 12.5 4.5 4.5L19 7.5",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm10 3-5-5",
  arrow: "M5 12h14m-6-6 6 6-6 6",
  heart: "M19 14l-7 7-7-7a4.5 4.5 0 1 1 7-5.5 4.5 4.5 0 1 1 7 5.5Z",
  chat: "M4 19.5 5.3 16A8 8 0 1 1 8 18.7L4 19.5Z",
  phone: "M5 4h3.5l1.5 4-2 1.5a11 11 0 0 0 6.5 6.5l1.5-2 4 1.5V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z",
  home: "M3.5 11 12 4l8.5 7M5.5 9.5V20h13V9.5M10 20v-5h4v5",
  bed: "M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7M3 14h18M7 9V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2",
  doc: "M7 3h7l5 5v13H7V3Zm7 0v5h5M10 13h6M10 17h6",
  share: "M8.6 13.5l6.8 4M15.4 6.5l-6.8 4M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm12 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  photos: "M4 5h16v14H4V5Zm0 10 4.5-4.5L13 15l2.5-2.5L20 17M15.5 9.5h.01",
  video: "M3 6h12v12H3V6Zm12 4.5 6-3.5v10l-6-3.5",
  calendar: "M4 6h16v15H4V6Zm0 4h16M8 3v4M16 3v4",
  mail: "M3 5h18v14H3V5Zm0 0 9 7 9-7",
  compass: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm3.5-12.5-2 5-5 2 2-5 5-2Z",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0",
  more: "M12 5.5h.01M12 12h.01M12 18.5h.01",
  menu: "M4 8h16M4 16h16",
  close: "M6 6l12 12M6 18 18 6",
} as const;

export type IconName = keyof typeof paths;

export default function Icon({
  name,
  className = "h-4 w-4",
  filled = false,
  strokeWidth = 1.6,
}: {
  name: IconName;
  className?: string;
  filled?: boolean;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={paths[name]} />
    </svg>
  );
}
