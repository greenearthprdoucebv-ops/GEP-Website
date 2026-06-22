import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Home } from './Home'

vi.mock('../assets/about/cutGinger.jpg', () => ({ default: 'cutGinger.jpg' }))
vi.mock('../assets/about/China Ginger.png', () => ({ default: 'China Ginger.png' }))
vi.mock('../assets/about/img1.png', () => ({ default: 'img1.png' }))
vi.mock('../assets/about/ginger-field.jpg', () => ({ default: 'ginger-field.jpg' }))
vi.mock('../assets/about/ginger-harvest.jpeg', () => ({ default: 'ginger-harvest.jpeg' }))
vi.mock('../assets/about/GEPHeroSection.mp4', () => ({ default: 'GEPHeroSection.mp4' }))

describe('Home page', () => {
  beforeEach(() => {
    render(<Home />)
  })

  it('renders hero action links', () => {
    expect(screen.getByRole('link', { name: /Browse Catalogue/i })).toHaveAttribute('href', '/catalogue')
    expect(screen.getByRole('link', { name: /Get in Touch/i })).toHaveAttribute('href', '/contact')
  })

  it('renders the products section heading', () => {
    expect(screen.getByRole('heading', { name: 'Our Products' })).toBeInTheDocument()
  })

  it('renders the why GreenEarth section', () => {
    expect(screen.getByRole('heading', { name: 'Why GreenEarth' })).toBeInTheDocument()
    expect(screen.getByText(/soil health and eco-friendly practices/i)).toBeInTheDocument()
  })

  it('renders the certifications section', () => {
    expect(screen.getByRole('heading', { name: 'Certifications & Standards' })).toBeInTheDocument()
  })

  it('supports keyboard navigation for hero links', async () => {
    const user = userEvent.setup()
    await user.tab()
    expect(screen.getByRole('link', { name: /Browse Catalogue/i })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('link', { name: /Get in Touch/i })).toHaveFocus()
  })
})
