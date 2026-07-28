// Generates a topographic contour-line field: concentric, irregular rings
// echoing "hill" (elevation) + "27" (the number of rings/markers), used as
// the site's signature background graphic behind the hero.
function buildContours(container, opts = {}) {
  const w = 1400, h = 700;
  const cx = opts.cx ?? w * 0.72;
  const cy = opts.cy ?? h * 0.5;
  const rings = opts.rings ?? 11;
  const seed = opts.seed ?? 7;

  function rand(i) {
    const x = Math.sin(i * 999.53 + seed * 12.9) * 43758.5453;
    return x - Math.floor(x);
  }

  let svg = `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">`;

  for (let r = 1; r <= rings; r++) {
    const baseR = r * 34;
    const points = [];
    const N = 60;
    for (let i = 0; i <= N; i++) {
      const a = (i / N) * Math.PI * 2;
      const wobble =
        Math.sin(a * 3 + r * 0.7 + seed) * (6 + r * 1.4) +
        Math.sin(a * 7 - r) * (3 + rand(r) * 4);
      const rr = baseR + wobble;
      points.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.72]);
    }
    let d = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)} `;
    for (let i = 1; i < points.length; i++) {
      d += `L ${points[i][0].toFixed(1)} ${points[i][1].toFixed(1)} `;
    }
    d += "Z";
    const opacity = 0.35 + (r / rings) * 0.4;
    svg += `<path d="${d}" style="opacity:${opacity.toFixed(2)}"/>`;
  }

  svg += `</svg>`;
  container.innerHTML = svg;
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".contours").forEach((el, idx) => {
    buildContours(el, { seed: 7 + idx * 3 });
  });
});
