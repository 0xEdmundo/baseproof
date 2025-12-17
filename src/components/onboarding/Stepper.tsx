'use client';

interface Step {
    id: number;
    title: string;
}

interface StepperProps {
    steps: Step[];
    currentStep: number;
    onStepClick: (index: number) => void;
}

export function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
    const progress = ((currentStep) / (steps.length - 1)) * 100;

    return (
        <div className="w-full px-6 py-6">
            {/* Progress bar */}
            <div className="progress-bar mb-6">
                <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Step indicators */}
            <div className="flex justify-between items-center">
                {steps.map((step, index) => (
                    <button
                        key={step.id}
                        onClick={() => onStepClick(index)}
                        className="flex flex-col items-center gap-2 transition-all duration-300"
                    >
                        <div
                            className={`step-indicator ${index === currentStep
                                    ? 'step-active'
                                    : index < currentStep
                                        ? 'step-completed'
                                        : 'step-inactive'
                                }`}
                        >
                            {index < currentStep ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                step.id
                            )}
                        </div>
                        <span
                            className={`text-xs font-medium transition-colors ${index === currentStep
                                    ? 'text-base-blue'
                                    : index < currentStep
                                        ? 'text-green-500'
                                        : 'text-base-gray-400'
                                }`}
                        >
                            {step.title}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
