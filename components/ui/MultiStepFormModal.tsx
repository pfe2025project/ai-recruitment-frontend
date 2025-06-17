/* eslint-disable react/no-unescaped-entities */
import React, { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import { FaTimes, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useProfile } from '@/context/ProfileContext';
import { updateFullProfile } from '@/lib/api/profile';
import { toast } from 'react-toastify';

interface Step {
  id: string;
  name: string;
  component: ReactNode;
  optional?: boolean;
  hasExistingInfo?: boolean;
  isCompleted?: boolean;
}

interface MultiStepFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  steps: Step[];
  onSave: () => void;
  initialStepIndex?: number;
}

const MultiStepFormModal: React.FC<MultiStepFormModalProps> = ({
  isOpen,
  onClose,
  steps,
  onSave,
  initialStepIndex = 0,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStepIndex);
  const [, setCompletedSteps] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { profileData } = useProfile();

  if (!isOpen) return null;

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleCloseAttempt = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowCloseConfirm(true);
    
  };

  const handleConfirmClose = async () => {
    setIsClosing(true);
    try {
      const response = await updateFullProfile(profileData);
      if (response.success) {
        toast.success('Progression sauvegardée');
        setIsSaving(false);
        setShowCloseConfirm(false);
        setIsClosing(false);
        onSave();
        onClose();
      } else {
        toast.error('Erreur lors de la sauvegarde');
        setIsClosing(false);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Une erreur est survenue');
      setIsClosing(false);
    }finally{
      setIsSaving(false)
    }
  };

  const handleContinueEditing = () => {
    setShowCloseConfirm(false);
  };

  const goToNextStep = () => {
    setCompletedSteps(prev => new Set(prev).add(currentStep.id));
    if (!isLastStep) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    if (currentStep.optional && !isLastStep) {
      goToNextStep();
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await updateFullProfile(profileData);
      if (response.success) {
        toast.success('Profile saved successfully!');
        setIsSaving(false);
        setShowCloseConfirm(false);
        setIsClosing(false);
        onSave();
        onClose();
      } else {
        toast.error('Failed to save profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('An error occurred while saving your profile');
    } finally {
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: '0%',
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

    
  const getStepIcon = (step: Step, index: number, isCurrent: boolean) => {
    // Vérifier si les données existent dans le contexte pour cette étape
    const hasData = () => {
      switch(step.id) {
        case 'basic-info':
          return !!profileData?.name || !!profileData?.contact?.phone;
        case 'about':
          return !!profileData?.about;
        case 'education':
          return profileData?.education?.length > 0;
        case 'experience':
          return profileData?.experiences?.length > 0;
        case 'skills':
          return (profileData?.skills?.extracted?.pySkills?.length > 0 || 
                  profileData?.skills?.added?.length > 0);
        case 'certifications':
          return profileData?.certifications?.length > 0;
        case 'job-preferences':
          return !!profileData?.jobPreferences?.jobType;
        case 'other-info':
          return profileData?.languages?.length > 0;
        case 'cv-upload':
          return !!profileData?.cvPdfUrl;
        default:
          return false;
      }
    };

    // Si l'étape est complétée OU qu'il y a des données pour cette étape
    if (  hasData()) {
      return (
        <FaCheckCircle 
          className="mr-3" 
          style={{ 
            color: "var(--success)",
            opacity: isCurrent ? 1 : 0.8 
          }} 
        />
      );
    }

    const baseClasses = "w-6 h-6 flex items-center justify-center rounded-full border-2 mr-3";
    if (isCurrent) {
      return (
        <span
          className={baseClasses}
          style={{
            borderColor: "var(--success)",
            backgroundColor: "var(--success-100)",
            color: "var(--success)",
          }}
        >
          {index + 1}
        </span>
      );
    }

    return (
      <span
        className={baseClasses}
        style={{
          borderColor: "var(--neutral-300)",
          color: "var(--neutral-500)",
        }}
      >
        {index + 1}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-70"
        onClick={handleCloseAttempt}
      />
      {/* Confirmation Modal - appears on top */}
      <AnimatePresence>
        {showCloseConfirm && (
          <motion.div
            key="confirmation-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-[110]"
          >
            <div 
              className="absolute inset-0 bg-gray-800 opacity-40"
              onClick={() => setShowCloseConfirm(false)}
            />
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg p-6 max-w-xl w-full relative z-[120] shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close icon for continue editing */}
              <button
                onClick={handleContinueEditing}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              >
                <FaTimes size={24} />
              </button>

              <div className="flex items-center mb-4">
                <FaExclamationTriangle className="text-yellow-500 mr-3 text-xl" />
                <h3 className="text-lg font-bold">Modifications non enregistrées</h3>
              </div>
              <p className="mb-6 text-gray-400">
                Vous avez des modifications non enregistrées. Que souhaitez-vous faire ?
              </p>
              
              <div className="flex justify-end space-x-3">
                <Button
                  onClick={()=>{
                      setIsSaving(false);
                      setShowCloseConfirm(false);
                      setIsClosing(false);
                      onClose()}}
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-50"
                >
                  Ne pas enregistrer
                </Button>
                
                <Button
                  onClick={handleConfirmClose}
                  variant="primary"
                  disabled={isClosing}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {isClosing ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Main Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl flex w-full max-w-7xl max-h-[90vh] overflow-hidden z-[105]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleCloseAttempt}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-50"
        >
          <FaTimes size={24} />
        </button>

        {/* Step Indicator Sidebar */}
        <div className="w-1/4 bg-gray-50 p-6 border-r border-gray-200 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-6 text-neutral-800">Votre Profil</h3>
            <ul className="space-y-4">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <li
                    className={`flex items-center text-lg font-medium transition-colors duration-200 ${
                      index === currentStepIndex
                        ? 'text-primary-600 font-bold'
                        : 'text-neutral-500 hover:text-neutral-700'
                    }`}
                  >
                    {getStepIcon(step, index, index === currentStepIndex)}
                    {step.name}
                  </li>
                  {index < steps.length - 1 && (
                    <div className="h-4 border-l-2 ml-3 mt-3 mb-3" style={{ borderColor: 'var(--neutral-200)', marginTop: "-19px", marginBottom: "0px" }} />
                  )}
                </React.Fragment>
              ))}
            </ul>
          </div>
          <div className="mt-8">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="h-2.5 rounded-full transition-all duration-500 ease-in-out"
                style={{
                  width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
                  backgroundColor: "var(--primary-500)",
                }}
              />
            </div>
            <p className="text-sm text-neutral-500 mt-2 text-right">
              Étape {currentStepIndex + 1} sur {steps.length}
            </p>
          </div>
        </div>

        {/* Right Content */}
        <div className="w-3/4 p-8 flex flex-col justify-between overflow-y-auto">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentStep.id}
              custom={currentStepIndex > initialStepIndex ? 1 : -1}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="flex-grow"
            >
              {currentStep.component}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
            <Button
              onClick={goToPreviousStep}
              disabled={isFirstStep}
              variant="outline"
              className='cursor-pointer'
              style={{ borderColor: 'var(--primary-300)', color: 'var(--primary-700)' }}
            >
              Précédent
            </Button>
            <div>
              {currentStep.optional && !isLastStep && (
                <Button
                  onClick={handleSkip}
                  variant="secondary"
                  className="mr-4 cursor-pointer"
                  style={{ backgroundColor: 'var(--secondary-100)', color: 'var(--secondary-700)' }}
                >
                  Passer
                </Button>
              )}
              {isLastStep ? (
                <Button
                  onClick={handleSave}
                  variant="primary"
                  className='cursor-pointer'
                  disabled={isSaving}
                  style={{ backgroundColor: 'var(--primary-600)', color: 'white' }}
                >
                  {isSaving ? 'Enregistrement...' : 'Sauvegarder et Terminer'}
                </Button>
              ) : (
                <Button
                  onClick={goToNextStep}
                  variant="primary"
                  className='cursor-pointer'
                  style={{ backgroundColor: 'var(--primary-500)', color: 'white' }}
                >
                  Suivant
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};


export default MultiStepFormModal;



