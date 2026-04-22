import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Shirt, Send, Music, VolumeX, Trash2 } from 'lucide-react';
import { db } from './firebase';
import { ref, push, onValue, remove } from 'firebase/database';

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
    <div className="flex justify-center gap-4 text-center my-8">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} className="bg-white/40 backdrop-blur-sm p-3 rounded-lg border border-vintage-pink/20 min-w-[70px]">
          <div className="text-2xl font-elegant font-bold text-vintage-pink">{value}</div>
          <div className="text-[10px] uppercase tracking-wider text-gray-500">{label}</div>
        </div>
      ))}
    </div>
  );
};

const FallingParticles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1]">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-vintage-yellow/10 rounded-full"
          initial={{
            x: Math.random() * 100 + "%",
            y: -20,
            scale: Math.random() * 0.5 + 0.1,
            opacity: Math.random() * 0.5 + 0.2
          }}
          animate={{
            y: ["0%", "120%"],
            x: ["-5%", "5%"],
            rotate: 360,
          }}
          transition={{
            duration: Math.random() * 30 + 30,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 20
          }}
          style={{
            width: Math.random() * 15 + 2 + "px",
            height: Math.random() * 15 + 2 + "px",
            filter: `blur(${Math.random() * 4 + 1}px)`,
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
      alert("Gagal mengirim ucapan. Coba lagi nanti.");
    }
  };

  const handleDelete = async (msgId) => {
    const modKey = prompt("Masukkan Moderator Key untuk menghapus:");
    // Replace 'shenny-sayang' with whatever key you prefer
    if (modKey === 'shenny24') {
      try {
        const msgRef = ref(db, `messages/${msgId}`);
        await remove(msgRef);
      } catch (error) {
        console.error("Error deleting message: ", error);
      }
    } else if (modKey !== null) {
      alert("Moderator Key salah!");
    }
  };

  return (
    <section className="mb-20">
      <div className="text-center mb-10">
        <Send className="mx-auto text-vintage-sage/40 mb-4" />
        <h2 className="text-3xl font-elegant text-gray-700">Kirim Ucapan & Doa</h2>
        <p className="text-gray-400 text-sm italic mt-2">Tinggalkan pesan manis untuk Shenny</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mb-12">
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-4">Nama</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama Anda"
            className="w-full bg-white/50 backdrop-blur-sm border border-vintage-sage/20 rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-vintage-sage/20 transition-all font-body text-gray-600"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest text-gray-400 ml-4">Pesan/Ucapan</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tulis ucapan & doa..."
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
          KIRIM UCAPAN
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
                  <button 
                    onClick={() => handleDelete(msg.id)}
                    className="absolute top-0 right-0 p-1 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                  
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
            Belum ada ucapan. Jadilah yang pertama!
          </p>
        )}
      </div>
    </section>
  );
};

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const targetDate = new Date('May 24, 2026 00:00:00').getTime();

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
      document.body.style.height = '100svh';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.height = 'auto';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.height = 'auto';
    };
  }, [isOpen]);

  return (
    <div className={`min-h-screen relative selection:bg-vintage-pink/30 ${!isOpen ? 'h-[100svh] overflow-hidden' : ''}`}>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="gate"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50, pointerEvents: 'none' }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-vintage-bg overflow-hidden h-[100svh] touch-none"
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
                <div className="text-[10px] uppercase tracking-[0.3em] font-body text-vintage-sage mb-2">Special Invitation To</div>
                <h2 className="text-2xl font-elegant italic text-vintage-pink mb-8">For You</h2>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleOpenInvitation}
                  className="px-8 py-3 bg-vintage-pink text-white rounded-full font-body tracking-[0.2em] text-xs shadow-lg shadow-vintage-pink/20 hover:bg-vintage-lavender transition-colors duration-500"
                >
                  OPEN INVITATION
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.main
        initial={false}
        animate={isOpen ? { opacity: 1, filter: 'blur(0px)', y: 0, pointerEvents: 'auto' } : { opacity: 0, filter: 'blur(8px)', y: 20, pointerEvents: 'none' }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="max-w-md mx-auto px-6 py-20 relative"
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
            className="text-vintage-sage uppercase tracking-[0.4em] text-xs mb-4"
          >
            A Journey Through Time
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-elegant leading-tight text-gray-700 mb-2"
          >
            Shenny Sukmana's <br />
            <span className="text-vintage-pink italic font-retro text-6xl">24th</span> Birthday
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400 font-body text-sm mt-4 italic"
          >
            "Because life is a collection of faded memories <br /> that bloom into beautiful futures."
          </motion.p>
        </header>

        {/* Countdown */}
        <section className="mb-20">
          <CountdownTimer targetDate={targetDate} />
        </section>

        {/* Event Details */}
        <section className="space-y-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex items-start gap-6 bg-white/30 backdrop-blur-md p-6 rounded-2xl border border-white/50"
          >
            <div className="bg-vintage-lavender/20 p-4 rounded-xl">
              <Calendar className="text-vintage-lavender w-6 h-6" />
            </div>
            <div>
              <h3 className="font-elegant text-xl mb-1 text-gray-700">The Big Day</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Minggu, 24 Mei 2026 <br />
                Pukul 13:00 WIB - 15:00 WIB
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex items-start gap-6 bg-white/30 backdrop-blur-md p-6 rounded-2xl border border-white/50"
          >
            <div className="bg-vintage-pink/20 p-4 rounded-xl">
              <MapPin className="text-vintage-pink w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-elegant text-xl mb-1 text-gray-700">Location</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                Komp. Griya Salak Asri blok b 3 No 24 Rt 07/Rw 09 Desa Cinangka Kec.Ciampea Kab. Bogor.
              </p>
              <a
                href="https://maps.app.goo.gl/eo6nMj39dCz5oD3t8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-vintage-pink font-bold border-b border-vintage-pink/30 pb-1 hover:text-vintage-lavender hover:border-vintage-lavender transition-colors"
              >
                View on Maps
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="p-8 bg-vintage-sage/10 rounded-3xl border border-vintage-sage/20 text-center relative overflow-hidden"
          >
            <Shirt className="mx-auto mb-4 text-vintage-sage w-8 h-8 opacity-60" />
            <h3 className="font-elegant text-2xl mb-2 text-gray-700">Dresscode</h3>
            <p className="text-vintage-sage font-bold text-lg mb-2">Semua Warna Soft</p>
            <p className="text-red-400 text-xs italic uppercase tracking-tighter">(Strictly No Black)</p>

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
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500">2026 All Rights Reserved</p>
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
        src="/audio/musik.mp3"
        loop
        preload="auto"
      />

      {/* Music Toggle (Functional) */}
      <div className="fixed bottom-6 right-6 z-[150]">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMusic}
          className="w-12 h-12 bg-white/60 backdrop-blur-md border border-vintage-pink/30 rounded-full flex items-center justify-center text-vintage-pink shadow-lg"
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
      </div>
    </div>
  );
}
