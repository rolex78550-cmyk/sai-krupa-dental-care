import React from 'react';
import { motion } from 'motion/react';
import { Star, MapPin, Clock, ArrowRight, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { user } = useAuth();

  const reviews = [
    { name: 'Puspa Anjali', time: '2 months ago', text: 'Doctor and staff behaviour are good and best treatment provide', rating: 5 },
    { name: 'Kpremsai Dora', time: '4 months ago', text: 'Very good & polite behavior of Doctor & Staff. Highly recommend for an newcomer or old if they want High quality Treatment for their teeth.', rating: 5 },
    { name: 'Tulu Sahu', time: '2 months ago', text: 'As a doctor and staff are good and i am satisfy her treatment', rating: 5 },
  ];

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-28 pb-32 lg:pt-40 lg:pb-48 overflow-hidden bg-slate-50 border-b border-white">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-teal-300/30 rounded-full blur-[100px] mix-blend-multiply"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, -5, 0],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-300/30 rounded-full blur-[100px] mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-teal-100 shadow-sm text-teal-800 font-medium text-sm mb-8"
            >
              <Sparkles className="w-4 h-4 text-teal-500" />
              <span>Polite Doctor & Smooth Procedures</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, type: 'spring' }}
              className="text-5xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tight text-slate-900 mb-8"
            >
              Exceptional Dental Care in <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-400">Borigumma</span>.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl lg:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
            >
              Quality treatment worth the price. We listen patiently, explain simply, and treat with the utmost care. Identifies as women-owned.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex justify-center"
            >
              <Link 
                to={user ? "/portal" : "#reviews"} 
                className="inline-flex h-16 items-center justify-center rounded-2xl bg-teal-600 px-8 py-4 text-lg font-medium text-white shadow-xl shadow-teal-500/30 hover:bg-teal-500 hover:scale-105 hover:shadow-teal-500/40 transition-all duration-300 transform group"
              >
                {user ? "Go to Patient Portal" : "See Patient Stories"}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ratings Banner */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, type: "spring" }}
        className="relative z-20 -mt-16 max-w-6xl mx-auto px-4 w-full"
      >
        <div className="bg-slate-900 rounded-[2rem] shadow-2xl backdrop-blur-xl border border-slate-800/50 p-8 md:p-10">
          <div className="flex flex-col md:flex-row items-center justify-evenly gap-8 md:gap-12">
            <div className="flex items-center gap-6">
              <div className="text-5xl md:text-6xl font-display font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">5.0</div>
              <div className="flex flex-col gap-1">
                <div className="flex text-amber-400 gap-1 mt-1 drop-shadow-md">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 fill-current" />)}
                </div>
                <div className="text-slate-400 text-sm font-medium tracking-wide">Based on 208 Google reviews</div>
              </div>
            </div>
            
            <div className="hidden md:block w-px h-16 bg-slate-800"></div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center gap-8 text-slate-300 font-medium whitespace-nowrap overflow-x-auto pb-2 md:pb-0 scrollbar-hide"
            >
              <div className="flex items-center gap-3"><Heart className="w-6 h-6 text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]" /> Polite Behavior</div>
              <div className="flex items-center gap-3"><ShieldCheck className="w-6 h-6 text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]" /> Quality Treatment</div>
              <div className="flex items-center gap-3"><Sparkles className="w-6 h-6 text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]" /> Smooth Procedures</div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Reviews Section */}
      <section id="reviews" className="py-24 bg-slate-50 relative overflow-hidden scroll-mt-20">
        {/* Background elements */}
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 0.1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="absolute top-0 right-0 w-96 h-96 bg-teal-300 rounded-full blur-[100px]"
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">Patient Experiences</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">Don’t just take our word for it. Here’s what our real patients have to say about their visits to Sai Krupa Dental Care.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.15, type: 'spring', stiffness: 50 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-full transform transition-shadow hover:shadow-xl hover:shadow-teal-100"
              >
                <div className="flex text-amber-400 mb-6 gap-1">
                  {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-slate-700 italic flex-1 text-lg leading-relaxed">"{review.text}"</p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold font-display text-lg">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{review.name}</h4>
                    <span className="text-sm text-slate-500">{review.time}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About/Directions Section */}
      <section id="about" className="py-24 bg-white relative overflow-hidden scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.2 }}
            className="bg-teal-900 rounded-[40px] overflow-hidden flex flex-col lg:flex-row relative shadow-2xl shadow-teal-900/20"
          >
            {/* Abstract Background pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            
            <div className="lg:w-1/2 p-12 lg:p-16 text-white relative z-10 flex flex-col justify-center">
              <motion.h2 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-3xl md:text-5xl font-display font-bold mb-6 text-white"
              >
                Visit Our Clinic
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-teal-100 mb-10 text-lg leading-relaxed"
              >
                Located in the heart of Borigumma, we provide high-quality treatment for your teeth. Whether you are a newcomer or an old patient, our polite staff is ready to help.
              </motion.p>
              
              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="flex items-start gap-4 bg-teal-800/50 p-4 rounded-2xl backdrop-blur-sm transition-colors hover:bg-teal-800/70"
                >
                  <MapPin className="w-6 h-6 text-teal-300 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white">Address</h4>
                    <p className="text-teal-100">Nilakantheswar marg,<br />Borigumma, Odisha 764056</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="flex items-start gap-4 bg-teal-800/50 p-4 rounded-2xl backdrop-blur-sm transition-colors hover:bg-teal-800/70"
                >
                  <Clock className="w-6 h-6 text-teal-300 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white">Hours</h4>
                    <p className="text-teal-100">Open Daily: 6:00 AM - 1:30 PM,<br/>Reopens 5:30 PM - 9:00 PM</p>
                  </div>
                </motion.div>
              </div>
            </div>
            
            <div className="lg:w-1/2 min-h-[400px] lg:min-h-auto relative overflow-hidden">
              {/* Using a solid color or an abstract gradient as a placeholder for map */}
              <motion.div 
                initial={{ scale: 1.1, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="absolute inset-0 bg-slate-100 flex items-center justify-center p-8 text-center group"
              >
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 transform group-hover:-translate-y-1 group-hover:scale-105 transition-all duration-300 z-10 relative">
                  <MapPin className="w-10 h-10 text-teal-600 mx-auto mb-4 animate-bounce" />
                  <h3 className="font-display font-bold text-lg text-slate-900">Sai Krupa Dental Care</h3>
                  <p className="text-slate-500 text-sm mt-1">2HX3+5X Borigumma, Odisha</p>
                  <a href="https://maps.google.com/?q=Sai+Krupa+Dental+Care,Borigumma" target="_blank" rel="noreferrer" className="mt-4 inline-block text-teal-600 font-medium text-sm hover:underline">
                    Get Directions
                  </a>
                </div>
                {/* Decorative map-like elements */}
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.6, 0.4, 0.6]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-1/4 left-1/4 w-32 h-32 bg-teal-100 rounded-full blur-2xl opacity-60"
                ></motion.div>
                <motion.div 
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 0.2, 0.4]
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-teal-200 rounded-full blur-3xl opacity-40"
                ></motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
