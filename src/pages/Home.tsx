import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoOpacity, setVideoOpacity] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let animationFrameId: number;

    const checkVideoTime = () => {
      if (video.duration) {
        const timeRemaining = video.duration - video.currentTime;

        // Fade in: first 0.5 seconds
        if (video.currentTime <= 0.5) {
          setVideoOpacity(video.currentTime / 0.5);
        }
        // Fade out: last 0.5 seconds
        else if (timeRemaining <= 0.5) {
          setVideoOpacity(timeRemaining / 0.5);
        }
        // Fully visible in between
        else {
          setVideoOpacity(1);
        }
      }

      animationFrameId = requestAnimationFrame(checkVideoTime);
    };

    const handlePlay = () => {
      animationFrameId = requestAnimationFrame(checkVideoTime);
    };

    const handleEnded = () => {
      setVideoOpacity(0);
      setTimeout(() => {
        if (video) {
          video.currentTime = 0;
          video.play().catch(console.error);
        }
      }, 100);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('ended', handleEnded);

    // Initial play attempt
    video.play().catch(console.error);

    return () => {
      cancelAnimationFrame(animationFrameId);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <>
      {/* Background Video Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src="/mp_.mp4"
          muted
          playsInline
          style={{ opacity: videoOpacity, transition: 'opacity 0.1s linear' }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white z-10 pointer-events-none" />
      </div>

      {/* Hero Section */}
      <main
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 pb-40 w-full"
        style={{ paddingTop: 'calc(8rem - 75px)' }}
      >
        <h1
          className="font-instrument text-5xl sm:text-7xl md:text-8xl max-w-7xl font-normal opacity-0 animate-fade-rise"
          style={{ lineHeight: 0.95, letterSpacing: '-2.46px' }}
        >
          <span className="text-black">Beyond </span>
          <i className="text-[#C8A96B]">treatment,</i>
          <span className="text-black"> we nurture </span>
          <br className="hidden md:block" />
          <i className="text-[#C8A96B]">lasting wellness.</i>
        </h1>

        <p className="font-inter text-base sm:text-lg max-w-2xl mt-8 leading-relaxed text-[#6F6F6F] opacity-0 animate-fade-rise-delay">
          A sanctuary where advanced medical care meets compassionate healing. We bridge the gap between leading specialists and your well-being, ensuring every step of your health journey is supported by expertise and care.
        </p>

        <button className="flex items-center justify-center gap-2 bg-black text-white rounded-full px-14 py-5 text-base mt-12 font-inter hover:scale-103 transition-transform duration-300 ease-out opacity-0 animate-fade-rise-delay-2">
          Book an Appointment
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button>
      </main>
    </>
  );
}
