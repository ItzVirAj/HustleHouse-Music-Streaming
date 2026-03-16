const palette = [
  ["#ff7a2f", "#ffb35c"],
  ["#64d2c1", "#1d8f84"],
  ["#7aa6ff", "#4653ff"],
  ["#f36e9f", "#9d3d68"],
  ["#ffd166", "#f28705"],
];

const escapeText = (value) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const getUserAvatar = (name = "User") => {
  const trimmedName = name.trim();
  const letter = (trimmedName.charAt(0) || "U").toUpperCase();
  const colorIndex = letter.charCodeAt(0) % palette.length;
  const [start, end] = palette[colorIndex];
  const safeLetter = escapeText(letter);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" role="img" aria-label="${safeLetter}">
      <defs>
        <linearGradient id="avatar-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${start}" />
          <stop offset="100%" stop-color="${end}" />
        </linearGradient>
      </defs>
      <rect width="160" height="160" rx="80" fill="url(#avatar-bg)" />
      <text
        x="50%"
        y="50%"
        dominant-baseline="middle"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="68"
        font-weight="700"
        fill="#fff8ef"
      >
        ${safeLetter}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};
