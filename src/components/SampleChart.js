import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const data = {
  labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
  datasets: [
    {
      label: '매출',
      data: [12, 19, 8, 15, 22, 17],
      backgroundColor: 'rgba(75, 132, 235, 0.6)',
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: '월별 매출' },
  },
};

function SampleChart() {
  return <Bar data={data} options={options} />;
}

export default SampleChart;
