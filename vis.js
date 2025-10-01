/** SVG helpers */
function el(name, attrs = {}, children = []) {
  const n = document.createElementNS('http://www.w3.org/2000/svg', name);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v));
  children.forEach((c) => n.appendChild(c));
  return n;
}
function mount(selector, width = 700, height = 360) {
  const host = document.querySelector(selector);
  const svg = el('svg', { viewBox: `0 0 ${width} ${height}`, role: 'img' });
  if (host) host.innerHTML = '', host.appendChild(svg);
  return svg;
}

/** 1) SVG Bar Chart */
(function barChart() {
  const svg = mount('#chart', 720, 380);
  if (!svg) return;

  // Create a new chart
  const margin = { top: 40, right: 24, bottom: 50, left: 60 };
  const W = 720, H = 380;
  const w = W - margin.left - margin.right;
  const h = H - margin.top - margin.bottom;

  const g = el('g', { transform: `translate(${margin.left},${margin.top})` });
  svg.appendChild(g);

  // Sample data: skill levels (0–100)
  const data = [
    { skill: 'Blue', value: 85 },
    { skill: 'Green', value: 78 },
    { skill: 'Red', value: 72 },
    { skill: 'Yellow', value: 68 },
    { skill: 'Purple', value: 82 }
  ];

  const xStep = w / data.length;
  const yMax = 100;

  // Axes
  const axis = el('g');
  // y ticks
  for (let t = 0; t <= yMax; t += 20) {
    const y = h - (t / yMax) * h;
    axis.appendChild(el('line', { x1: 0, y1: y, x2: w, y2: y, stroke: '#e5e7eb' }));
    axis.appendChild(el('text', { x: -10, y: y + 4, 'text-anchor': 'end', 'font-size': 12, fill: 'currentColor' }, [document.createTextNode(String(t))]));
  }
  g.appendChild(axis);

  // Draw bars
  data.forEach((d, i) => {
    const barW = Math.min(56, xStep * 0.6);
    const x = i * xStep + (xStep - barW) / 2;
    const barH = (d.value / yMax) * h;
    const y = h - barH;

    const rect = el('rect', {
      x, y, width: barW, height: barH,
      rx: 8, ry: 8,
      fill: 'currentColor',
      opacity: 0.9
    });
    // Tooltip title
    rect.appendChild(el('title', {}, [document.createTextNode(`${d.skill}: ${d.value}`)]));

    // Label
    const label = el('text', {
      x: x + barW / 2, y: h + 20,
      'text-anchor': 'middle', 'font-size': 12, fill: 'currentColor'
    }, [document.createTextNode(d.skill)]);

    // Value on top
    const value = el('text', {
      x: x + barW / 2, y: y - 6,
      'text-anchor': 'middle', 'font-size': 12, fill: 'currentColor'
    }, [document.createTextNode(String(d.value))]);

    g.appendChild(rect);
    g.appendChild(label);
    g.appendChild(value);
  });

  // Title
  g.appendChild(el('text', { x: 0, y: -12, 'font-size': 16, 'font-weight': 700, fill: 'currentColor' }, [document.createTextNode('Favorite Color Among 20 Year Olds (%)')]));
})();

/** 2) Creative SVG Art (Random Circle Grid) */
(function art() {
  const svg = mount('#art', 720, 360);
  if (!svg) return;

  const rows = 6;   // rows of circles
  const cols = 12;  // how many columns
  const cellW = 720 / cols;
  const cellH = 360 / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = c * cellW + cellW / 2;
      const cy = r * cellH + cellH / 2;

      // random radius and color
      const radius = 5 + Math.random() * 20;
      const hue = Math.floor(Math.random() * 360);

      const circle = el('circle', {
        cx,
        cy,
        r: radius,
        fill: `hsl(${hue}, 70%, 60%)`,
        opacity: 0.8
      });

      svg.appendChild(circle);
    }
  }
})();
