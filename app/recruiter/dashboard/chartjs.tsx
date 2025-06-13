import React, { useEffect, useState } from 'react';
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


ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const DashboardLayout = () => {


  const [dataa , setDataa] =useState({});

 async function getData(){
 const res = await fetch(`http://localhost:5000/api/dashboard/application-progression`);
 const data = await res.json();
 setDataa(data);



return data ;
 
 


  }




useEffect(
  ()=>{
   getData();
},[])






  const applicationProgressData = {
    labels: ['Applied', 'Round1 Shortlisted', 'Round2 Shortlisted'],
    datasets: [
      {
        data: [dataa?.applied, dataa?.shortlisted_round1, dataa?.shortlisted_round2],
        backgroundColor: ['#6377F2', '#A9B5F4', '#D6DCFA'],
        borderWidth: 0,
      },
    ],
  };

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




      <div className="">
        {/* Header */}
        <h1 className="text-2xl font-bold">Source of Hire</h1>
        {/* Chart Bars */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center">
              <span className="inline-block h-4 w-4 rounded-full company-website mr-2" />
              Company Website
            </span>
            <span className="font-medium">100 (30%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full overflow-hidden">
            <div className="chart-bar company-website w-3/4" />
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="flex items-center">
              <span className="inline-block h-4 w-4 rounded-full job-boards mr-2" />
              Job Boards
            </span>
            <span className="font-medium">50 (5%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full overflow-hidden">
            <div className="chart-bar job-boards w-1/4" />
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="flex items-center">
              <span className="inline-block h-4 w-4 rounded-full social-media mr-2" />
              Social Media
            </span>
            <span className="font-medium">80 (20%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full overflow-hidden">
            <div className="chart-bar social-media w-2/5" />
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="flex items-center">
              <span className="inline-block h-4 w-4 rounded-full career-fair mr-2" />
              Career Fair
            </span>
            <span className="font-medium">100 (30%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full overflow-hidden">
            <div className="chart-bar career-fair w-3/4" />
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="flex items-center">
              <span className="inline-block h-4 w-4 rounded-full referrals mr-2" />
              Referrals
            </span>
            <span className="font-medium">70 (15%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full overflow-hidden">
            <div className="chart-bar referrals w-3/5" />
          </div>
        </div>
        {/* Total */}
        <div className="mt-6 text-right">
          <strong>Total:</strong> 400
        </div>
      </div>


    </div>


  );
};

export default DashboardLayout;
