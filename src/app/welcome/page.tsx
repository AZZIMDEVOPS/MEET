'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRef } from 'react'
import { ArrowRight, Users, Calendar, Compass, MapPin, Sparkles, ChevronRight } from 'lucide-react'
import { MeetLogo } from '@/components/ui/MeetLogo'

const FEATURES = [
  {
    icon: Users,
    title: 'People',
    description: 'Discover people worth knowing. Connect with professionals, creatives and adventurers near you.',
    color: 'text-blue-600',
    iconBg: 'bg-blue-50 border-blue-200',
  },
  {
    icon: Calendar,
    title: 'Events',
    description: 'Find events worth attending. Tech meetups, art shows, hiking groups and experiences of every kind.',
    color: 'text-blue-600',
    iconBg: 'bg-blue-50 border-blue-200',
  },
  {
    icon: Compass,
    title: 'Communities',
    description: 'Join communities that share your passions. From startup founders to photography enthusiasts.',
    color: 'text-blue-600',
    iconBg: 'bg-blue-50 border-blue-200',
  },
  {
    icon: MapPin,
    title: 'Places',
    description: 'Discover places where people gather. Coworking spaces, cafes, parks and cultural venues.',
    color: 'text-blue-600',
    iconBg: 'bg-blue-50 border-blue-200',
  },
]

const TAGLINE_WORDS = ['People.', 'Places.', 'Experiences.']

function AnimatedTagline() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
      {TAGLINE_WORDS.map((word, i) => (
        <motion.span
          key={word}
          className={`text-lg md:text-xl font-medium tracking-wider ${
            i === 0 ? 'text-blue-600' : i === 1 ? 'text-blue-700' : 'text-blue-800'
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 + i * 0.15, duration: 0.5 }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  )
}

function NavBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <MeetLogo size="md" />
        <nav className="hidden md:flex items-center gap-6">
          {['Discover', 'Events', 'Communities', 'People'].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-4 py-2">
            Sign in
          </Link>
          <Link href="/auth/signup">
            <motion.button
              className="btn-blue text-sm py-2 px-5 font-semibold"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Join MEET
            </motion.button>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      <NavBar />

      {/* HERO */}
      <section
        ref={heroRef}
        className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden pt-20"
      >
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Brand badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-sm font-medium mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles size={14} className="text-blue-600" />
            <span>Introducing MEET by ReGNL</span>
          </motion.div>

          {/* Main headline - Consistent Official Brand Logo */}
          <motion.div
            className="mb-8 flex justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="sr-only">MEET — People. Places. Experiences.</h1>
            <MeetLogo size="hero" align="center" />
          </motion.div>

          {/* Tagline */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <AnimatedTagline />
          </motion.div>

          {/* Supporting copy */}
          <motion.p
            className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            Discover people worth knowing, places worth exploring and experiences worth sharing.
            Social media that moves you from the screen to real life.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.3 }}
          >
            <Link href="/auth/signup">
              <motion.button
                className="btn-blue text-base px-8 py-4 w-full sm:w-auto font-semibold flex items-center justify-center gap-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Join MEET <ArrowRight size={18} />
              </motion.button>
            </Link>
            <Link href="/discover">
              <motion.button
                className="btn-outline text-base px-8 py-4 w-full sm:w-auto font-semibold"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Explore Platform
              </motion.button>
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            className="mt-12 flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
          >
            <div className="flex -space-x-2">
              {['amara.jpg', 'kwame.jpg', 'sadia.jpg', 'david.jpg', 'aisha.jpg'].map((file) => (
                <img
                  key={file}
                  src={`/avatars/${file}`}
                  alt="MEET Member"
                  className="w-8 h-8 rounded-full ring-2 ring-white object-cover"
                />
              ))}
            </div>
            <span className="text-sm text-slate-700 font-medium">
              Join <strong className="text-slate-900 font-bold">12,000+</strong> people already on MEET
            </span>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-slate-300 rounded-full flex items-start justify-center p-1.5">
            <div className="w-1.5 h-2.5 bg-blue-600 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* FEATURES / DISCOVER */}
      <section className="py-24 px-6 border-t border-slate-200 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Discover <span className="text-blue-600">everything</span>
            </h2>
            <p className="text-slate-600 text-lg max-w-xl mx-auto">
              One platform to discover the people, places and experiences that matter to you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map(({ icon: Icon, title, description, color, iconBg }, i) => (
              <motion.div
                key={title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-blue-500 hover:shadow-md transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className={`w-10 h-10 rounded-xl border ${iconBg} flex items-center justify-center mb-4`}>
                  <Icon size={20} className={color} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONNECT */}
      <section className="py-24 px-6 border-y border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-4 block">Connect</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                Build real connections,<br />
                <span className="text-blue-600">not just follows</span>
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                Follow people, join communities, make connections and start real conversations.
                MEET is built for human connection — not just digital engagement.
              </p>
              <div className="space-y-4">
                {[
                  'Follow people who inspire you',
                  'Build professional and personal connections',
                  'Join communities around shared interests',
                  'Start authentic conversations',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                    </div>
                    <span className="text-slate-700 text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {/* UI mock */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-md">
                {[
                  { name: 'Amara Wanjiku', role: 'Lead UX Designer @ iHub', avatar: '/avatars/amara.jpg', action: 'Connect' },
                  { name: 'Kwame Mensah', role: 'Documentary Storyteller', avatar: '/avatars/kwame.jpg', action: 'Follow' },
                  { name: 'Sadia Ibrahim', role: 'Fintech Founder @ PayAfrica', avatar: '/avatars/sadia.jpg', action: 'Connect' },
                ].map((user) => (
                  <motion.div
                    key={user.name}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                    whileHover={{ x: 4 }}
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/20"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.role} · Nairobi</p>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors">
                      {user.action}
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MEET */}
      <section className="py-24 px-6 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              className="order-2 lg:order-1"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {/* Events mockup */}
              <div className="space-y-3">
                {[
                  { title: 'Nairobi Tech Meetup', date: 'Sat 27 Sep • 2PM', count: 147, category: 'Technology' },
                  { title: 'Photography Walk — Karura', date: 'Sun 28 Sep • 7AM', count: 23, category: 'Photography' },
                  { title: 'Startup Founders Night', date: 'Fri 26 Sep • 6PM', count: 68, category: 'Business' },
                ].map(({ title, date, count }) => (
                  <motion.div
                    key={title}
                    className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center gap-4 shadow-sm hover:border-blue-500 hover:shadow-md transition-all"
                    whileHover={{ x: 4 }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0 text-blue-600">
                      <Calendar size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{title}</p>
                      <p className="text-xs text-slate-500">{date}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-bold text-slate-900">{count}</p>
                      <p className="text-[10px] text-slate-500">going</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="order-1 lg:order-2"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-4 block">Meet</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                From discovery<br />
                <span className="text-blue-600">to real life</span>
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                Attend events, join activities, meet people nearby.
                MEET turns digital discovery into real-world experiences.
              </p>
              <Link href="/events">
                <button className="btn-outline flex items-center gap-2">
                  Explore Events <ChevronRight size={16} />
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MEET AI */}
      <section className="py-24 px-6 bg-blue-50/40 border-y border-slate-200">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-100/60 text-blue-700 text-sm font-medium mb-8">
              <Sparkles size={14} className="text-blue-600" />
              <span>Available Now</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
              Meet <span className="text-blue-600">MEET AI</span>
            </h2>
            <p className="text-slate-600 text-lg mb-10 max-w-2xl mx-auto">
              Your intelligent guide to people, places and experiences.
              Just ask — and MEET AI finds the perfect match for you.
            </p>

            {/* AI Chat Mock */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-left max-w-2xl mx-auto shadow-md">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
                  <Sparkles size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">MEET AI</p>
                  <p className="text-[10px] text-slate-500">Your social discovery guide</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { role: 'user', content: 'Find photography events near Nairobi this weekend.' },
                  { role: 'assistant', content: "I found 3 photography events near you this weekend:\n\n• Photography Walk — Karura Forest (Sunday 7AM, free)\n• Street Photography Workshop (Saturday 2PM, KES 1,500)\n• Golden Hour Shoot — Nairobi CBD (Sunday 5PM, free)\n\nWould you like to join any of these?" },
                ].map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] text-sm px-4 py-3 rounded-2xl whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-sm'
                        : 'bg-slate-100 text-slate-800 rounded-tl-sm border border-slate-200'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-3">
                <input
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
                  placeholder="Ask MEET AI anything..."
                  readOnly
                />
                <Link href="/meet-ai">
                  <button className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors">
                    Try it
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MEET & MEAT TEASER */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="rounded-2xl border border-slate-200 bg-white p-8 md:p-12 text-center shadow-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-300 bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-6">
              18+ Only
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
              MEET & MEAT
            </h2>
            <p className="text-slate-600 text-base max-w-xl mx-auto mb-8">
              A separate adult experience inside MEET. Discover, match and connect with people who share your interests and preferences. Privacy, safety and consent built in from the ground up.
            </p>
            <Link href="/meet-and-meat">
              <button className="px-6 py-3 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 text-sm font-semibold">
                Learn more
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 px-6 text-center relative overflow-hidden border-t border-slate-200 bg-slate-50/50">
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.p
            className="text-slate-500 text-lg mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            The internet helped us connect virtually.
          </motion.p>
          <motion.h2
            className="text-4xl md:text-6xl font-black text-slate-900 mb-8 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            MEET helps you<br />
            connect in <span className="text-blue-600">real life.</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/auth/signup">
              <motion.button
                className="btn-blue text-lg px-10 py-5 font-bold flex items-center justify-center gap-2 mx-auto"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Join MEET <ArrowRight size={20} />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 py-12 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <MeetLogo size="sm" showTagline />
          <div className="flex flex-wrap items-center gap-6">
            {['Privacy', 'Terms', 'Safety', 'Help', 'Careers'].map((item) => (
              <Link key={item} href="#" className="text-xs text-slate-700 hover:text-blue-600 font-semibold transition-colors">
                {item}
              </Link>
            ))}
          </div>
          <p className="text-xs text-slate-600 font-medium">Concept and Dev By ReGNL. 2026</p>
        </div>
      </footer>
    </div>
  )
}
