import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Home } from './Home'

vi.mock('../assets/about/cutGinger.jpg', () => ({ default: 'cutGinger.jpg' }))
vi.mock('../assets/about/ginger-field.jpg', () => ({ default: 'ginger-field.jpg' }))
vi.mock('../assets/about/ginger-harvest.jpeg', () => ({ default: 'ginger-harvest.jpeg' }))

describe('Home page', () => {
  beforeEach(() => {
    render(<Home />)
  })

  // ── Static content ──────────────────────────────────────────────────────────

  describe('Hero section', () => {
    it('renders the scroll cue text', () => {
      expect(screen.getByText('Scroll')).toBeInTheDocument()
    })

    it('renders the hero background video', () => {
      const video = document.querySelector('.home-hero__video')
      expect(video).toBeInTheDocument()
      expect(video).toHaveAttribute('poster', 'cutGinger.jpg')
    })

    it('renders the lead paragraph', () => {
      expect(screen.getByText(/Premium ginger sourced directly from farms/i)).toBeInTheDocument()
    })

    it('renders Browse Catalogue link pointing to /Catalogue', () => {
      expect(screen.getByRole('link', { name: /Browse Catalogue/i })).toHaveAttribute('href', '/Catalogue')
    })

    it('renders Get in Touch link pointing to /Contact', () => {
      expect(screen.getByRole('link', { name: /Get in Touch/i })).toHaveAttribute('href', '/Contact')
    })
  })

  describe('Products section', () => {
    it('renders the section heading', () => {
      expect(screen.getByRole('heading', { name: 'Our Products' })).toBeInTheDocument()
    })

    it('renders Chinese Ginger product name and origin', () => {
      expect(screen.getByRole('heading', { name: 'Chinese Ginger' })).toBeInTheDocument()
      expect(screen.getByText('Shandong, China')).toBeInTheDocument()
    })

    it('renders Peru Ginger product name and origin', () => {
      expect(screen.getByRole('heading', { name: 'Peru Ginger' })).toBeInTheDocument()
      expect(screen.getByText('Junín, Peru')).toBeInTheDocument()
    })

    it('renders product images with correct alt text', () => {
      expect(screen.getByAltText('Chinese Ginger')).toBeInTheDocument()
      expect(screen.getByAltText('Peru Ginger')).toBeInTheDocument()
    })

    it('renders Chinese Ginger keywords', () => {
      expect(screen.getByText('Organic')).toBeInTheDocument()
      expect(screen.getByText('Grade A')).toBeInTheDocument()
      expect(screen.getByText('Year-round supply')).toBeInTheDocument()
    })

    it('renders Peru Ginger keywords', () => {
      expect(screen.getByText('Mild flavor')).toBeInTheDocument()
      expect(screen.getByText('Export quality')).toBeInTheDocument()
      expect(screen.getByText('Seasonal harvest')).toBeInTheDocument()
    })

    it('renders product descriptions', () => {
      expect(screen.getByText(/bold, pungent, and aromatic/i)).toBeInTheDocument()
      expect(screen.getByText(/milder, slightly sweet ginger/i)).toBeInTheDocument()
    })
  })

  describe('Why GreenEarth section', () => {
    it('renders the section heading', () => {
      expect(screen.getByRole('heading', { name: 'Why GreenEarth' })).toBeInTheDocument()
    })

    it('renders Sustainable Farming card', () => {
      expect(screen.getByRole('heading', { name: 'Sustainable Farming' })).toBeInTheDocument()
      expect(screen.getByText(/soil health and eco-friendly practices/i)).toBeInTheDocument()
    })

    it('renders Quality & Transparency card', () => {
      expect(screen.getByRole('heading', { name: 'Quality & Transparency' })).toBeInTheDocument()
      expect(screen.getByText(/lab-tested and fully documented/i)).toBeInTheDocument()
    })

    it('renders Direct & Reliable card', () => {
      expect(screen.getByRole('heading', { name: 'Direct & Reliable' })).toBeInTheDocument()
      expect(screen.getByText(/No middlemen/i)).toBeInTheDocument()
    })
  })

  describe('Reviews section', () => {
    it('renders the section heading', () => {
      expect(screen.getByRole('heading', { name: 'What Clients Say' })).toBeInTheDocument()
    })

    it('renders all review authors (at least once each)', () => {
      expect(screen.getAllByText('Maria L.').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('James T.').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('Sara K.').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('David R.').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('Anika K.').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('Thomas R.').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('Lena D.').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('Sophie F.').length).toBeGreaterThanOrEqual(1)
    })

    it('renders review roles', () => {
      expect(screen.getAllByText('Head of Procurement, FoodCo').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('Product Developer, TeaHouse').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('Operations Manager, SpiceTrade').length).toBeGreaterThanOrEqual(1)
    })

    it('renders five-star ratings', () => {
      expect(screen.getAllByText('★★★★★').length).toBeGreaterThan(0)
    })

    it('renders four-star ratings with one empty star', () => {
      expect(screen.getAllByText('★★★★☆').length).toBeGreaterThan(0)
    })
  })

  // ── Interaction ─────────────────────────────────────────────────────────────

  describe('Interaction – link clicks', () => {
    it('Browse Catalogue link can be clicked and remains in the DOM', async () => {
      const user = userEvent.setup()
      const link = screen.getByRole('link', { name: /Browse Catalogue/i })
      await user.click(link)
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/Catalogue')
    })

    it('Get in Touch link can be clicked and remains in the DOM', async () => {
      const user = userEvent.setup()
      const link = screen.getByRole('link', { name: /Get in Touch/i })
      await user.click(link)
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/Contact')
    })
  })

  describe('Interaction – keyboard navigation', () => {
    it('first Tab keystroke focuses Browse Catalogue link', async () => {
      const user = userEvent.setup()
      await user.tab()
      expect(screen.getByRole('link', { name: /Browse Catalogue/i })).toHaveFocus()
    })

    it('second Tab keystroke moves focus to Get in Touch link', async () => {
      const user = userEvent.setup()
      await user.tab()
      await user.tab()
      expect(screen.getByRole('link', { name: /Get in Touch/i })).toHaveFocus()
    })

    it('Shift+Tab moves focus backwards from Get in Touch to Browse Catalogue', async () => {
      const user = userEvent.setup()
      await user.tab()
      await user.tab()
      expect(screen.getByRole('link', { name: /Get in Touch/i })).toHaveFocus()
      await user.tab({ shift: true })
      expect(screen.getByRole('link', { name: /Browse Catalogue/i })).toHaveFocus()
    })

    it('Enter key activates the focused Browse Catalogue link', async () => {
      const user = userEvent.setup()
      const link = screen.getByRole('link', { name: /Browse Catalogue/i })
      link.focus()
      expect(link).toHaveFocus()
      await user.keyboard('{Enter}')
      expect(link).toHaveAttribute('href', '/Catalogue')
    })
  })

  describe('Interaction – accessibility', () => {
    it('every link element has an accessible name', () => {
      screen.getAllByRole('link').forEach((link) => {
        expect(link).toHaveAccessibleName()
      })
    })

    it('reviews track has an accessible label', () => {
      expect(screen.getByLabelText('Client reviews')).toBeInTheDocument()
    })

    it('product images have descriptive alt text', () => {
      expect(screen.getByAltText('Chinese Ginger')).toHaveAttribute('alt', 'Chinese Ginger')
      expect(screen.getByAltText('Peru Ginger')).toHaveAttribute('alt', 'Peru Ginger')
    })
  })
})
