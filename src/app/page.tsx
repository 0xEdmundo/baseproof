'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    BasicTierIcon,
    SilverTierIcon,
    EliteTierIcon,
    GoldTierIcon,
    PlatinumTierIcon,
    BuilderIcon,
    DeveloperIcon,
    CreatorIcon,
    LeaderIcon,
    InvestorIcon
} from '@/components/icons';

// Premium SVG Icons for screens
const ShieldIcon = () => (
    <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const ScaleIcon = () => (
    <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
);

const TagIcon = () => (
    <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
);

const TiersIcon = () => (
    <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 3H18L22 9L12 22L2 9L6 3Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 3L8 9L12 22L16 9L13 3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 9H22" />
    </svg>
);

const WallIcon = () => (
    <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const ChartIcon = () => (
    <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const RocketIcon = () => (
    <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
);

// Onboarding screens data - now includes TIERS screen
const ONBOARDING_SCREENS = [
    {
        Icon: ShieldIcon,
        gradient: 'from-base-blue to-purple-600',
        glowColor: 'shadow-base-blue/50',
        title: 'Welcome to',
        highlight: 'BaseProof',
        description: 'Your onchain reputation passport. Build trust through verified vouches from real builders on Base.',
        visual: 'welcome',
    },
    {
        Icon: ScaleIcon,
        gradient: 'from-blue-500 to-cyan-400',
        glowColor: 'shadow-cyan-500/50',
        title: 'Weighted',
        highlight: 'Influence',
        description: 'Trust Score determines influence. A Platinum user\'s vouch carries 8x the weight of a newcomer. Quality over quantity.',
        visual: 'weight',
    },
    {
        Icon: TiersIcon,
        gradient: 'from-cyan-400 via-purple-500 to-amber-500',
        glowColor: 'shadow-purple-500/50',
        title: 'Trust',
        highlight: 'Tiers',
        description: 'Climb from Basic to Platinum. Each tier unlocks more influence and reputation weight.',
        visual: 'tiers',
    },
    {
        Icon: TagIcon,
        gradient: 'from-amber-500 to-orange-400',
        glowColor: 'shadow-amber-500/50',
        title: 'Role',
        highlight: 'Tags',
        description: 'When you vouch, you assign roles. Builder, Developer, Creator, Leader, Investor — building your verified identity.',
        visual: 'tags',
    },
    {
        Icon: WallIcon,
        gradient: 'from-purple-500 to-pink-500',
        glowColor: 'shadow-purple-500/50',
        title: 'Wall of',
        highlight: 'Trust',
        description: 'Every vouch is permanently recorded on Base. A transparent, immutable history that can\'t be faked.',
        visual: 'wall',
    },
    {
        Icon: ChartIcon,
        gradient: 'from-green-500 to-emerald-400',
        glowColor: 'shadow-green-500/50',
        title: 'Smart',
        highlight: 'Limits',
        description: '5 vouches per day, 35 per week. Scarcity creates value — each vouch you give truly matters.',
        visual: 'limits',
    },
    {
        Icon: RocketIcon,
        gradient: 'from-base-blue to-purple-600',
        glowColor: 'shadow-base-blue/50',
        title: 'Ready to',
        highlight: 'Begin?',
        description: 'Create your profile, receive vouches, mint your soulbound NFT card, and climb the leaderboard.',
        visual: null,
        isFinal: true,
    },
];

// Animated visual components
function WelcomeVisual() {
    return (
        <div className="flex items-center justify-center gap-3 animate-fade-in">
            <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="w-10 h-10 rounded-full border-2 border-base-gray-900 animate-bounce-slow"
                        style={{
                            background: `linear-gradient(135deg, ${i === 1 ? '#0052FF, #7B3FE4' : i === 2 ? '#10B981, #34D399' : '#F59E0B, #FBBF24'})`,
                            animationDelay: `${i * 150}ms`
                        }}
                    />
                ))}
            </div>
            <div className="text-2xl animate-pulse">→</div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-base-blue to-purple-600 flex items-center justify-center shadow-lg shadow-base-blue/30 animate-pulse-slow">
                <span className="text-white text-xl font-bold">✓</span>
            </div>
        </div>
    );
}

function WeightVisual() {
    const [animate, setAnimate] = useState(false);
    useEffect(() => {
        setAnimate(true);
    }, []);

    return (
        <div className="space-y-3 w-full max-w-xs">
            <div className={`p-4 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 transform transition-all duration-500 ${animate ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                            <PlatinumTierIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-white text-sm font-semibold">Platinum</p>
                            <p className="text-cyan-300 text-xs">8,000+ points</p>
                        </div>
                    </div>
                    <span className="text-2xl font-bold text-green-400">+80</span>
                </div>
                <div className="h-2 bg-base-gray-700/50 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-1000 ${animate ? 'w-4/5' : 'w-0'}`} />
                </div>
            </div>
            <div className={`p-4 rounded-xl bg-base-gray-800/50 border border-base-gray-700/50 transform transition-all duration-500 delay-200 ${animate ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-zinc-800 flex items-center justify-center">
                            <BasicTierIcon className="w-5 h-5 text-slate-300" />
                        </div>
                        <div>
                            <p className="text-white text-sm font-semibold">Basic</p>
                            <p className="text-base-gray-400 text-xs">Starting tier</p>
                        </div>
                    </div>
                    <span className="text-xl font-bold text-green-400">+10</span>
                </div>
                <div className="h-2 bg-base-gray-700/50 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r from-slate-500 to-zinc-600 rounded-full transition-all duration-1000 delay-300 ${animate ? 'w-1/5' : 'w-0'}`} />
                </div>
            </div>
        </div>
    );
}

// NEW: Tiers Visual - shows all tier levels
function TiersVisual() {
    const [animate, setAnimate] = useState(false);
    useEffect(() => {
        setAnimate(true);
    }, []);

    const tiers = [
        { name: 'Platinum', score: '8,000+', Icon: PlatinumTierIcon, gradient: 'from-cyan-400 to-purple-600', borderColor: 'border-cyan-400/40', textColor: 'text-cyan-400' },
        { name: 'Gold', score: '5,000+', Icon: GoldTierIcon, gradient: 'from-amber-400 to-orange-500', borderColor: 'border-amber-400/40', textColor: 'text-amber-400' },
        { name: 'Elite', score: '2,500+', Icon: EliteTierIcon, gradient: 'from-purple-500 to-pink-500', borderColor: 'border-purple-400/40', textColor: 'text-purple-400' },
        { name: 'Silver', score: '1,000+', Icon: SilverTierIcon, gradient: 'from-gray-300 to-slate-500', borderColor: 'border-gray-400/40', textColor: 'text-gray-300' },
        { name: 'Basic', score: '0+', Icon: BasicTierIcon, gradient: 'from-slate-600 to-zinc-800', borderColor: 'border-slate-500/40', textColor: 'text-slate-400' },
    ];

    return (
        <div className="space-y-2 w-full max-w-xs">
            {tiers.map((tier, i) => (
                <div
                    key={tier.name}
                    className={`flex items-center justify-between p-3 rounded-xl bg-gradient-to-r ${tier.gradient} bg-opacity-10 border ${tier.borderColor} transform transition-all duration-500 hover:scale-[1.02] ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                    style={{
                        transitionDelay: `${i * 100}ms`,
                        background: `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))`
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${tier.gradient} flex items-center justify-center shadow-lg`}>
                            <tier.Icon className="w-5 h-5 text-white" />
                        </div>
                        <span className={`font-semibold ${tier.textColor}`}>{tier.name}</span>
                    </div>
                    <span className="text-base-gray-400 text-sm">{tier.score} pts</span>
                </div>
            ))}
        </div>
    );
}

function TagsVisual() {
    const [animate, setAnimate] = useState(false);
    useEffect(() => {
        setAnimate(true);
    }, []);

    const tags = [
        { Icon: BuilderIcon, name: 'Builder', color: 'from-blue-500 to-cyan-500', border: 'border-blue-500/40' },
        { Icon: DeveloperIcon, name: 'Developer', color: 'from-purple-500 to-violet-500', border: 'border-purple-500/40' },
        { Icon: CreatorIcon, name: 'Creator', color: 'from-pink-500 to-rose-500', border: 'border-pink-500/40' },
        { Icon: LeaderIcon, name: 'Leader', color: 'from-amber-500 to-orange-500', border: 'border-amber-500/40' },
        { Icon: InvestorIcon, name: 'Investor', color: 'from-green-500 to-emerald-500', border: 'border-green-500/40' },
    ];

    return (
        <div className="flex flex-wrap justify-center gap-2 w-full max-w-xs">
            {tags.map((tag, i) => (
                <div
                    key={tag.name}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r ${tag.color} bg-opacity-10 border ${tag.border} transform transition-all duration-500 hover:scale-105 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                    style={{
                        transitionDelay: `${i * 100}ms`,
                        background: `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))`
                    }}
                >
                    <tag.Icon className="w-5 h-5 text-white" />
                    <span className="text-white text-sm font-medium">{tag.name}</span>
                </div>
            ))}
        </div>
    );
}

function WallVisual() {
    const [animate, setAnimate] = useState(false);
    useEffect(() => {
        setAnimate(true);
    }, []);

    const vouches = [
        { from: 'vitalik.eth', role: 'Builder', time: 'just now' },
        { from: 'jesse.base', role: 'Developer', time: '2m ago' },
        { from: 'dan.eth', role: 'Creator', time: '5m ago' },
    ];

    return (
        <div className="space-y-2 w-full max-w-xs">
            {vouches.map((v, i) => (
                <div
                    key={i}
                    className={`flex items-center justify-between p-3 rounded-xl bg-base-gray-800/50 border border-base-gray-700/50 transform transition-all duration-500 ${animate ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}
                    style={{ transitionDelay: `${i * 150}ms` }}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-base-blue to-purple-600 shadow-lg shadow-base-blue/20" />
                        <div>
                            <p className="text-white text-sm font-medium">{v.from}</p>
                            <p className="text-base-gray-500 text-xs">{v.role} • {v.time}</p>
                        </div>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                        <span className="text-green-400 text-xs">✓</span>
                    </div>
                </div>
            ))}
            <div className={`flex items-center justify-center gap-2 pt-2 transition-all duration-500 delay-500 ${animate ? 'opacity-100' : 'opacity-0'}`}>
                <div className="w-2 h-2 rounded-full bg-base-blue animate-pulse" />
                <p className="text-base-gray-500 text-xs">Recorded on Base L2</p>
            </div>
        </div>
    );
}

function LimitsVisual() {
    const [dailyCount, setDailyCount] = useState(0);
    const [weeklyCount, setWeeklyCount] = useState(0);

    useEffect(() => {
        const dailyInterval = setInterval(() => {
            setDailyCount(prev => prev < 5 ? prev + 1 : prev);
        }, 200);
        const weeklyInterval = setInterval(() => {
            setWeeklyCount(prev => prev < 35 ? prev + 5 : prev);
        }, 150);

        return () => {
            clearInterval(dailyInterval);
            clearInterval(weeklyInterval);
        };
    }, []);

    return (
        <div className="flex gap-4 w-full max-w-xs justify-center">
            <div className="flex-1 p-5 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/30 text-center">
                <p className="text-4xl font-bold text-green-400 tabular-nums">{dailyCount}</p>
                <p className="text-sm text-base-gray-400 mt-2">Per Day</p>
                <div className="mt-3 flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${i <= dailyCount ? 'bg-green-400' : 'bg-base-gray-700'}`}
                        />
                    ))}
                </div>
            </div>
            <div className="flex-1 p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-violet-500/5 border border-purple-500/30 text-center">
                <p className="text-4xl font-bold text-purple-400 tabular-nums">{weeklyCount}</p>
                <p className="text-sm text-base-gray-400 mt-2">Per Week</p>
                <div className="mt-3 h-2 bg-base-gray-700/50 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-purple-400 to-violet-500 rounded-full transition-all duration-300"
                        style={{ width: `${(weeklyCount / 35) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

export default function Home() {
    const router = useRouter();
    const [currentScreen, setCurrentScreen] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const screen = ONBOARDING_SCREENS[currentScreen];
    const isLast = currentScreen === ONBOARDING_SCREENS.length - 1;

    const handleNext = () => {
        if (isAnimating) return;
        if (isLast) {
            router.push('/profile/setup');
        } else {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentScreen(prev => prev + 1);
                setIsAnimating(false);
            }, 150);
        }
    };

    const renderVisual = () => {
        switch (screen.visual) {
            case 'welcome': return <WelcomeVisual />;
            case 'weight': return <WeightVisual />;
            case 'tiers': return <TiersVisual />;
            case 'tags': return <TagsVisual />;
            case 'wall': return <WallVisual />;
            case 'limits': return <LimitsVisual />;
            default: return null;
        }
    };

    return (
        <div
            className="min-h-screen bg-base-gray-900 flex flex-col cursor-pointer select-none"
            onClick={handleNext}
        >
            {/* Header */}
            <header className="px-4 py-3 border-b border-base-gray-800">
                <div className="max-w-lg mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-base-blue to-purple-600 flex items-center justify-center shadow-lg shadow-base-blue/20">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <span className="text-base font-bold text-white">BaseProof</span>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push('/dashboard');
                        }}
                        className="text-base-gray-400 text-xs hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-base-gray-800"
                    >
                        Skip →
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className={`flex-1 flex flex-col items-center justify-center px-6 py-8 max-w-lg mx-auto w-full transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                {/* Icon with Glow */}
                <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${screen.gradient} flex items-center justify-center mb-8 shadow-2xl ${screen.glowColor} animate-float`}>
                    <screen.Icon />
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-white text-center mb-4">
                    {screen.title}{' '}
                    <span className={`text-transparent bg-clip-text bg-gradient-to-r ${screen.gradient}`}>
                        {screen.highlight}
                    </span>
                </h1>

                {/* Description */}
                <p className="text-base-gray-400 text-center text-base leading-relaxed mb-10 max-w-sm">
                    {screen.description}
                </p>

                {/* Visual */}
                <div className="mb-8 w-full flex justify-center">
                    {renderVisual()}
                </div>

                {/* Final screen CTA buttons */}
                {screen.isFinal && (
                    <div className="w-full space-y-3" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => router.push('/profile/setup')}
                            className="w-full py-4 bg-gradient-to-r from-base-blue to-purple-600 hover:from-base-blue-light hover:to-purple-500 text-white font-semibold rounded-xl transition-all text-base shadow-lg shadow-base-blue/25"
                        >
                            Get Started
                        </button>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="w-full py-4 bg-base-gray-800 hover:bg-base-gray-700 border border-base-gray-700 text-white font-medium rounded-xl transition-all text-base"
                        >
                            Explore Dashboard
                        </button>
                    </div>
                )}
            </main>

            {/* Progress Dots & Navigation */}
            <footer className="px-4 py-5 border-t border-base-gray-800">
                <div className="max-w-lg mx-auto">
                    {/* Progress Dots */}
                    <div className="flex justify-center gap-2 mb-3">
                        {ONBOARDING_SCREENS.map((_, i) => (
                            <button
                                key={i}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentScreen(i);
                                }}
                                className={`h-2 rounded-full transition-all duration-300 ${i === currentScreen
                                        ? 'w-8 bg-gradient-to-r from-base-blue to-purple-600'
                                        : i < currentScreen
                                            ? 'w-2 bg-base-blue/60'
                                            : 'w-2 bg-base-gray-700 hover:bg-base-gray-600'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Navigation hint */}
                    {!isLast && (
                        <p className="text-center text-base-gray-500 text-xs">
                            Tap anywhere to continue
                        </p>
                    )}
                </div>
            </footer>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-4px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 2s ease-in-out infinite;
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 2s ease-in-out infinite;
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
