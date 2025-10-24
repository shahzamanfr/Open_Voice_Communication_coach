import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { CoachMode, Feedback, ScoreHistory, LoadingState, ImageDomain } from './types';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Header from './components/Header';
// removed DomainGallery
import ImagePanel from './components/ImagePanel';
import InputPanel from './components/InputPanel';
import FeedbackPanel from './components/FeedbackPanel';
import ControlsPanel from './components/ControlsPanel';
import ProgressPanel from './components/ProgressPanel';
import BehavioralAnalysisPanel from './components/BehavioralAnalysisPanel';
import RewritePanel from './components/RewritePanel';
import { getCoachingFeedback, generateImageCaption, imageToGenerativePart, getExplanationStrategy } from './services/geminiService';
import { imageDomains } from './data/imageDomains';
import HomeDomains from './components/HomeDomains';
import AboutSection from './components/AboutSection';
import TeacherInterface from './components/TeacherInterface';
import StorytellerInterface from './components/StorytellerInterface';
import DebaterInterface from './components/DebaterInterface';
import GroupDiscussionInterface from './components/GroupDiscussionInterface';

interface ChallengeInfo {
  scoreToBeat: number;
}

const AppContent: React.FC = () => {
  const { theme } = useTheme();
  const initialDomain = imageDomains[0];
  const [selectedDomainSlug, setSelectedDomainSlug] = useState<string>(initialDomain?.slug ?? '');
  const [domainImageIndices, setDomainImageIndices] = useState<Record<string, number>>(() => {
    const indices: Record<string, number> = {};
    imageDomains.forEach((domain) => {
      indices[domain.slug] = 0;
    });
    return indices;
  });
  const [imageUrl, setImageUrl] = useState<string>(() => `https://picsum.photos/1024/768?random=${new Date().getTime()}`);
  const [userExplanation, setUserExplanation] = useState<string>('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [coachMode, setCoachMode] = useState<CoachMode>(CoachMode.Teacher);
  const [scoreHistory, setScoreHistory] = useState<ScoreHistory[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Idle);
  const [error, setError] = useState<string | null>(null);
  const [challengeInfo, setChallengeInfo] = useState<ChallengeInfo | null>(null);
  const [explanationStrategy, setExplanationStrategy] = useState<string | null>(null);
  const [isFetchingStrategy, setIsFetchingStrategy] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const [showDescribeSection, setShowDescribeSection] = useState<boolean>(() => window.location.hash === '#image-describe');
  const [showTeacherInterface, setShowTeacherInterface] = useState<boolean>(false);
  const [showStorytellerInterface, setShowStorytellerInterface] = useState<boolean>(false);
  const [showDebaterInterface, setShowDebaterInterface] = useState<boolean>(false);
  const [showGroupDiscussionInterface, setShowGroupDiscussionInterface] = useState<boolean>(false);
  
  
  const ai = useMemo(() => {
    // Vite exposes only VITE_* env vars to the client
    const viteEnv = (import.meta as any).env || {};
    const apiKey = viteEnv.VITE_GEMINI_API_KEY || viteEnv.VITE_API_KEY;

    console.log('🔑 API Key check (Vite):', {
      hasKey: !!apiKey,
      exposedVars: Object.keys(viteEnv).filter((k: string) => k.startsWith('VITE_'))
    });

    if (apiKey) {
      console.log('✅ Gemini AI initialized successfully');
      return new GoogleGenAI({ apiKey });
    }
    console.log('❌ No API key found - Gemini AI not initialized');
    return null;
  }, []);

  const domainLookup = useMemo<Record<string, ImageDomain>>(() => {
    const lookup: Record<string, ImageDomain> = {};
    imageDomains.forEach((domain) => {
      lookup[domain.slug] = domain;
    });
    return lookup;
  }, []);

  const effectiveSelectedDomain = selectedDomainSlug || (initialDomain?.slug ?? '');
  const activeDomain = useMemo(() => {
    if (!effectiveSelectedDomain) {
      return initialDomain;
    }
    return domainLookup[effectiveSelectedDomain] ?? initialDomain;
  }, [domainLookup, effectiveSelectedDomain, initialDomain]);

  const resetState = useCallback(() => {
    setUserExplanation('');
    setFeedback(null);
    setLoadingState(LoadingState.Idle);
    setError(null);
    setChallengeInfo(null);
    setExplanationStrategy(null);
  }, []);


  const fetchNewImage = useCallback(() => {
    const newImageUrl = `https://picsum.photos/1024/768?random=${new Date().getTime()}`;
    setImageUrl(newImageUrl);
    resetState();
  }, [resetState]);

  const handleDomainSelect = useCallback((slug: string) => {
    const domain = domainLookup[slug];
    if (!domain) {
      return;
    }

    setSelectedDomainSlug(slug);
    // Keep indices state for future, but image generation is random now
    setDomainImageIndices((prev) => ({ ...prev }));
    fetchNewImage();
  }, [domainLookup, fetchNewImage]);

  const handleImageSelect = useCallback((slug: string, imageId: string) => {
    console.log('Image selected:', { slug, imageId });
    
    // Check if this is a selected image from DomainImageGallery (starts with 'selected-')
    if (imageId.startsWith('selected-')) {
      // For Pexels images, we need to get the image URL from the DomainImageGallery
      // The imageUrl will be set by the DomainImageGallery component
      console.log('Pexels image selected, switching to describe section');
      setSelectedDomainSlug(slug);
      resetState();
      // Navigate to the describe section
      window.location.hash = '#image-describe';
      return;
    }
    
    // Find the specific image from the domain (for hardcoded domain images)
    const domain = domainLookup[slug];
    if (!domain) {
      console.error('Domain not found:', slug);
      return;
    }
    
    const selectedImage = domain.images.find(img => img.id === imageId);
    if (selectedImage) {
      console.log('Setting image URL:', selectedImage.src);
      setImageUrl(selectedImage.src);
      setSelectedDomainSlug(slug);
      resetState();
    } else {
      console.error('Image not found:', imageId, 'in domain:', slug);
    }
  }, [domainLookup, resetState]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const challengeImage = urlParams.get('image');
    const challengeScore = urlParams.get('score');

    if (challengeImage && challengeScore) {
      setImageUrl(decodeURIComponent(challengeImage));
      setChallengeInfo({ scoreToBeat: parseInt(challengeScore, 10) });
       // Clean the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const storedHistory = localStorage.getItem('scoreHistory');
    if (storedHistory) {
      setScoreHistory(JSON.parse(storedHistory));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (scoreHistory.length > 0) {
      localStorage.setItem('scoreHistory', JSON.stringify(scoreHistory));
    }
  }, [scoreHistory]);

  const handleGetStrategy = async () => {
    if (!ai || !imgRef.current) {
      setError("Cannot get strategy until the image is loaded.");
      return;
    }
    setIsFetchingStrategy(true);
    setError(null);
    try {
      const imagePart = imageToGenerativePart(imgRef.current);
      const strategy = await getExplanationStrategy(ai, imagePart);
      setExplanationStrategy(strategy);
    } catch (err) {
      console.error(err);
      setError("Could not fetch a strategy. Please try again.");
    } finally {
      setIsFetchingStrategy(false);
    }
  };

  // Toggle visibility of the describe section based on URL hash
  useEffect(() => {
    const onHashChange = () => {
      setShowDescribeSection(window.location.hash === '#image-describe');
    };
    window.addEventListener('hashchange', onHashChange);
    onHashChange();
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleSubmit = async () => {
    console.log('🚀 Starting AI analysis...', {
      userExplanation: userExplanation.substring(0, 50) + '...',
      coachMode,
      hasAI: !!ai,
      hasImage: !!imgRef.current
    });

    if (!userExplanation.trim()) {
      setError("Please provide an explanation before submitting.");
      return;
    }
    if (!ai) {
      console.log('❌ AI not initialized - API key missing');
      // For testing purposes, show mock feedback
      const mockFeedback = {
        role: coachMode,
        overall_score: 85,
        category_scores: {
          clarity: 18,
          vocabulary: 17,
          grammar: 20,
          logic: 15,
          fluency: 16,
          creativity: 15
        },
        feedback: `As a ${coachMode}, I can see you've provided a thoughtful explanation. Your communication shows good structure and clarity.`,
        tips: [
          "Add more descriptive adjectives to enhance vocabulary richness.",
          "Slow down your delivery to improve clarity.",
          "Use transitions between ideas for better flow.",
          "Consider adding emotional context to make it more engaging."
        ],
        // Legacy fields
        score: 85,
        whatYouDidWell: "Good structure and clear communication.",
        areasForImprovement: "Could use richer vocabulary and smoother transitions.",
        personalizedTip: "Focus on adding descriptive language to enhance your explanation.",
        spokenResponse: "Your explanation shows good structure and clarity.",
        communicationBehavior: {
          profile: "Clear Communicator",
          strength: "Good organization of ideas",
          growthArea: "Vocabulary richness"
        },
        exampleRewrite: {
          original: "The image shows a person.",
          improved: "The image depicts a confident individual standing in a professional setting.",
          reasoning: "The improved version adds descriptive language and context."
        }
      };
      
      setFeedback(mockFeedback);
      setLoadingState(LoadingState.Done);
      console.log('🎭 Using mock feedback for testing');
      return;
    }

    // Handle image mode only
    if (!imgRef.current) {
      setError("Image not loaded properly. Please try again.");
      return;
    }

    setLoadingState(LoadingState.GeneratingCaption);
    setError(null);
    setFeedback(null);

    try {
      console.log('📸 Converting image to generative part...');
      const imagePart = imageToGenerativePart(imgRef.current);
      
      console.log('🤖 Generating AI caption...');
      const aiCaption = await generateImageCaption(ai, imagePart);
      console.log('✅ AI Caption generated:', aiCaption.substring(0, 100) + '...');
      
      setLoadingState(LoadingState.GeneratingFeedback);
      
      console.log('🎯 Getting coaching feedback...');
      const coachFeedback = await getCoachingFeedback(ai, aiCaption, userExplanation, coachMode, explanationStrategy);
      console.log('✅ Coaching feedback received:', coachFeedback);
      
      setFeedback(coachFeedback);
      const newHistoryEntry: ScoreHistory = {
        date: new Date().toISOString().split('T')[0],
        score: coachFeedback.score || coachFeedback.overall_score || 0,
        mode: coachMode,
      };
      setScoreHistory(prev => [...prev, newHistoryEntry].slice(-10)); // Keep last 10 scores
      setLoadingState(LoadingState.Done);
      console.log('🎉 Analysis complete!');
    } catch (err) {
      console.error('❌ Error during AI analysis:', err);
      setError("An error occurred while getting feedback. Please try again.");
      setLoadingState(LoadingState.Error);
    }
  };

  const isLoading = loadingState === LoadingState.GeneratingCaption || loadingState === LoadingState.GeneratingFeedback;
  const gallerySelectedSlug = activeDomain?.slug ?? (initialDomain?.slug ?? '');

  return (
    <div className={`theme-animate-root min-h-screen font-sans transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
      theme === 'dark' 
        ? 'bg-black text-white' 
        : 'bg-white text-black'
    }`}>
      {showTeacherInterface ? (
        <TeacherInterface 
          onBack={() => setShowTeacherInterface(false)} 
          ai={ai}
        />
      ) : showStorytellerInterface ? (
        <StorytellerInterface 
          onBack={() => setShowStorytellerInterface(false)} 
          ai={ai}
        />
      ) : showDebaterInterface ? (
        <DebaterInterface 
          onBack={() => setShowDebaterInterface(false)} 
          ai={ai}
        />
      ) : showGroupDiscussionInterface ? (
        <GroupDiscussionInterface 
          onBack={() => setShowGroupDiscussionInterface(false)} 
          ai={ai}
        />
      ) : (
        <>
          <Header />
          <main className="w-full px-4 lg:px-8 mx-auto max-w-7xl">
        {!showDescribeSection && (
          <section className="py-20">
            <div className="relative">
              <div className="pointer-events-none absolute -top-24 -right-16 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_60%)] blur-3xl" aria-hidden />
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-14">
                <div className="max-w-3xl space-y-6">
                <p className={`text-xs uppercase tracking-[0.35em] ${
                  theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
                }`}>AI Communication Coach</p>
                <h2 className={`text-5xl sm:text-6xl font-semibold tracking-tight ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}>Build your explanation skills</h2>
                <p className={`text-base max-w-2xl ${
                  theme === 'dark' ? 'text-gray-400/90' : 'text-gray-600'
                }`}>Start with a random image to describe, then get instant feedback and tips.</p>
                <div className="flex flex-wrap items-center gap-3">
                  <button onClick={() => setShowDescribeSection(true)} className={`rounded-full border px-5 py-2.5 text-sm font-semibold hover:opacity-95 transition-colors duration-200 ${
                    theme === 'dark' 
                      ? 'border-gray-600 bg-black text-white' 
                      : 'border-gray-300 bg-white text-black'
                  }`}>Try Image Describe</button>
                  <button onClick={() => setShowDescribeSection(true)} className={`rounded-full border px-5 py-2.5 text-sm font-semibold hover:opacity-95 transition-colors duration-200 ${
                    theme === 'dark' 
                      ? 'border-gray-600 bg-black text-white' 
                      : 'border-gray-300 bg-white text-black'
                  }`}>Start Now</button>
                </div>
                
                <div className="mt-8">
                    <div className="mb-6 flex flex-wrap items-center gap-2">
                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                        theme === 'dark' 
                          ? 'border-gray-800 bg-gray-900/60 text-gray-300' 
                          : 'border-gray-200 bg-gray-100 text-gray-700'
                      }`}>Teacher</span>
                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                        theme === 'dark' 
                          ? 'border-gray-800 bg-gray-900/60 text-gray-300' 
                          : 'border-gray-200 bg-gray-100 text-gray-700'
                      }`}>Debater</span>
                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                        theme === 'dark' 
                          ? 'border-gray-800 bg-gray-900/60 text-gray-300' 
                          : 'border-gray-200 bg-gray-100 text-gray-700'
                      }`}>Storyteller</span>
                    </div>
                  <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { src: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=640&h=480&fit=crop", alt: "Creative workspace with laptop and notebook" },
                      { src: "https://picsum.photos/seed/hero-2/640/480", alt: "Website preview" },
                      { src: "https://picsum.photos/seed/hero-3/640/480", alt: "Website preview" }
                    ].map((image, i) => (
                      <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gray-800/70 bg-gray-900/60 ui-card">
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="h-full w-full object-cover grayscale contrast-125 hover:grayscale-0 transition-[transform,filter] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03]"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" aria-hidden />
                      </div>
                    ))}
                  </div>
                  {/* Expanded explanatory content */}
                  <div className="mt-6 space-y-4">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-gray-800 bg-gray-900/60 px-3 py-1 text-xs font-semibold text-gray-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-pulse" />
                        Built to make your ideas land
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-gray-400 max-w-2xl">
                        AI Communication Coach helps you turn fuzzy thoughts into crisp explanations. Practice on realistic visuals,
                        write your take, and get instant feedback on clarity, structure, and impact. Level up fast with
                        strategies you can reuse in interviews, standups, and presentations.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="rounded-2xl ui-card p-5 transition-colors duration-300 hover:bg-gray-900/60">
                        <p className="text-white text-sm font-semibold">Practice that sticks</p>
                        <p className="text-xs text-gray-400 mt-1">Short, focused reps so you build habits—not just answers.</p>
                      </div>
                      <div className="rounded-2xl ui-card p-5 transition-colors duration-300 hover:bg-gray-900/60">
                        <p className="text-white text-sm font-semibold">Feedback that matters</p>
                        <p className="text-xs text-gray-400 mt-1">Specific next steps on tone, structure, and storytelling.</p>
                      </div>
                      <a href="#about" className="rounded-2xl ui-card p-5 transition-colors duration-300 hover:bg-gray-900/60">
                        <p className="text-white text-sm font-semibold">Learn how it works</p>
                        <p className="text-xs text-gray-400 mt-1">Dive deeper into benefits and the coaching flow.</p>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
                <div className="w-full lg:max-w-xl rounded-3xl bg-black border border-gray-800 p-7 space-y-5 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.6)]">
                <HomeDomains
                  domains={imageDomains}
                  selectedDomainSlug={selectedDomainSlug}
                  onSelectDomain={(slug) => {
                    handleDomainSelect(slug);
                    window.location.hash = '#image-describe';
                  }}
                  onSelectImage={handleImageSelect}
                  onImageUrlSet={setImageUrl}
                />
              </div>
              </div>
            </div>
          </section>
        )}

        {!showDescribeSection && (
          <>
            {/* Coach Selection Interface */}
            <section className="py-20">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                  <p className="text-xs uppercase tracking-[0.35em] text-gray-600 mb-4">AI Coaching</p>
                  <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4">Choose your coaching style</h2>
                  <p className="text-base text-gray-400 max-w-2xl mx-auto">Each coach brings a unique perspective to help you improve your communication skills</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Teacher Coach */}
                  <button 
                    onClick={() => setShowTeacherInterface(true)}
                    className="group relative flex h-full min-h-[140px] flex-col justify-between overflow-hidden rounded-2xl bg-black border border-gray-800 p-5 text-left shadow-[0_10px_40px_-20px_rgba(0,0,0,0.7)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_-25px_rgba(255,255,255,0.1)] focus:outline-none hover:border-white/50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold tracking-tight group-hover:text-white transition-colors duration-300">Teacher</h3>
                        <p className="mt-1 text-xs text-white leading-relaxed line-clamp-2 group-hover:text-gray-100 transition-colors duration-300">Structured, constructive feedback focused on learning and improvement</p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="text-xs text-gray-300 bg-gray-800/50 rounded-lg px-2 py-1 text-center group-hover:bg-white/10 group-hover:text-white transition-all duration-300">Clear</div>
                      <div className="text-xs text-gray-300 bg-gray-800/50 rounded-lg px-2 py-1 text-center group-hover:bg-white/10 group-hover:text-white transition-all duration-300">Guided</div>
                      <div className="text-xs text-gray-300 bg-gray-800/50 rounded-lg px-2 py-1 text-center group-hover:bg-white/10 group-hover:text-white transition-all duration-300">Supportive</div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  </button>

                  {/* Debater Coach */}
                  <button 
                    onClick={() => setShowDebaterInterface(true)}
                    className="group relative flex h-full min-h-[140px] flex-col justify-between overflow-hidden rounded-2xl bg-black border border-gray-800 p-5 text-left shadow-[0_10px_40px_-20px_rgba(0,0,0,0.7)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_-25px_rgba(255,255,255,0.1)] focus:outline-none hover:border-white/50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold tracking-tight group-hover:text-white transition-colors duration-300">Debater</h3>
                        <p className="mt-1 text-xs text-white leading-relaxed line-clamp-2 group-hover:text-gray-100 transition-colors duration-300">Analytical, challenging feedback that pushes your critical thinking</p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="text-xs text-gray-300 bg-gray-800/50 rounded-lg px-2 py-1 text-center group-hover:bg-white/10 group-hover:text-white transition-all duration-300">Logical</div>
                      <div className="text-xs text-gray-300 bg-gray-800/50 rounded-lg px-2 py-1 text-center group-hover:bg-white/10 group-hover:text-white transition-all duration-300">Critical</div>
                      <div className="text-xs text-gray-300 bg-gray-800/50 rounded-lg px-2 py-1 text-center group-hover:bg-white/10 group-hover:text-white transition-all duration-300">Evidence</div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  </button>

                  {/* Storyteller Coach */}
                  <button 
                    onClick={() => setShowStorytellerInterface(true)}
                    className="group relative flex h-full min-h-[140px] flex-col justify-between overflow-hidden rounded-2xl bg-black border border-gray-800 p-5 text-left shadow-[0_10px_40px_-20px_rgba(0,0,0,0.7)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_-25px_rgba(255,255,255,0.1)] focus:outline-none hover:border-white/50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold tracking-tight group-hover:text-white transition-colors duration-300">Storyteller</h3>
                        <p className="mt-1 text-xs text-white leading-relaxed line-clamp-2 group-hover:text-gray-100 transition-colors duration-300">Creative, expressive feedback that enhances your narrative skills</p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="text-xs text-gray-300 bg-gray-800/50 rounded-lg px-2 py-1 text-center group-hover:bg-white/10 group-hover:text-white transition-all duration-300">Creative</div>
                      <div className="text-xs text-gray-300 bg-gray-800/50 rounded-lg px-2 py-1 text-center group-hover:bg-white/10 group-hover:text-white transition-all duration-300">Engaging</div>
                      <div className="text-xs text-gray-300 bg-gray-800/50 rounded-lg px-2 py-1 text-center group-hover:bg-white/10 group-hover:text-white transition-all duration-300">Expressive</div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  </button>

                  {/* Group Discussion Coach */}
                  <button 
                    onClick={() => setShowGroupDiscussionInterface(true)}
                    className="group relative flex h-full min-h-[140px] flex-col justify-between overflow-hidden rounded-2xl bg-black border border-gray-800 p-5 text-left shadow-[0_10px_40px_-20px_rgba(0,0,0,0.7)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_-25px_rgba(255,255,255,0.1)] focus:outline-none hover:border-white/50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold tracking-tight group-hover:text-white transition-colors duration-300">Group Discussion</h3>
                        <p className="mt-1 text-xs text-white leading-relaxed line-clamp-2 group-hover:text-gray-100 transition-colors duration-300">Practice with AI agents in realistic group discussions and get comprehensive feedback</p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="text-xs text-gray-300 bg-gray-800/50 rounded-lg px-2 py-1 text-center group-hover:bg-white/10 group-hover:text-white transition-all duration-300">Dynamic</div>
                      <div className="text-xs text-gray-300 bg-gray-800/50 rounded-lg px-2 py-1 text-center group-hover:bg-white/10 group-hover:text-white transition-all duration-300">Interactive</div>
                      <div className="text-xs text-gray-300 bg-gray-800/50 rounded-lg px-2 py-1 text-center group-hover:bg-white/10 group-hover:text-white transition-all duration-300">Realistic</div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  </button>
                </div>


                {/* Start Button */}
                <div className="text-center mt-12">
                  <button 
                    onClick={() => setShowDescribeSection(true)}
                    className="group relative rounded-full border border-gray-600 bg-black text-white px-8 py-3 text-sm font-semibold hover:border-white/50 hover:bg-white/5 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgba(255,255,255,0.2)] focus:outline-none"
                  >
                    <span className="relative z-10">Start Practicing</span>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </button>
                </div>
              </div>
            </section>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent my-6" />
            <AboutSection />
          </>
        )}

        {showDescribeSection && (
          <div className="py-14" id="image-describe">
            {/* Back to Home Button */}
            <div className="pt-8 mb-8">
              <button 
                onClick={() => setShowDescribeSection(false)}
                className="flex items-center text-gray-400 hover:text-white transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Home
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - Image */}
              <div className="space-y-6">
                <ImagePanel
                  ref={imgRef}
                  imageUrl={imageUrl}
                  onNewImage={fetchNewImage}
                  isLoading={isLoading}
                  domainTitle={activeDomain?.title}
                  domainEmoji={activeDomain?.emoji}
                  domainDescription={activeDomain?.description}
                />
              </div>

              {/* Right Side - Controls and Input */}
              <div className="space-y-6">
                <ControlsPanel selectedMode={coachMode} onModeChange={setCoachMode} isDisabled={isLoading} />
                <InputPanel
                  explanation={userExplanation}
                  onExplanationChange={setUserExplanation}
                  onSubmit={handleSubmit}
                  loadingState={loadingState}
                  challengeInfo={challengeInfo}
                  onGetStrategy={handleGetStrategy}
                  isFetchingStrategy={isFetchingStrategy}
                  strategy={explanationStrategy}
                  onDismissStrategy={() => setExplanationStrategy(null)}
                />
                {error && <div className="text-red-400 bg-red-900/50 p-3 rounded-lg border border-red-800">{error}</div>}
              </div>
            </div>

            {/* Feedback Section - Full Width Below */}
            <div className="mt-12">
              <FeedbackPanel 
                feedback={feedback} 
                loadingState={loadingState} 
                imageUrl={imageUrl}
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <BehavioralAnalysisPanel behavior={feedback?.communicationBehavior} />
                <RewritePanel rewrite={feedback?.exampleRewrite} />
              </div>
              <div className="mt-8">
                <ProgressPanel history={scoreHistory} />
              </div>
            </div>
          </div>
        )}
          </main>
        </>
      )}

      </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
