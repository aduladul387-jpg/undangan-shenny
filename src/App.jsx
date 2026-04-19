import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NoiseOverlay = () => (
  <div className="pointer-events-none absolute inset-0 z-50 w-full h-full">
    <div className="absolute inset-0 opacity-[0.35] mix-blend-overlay">
      <svg className="w-full h-full filter contrast-[1.8]" xmlns="http://www.w3.org/2000/svg">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
    <div className="absolute inset-0 bg-yellow-900/10 mix-blend-multiply opacity-60"></div>
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(60,40,20,0.3)_100%)]"></div>
  </div>
);

const animateFloat = (delay) => ({
  animate: {
    y: [0, -12, 0],
    rotate: [-2, 2, -2],
    transition: { duration: 5 + Math.random()*2, ease: "easeInOut", repeat: Infinity, delay }
  }
});

const FoilLetter = ({ char, colorClass, rotate = 0, yTranslate = 0, delay = 0, size = "text-6xl md:text-8xl" }) => (
  <motion.div 
    variants={animateFloat(delay)}
    animate="animate"
    className={`font-['Fredoka_One'] ${size} ${colorClass} mx-[2px] md:mx-2 relative`}
    style={{ transform: `rotate(${rotate}deg) translateY(${yTranslate}px)` }}
  >
    {char}
    <span className="absolute inset-0 bg-gradient-to-br from-white/80 via-transparent to-black/20 mix-blend-overlay pointer-events-none"></span>
  </motion.div>
);

const RoundBalloon = ({ color, size, className, delay = 0, zIndex = 1 }) => (
  <motion.div
    className={`absolute rounded-t-[50%] rounded-b-[45%] flex flex-col items-center justify-end ${className}`}
    style={{
      width: size,
      height: size * 1.25,
      backgroundColor: color,
      boxShadow: 'inset -12px -12px 18px rgba(0,0,0,0.15), inset 12px 12px 18px rgba(255,255,255,0.4), 4px 10px 15px rgba(0,0,0,0.1)',
      zIndex
    }}
    variants={animateFloat(delay)}
    animate="animate"
  >
    <div className="absolute top-[8%] left-[15%] w-[25%] h-[15%] bg-white/50 rounded-full blur-[2px] transform -rotate-45"></div>
    <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent translate-y-[6px]" style={{ borderBottomColor: color }}></div>
  </motion.div>
);

const StarBalloon = ({ colorClass, className, delay }) => (
  <motion.div 
    variants={animateFloat(delay)} 
    animate="animate"
    className={`absolute ${className} ${colorClass} font-['Fredoka_One'] text-7xl drop-shadow-2xl`}
  >
    ★
  </motion.div>
);

const JaggedSVG = () => (
  <svg className="absolute w-full h-[40px] text-[#292421]" preserveAspectRatio="none" viewBox="0 0 1200 40" fill="currentColor">
    <path d="M0,0 L1200,0 L1200,10 L1180,30 L1150,15 L1120,40 L1080,20 L1040,35 L1010,10 L980,25 L940,5 L900,30 L870,15 L830,35 L800,20 L760,40 L730,15 L690,30 L660,10 L630,25 L590,5 L560,35 L530,20 L490,40 L460,15 L430,30 L390,10 L360,25 L320,5 L290,35 L260,20 L230,40 L190,15 L160,30 L130,10 L90,25 L60,5 L30,35 L0,20 Z" />
  </svg>
);

const App = () => {
  const [isOpened, setIsOpened] = useState(false);
  const [buttonFaded, setButtonFaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const bgMusicRef = useRef(null);

  const colors = {
    pink: '#f1a7b8', purple: '#b89ec6', yellow: '#f4d78b', teal: '#8bc3c8', white: '#f8f4f0'
  };

  const handleOpen = () => {
    // Play tear sound
    const tearAudio = new Audio("/robek.mp3");
    tearAudio.play().catch(e => console.log('Tear audio prevented:', e));

    // Initialize and play background music
    if (!bgMusicRef.current) {
      bgMusicRef.current = new Audio("/musik.mp3");
      bgMusicRef.current.loop = true;
      bgMusicRef.current.volume = 0.5;
    }
    bgMusicRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch(e => console.log('Background music prevented:', e));
    
    // Trigger animation
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
    <div className="relative min-h-screen overflow-x-hidden font-body selection:bg-pink-300/40">
      
      {/* ---------- TORN PAPER COVER SCREEN ---------- */}
      <AnimatePresence>
        {!isOpened && (
          <div className="fixed inset-0 z-50 pointer-events-none">
            
            {/* CENTRAL BUTTON (Renders on Top of Both halves) */}
            <motion.div 
              className={`absolute top-0 flex flex-col items-center justify-center w-full h-full z-10 pointer-events-auto transition-opacity duration-300 ${buttonFaded ? 'opacity-0' : 'opacity-100'}`}
            >
              <div className="relative flex flex-col items-center p-8 text-center max-w-sm w-[90%] backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-2xl">
                <p className="font-heading italic text-gray-400 mb-2 uppercase tracking-widest text-sm text-shadow">You are invited to</p>
                <h1 className="font-heading text-3xl font-bold text-[#f1a7b8] mb-8 drop-shadow-md">
                  Shenny Sukmana's <br /> 24th Birthday
                </h1>
                
                <button 
                  onClick={handleOpen}
                  className="relative group px-10 py-4 overflow-hidden rounded-full font-bold uppercase tracking-[0.2em] bg-transparent border-2 border-[#b89ec6] text-[#b89ec6] transition-all duration-300 hover:text-white"
                >
                  <div className="absolute inset-0 w-0 bg-[#b89ec6] transition-all duration-[400ms] ease-out group-hover:w-full"></div>
                  <span className="relative z-10 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail-open"><path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z"/><path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"/></svg>
                    Open Invitation
                  </span>
                </button>
              </div>
            </motion.div>

            {/* TOP HALF TEAR */}
            <motion.div 
              className="absolute top-0 w-full h-[51vh] bg-[#292421] overflow-hidden"
              initial={{ y: 0 }}
              exit={{ y: "-100%", transition: { duration: 1.5, ease: [0.76, 0, 0.24, 1] } }}
            >
              <NoiseOverlay />
              <div className="absolute bottom-[-16px] left-0 w-full rotate-180">
                <JaggedSVG />
              </div>
            </motion.div>

            {/* BOTTOM HALF TEAR */}
            <motion.div 
              className="absolute bottom-0 w-full h-[51vh] bg-[#292421] overflow-hidden"
              initial={{ y: 0 }}
              exit={{ y: "100%", transition: { duration: 1.5, ease: [0.76, 0, 0.24, 1] } }}
            >
              <NoiseOverlay />
              <div className="absolute top-[-16px] left-0 w-full">
                <JaggedSVG />
              </div>
            </motion.div>

          </div>
        )}
      </AnimatePresence>

      {/* ---------- MAIN INVITATION (WALL OF BALLOONS) ---------- */}
      <div className={`relative min-h-screen bg-[#ede4d8] flex flex-col items-center pt-8 pb-56 px-2 transition-opacity duration-1000 ${isOpened ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'}`}>
        <NoiseOverlay />
        
        {/* BACKGROUND SCATTERED BALLOONS (WALL) */}
        {isOpened && (
          <>
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
          </>
        )}

        {/* HAPPY SCENE */}
        <div className="relative z-30 w-full max-w-4xl text-center flex flex-col items-center mt-4">
          
          {/* HAPPY Arc */}
          <div className="flex justify-center items-end h-32 mb-6">
            <FoilLetter char="H" colorClass="foil-3d-pink" rotate={-15} yTranslate={20} delay={0.2} />
            <FoilLetter char="A" colorClass="foil-3d-silver" rotate={-5} yTranslate={5} delay={0.4} />
            <FoilLetter char="P" colorClass="foil-3d-purple" rotate={0} yTranslate={0} delay={0.6} />
            <FoilLetter char="P" colorClass="foil-3d-silver" rotate={8} yTranslate={8} delay={0.8} />
            <FoilLetter char="Y" colorClass="foil-3d-pink" rotate={15} yTranslate={25} delay={1.0} />
          </div>

          {/* Massive 24 (Centerpiece) */}
          <div className="flex justify-center items-center my-4 relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={isOpened ? { scale: 1 } : { scale: 0 }}
              transition={{ type: "spring", bounce: 0.5, duration: 1.5, delay: 1 }}
              className="flex"
            >
              <FoilLetter char="2" colorClass="foil-3d-pink" size="text-[160px] md:text-[220px]" rotate={-5} delay={0} />
              <FoilLetter char="4" colorClass="foil-3d-purple" size="text-[160px] md:text-[220px]" rotate={5} delay={0.2} />
            </motion.div>
          </div>

          {/* BIRTHDAY Arc */}
          <div className="flex justify-center items-start h-32 mt-4 flex-wrap max-w-full">
            <FoilLetter char="B" colorClass="foil-3d-purple" rotate={-20} yTranslate={-20} delay={1.2} />
            <FoilLetter char="I" colorClass="foil-3d-pink" rotate={-15} yTranslate={-10} delay={1.3} />
            <FoilLetter char="R" colorClass="foil-3d-silver" rotate={-5} yTranslate={0} delay={1.4} />
            <FoilLetter char="T" colorClass="foil-3d-pink" rotate={0} yTranslate={5} delay={1.5} />
            <FoilLetter char="H" colorClass="foil-3d-purple" rotate={2} yTranslate={5} delay={1.6} />
            <FoilLetter char="D" colorClass="foil-3d-silver" rotate={8} yTranslate={0} delay={1.7} />
            <FoilLetter char="A" colorClass="foil-3d-purple" rotate={15} yTranslate={-10} delay={1.8} />
            <FoilLetter char="Y" colorClass="foil-3d-silver" rotate={20} yTranslate={-20} delay={1.9} />
          </div>

          {/* INVITATION CARD CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isOpened ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 1.2, delay: 2.2 }}
            className="relative z-30 w-[90%] max-w-xl mx-auto mt-16 p-8 rounded-3xl bg-white/45 backdrop-blur-md border border-white/60 shadow-[0_20px_40px_rgba(0,0,0,0.1)]"
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-100 text-yellow-800 px-6 py-2 rounded-full font-bold shadow-md uppercase tracking-widest text-xs border border-yellow-300">
              You're Invited!
            </div>

            <h2 className="font-heading text-2xl md:text-3xl text-gray-800 font-bold mb-4 italic">
              Celebrating <span className="text-[#a45d70]">Shenny Sukmana</span>
            </h2>
            
            <div className="w-16 h-[2px] bg-yellow-400 mx-auto mb-6"></div>

            <p className="text-gray-700 text-base md:text-lg leading-relaxed font-body font-semibold max-w-sm mx-auto mb-8">
              Komp. Griya salak asri blok b 3 no 24 
              <br />
              rt07/rw09 desa cinangka 
              <br />
              kec.ciampea kab bogor
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
              <a 
                href="#" 
                className="flex-1 max-w-[200px] mx-auto flex items-center justify-center gap-2 bg-[#f1a7b8] hover:bg-[#e091a3] text-gray-900 font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 font-body uppercase tracking-wider text-sm group"
              >
                <span>RSVP</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </a>
              
              <a 
                href="https://maps.app.goo.gl/yN9xiCYW3FtoNorC6" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 max-w-[200px] mx-auto flex items-center justify-center gap-2 bg-[#f4d78b] hover:bg-[#dfc176] text-gray-900 font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 font-body uppercase tracking-wider text-sm group"
              >
                <span>Maps</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:scale-110"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </a>
            </div>
          </motion.div>
        </div>

        {/* FLOOR BALLOONS (CROWDED BOTTOM) */}
        {isOpened && (
          <div className="absolute bottom-[2%] left-0 w-full h-48 pointer-events-none z-20 flex justify-center items-end">
            {/* Layer 1 - Background */}
            <RoundBalloon color={colors.yellow} size={130} className="bottom-[10%] left-[-5%]" delay={0} />
            <RoundBalloon color={colors.purple} size={150} className="bottom-[5%] left-[10%]" delay={1} />
            <RoundBalloon color={colors.teal} size={120} className="bottom-[20%] left-[25%]" delay={2} />
            <RoundBalloon color={colors.pink} size={140} className="bottom-[-10%] left-[40%]" delay={0.5} />
            <RoundBalloon color={colors.white} size={135} className="bottom-[15%] left-[55%]" delay={1.5} />
            <RoundBalloon color={colors.purple} size={160} className="bottom-[2%] right-[25%]" delay={0.8} />
            <RoundBalloon color={colors.yellow} size={125} className="bottom-[18%] right-[10%]" delay={2.2} />
            <RoundBalloon color={colors.teal} size={145} className="bottom-[-5%] right-[-5%]" delay={1.1} />

            {/* Layer 2 - Foreground */}
            <RoundBalloon color={colors.white} size={110} className="bottom-[-5%] left-[5%]" delay={2.1} zIndex={10} />
            <RoundBalloon color={colors.pink} size={100} className="bottom-[10%] left-[20%]" delay={0.4} zIndex={10} />
            <RoundBalloon color={colors.yellow} size={120} className="bottom-[-15%] left-[32%]" delay={1.8} zIndex={10} />
            <RoundBalloon color={colors.purple} size={115} className="bottom-[5%] left-[48%]" delay={0.9} zIndex={10} />
            <RoundBalloon color={colors.teal} size={130} className="bottom-[-8%] right-[38%]" delay={2.5} zIndex={10} />
            <RoundBalloon color={colors.pink} size={105} className="bottom-[12%] right-[18%]" delay={0.2} zIndex={10} />
            <RoundBalloon color={colors.white} size={115} className="bottom-[-10%] right-[5%]" delay={1.4} zIndex={10} />
          </div>
        )}
      </div>

      {/* ---------- MUSIC TOGGLE BUTTON ---------- */}
      {isOpened && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-6 right-6 z-[100] w-12 h-12 bg-white/20 backdrop-blur-md border border-white/40 rounded-full flex items-center justify-center shadow-2xl hover:bg-white/30 transition-all duration-300 group"
          title={isPlaying ? "Mute Music" : "Unmute Music"}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-800 drop-shadow-sm group-hover:scale-110 transition-transform"><path d="M11 5L6 9H2V15H6L11 19V5Z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-800/60 drop-shadow-sm group-hover:scale-110 transition-transform"><path d="M11 5L6 9H2V15H6L11 19V5Z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
          )}
        </button>
      )}
    </div>
  );
};

export default App;
