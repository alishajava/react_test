import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineElement,
  LineController,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

const LEGEND_ITEMS = [
  { label: '매출', type: 'box', color: 'rgba(75, 132, 235, 0.6)' },
  { label: '합계', type: 'line', color: 'rgba(235, 94, 40, 1)', dash: [] },
  { label: '목표치', type: 'line', color: 'rgba(60, 60, 60, 0.8)', dash: [3, 2] },
];

// chart.js's built-in legend has no way to draw a dashed line swatch
// (pointStyle: 'line' always renders solid), so this plugin draws the
// legend row itself in the space reserved by the title's padding.bottom.
const customLegendPlugin = {
  id: 'customLegend',
  afterDraw(chart) {
    const { ctx, chartArea } = chart;
    const iconWidth = 20;
    const iconTextGap = 6;
    const gap = 20;
    const y = chartArea.top - 12;

    ctx.save();
    ctx.font = '12px sans-serif';
    ctx.textBaseline = 'middle';

    const widths = LEGEND_ITEMS.map(
      (item) => iconWidth + iconTextGap + ctx.measureText(item.label).width
    );
    const totalWidth = widths.reduce((a, b) => a + b, 0) + gap * (LEGEND_ITEMS.length - 1);
    let x = chartArea.left + (chartArea.right - chartArea.left - totalWidth) / 2;

    LEGEND_ITEMS.forEach((item, i) => {
      if (item.type === 'box') {
        ctx.fillStyle = item.color;
        ctx.fillRect(x, y - 6, iconWidth, 12);
      } else {
        ctx.strokeStyle = item.color;
        ctx.lineWidth = 2;
        ctx.setLineDash(item.dash);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + iconWidth, y);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      ctx.fillStyle = '#333';
      ctx.fillText(item.label, x + iconWidth + iconTextGap, y);
      x += widths[i] + gap;
    });

    ctx.restore();
  },
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineElement,
  LineController,
  PointElement,
  Title,
  Tooltip,
  customLegendPlugin
);

const monthlySales = [12, 19, 8, 15, 22, 17];
const cumulativeTotal = monthlySales.reduce((acc, value) => {
  const prev = acc.length ? acc[acc.length - 1] : 0;
  acc.push(prev + value);
  return acc;
}, []);
const target = 18;

const data = {
  labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
  datasets: [
    {
      type: 'bar',
      label: '매출',
      data: monthlySales,
      backgroundColor: 'rgba(75, 132, 235, 0.6)',
      yAxisID: 'y',
      order: 2,
    },
    {
      type: 'line',
      label: '합계',
      data: cumulativeTotal,
      borderColor: 'rgba(235, 94, 40, 1)',
      backgroundColor: 'rgba(235, 94, 40, 1)',
      borderDash: [],
      tension: 0.2,
      yAxisID: 'y1',
      order: 0,
    },
    {
      type: 'line',
      label: '목표치',
      data: monthlySales.map(() => target),
      borderColor: 'rgba(60, 60, 60, 0.8)',
      backgroundColor: 'rgba(60, 60, 60, 0.8)',
      borderDash: [6, 4],
      pointRadius: 0,
      yAxisID: 'y',
      order: 1,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: true, text: '월별 매출', padding: { top: 6, bottom: 26 } },
  },
  scales: {
    y: {
      type: 'linear',
      position: 'left',
      title: { display: true, text: '월별 매출' },
    },
    y1: {
      type: 'linear',
      position: 'right',
      title: { display: true, text: '누적 합계' },
      grid: { drawOnChartArea: false },
    },
  },
};

function SampleChart() {
  return <Chart type="bar" data={data} options={options} />;
}

export default SampleChart;
