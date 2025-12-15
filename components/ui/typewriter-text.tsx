"use client"

import { useEffect, useState } from "react"

interface TypewriterTextProps {
  phrases: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseTime?: number
  className?: string
}

export function TypewriterText({
  phrases,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseTime = 2000,
  className = "",
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex]

    const handleTyping = () => {
      if (isDeleting) {
        setDisplayedText((prev) => prev.slice(0, -1))
        if (displayedText === "") {
          setIsDeleting(false)
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length)
        }
      } else {
        setDisplayedText((prev) => currentPhrase.slice(0, prev.length + 1))
        if (displayedText === currentPhrase) {
          // Pause before deleting
          setTimeout(() => setIsDeleting(true), pauseTime)
        }
      }
    }

    const timer = setTimeout(
      handleTyping,
      isDeleting ? deletingSpeed : displayedText === currentPhrase ? pauseTime : typingSpeed,
    )

    return () => clearTimeout(timer)
  }, [displayedText, isDeleting, phrases, currentPhraseIndex, typingSpeed, deletingSpeed, pauseTime])

  return (
    <span className={className}>
      {displayedText}
      <span className="animate-blink">|</span>
    </span>
  )
}
