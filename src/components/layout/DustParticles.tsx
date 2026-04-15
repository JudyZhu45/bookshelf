'use client'

import { useEffect, useState } from 'react'

export default function DustParticles() {
  const [particles, setParticles] = useState<Array<{ id: number; left: string; size: number; duration: number; delay: number }>>([])

  useEffect(() => {
    const items = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 15,
    }))
    setParticles(items)
  }, [])

  if (particles.length === 0) return null

  return (
    <div className="dust-container">
      {particles.map((p) => (
        <div
          key={p.id}
          className="dust"
          style={{
            left: p.left,
            bottom: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
