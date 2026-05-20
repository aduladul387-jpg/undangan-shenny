import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Shirt, Send, Music, VolumeX } from 'lucide-react';
import { db } from './firebase';
import { ref, push, onValue, remove } from 'firebase/database';

const LABEL_TRANSLATIONS = {
  days: 'Hari',
  hours: 'Jam',
  minutes: 'Menit',
  seconds: 'Detik'
};

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex justify-center gap-2 sm:gap-4 text-center my-8 h-[68px] sm:h-[76px]">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} className="bg-white/40 backdrop-blur-sm rounded-lg border border-vintage-pink/20 min-w-[64px] sm:min-w-[70px] h-full flex flex-col justify-center items-center">
          <div className="text-xl sm:text-2xl font-elegant font-bold text-vintage-pink leading-none">{value}</div>
          <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-gray-500 mt-1 leading-none">{LABEL_TRANSLATIONS[label] || label}</div>
        </div>
      ))}
    </div>
  );
};

const PARTICLES = Array.from({ length: 30 }).map((_, i) => ({
  id: i,
  x: Math.random() * 100,
  scale: Math.random() * 0.5 + 0.1,
  opacity: Math.random() * 0.5 + 0.2,
  duration: Math.random() * 30 + 30,
  delay: Math.random() * 20,
  size: Math.random() * 15 + 2,
  blur: Math.random() * 4 + 1
}));

const FallingParticles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1]">
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bg-vintage-yellow/10 rounded-full"
          initial={{
            x: p.x + "%",
            y: -20,
            scale: p.scale,
            opacity: p.opacity
          }}
          animate={{
            y: ["0%", "120%"],
            x: ["-5%", "5%"],
            rotate: 360,
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
            delay: p.delay
          }}
          style={{
            width: p.size + "px",
            height: p.size + "px",
            filter: `blur(${p.blur}px)`,
            willChange: 'transform'
          }}
        />
      ))}
    </div>
  );
};

const Guestbook = () => {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const messagesRef = ref(db, 'messages');
    // real-time listener
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.entries(data).map(([id, values]) => ({
          id,
          ...values,
        })).sort((a, b) => b.timestamp - a.timestamp);
        setMessages(messageList);
      } else {
        setMessages([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    try {
      const messagesRef = ref(db, 'messages');
      const newMessage = {
        name,
        message,
        timestamp: Date.now(),
        date: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })
      };

      await push(messagesRef, newMessage);
      setName('');
      setMessage('');
    } catch (error) {
      console.error("Error adding message: ", error);
      alert("Yah, kartunya gagal terkirim. Coba lagi sebentar ya, Teman-teman!");
    }
  };


  return (
    <section className="mb-20">
      <div className="text-center mb-10">
        <Send className="mx-auto text-vintage-sage/40 mb-4" />
        <h2 className="text-3xl font-elegant text-gray-700">Tulis Kartu Ucapan Lucu ✍️</h2>
        <p className="text-gray-400 text-sm italic mt-2">Yuk, tulis doa dan ucapan selamat ulang tahun yang manis untuk Kak Shenny!</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mb-12">
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-4">Siapa Namamu?</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tulis nama panggilanmu di sini..."
            className="w-full bg-white/50 backdrop-blur-sm border border-vintage-sage/20 rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-vintage-sage/20 transition-all font-body text-gray-600"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-4">Doa atau Ucapan Manismu</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tulis doa terbaikmu di sini, seperti 'Semoga Kak Shenny sehat selalu dan ceria terus!'..."
            rows="4"
            className="w-full bg-white/50 backdrop-blur-sm border border-vintage-sage/20 rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-vintage-sage/20 transition-all font-body text-gray-600 resize-none"
            required
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-vintage-sage text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-body tracking-[0.2em] text-sm mt-4 shadow-lg hover:bg-opacity-90 transition-colors"
        >
          KIRIM KARTU UCAPAN 💌
        </motion.button>
      </form>

      <div className="max-h-[600px] overflow-y-auto pr-2 space-y-8 scrollbar-thin">
        {isLoading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vintage-sage mx-auto"></div>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="polaroid weathered-paper"
              >
                <div className="tape" />
                <div className="flex flex-col gap-2 min-h-[100px] justify-between h-full relative group">

                  <p className="text-gray-600 font-body text-sm italic leading-relaxed pt-2">
                    "{msg.message}"
                  </p>
                  <div className="mt-4 pt-2 border-t border-vintage-sage/10">
                    <p className="font-retro text-xl text-vintage-pink">{msg.name}</p>
                    <p className="text-[9px] uppercase tracking-tighter text-gray-400">{msg.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {!isLoading && messages.length === 0 && (
          <p className="text-center text-gray-400 italic text-sm py-10 opacity-60">
            Belum ada ucapan nih. Yuk, jadi yang pertama kirim ucapan manis!
          </p>
        )}
      </div>
    </section>
  );
};

const TARGET_DATE = new Date('May 24, 2026 00:00:00').getTime();

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handleOpenInvitation = () => {
    setIsOpen(true);
    if (audioRef.current) {
      audioRef.current.volume = 0;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        // Fade in effect
        let vol = 0;
        const fadeInterval = setInterval(() => {
          if (vol < 0.4) {
            vol += 0.02;
            audioRef.current.volume = vol;
          } else {
            clearInterval(fadeInterval);
          }
        }, 100);
      }).catch(err => console.log("Audio play blocked:", err));
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div className={`min-h-screen relative selection:bg-vintage-pink/30 ${!isOpen ? 'overflow-hidden' : ''}`}>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="gate"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50, pointerEvents: 'none' }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            className={`fixed inset-0 z-[200] flex items-center justify-center bg-vintage-bg overflow-hidden h-[100svh] vintage-filter ${isOpen ? 'pointer-events-none' : 'touch-none'}`}
          >
            {/* Gate Background Overlay */}
            <div className="absolute inset-0 bg-paper opacity-20 pointer-events-none" />
            <div className="absolute inset-0 bg-grain opacity-10 pointer-events-none" />

            <div className="relative z-10 text-center px-6 max-h-screen flex flex-col justify-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="mb-4"
              >
                <div className="text-[10px] uppercase tracking-[0.3em] font-body text-vintage-sage mb-2">Ada Surat Undangan Cantik Buat</div>
                <h2 className="text-2xl font-elegant italic text-vintage-pink mb-8">Kamu, Teman Baikku ✨</h2>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleOpenInvitation}
                  className="px-8 py-3 bg-vintage-pink text-white rounded-full font-body tracking-[0.2em] text-xs shadow-lg shadow-vintage-pink/20 hover:bg-vintage-lavender transition-colors duration-500"
                >
                  BUKA SURATNYA DI SINI! ✉️
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.main
        initial={false}
        animate={isOpen ? { opacity: 1, y: 0, pointerEvents: 'auto' } : { opacity: 0, y: 20, pointerEvents: 'none' }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`max-w-md mx-auto px-6 py-20 relative ${isOpen ? 'vintage-filter' : ''}`}
      >
        <FallingParticles />

        {/* Floating Balloons (Blobs) */}
        <motion.div
          animate={{ y: [0, -30, 0], x: [0, 10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 -left-10 w-24 h-24 bg-vintage-pink/15 rounded-full blur-2xl"
        />
        <motion.div
          animate={{ y: [0, 40, 0], x: [0, -15, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-60 -right-10 w-32 h-32 bg-vintage-lavender/15 rounded-full blur-2xl"
        />
        <motion.div
          animate={{ y: [0, -50, 0], x: [0, 20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute bottom-40 -left-20 w-40 h-40 bg-vintage-sage/15 rounded-full blur-3xl"
        />

        {/* Decorative Peppa */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-10 -right-10 w-40 h-40 opacity-40 grayscale-[0.3] pointer-events-none"
        >
          <img src="/images/peppa.png" alt="Vintage Peppa" className="w-full h-full object-contain" />
        </motion.div>

        {/* Header */}
        <header className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-vintage-sage uppercase tracking-[0.4em] text-xs mb-4"
          >
            Petualangan Hari Ulang Tahun 🎈
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-elegant leading-tight text-gray-700 mb-2"
          >
            Ulang Tahun Kak <span className="text-vintage-pink italic font-retro text-6xl">Shenny</span> <br />
            Sukmana yang ke-24
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.4 }}
            className="text-gray-400 font-body text-sm mt-4 italic"
          >
            "Ayo ikut Kak Shenny merayakan hari bahagia dengan penuh tawa, <br /> kue manis, dan balon warna-warni! 🎂🎉"
          </motion.p>
        </header>

        {/* Countdown */}
        <section className="mb-20">
          <CountdownTimer targetDate={TARGET_DATE} />
        </section>

        {/* Event Details */}
        <section className="space-y-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="flex items-start gap-6 bg-white/30 backdrop-blur-md p-6 rounded-2xl border border-white/50"
          >
            <div className="bg-vintage-lavender/20 p-4 rounded-xl">
              <Calendar className="text-vintage-lavender w-6 h-6" />
            </div>
            <div>
              <h3 className="font-elegant text-xl mb-1 text-gray-700">Hari Seru-seruan 📅</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Minggu, 24 Mei 2026 <br />
                Jam 13.00 - 15.00 WIB (Jam 1 - 3 Siang)
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="flex items-start gap-6 bg-white/30 backdrop-blur-md p-6 rounded-2xl border border-white/50"
          >
            <div className="bg-vintage-pink/20 p-4 rounded-xl">
              <MapPin className="text-vintage-pink w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-elegant text-xl mb-1 text-gray-700">Tempat Pesta 📍</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                Komp. Griya Salak Asri Blok B3 No. 24 <br />
                Rt 07 / Rw 09, Desa Cinangka <br />
                Kec. Ciampea, Kab. Bogor
              </p>
              <a
                href="https://maps.app.goo.gl/eo6nMj39dCz5oD3t8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-vintage-pink font-bold border-b border-vintage-pink/30 pb-1 hover:text-vintage-lavender hover:border-vintage-lavender transition-colors"
              >
                Ayo Lihat Peta di Sini 🗺️
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            className="p-8 bg-vintage-sage/10 rounded-3xl border border-vintage-sage/20 text-center relative overflow-hidden"
          >
            <Shirt className="mx-auto mb-4 text-vintage-sage w-8 h-8 opacity-60" />
            <h3 className="font-elegant text-2xl mb-2 text-gray-700">Baju Pesta Kita 👗👕</h3>
            <p className="text-vintage-sage font-bold text-lg mb-2">Baju warna-warni yang lembut (pastel) ya!</p>
            <p className="text-red-400 text-xs italic uppercase tracking-tighter">(Sstt.. Jangan pakai baju warna hitam ya, teman-teman! 🤫)</p>

            {/* Visual indicator for colors */}
            <div className="flex justify-center gap-2 mt-6">
              <div className="w-6 h-6 rounded-full bg-[#FFE4E1]" />
              <div className="w-6 h-6 rounded-full bg-[#F0F8FF]" />
              <div className="w-6 h-6 rounded-full bg-[#F5F5DC]" />
              <div className="w-6 h-6 rounded-full bg-[#E6E6FA]" />
            </div>
          </motion.div>
        </section>


        {/* Guestbook Section */}
        <Guestbook />

        <footer className="text-center py-10 opacity-40">
          <div className="font-retro text-2xl text-vintage-pink mb-2">Shenny Sukmana</div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500">Dibuat dengan cinta untuk pesta kita 💖</p>
        </footer>

        {/* Decorative Floating Peppa (Mobile) */}
        <motion.div
          animate={{
            y: [0, 40, 0],
            x: [0, 10, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="fixed -bottom-10 -left-10 w-32 h-32 opacity-20 pointer-events-none z-10"
        >
          <img src="/images/peppa.png" alt="Decorative Peppa" className="w-full h-full object-contain scale-x-[-1]" />
        </motion.div>
      </motion.main>

      {/* Background Music Element */}
      <audio
        ref={audioRef}
        src="/audio/hbd.mp3"
        loop
        preload="auto"
      />

      {/* Music Toggle (Fixed to Viewport) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="music-toggle"
            initial={{ opacity: 0, scale: 0, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0, x: 20 }}
            className="fixed bottom-6 right-6 z-[150]"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleMusic}
              className="w-12 h-12 bg-white/60 backdrop-blur-md border border-vintage-pink/30 rounded-full flex items-center justify-center text-vintage-pink shadow-lg hover:bg-white/80 transition-colors"
            >
              {isPlaying ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Music size={20} />
                </motion.div>
              ) : (
                <VolumeX size={20} />
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
