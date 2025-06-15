/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// Icons
import { FaArrowLeft, FaCheck, FaSpinner } from 'react-icons/fa';
import { steps } from '@/lib/candidate/config/steps';
import { updateFullProfile } from '@/lib/api/profile';
import { useProfile } from '@/context/ProfileContext';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const ProfileEditPage: React.FC = () => {
  const router = useRouter();
  const [selectedStepId, setSelectedStepId] = useState<string>('cv-upload');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { profileData } = useProfile();

  const selectedStep = steps.find((step) => step.id === selectedStepId);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      const response = await updateFullProfile(profileData);
      
      if (response.success) {
        toast.success('Profile saved successfully!');
        setSaveSuccess(true);
        
        // Reset success state after 2 seconds
        setTimeout(() => setSaveSuccess(false), 2000);
      } else {
        toast.error('Failed to save profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('An error occurred while saving your profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-800 mr-6"
          >
            <FaArrowLeft className="mr-2" />
            Retour
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Éditer votre profil</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full md:w-1/4 bg-white p-6 shadow rounded-xl">
            <h3 className="text-lg font-bold mb-6">Sections</h3>
            <ul className="space-y-4">
              {steps.map((step) => (
                <motion.li
                  key={step.id}
                  onClick={() => setSelectedStepId(step.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`cursor-pointer p-2 rounded-lg flex items-center transition ${
                    selectedStepId === step.id
                      ? 'bg-blue-100 text-blue-600 font-medium'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {step.icon}
                  {step.name}
                </motion.li>
              ))}
            </ul>
          </aside>

          {/* Right content */}
          <main className="flex-1 bg-white p-6 shadow rounded-xl flex flex-col">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                {/* {selectedStep?.icon} */}
                {/* {selectedStep?.name} */}
              </h2>
              {selectedStep?.component}
            </div>

            <div className="mt-6 flex justify-end">
              <AnimatePresence mode="wait">
                {saveSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow flex items-center gap-2 transition-colors"
                      disabled
                    >
                      <FaCheck className="animate-bounce" />
                      Enregistré avec succès !
                    </button>
                  </motion.div>
                ) : isSaving ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <button
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow flex items-center gap-2 transition-colors"
                      disabled
                    >
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      >
                        <FaSpinner />
                      </motion.span>
                      Enregistrement...
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="normal"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.button
                      onClick={handleSave}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow flex items-center gap-2 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Enregistrer
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditPage;