// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { StartScreen } from './StartScreen'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('Adventure Files start screen', () => {
  it('renders the title and one plain PRESS START button', () => {
    render(<StartScreen onStart={vi.fn()} />)

    expect(
      screen.getByRole('heading', { name: 'ADVENTURE FILES' }),
    ).toBeTruthy()

    expect(
      screen.getByRole('button', { name: 'PRESS START' }),
    ).toBeTruthy()

    expect(screen.queryByText('PT')).toBeNull()
    expect(screen.queryByText('EN')).toBeNull()

    expect(
      document.querySelector('source[media="(orientation: portrait)"]')
        ?.getAttribute('srcset'),
    ).toBe('/art/adventure-files-start-mobile.png')
  })

  it('begins immediately when reduced motion is preferred', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }))
    const onStart = vi.fn()

    render(<StartScreen onStart={onStart} />)

    fireEvent.click(screen.getByRole('button', { name: 'PRESS START' }))

    expect(onStart).toHaveBeenCalledTimes(1)
  })

  it('uses the closing iris before opening login', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }))
    vi.useFakeTimers()
    const onStart = vi.fn()

    const { container } = render(<StartScreen onStart={onStart} />)

    fireEvent.click(screen.getByRole('button', { name: 'PRESS START' }))
    expect(
      container.querySelector('.start-screen__content--closing'),
    ).toBeTruthy()
    expect(onStart).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(720)
    })

    expect(onStart).toHaveBeenCalledTimes(1)
  })

  it('accepts Enter on the focused start control', async () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }))
    const onStart = vi.fn()
    const user = userEvent.setup()

    render(<StartScreen onStart={onStart} />)

    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'PRESS START' }),
    )

    await user.keyboard('{Enter}')

    expect(onStart).toHaveBeenCalledTimes(1)
  })
})
