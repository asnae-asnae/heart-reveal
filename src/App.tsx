import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Lock, Eye, EyeOff } from 'lucide-react'
import TextHeart from './components/TextHeart'

const CORRECT_PASSWORD = 'hind'

export default function App() {
  const [stage, setStage] = useState<'password' | 'decrypting' | 'reveal'>('password')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [glitch, setGlitch] = useState(false)
  const [decryptDots, setDecryptDots] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (stage === 'password') {
      setPassword('')
      setError(false)
      setGlitch(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [stage])

  // Decrypting animation
  useEffect(() => {
    if (stage !== 'decrypting') return
    const dotInterval = setInterval(() => {
      setDecryptDots(prev => prev.length >= 5 ? '' : prev + '.')
    }, 300)
    const revealTimer = setTimeout(() => setStage('reveal'), 2500)
    return () => {
      clearInterval(dotInterval)
      clearTimeout(revealTimer)
    }
  }, [stage])

  const handleSubmit = () => {
    if (password.toLowerCase().trim() === CORRECT_PASSWORD) {
      setGlitch(true)
      setTimeout(() => setStage('decrypting'), 500)
    } else {
      setError(true)
      setPassword('')
      setTimeout(() => {
        setError(false)
        inputRef.current?.focus()
      }, 800)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
    if (e.key === 'Escape') {
      setPassword('')
      inputRef.current?.focus()
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#050505] overflow-hidden">
      <div className="scanline" />

      {/* Glitch overlay on unlock */}
      {glitch && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0, 0.8, 0] }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 z-40 bg-pink-deep/20 pointer-events-none"
        />
      )}

      <AnimatePresence mode="wait">
        {stage === 'password' ? (
          <motion.div
            key="password"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full max-w-md p-8"
          >
            <div className="text-center space-y-8">
              <div className="space-y-2">
                <div className="flex justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                    className="w-14 h-14 rounded-full border border-pink-deep/30 bg-pink-deep/5 flex items-center justify-center"
                  >
                    <Lock size={22} className="text-pink-soft/80" />
                  </motion.div>
                </div>
                <h1 className="text-white/70 font-mono text-sm tracking-[0.3em] uppercase">
                  Encrypted Message
                </h1>
                <p className="text-white/20 text-[10px] font-mono tracking-widest">
                  enter passcode to decrypt
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative group">
                  <input
                    ref={inputRef}
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (error) setError(false)
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder='••••••'
                    className={`w-full bg-transparent border px-4 py-3 font-mono text-sm text-white/80 outline-none transition-all duration-300
                      ${error
                        ? 'border-red-500/60 text-red-400 placeholder-red-400/30'
                        : 'border-white/10 focus:border-pink-deep/40 focus:shadow-[0_0_20px_-8px_#ff2d7b]'
                      }`}
                    autoComplete="off"
                    spellCheck={false}
                    maxLength={20}
                  />
                  <button
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60 transition-colors"
                    tabIndex={-1}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400/60 text-[10px] font-mono tracking-wider"
                  >
                    ACCESS DENIED — incorrect passcode
                  </motion.p>
                )}
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={!password}
                className={`w-full py-3 font-mono text-xs tracking-[0.25em] uppercase transition-all duration-300
                  ${password
                    ? 'border border-pink-deep/30 bg-pink-deep/5 hover:bg-pink-deep/10 text-pink-soft cursor-pointer'
                    : 'border border-white/5 text-white/10 cursor-not-allowed'
                  }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <Lock size={14} />
                  Decrypt
                </span>
              </motion.button>

              <p className="text-white/10 text-[9px] font-mono tracking-widest animate-pulse">
                [Enter] to submit &nbsp;·&nbsp; [Esc] to clear
              </p>
            </div>
          </motion.div>
        ) : stage === 'decrypting' ? (
          <motion.div
            key="decrypting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <motion.p
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="font-mono text-pink-soft/60 text-sm tracking-[0.2em]"
            >
              DECRYPTING{decryptDots}
            </motion.p>

            {/* Decrypt progress bar */}
            <div className="mt-6 w-48 h-px bg-white/5 mx-auto overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.2, ease: 'easeInOut' }}
                className="h-full bg-pink-deep/40"
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative w-full h-screen flex items-center justify-center overflow-hidden"
          >
            <TextHeart />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 4.5, duration: 1.5 }}
              className="z-20 absolute bottom-16"
            >
              <motion.button
                onClick={() => setStage('password')}
                className="text-white/20 hover:text-white/60 transition-colors uppercase text-[10px] tracking-widest font-mono"
              >
                Re-encrypt
              </motion.button>
            </motion.div>

            <div className="absolute top-8 left-8 text-[10px] font-mono text-white/10 uppercase tracking-widest space-y-1">
              <div>ln: 420</div>
              <div>id: 0xDEADBEEF</div>
              <div>type: organic_emotion</div>
            </div>
            <div className="absolute bottom-8 right-8 text-[10px] font-mono text-white/10 uppercase tracking-widest">
              heart_reveal // success
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
