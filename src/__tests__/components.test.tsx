import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Spinner } from '../components/ui/Spinner'
import { Badge } from '../components/ui/Badge'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Avatar } from '../components/ui/Avatar'
import { Modal } from '../components/ui/Modal'
import { NotFound } from '../pages/NotFound'

// ─── Spinner ──────────────────────────────────────────────────────────────────
describe('Spinner', () => {
  it('renders an SVG with loading label', () => {
    render(<Spinner />)
    expect(screen.getByLabelText('Loading')).toBeInTheDocument()
  })

  it('applies sm size class', () => {
    render(<Spinner size="sm" />)
    const svg = screen.getByLabelText('Loading')
    expect(svg.getAttribute('class')).toContain('h-4')
  })

  it('applies lg size class', () => {
    render(<Spinner size="lg" />)
    const svg = screen.getByLabelText('Loading')
    expect(svg.getAttribute('class')).toContain('h-10')
  })

  it('merges custom className', () => {
    render(<Spinner className="text-red-500" />)
    const svg = screen.getByLabelText('Loading')
    expect(svg.getAttribute('class')).toContain('text-red-500')
  })
})

// ─── Badge ────────────────────────────────────────────────────────────────────
describe('Badge', () => {
  it('renders children text', () => {
    render(<Badge>Active</Badge>)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Badge className="bg-red-500">High</Badge>)
    const badge = screen.getByText('High')
    expect(badge.className).toContain('bg-red-500')
  })
})

// ─── ProgressBar ──────────────────────────────────────────────────────────────
describe('ProgressBar', () => {
  it('renders a progressbar role element', () => {
    render(<ProgressBar value={50} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('sets aria-valuenow correctly', () => {
    render(<ProgressBar value={75} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75')
  })

  it('clamps value above 100 to 100', () => {
    render(<ProgressBar value={150} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
  })

  it('clamps value below 0 to 0', () => {
    render(<ProgressBar value={-20} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
  })

  it('shows label when showLabel is true', () => {
    render(<ProgressBar value={42} showLabel />)
    expect(screen.getByText('42%')).toBeInTheDocument()
    expect(screen.getByText('Progress')).toBeInTheDocument()
  })

  it('does not show label by default', () => {
    render(<ProgressBar value={42} />)
    expect(screen.queryByText('42%')).not.toBeInTheDocument()
  })

  it('uses emerald color when value is 100', () => {
    render(<ProgressBar value={100} />)
    const bar = screen.getByRole('progressbar')
    expect(bar.className).toContain('emerald')
  })

  it('uses violet color when value is less than 100', () => {
    render(<ProgressBar value={80} />)
    const bar = screen.getByRole('progressbar')
    expect(bar.className).toContain('violet')
  })
})

// ─── Avatar ───────────────────────────────────────────────────────────────────
describe('Avatar', () => {
  it('renders an image when avatarUrl is provided', () => {
    render(<Avatar avatarUrl="https://example.com/avatar.png" name="Alice" />)
    expect(screen.getByRole('img')).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/avatar.png')
  })

  it('renders initials when no avatarUrl', () => {
    render(<Avatar name="Alice Brown" />)
    expect(screen.getByText('AB')).toBeInTheDocument()
  })

  it('falls back to email initials', () => {
    render(<Avatar email="test@example.com" />)
    expect(screen.getByText('TE')).toBeInTheDocument()
  })

  it('shows NA when nothing is provided', () => {
    render(<Avatar />)
    expect(screen.getByText('NA')).toBeInTheDocument()
  })
})

// ─── Modal ────────────────────────────────────────────────────────────────────
describe('Modal', () => {
  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Test Modal">
        <p>Content</p>
      </Modal>
    )
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument()
    expect(screen.queryByText('Content')).not.toBeInTheDocument()
  })

  it('renders title and children when isOpen is true', () => {
    render(
      <Modal isOpen onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    )
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Modal content')).toBeInTheDocument()
  })

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen onClose={onClose} title="Test Modal">
        <p>Content</p>
      </Modal>
    )
    fireEvent.click(screen.getByLabelText('Close modal'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn()
    const { container } = render(
      <Modal isOpen onClose={onClose} title="Test Modal">
        <p>Content</p>
      </Modal>
    )
    // Click the backdrop (first child of dialog)
    const backdrop = container.querySelector('[aria-hidden="true"]')!
    fireEvent.click(backdrop)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose on Escape key press', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen onClose={onClose} title="Test Modal">
        <p>Content</p>
      </Modal>
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('has correct aria attributes', () => {
    render(
      <Modal isOpen onClose={() => {}} title="Dialog Title">
        <p>Content</p>
      </Modal>
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title')
  })
})

// ─── NotFound page ────────────────────────────────────────────────────────────
describe('NotFound page', () => {
  it('renders 404 heading', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    )
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('renders page not found text', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    )
    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })

  it('renders a back to home link', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    )
    expect(screen.getByRole('link', { name: /back to home/i })).toBeInTheDocument()
  })
})
