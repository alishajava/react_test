import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
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
    legend: { position: 'top' },
    title: { display: true, text: '월별 매출' },
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
