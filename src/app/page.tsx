'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Stepper } from '@/components/onboarding/Stepper';
import { Step1 } from '@/components/onboarding/Step1';
import { Step2 } from '@/components/onboarding/Step2';
import { Step3 } from '@/components/onboarding/Step3';
import { Step4 } from '@/components/onboarding/Step4';
import Link from 'next/link';

const STEPS = [
    { id: 1, title: 'Influence', component: Step1 },
    { id: 2, title: 'Tags', component: Step2 },
    { id: 3, title: 'Trust Wall', component: Step3 },
    { id: 4, title: 'Passport', component: Step4 },
];

export default function Home() {
    const [currentStep, setCurrentStep] = useState(0);
    const router = useRouter();

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = () => {
        // Navigate to dashboard after onboarding
        router.push('/dashboard');
    };

    const CurrentStepComponent = STEPS[currentStep].component;

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-base-gray-900 via-base-gray-900 to-black">
            {/* Header */}
            <header className="w-full px-6 py-4 flex items-center justify-between border-b border-base-gray-800">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-base-blue to-purple-600 flex items-center justify-center shadow-lg shadow-base-blue/25">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-white to-base-gray-400 bg-clip-text text-transparent">
                        BaseProof
                    </span>
                </Link>

                <Link
                    href="/dashboard"
                    className="text-base-gray-400 hover:text-white text-sm transition-colors"
                >
                    Skip intro →
                </Link>
            </header>

            {/* Stepper Navigation */}
            <Stepper
                steps={STEPS}
                currentStep={currentStep}
                onStepClick={(index) => setCurrentStep(index)}
            />

            {/* Step Content */}
            <div className="flex-1 flex flex-col px-6 py-8 overflow-y-auto">
                <CurrentStepComponent />
            </div>

            {/* Navigation Buttons */}
            <footer className="w-full px-6 py-6 border-t border-base-gray-800 bg-base-gray-900/80 backdrop-blur-xl">
                <div className="flex gap-4 max-w-md mx-auto">
                    {currentStep > 0 && (
                        <button
                            onClick={handleBack}
                            className="flex-1 py-3 px-6 bg-base-gray-800 hover:bg-base-gray-700 text-white font-semibold rounded-xl transition-all border border-base-gray-700"
                        >
                            Back
                        </button>
                    )}

                    {currentStep < STEPS.length - 1 ? (
                        <button
                            onClick={handleNext}
                            className="flex-1 py-3 px-6 bg-gradient-to-r from-base-blue to-purple-600 hover:from-base-blue-light hover:to-purple-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-base-blue/25"
                        >
                            Continue
                        </button>
                    ) : (
                        <button
                            onClick={handleComplete}
                            className="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-500/25 flex items-center justify-center gap-2"
                        >
                            Enter Dashboard
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    )}
                </div>
            </footer>
        </div>
    );
}
