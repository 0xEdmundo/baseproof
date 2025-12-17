'use client';

import { useState } from 'react';
import { Stepper } from '@/components/onboarding/Stepper';
import { Step1 } from '@/components/onboarding/Step1';
import { Step2 } from '@/components/onboarding/Step2';
import { Step3 } from '@/components/onboarding/Step3';
import { Step4 } from '@/components/onboarding/Step4';
import { SearchBar } from '@/components/search/SearchBar';
import { useFarcaster } from '@/lib/farcaster';
import Link from 'next/link';

const STEPS = [
    { id: 1, title: 'Influence', component: Step1 },
    { id: 2, title: 'Tags', component: Step2 },
    { id: 3, title: 'Trust Wall', component: Step3 },
    { id: 4, title: 'Passport', component: Step4 },
];

export default function Home() {
    const [currentStep, setCurrentStep] = useState(0);
    const { isLoaded, user } = useFarcaster();

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
        // Navigate to explore/profile after onboarding
        console.log('Onboarding complete!');
    };

    const CurrentStepComponent = STEPS[currentStep].component;

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="w-full px-6 py-4 flex items-center justify-between border-b border-[var(--border)]">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-base-blue flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold gradient-text">BaseProof</h1>
                </Link>

                <div className="hidden sm:block">
                    <SearchBar />
                </div>

                {isLoaded && user && (
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-base-gray-400">@{user.username}</span>
                    </div>
                )}
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
            <footer className="w-full px-6 py-6 border-t border-[var(--border)]">
                <div className="flex gap-4 max-w-md mx-auto">
                    {currentStep > 0 && (
                        <button
                            onClick={handleBack}
                            className="btn-secondary flex-1"
                        >
                            Back
                        </button>
                    )}

                    {currentStep < STEPS.length - 1 ? (
                        <button
                            onClick={handleNext}
                            className="btn-primary flex-1"
                        >
                            Continue
                        </button>
                    ) : (
                        <button
                            onClick={handleComplete}
                            className="btn-primary flex-1"
                        >
                            Get Started
                        </button>
                    )}
                </div>
            </footer>
        </div>
    );
}
