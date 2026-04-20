import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Scanlines = () => (
  <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%]"></div>
    <motion.div 
      animate={{ y: ["-100%", "100%"] }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      className="absolute top-0 left-0 w-full h-2 bg-white/5 blur-sm mix-blend-overlay will-change-transform"
    />
  </div>
);

const NoiseOverlay = () => (
  <div className="pointer-events-none fixed inset-0 z-50 w-full h-full">
    <motion.div 
      animate={{ 
        x: [0, -0.5, 0.5, -0.2, 0],
        y: [0, 0.5, -0.5, 0.2, 0],
        opacity: [0.9, 1, 0.95, 1, 0.9]
      }}
      transition={{ repeat: Infinity, duration: 0.2, ease: "linear" }}
      className="absolute inset-0 transform-gpu"
    >
      {/* Base Grain */}
      <div className="absolute inset-0 opacity-[0.55] mix-blend-overlay">
        <svg className="w-full h-full filter contrast-[2.0] brightness-[0.8]" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>
      
      {/* Scratches */}
      <div className="absolute inset-0 opacity-[0.2] mix-blend-screen bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
    </motion.div>
    
    <Scanlines />
    
    {/* Heavy Color Grading Overlay */}
    <div className="absolute inset-0 bg-[#3a2a00] mix-blend-color opacity-40"></div>
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,rgba(0,0,0,0.8)_100%)]"></div>
  </div>
);

const MoldyParchment = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-[#b5a68e] bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] opacity-100"></div>
    {/* Mold / Water Stains */}
    <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-[#2d301d] rounded-full blur-[80px] opacity-30 mix-blend-multiply"></div>
    <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-[#3e2b1c] rounded-full blur-[60px] opacity-40 mix-blend-multiply"></div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle,transparent_20%,#4a3f35_100%)] opacity-20"></div>
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-20 mix-blend-multiply"></div>
  </div>
);

const MoldStain = ({ className }) => (
  <div className={`absolute pointer-events-none opacity-40 mix-blend-multiply blur-3xl bg-[#1a1c0d] rounded-full ${className}`}></div>
);

const Cobweb = ({ className }) => (
  <svg className={`absolute pointer-events-none opacity-50 mix-blend-multiply ${className}`} width="300" height="300" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0L200 200M0 0L200 100M0 0L100 200M0 0V200M0 0H200" stroke="#2a2a2a" strokeWidth="0.5" />
    <path d="M20 0C20 40 40 60 60 60M40 0C40 60 60 80 80 80M60 0C60 80 80 100 100 100M80 0C80 100 100 120 120 120" stroke="#2a2a2a" strokeWidth="0.5" />
    <path d="M0 20C40 20 60 40 60 60M0 40C60 40 80 60 80 80M0 60C80 60 100 80 100 100M0 80C100 80 120 100 120 120" stroke="#2a2a2a" strokeWidth="0.5" />
  </svg>
);

const Spider = ({ className, delay = 0, scale = 1, rotate = 0 }) => (
  <motion.div
    className={`absolute pointer-events-none z-40 ${className}`}
    style={{ scale, rotate: `${rotate}deg` }}
    initial={{ y: -20, opacity: 0 }}
    animate={{ 
      y: [0, 15, 0],
      opacity: 0.8,
      transition: { duration: 5 + Math.random() * 2, repeat: Infinity, ease: "easeInOut", delay }
    }}
  >
    {/* Silk Thread */}
    <div className="absolute top-[-200px] left-1/2 w-[0.5px] h-[200px] bg-black/20"></div>
    <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="15" fill="#1a1c0d" />
      <circle cx="50" cy="30" r="10" fill="#1a1c0d" />
      {/* Creepy Legs */}
      <path d="M35 30 C15 10 0 30 5 50" stroke="#1a1c0d" strokeWidth="3" fill="none" />
      <path d="M35 45 C10 35 0 60 5 80" stroke="#1a1c0d" strokeWidth="3" fill="none" />
      <path d="M35 60 C10 65 10 90 20 100" stroke="#1a1c0d" strokeWidth="3" fill="none" />
      <path d="M40 20 C30 0 10 5 0 20" stroke="#1a1c0d" strokeWidth="3" fill="none" />
      
      <path d="M65 30 C85 10 100 30 95 50" stroke="#1a1c0d" strokeWidth="3" fill="none" />
      <path d="M65 45 C90 35 100 60 95 80" stroke="#1a1c0d" strokeWidth="3" fill="none" />
      <path d="M65 60 C90 65 90 90 80 100" stroke="#1a1c0d" strokeWidth="3" fill="none" />
      <path d="M60 20 C70 0 90 5 100 20" stroke="#1a1c0d" strokeWidth="3" fill="none" />
    </svg>
  </motion.div>
);

const DustParticles = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
    {[...Array(15)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-white/10 rounded-full blur-[1px]"
        initial={{ 
          x: Math.random() * 100 + "%", 
          y: Math.random() * 100 + "%",
          opacity: 0 
        }}
        animate={{ 
          y: [null, (Math.random() * 100 - 50) + "%"],
          opacity: [0, 0.3, 0],
          transition: { 
            duration: 15 + Math.random() * 20, 
            repeat: Infinity, 
            ease: "linear" 
          }
        }}
      />
    ))}
  </div>
);

const CrackOverlay = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.25] mix-blend-multiply" preserveAspectRatio="none" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 0L15 20L5 40L20 60L10 80L25 100" stroke="black" strokeWidth="1" />
    <path d="M90 10L75 30L85 50L70 75L80 95" stroke="black" strokeWidth="1" />
    <path d="M30 10L50 5L70 15" stroke="black" strokeWidth="1" />
    <path d="M20 85L45 95L75 90" stroke="black" strokeWidth="1" />
    <path d="M50 0L52 30L48 60L51 100" stroke="black" strokeWidth="0.5" strokeDasharray="2 2" />
  </svg>
);

const animateFloat = (delay) => ({
  animate: {
    y: [0, -10, 0],
    rotate: [-5, 5, -5],
    transition: { duration: 6 + Math.random() * 2, ease: "easeInOut", repeat: Infinity, delay }
  }
});

const FoilLetter = ({ char, colorClass, rotate = 0, yTranslate = 0, delay = 0, size = "text-6xl md:text-8xl" }) => {
  const randomOpacity = Math.random() * 0.4 + 0.4; // Faded ink effect
  return (
    <motion.div
      variants={animateFloat(delay)}
      animate="animate"
      className={`font-['Special_Elite'] ${size} ${colorClass} mx-[2px] md:mx-2 relative transform-gpu`}
      style={{ 
        transform: `rotate(${rotate}deg) translateY(${yTranslate}px)`,
        opacity: randomOpacity,
        filter: 'grayscale(0.3) brightness(0.7)'
      }}
    >
      {char}
      <div className="absolute inset-0 opacity-40 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/dust.png')] pointer-events-none"></div>
    </motion.div>
  );
};

const RoundBalloon = ({ color, size, className, delay = 0, zIndex = 1 }) => (
  <motion.div
    className={`absolute rounded-t-[45%] rounded-b-[40%] flex flex-col items-center justify-end ${className}`}
    style={{
      width: size * 0.9, // Slightly deflated width
      height: size * 1.1, // Slightly sagging height
      backgroundColor: color,
      filter: 'grayscale(0.2) brightness(0.6) blur(0.3px)',
      boxShadow: 'inset -8px -8px 12px rgba(0,0,0,0.3), inset 8px 8px 12px rgba(255,255,255,0.1), 4px 6px 10px rgba(0,0,0,0.2)',
      zIndex,
      transform: 'translateZ(0)'
    }}
    variants={animateFloat(delay)}
    animate="animate"
  >
    <div className="absolute top-[8%] left-[15%] w-[20%] h-[12%] bg-white/10 rounded-full blur-[4px] transform -rotate-45"></div>
    <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent translate-y-[6px]" style={{ borderBottomColor: '#333' }}></div>
    {/* Dust/Grime on balloon */}
    <div className="absolute inset-0 rounded-full opacity-50 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] pointer-events-none"></div>
  </motion.div>
);

const StarBalloon = ({ colorClass, className, delay }) => (
  <motion.div
    variants={animateFloat(delay)}
    animate="animate"
    className={`absolute ${className} ${colorClass} font-['Fredoka_One'] text-7xl drop-shadow-2xl transform-gpu`}
    style={{ filter: 'grayscale(0.3) brightness(0.5)', transform: 'translateZ(0)' }}
  >
    ★
    <div className="absolute inset-0 opacity-50 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/dust.png')] pointer-events-none"></div>
  </motion.div>
);

const App = () => {
  const [isOpened, setIsOpened] = useState(false);
  const [buttonFaded, setButtonFaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const bgMusicRef = useRef(null);

  // Dusty but colorful palette
  const colors = {
    pink: '#d48095', purple: '#847391', yellow: '#b59a5a', teal: '#5a8287', white: '#b3ada3'
  };

  const handleOpen = () => {
    const tearAudio = new Audio("/robek.mp3");
    tearAudio.play().catch(e => console.log('Tear audio prevented:', e));

    if (!bgMusicRef.current) {
      bgMusicRef.current = new Audio("/musik.mp3");
      bgMusicRef.current.loop = true;
      bgMusicRef.current.volume = 0.5;
    }
    bgMusicRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch(e => console.log('Background music prevented:', e));

    setButtonFaded(true);
    setTimeout(() => {
      setIsOpened(true);
    }, 200);
  };

  const toggleMusic = () => {
    if (bgMusicRef.current) {
      if (isPlaying) {
        bgMusicRef.current.pause();
      } else {
        bgMusicRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div 
      className="relative min-h-screen overflow-x-hidden font-body selection:bg-black/40 bg-[#121010] transform-gpu"
      style={{ filter: 'sepia(0.3) contrast(0.95) brightness(0.9)' }}
    >
      <NoiseOverlay />

      {/* ---------- TORN PAPER COVER SCREEN ---------- */}
      <AnimatePresence>
        {!isOpened && (
          <div className="fixed inset-0 z-50 pointer-events-none">
            {/* CENTRAL BUTTON */}
            <motion.div
              className={`absolute top-0 flex flex-col items-center justify-center w-full h-full z-10 pointer-events-auto transition-opacity duration-300 ${buttonFaded ? 'opacity-0' : 'opacity-100'}`}
            >
              <div className="relative flex flex-col items-center p-8 text-center max-w-sm w-[90%] bg-[#b5a68e]/80 border-t-8 border-b-8 border-[#3a352b] shadow-2xl overflow-hidden">
                <MoldyParchment />
                <CrackOverlay />
                <p className="font-heading italic text-[#3a352b] mb-2 uppercase tracking-widest text-sm relative z-10">You are invited to</p>
                <h1 className="font-['Special_Elite'] text-3xl font-bold text-[#1a1c0d] mb-8 relative z-10">
                  SHENNY SUKMANA'S <br /> 24TH BIRTHDAY
                </h1>

                <button
                  onClick={handleOpen}
                  className="relative group px-10 py-4 overflow-hidden rounded-md font-bold uppercase tracking-[0.2em] bg-transparent border-2 border-[#1a1c0d] text-[#1a1c0d] transition-all duration-300 hover:bg-[#1a1c0d] hover:text-[#b5a68e] z-10"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Open Invitation
                  </span>
                </button>
              </div>
            </motion.div>

            {/* TOP HALF TEAR */}
            <motion.div
              className="absolute top-0 w-full h-[51vh] bg-[#1a1c0d] overflow-hidden"
              initial={{ y: 0 }}
              exit={{ y: "-100%", transition: { duration: 1.5, ease: [0.76, 0, 0.24, 1] } }}
            >
              <MoldyParchment />
              <Cobweb className="top-0 left-0" />
              <Cobweb className="top-0 right-0 scale-x-[-1]" />
            </motion.div>

            {/* BOTTOM HALF TEAR */}
            <motion.div
              className="absolute bottom-0 w-full h-[51vh] bg-[#1a1c0d] overflow-hidden"
              initial={{ y: 0 }}
              exit={{ y: "100%", transition: { duration: 1.5, ease: [0.76, 0, 0.24, 1] } }}
            >
              <MoldyParchment />
              <Cobweb className="bottom-0 left-0 scale-y-[-1]" />
              <Cobweb className="bottom-0 right-0 scale-x-[-1] scale-y-[-1]" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------- MAIN INVITATION ---------- */}
      <div className={`relative min-h-screen flex flex-col items-center pt-8 pb-32 px-2 will-change-transform transition-opacity duration-1000 ${isOpened ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'}`}>
        <MoldyParchment />
        <DustParticles />
        <MoldStain className="w-96 h-96 -top-20 -left-20" />
        <MoldStain className="w-[500px] h-[500px] top-1/2 -right-64 opacity-30" />
        <MoldStain className="w-64 h-64 bottom-40 left-1/4 opacity-40" />
        
        <Cobweb className="top-0 left-0 opacity-80" />
        <Cobweb className="top-0 right-0 scale-x-[-1] opacity-80" />

        {/* BACKGROUND SCATTERED BALLOONS (WALL) */}
        {isOpened && (
          <div className="opacity-60">
            <RoundBalloon color={colors.yellow} size={90} className="top-[15%] left-[5%]" delay={0} zIndex={1} />
            <RoundBalloon color={colors.purple} size={110} className="top-[25%] left-[12%]" delay={1.5} zIndex={0} />
            <RoundBalloon color={colors.teal} size={80} className="top-[20%] left-[22%]" delay={0.5} zIndex={1} />
            <RoundBalloon color={colors.pink} size={100} className="top-[35%] left-[8%]" delay={2.5} zIndex={2} />

            <RoundBalloon color={colors.yellow} size={95} className="top-[18%] right-[8%]" delay={0.8} zIndex={1} />
            <RoundBalloon color={colors.teal} size={85} className="top-[22%] right-[20%]" delay={1.2} zIndex={0} />
            <RoundBalloon color={colors.purple} size={105} className="top-[32%] right-[15%]" delay={2} zIndex={2} />
            <RoundBalloon color={colors.pink} size={90} className="top-[28%] right-[5%]" delay={0.3} zIndex={1} />

            <StarBalloon colorClass="foil-3d-silver" className="top-[45%] left-[18%]" delay={1} />
            <StarBalloon colorClass="foil-3d-pink" className="top-[40%] right-[22%]" delay={2} />
          </div>
        )}

        {/* HAPPY SCENE - Tilted & Hanging */}
        <motion.div 
          className="relative z-30 w-full max-w-4xl text-center flex flex-col items-center mt-4 origin-top"
          animate={{ rotate: [-2, -3, -1, -2.5, -2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Thread holding the banner */}
          <div className="absolute top-[-50px] left-1/2 w-[1px] h-[60px] bg-white/20 blur-[0.5px]"></div>

          {/* HAPPY Arc */}
          <div className="flex justify-center items-end h-32 mb-6">
            <FoilLetter char="H" colorClass="foil-3d-pink" rotate={-25} yTranslate={30} delay={0.2} />
            <FoilLetter char="A" colorClass="foil-3d-silver" rotate={-10} yTranslate={15} delay={0.4} />
            <FoilLetter char="P" colorClass="foil-3d-purple" rotate={-5} yTranslate={5} delay={0.6} />
            <FoilLetter char="P" colorClass="foil-3d-silver" rotate={10} yTranslate={10} delay={0.8} />
            <FoilLetter char="Y" colorClass="foil-3d-pink" rotate={25} yTranslate={40} delay={1.0} />
          </div>

          {/* Massive 24 (Centerpiece) */}
          <div className="flex justify-center items-center my-4 relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={isOpened ? { scale: 1, rotate: 5 } : { scale: 0 }}
              transition={{ type: "spring", bounce: 0.5, duration: 1.5, delay: 1 }}
              className="flex"
            >
              <FoilLetter char="2" colorClass="foil-3d-pink" size="text-[160px] md:text-[220px]" rotate={-10} delay={0} />
              <FoilLetter char="4" colorClass="foil-3d-purple" size="text-[160px] md:text-[220px]" rotate={15} delay={0.2} />
            </motion.div>
          </div>

          {/* BIRTHDAY Arc */}
          <div className="flex justify-center items-start h-32 mt-4 flex-wrap max-w-full">
            <FoilLetter char="B" colorClass="foil-3d-purple" rotate={-30} yTranslate={-25} delay={1.2} />
            <FoilLetter char="I" colorClass="foil-3d-pink" rotate={-20} yTranslate={-15} delay={1.3} />
            <FoilLetter char="R" colorClass="foil-3d-silver" rotate={-5} yTranslate={-5} delay={1.4} />
            <FoilLetter char="T" colorClass="foil-3d-pink" rotate={5} yTranslate={10} delay={1.5} />
            <FoilLetter char="H" colorClass="foil-3d-purple" rotate={10} yTranslate={15} delay={1.6} />
            <FoilLetter char="D" colorClass="foil-3d-silver" rotate={18} yTranslate={5} delay={1.7} />
            <FoilLetter char="A" colorClass="foil-3d-purple" rotate={25} yTranslate={-15} delay={1.8} />
            <FoilLetter char="Y" colorClass="foil-3d-silver" rotate={35} yTranslate={-30} delay={1.9} />
          </div>

          {/* INVITATION CARD CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isOpened ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 1.2, delay: 2.2 }}
            className="relative z-30 w-[90%] max-w-xl mx-auto mt-16 p-8 bg-[#3d382e]/80 border-t-4 border-b-4 border-[#1a1c0d] shadow-2xl"
          >
            <MoldyParchment />
            <CrackOverlay />
            <Spider className="-top-12 left-10" delay={0.5} scale={0.7} rotate={-10} />
            <Spider className="-top-8 right-12" delay={2} scale={0.6} rotate={15} />
            <Spider className="-top-16 right-1/4" delay={4} scale={0.8} rotate={-5} />
            
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#1a1c0d] text-[#b5a68e] px-6 py-2 rounded-none font-bold shadow-md uppercase tracking-widest text-xs border border-white/10 relative z-10">
              You're Invited!
            </div>

            <h2 className="font-['Special_Elite'] text-2xl md:text-3xl text-[#1a1c0d] font-bold mb-4 relative z-10">
              Celebrating <span className="opacity-70">Shenny Sukmana</span>
            </h2>

            <div className="w-16 h-[2px] bg-[#1a1c0d]/30 mx-auto mb-6 relative z-10"></div>

            <p className="font-['Special_Elite'] text-[#1a1c0d] text-base md:text-lg leading-relaxed max-w-sm mx-auto mb-8 opacity-60 relative z-10">
              Komp. Griya salak asri blok b 3 no 24
              <br />
              rt 07/rw 09 desa cinangka
              <br />
              kec.ciampea kab bogor
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center relative z-10">
              <a
                href="#"
                className="flex-1 max-w-[200px] mx-auto flex items-center justify-center gap-2 bg-[#1a1c0d] hover:bg-black text-[#b5a68e] font-bold py-3 px-6 shadow-lg transition-all duration-300 font-['Special_Elite'] uppercase tracking-wider text-sm group"
              >
                <span>RSVP</span>
              </a>

              <a
                href="https://maps.app.goo.gl/yN9xiCYW3FtoNorC6"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 max-w-[200px] mx-auto flex items-center justify-center gap-2 bg-[#2d301d] hover:bg-black text-[#b5a68e] font-bold py-3 px-6 shadow-lg transition-all duration-300 font-['Special_Elite'] uppercase tracking-wider text-sm group"
              >
                <span>Maps</span>
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* FLOOR BALLOONS (DEFLATED CROWD) */}
        {isOpened && (
          <div className="absolute bottom-[2%] left-0 w-full h-48 pointer-events-none z-20 flex justify-center items-end opacity-50">
            <Cobweb className="bottom-0 left-0 scale-y-[-1] opacity-60" />
            <Cobweb className="bottom-0 right-0 scale-x-[-1] scale-y-[-1] opacity-60" />
            
            <RoundBalloon color={colors.yellow} size={130} className="bottom-[10%] left-[-5%]" delay={0} />
            <RoundBalloon color={colors.purple} size={150} className="bottom-[5%] left-[10%]" delay={1} />
            <RoundBalloon color={colors.teal} size={120} className="bottom-[20%] left-[25%]" delay={2} />
            <RoundBalloon color={colors.pink} size={140} className="bottom-[-10%] left-[40%]" delay={0.5} />
            <RoundBalloon color={colors.white} size={135} className="bottom-[15%] left-[55%]" delay={1.5} />
            <RoundBalloon color={colors.purple} size={160} className="bottom-[2%] right-[25%]" delay={0.8} />
          </div>
        )}
      </div>

      {/* ---------- MUSIC TOGGLE BUTTON ---------- */}
      {isOpened && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-6 right-6 z-[100] w-12 h-12 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center shadow-2xl hover:bg-black/60 transition-all duration-300 group"
          title={isPlaying ? "Mute Music" : "Unmute Music"}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b5a68e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2V15H6L11 19V5Z" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b5a68e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2V15H6L11 19V5Z" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
          )}
        </button>
      )}
    </div>
  );
};

export default App;
