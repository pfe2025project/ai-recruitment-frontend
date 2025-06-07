import React, { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import { FaTimes, FaCheckCircle } from 'react-icons/fa';

interface Step {
  id: string;
  name: string;
  component: ReactNode;
  optional?: boolean;
  hasExistingInfo?: boolean;
  isCompleted?: boolean; // ✅ Added this missing prop
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
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

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

  const handleSave = () => {
    onSave();
    onClose();
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
    if (step.isCompleted || completedSteps.has(step.id)) {
      return <FaCheckCircle className="mr-3" style={{ color: "var(--success)" }} />;
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
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-lg shadow-xl flex w-full max-w-7xl max-h-[90vh] overflow-hidden transform transition-all duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
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
                    <div className="h-4  border-l-2 ml-3 mt-3 mb-3" style={{ borderColor: 'var(--neutral-200)' ,marginTop: "-19px",marginBottom:"0px" }} />
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
              key={currentStep.id} // ✅ More robust than currentStepIndex
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
              style={{ borderColor: 'var(--primary-300)', color: 'var(--primary-700)' }}
            >
              Précédent
            </Button>
            <div>
              {currentStep.optional && !isLastStep && (
                <Button
                  onClick={handleSkip}
                  variant="secondary"
                  className="mr-4"
                  style={{ backgroundColor: 'var(--secondary-100)', color: 'var(--secondary-700)' }}
                >
                  Passer
                </Button>
              )}
              {isLastStep ? (
                <Button
                  onClick={handleSave}
                  variant="primary"
                  style={{ backgroundColor: 'var(--primary-600)', color: 'white' }}
                >
                  Sauvegarder et Terminer
                </Button>
              ) : (
                <Button
                  onClick={goToNextStep}
                  variant="primary"
                  style={{ backgroundColor: 'var(--primary-500)', color: 'white' }}
                >
                  Suivant
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiStepFormModal;
