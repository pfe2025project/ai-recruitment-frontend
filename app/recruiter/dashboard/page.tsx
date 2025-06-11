'use client';

import { AiOutlineLike } from "react-icons/ai";
import { FaShareAlt } from "react-icons/fa";
import { FcRating } from "react-icons/fc";
import { FiDollarSign } from "react-icons/fi";


import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';



ChartJS.register(ArcElement, Tooltip, Legend);


ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);



import { LuUsersRound } from "react-icons/lu";
import { TbUsersPlus } from "react-icons/tb";
import { PiBriefcaseLight, PiMoneyLight } from "react-icons/pi";
import ChartsDashboard from "./chartjs";
import DashboardLayout from "./SidBar";
import Topbar from "./navbar";
import { useEffect, useState } from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default  function Home() {
  const [dataa , setDataa] =useState({});

 async function getData(){
 const res = await fetch(`http://127.0.0.1:5000/api/dashboard/summary`);
 const data = await res.json();
 setDataa(data);



return data ;
 
 


  }




useEffect(()=>{
   getData();
},[])



 console.log(dataa);

 
  





  const data = {
    labels: [
      'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
      'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
    ],
    datasets: [
      {
        label: 'Applications',
        data: [30, 25, 35, 40, 45, 50, 42, 38, 33, 29, 44, 50],
        backgroundColor: '#3B82F6', // blue-500
        borderRadius: 5,
      },
      {
        label: 'Hired',
        data: [20, 18, 22, 25, 28, 30, 24, 22, 19, 17, 26, 23],
        backgroundColor: '#D1D5DB', // gray-300
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Job Applied vs Hired' },
    },
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true },
    },
  };

  const barData = {
    labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
    datasets: [
      {
        label: 'Applications',
        data: [30, 25, 35, 40, 45, 50, 42, 38, 33, 29, 44, 50],
        backgroundColor: '#3B82F6',
        borderRadius: 5,
      },
      {
        label: 'Hired',
        data: [20, 18, 22, 25, 28, 30, 24, 22, 19, 17, 26, 23],
        backgroundColor: '#D1D5DB',
        borderRadius: 5,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Job Applied vs Hired' },
    },
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true },
    },
  };

  // Offer Letter Acceptance Doughnut
  const offerAcceptanceData = {
    labels: ['Accepted', 'Pending'],
    datasets: [
      {
        data: [75, 15],
        backgroundColor: ['#06b6d4', '#3b82f6'],
        hoverOffset: 4,
      },
    ],
  };

  const offerOptions = {
    cutout: '70%',
    plugins: {
      legend: { display: false },
    },
  };

  const inclusionData = {
    labels: ['Applied', 'Interview', 'Hired'],
    datasets: [
      {
        data: [40, 30, 20],
        backgroundColor: ['#93c5fd', '#a5f3fc', '#38bdf8'],
        borderWidth: 10,
        borderColor: '#fff', // يعطي فصل بين الأجزاء
        hoverOffset: 4,
      },
    ],
  };

  const inclusionOptions = {
    cutout: '70%',
    rotation: -90, // يبدأ من الأعلى
    circumference: 270, // شكل غير كامل
    plugins: {
      legend: { position: 'bottom' },
    },
  };


  const acceptedData = {
    labels: ["Accepted", "Pending"],
    datasets: [
      {
        data: [75, 25],
        backgroundColor: ["#34d399", "#e5e7eb"], // أخضر + رمادي
        borderWidth: 0,
      },
    ],
  };

  const pendingData = {
    labels: ["Pending", "Others"],
    datasets: [
      {
        data: [15, 85],
        backgroundColor: ["#3b82f6", "#e5e7eb"], // أزرق + رمادي
        borderWidth: 0,
      },
    ],
  };

  const lgbtqData = {
    labels: ["Applied", "Interview", "Hired"],
    datasets: [
      {
        data: [30, 20, 10],
        backgroundColor: ["#93c5fd", "#a5f3fc", "#38bdf8"],
        borderWidth: 6,
        borderColor: "#fff",
      },
    ],
  };




  return (
    <div className="bg-gray-100 min-h-screen ">

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-1 h-screen bg-gray-200 p-4">
          <DashboardLayout />

        </div>
        <div className="col-span-11 bg-blue-100 p-4">
          <Topbar />

         <div className="flex mb-4 justify-between items-center">

  <div>
    <h1 className="text-xl font-bold text-gray-500">Recruiters Dashboard</h1>
  </div>
  
  <div className="flex items-center gap-4">
 
  

    <select className="border border-1 border-gray-500 rounded-lg" name="" id="">
      <option value="">01Jan2022 - 31Dec2022</option>
      <option value="">01Feb2022 - 28Dec2022</option>
      <option value="">01Mar2022 - 30Dec2022</option>
      <option value="">01Apr2022 - 31Dec2022</option>
      <option value="">01May2022 - 30Dec2022</option>
      <option value="">01Jun2022 - 31Dec2022</option>
      <option value="">01Jul2022 - 31Dec2022</option>
      <option value="">01Aug2022 - 31Dec2022</option>
      <option value="">01Sep2022 - 30Dec2022</option>
      <option value="">01Oct2022 - 31Dec2022</option>
      <option value="">01Nov2022 - 30Dec2022</option>
      <option value="">01Dec2022 - 31Dec2022</option>
 
    </select>

    <label className="flex items-center gap-2 cursor-pointer bg-indigo-500 hover:bg-blue-700 text-white px-4 py-1 rounded-lg transition">
    
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
      <span> Export</span>
      <input type="file" className="hidden" />
    </label>
  </div>
</div>


          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Applied Candidates */}
            <div className=" gap-4 bg-white rounded-xl px-6 py-4 shadow border  border-gray-200">
              <div className=" rounded-full p-3 p-3 flex justify-between ">
                <LuUsersRound className="text-indigo-500" size={24} />
                <div className="text-xl font-bold text-indigo-500">{dataa?.appliedCandidates}</div>
              </div>
              <div>

                <div className="text-sm text-gray-500">Applied Candidates</div>
              </div>
            </div>

            {/* Hired Candidates */}
            <div className=" gap-4 bg-white rounded-xl px-6 py-4 shadow border border-gray-200">
              <div className=" rounded-full p-3  flex justify-between">
                <TbUsersPlus className="text-green-600" size={24} />
                <div className="text-xl font-bold text-green-600">{dataa?.hiredCandidates}</div>
              </div>
              <div>

                <div className="text-sm text-gray-500">Hired Candidates</div>
              </div>
            </div>

            {/* Open Positions */}
            <div className=" gap-4 bg-white rounded-xl px-6 py-4 shadow border border-gray-200">
              <div className=" rounded-full p-3  flex justify-between">
                <PiBriefcaseLight className="text-cyan-500" size={24} />
                <div className="text-xl font-bold text-cyan-500">{dataa?.openPositions}</div>

              </div>
              <div>
                <div className="text-sm text-gray-500">Open Positions</div>

              </div>
            </div>

            {/* Avg Cost Per Hire */}
            <div className=" gap-4 bg-white rounded-xl px-6 py-4 shadow border border-gray-200">
              <div className=" flex justify-between rounded-full p-3">
                <PiMoneyLight className="text-yellow-500" size={24} />
                <div className="text-xl font-bold text-yellow-500">${dataa?.avgCostPerHire}</div>
              </div>
              <div>

                <div className="text-sm text-gray-500">Avg Cost Per Hire</div>
              </div>
            </div>
          </div>


          <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 bg-white p-6 rounded-xl shadow-md">
              <Bar data={data} options={options} />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {/* Offer Letter Acceptance */}
                <div className="bg-white p-4 rounded-xl shadow text-center">
                  <h4 className="text-gray-500 mb-2">Offer letter Acceptance</h4>
                  <Doughnut data={acceptedData} />
                  <div className="mt-2 text-lg text-green-500 font-bold">75% Accepted</div>
                </div>

                {/* Pending */}
                <div className="bg-white p-4 rounded-xl shadow text-center">
                  <h4 className="text-gray-500 mb-2">Pending</h4>
                  <Doughnut data={pendingData} />
                  <div className="mt-2 text-lg text-blue-500 font-bold">15% Pending</div>
                </div>

                {/* LGBTQIA+ Inclusion */}
                <div className="bg-white p-4 rounded-xl shadow text-center">
                  <h4 className="text-gray-500 mb-2">LGBTQIA+ Inclusion</h4>
                  <Doughnut data={lgbtqData} options={{ cutout: "70%" }} />
                </div>
              </div>

            </div>
            <div className="md:col-span-4 max-w-xl mx-auto bg-white rounded-lg shadow p-6 space-y-6 ">
              <ChartsDashboard />
            </div>
          </div>
        </div>

       
      </div>




    </div>
  );
}
