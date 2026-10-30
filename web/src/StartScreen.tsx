import { useEffect, useRef, useState } from 'react'
import './StartScreen.css'

/*
 * Total transition duration:
 *
 * 1600ms - Retro screen closing animation
 *  300ms - Black screen pause
 *
 * Total: 1900ms
 */

const IRIS_DURATION_MS = 1900

type StartScreenProps = {
  onStart: () => void
}

export function StartScreen({ onStart }: StartScreenProps) {
  const [closing, setClosing] = useState(false)

  const started = useRef(false)

  const timeout = useRef<number | null>(null)

  const startButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    // Enable keyboard interaction immediately.
    startButton.current?.focus()

    return () => {
      if (timeout.current !== null) {
        window.clearTimeout(timeout.current)
      }
    }
  }, [])

  function beginAdventure() {
    // Prevent multiple transitions.
    if (started.current) {
      return
    }

    started.current = true

    /*
     * Respect reduced-motion accessibility preferences.
     */
    if (
      window.matchMedia?.(
        '(prefers-reduced-motion: reduce)',
      ).matches
    ) {
      onStart()
      return
    }

    /*
     * Start the retro closing animation.
     */
    setClosing(true)

    /*
     * Wait for:
     * - 1600ms of animation
     * - 300ms of black screen
     *
     * Then open the login screen.
     */
    timeout.current = window.setTimeout(
      onStart,
      IRIS_DURATION_MS,
    )
  }

  return (
    <main
      className="start-screen"
      aria-label="Adventure Files start screen"
    >
      <div className="start-screen__frame">
        <div
          className={
            closing
              ? 'start-screen__content start-screen__content--closing'
              : 'start-screen__content'
          }
        >
          {/* Responsive pixel art illustration */}

          <picture className="start-screen__artwork">
            <source
              media="(orientation: portrait)"
              srcSet="/art/adventure-files-start-mobile.png"
            />

            <img
              src="/art/adventure-files-start-desktop.png"
              alt=""
              draggable={false}
            />
          </picture>

          {/* Animated game title */}

          <h1
            className="start-screen__title"
            aria-label="ADVENTURE FILES"
          >
            <span>ADVENTURE</span>
            <span>FILES</span>
          </h1>

          {/* Classic blinking PRESS START */}

          <button
            ref={startButton}
            className="start-screen__press"
            type="button"
            onClick={beginAdventure}
            disabled={closing}
          >
            PRESS START
          </button>
        </div>
      </div>
    </main>
  )
}
