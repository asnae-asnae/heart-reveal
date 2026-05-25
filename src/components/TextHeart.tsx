import { useEffect, useRef } from 'react'

interface Point {
  x: number
  y: number
  alpha: number
  targetAlpha: number
  delay: number
}

export default function TextHeart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let points: Point[] = []
    let startTime: number | null = null
    const fontSize = 14
    const word = "Hind"

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initPoints()
    }

    const initPoints = () => {
      points = []
      const cx = canvas.width / 2
      const cy = canvas.height / 2 + 10
      const s = Math.min(canvas.width, canvas.height) / 48

      // Outer heart — sparse, clean
      for (let t = 0; t < Math.PI * 2; t += 0.12) {
        const x = 16 * Math.pow(Math.sin(t), 3)
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
        points.push({
          x: cx + x * s,
          y: cy + y * s,
          alpha: 0,
          targetAlpha: 0.6 + Math.random() * 0.3,
          delay: 500 + Math.random() * 1500,
        })
      }

      // One inner layer — just enough to fill
      for (let t = 0; t < Math.PI * 2; t += 0.1) {
        const x = 16 * Math.pow(Math.sin(t), 3)
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
        points.push({
          x: cx + x * s * 0.65,
          y: cy + y * s * 0.65,
          alpha: 0,
          targetAlpha: 0.35 + Math.random() * 0.25,
          delay: 1000 + Math.random() * 2000,
        })
      }
    }

    const draw = (time: number) => {
      if (!startTime) startTime = time
      const elapsed = time - startTime

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw particles
      points.forEach(p => {
        if (elapsed > p.delay) {
          p.alpha += (p.targetAlpha - p.alpha) * 0.025
        }
        if (p.alpha > 0.01) {
          ctx.globalAlpha = p.alpha
          ctx.fillStyle = '#ff4d6d'
          ctx.font = `${fontSize}px "Fira Code", monospace`
          const m = ctx.measureText(word)
          ctx.fillText(word, p.x - m.width / 2, p.y)
        }
      })
      ctx.globalAlpha = 1

      // Big center text after heart is visible
      const heartVisible = elapsed > 2800
      if (heartVisible) {
        const fadeIn = Math.min(1, (elapsed - 2800) / 1200)
        ctx.globalAlpha = fadeIn
        ctx.fillStyle = '#ff4d6d'
        ctx.font = `bold ${Math.min(canvas.width, canvas.height) * 0.065}px "Fira Code", monospace`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        // Shadow glow
        ctx.shadowColor = '#ff4d6d'
        ctx.shadowBlur = 30

        ctx.fillText('i love you', canvas.width / 2, canvas.height / 2)

        ctx.shadowBlur = 0
        ctx.globalAlpha = 1
      }

      animationFrameId = requestAnimationFrame(draw)
    }

    window.addEventListener('resize', resize)
    resize()
    animationFrameId = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
    />
  )
}
