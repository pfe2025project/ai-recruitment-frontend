import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

// تسجيل العناصر المطلوبة
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const DashboardLayout = () => {
  // بيانات مخطط Application Progression (دائري)
  const applicationProgressData = {
    labels: ['Applied', 'Round1 Shortlisted', 'Round2 Shortlisted'],
    datasets: [
      {
        data: [400, 150, 50],
        backgroundColor: ['#6377F2', '#A9B5F4', '#D6DCFA'],
        borderWidth: 0,
      },
    ],
  };

  // بيانات مخطط Source of Hire (شريطي أفقي)
  const sourceOfHireData = {
    labels: ['Company Website', 'Job Boards', 'Social Media', 'Career Fair', 'Referrals'],
    datasets: [
      {
        label: 'Number of Candidates',
        data: [100, 50, 80, 100, 70],
        backgroundColor: ['#6377F2', '#A9B5F4', '#D6DCFA', '#80D0C7', '#F7C59F'],
        borderRadius: 8,
      },
    ],
  };

  const sourceOfHireOptions = {
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
        max: 400,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Application Progression</h2>
        <div style={{ maxWidth: '300px' }}>
          <Doughnut data={applicationProgressData} />
        </div>
      </div>

      <div>
        <h2 style={{ marginBottom: '1rem' }}>Source of Hire</h2>
        <div style={{ maxWidth: '600px' }}>
          <Bar data={sourceOfHireData} options={sourceOfHireOptions} />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
