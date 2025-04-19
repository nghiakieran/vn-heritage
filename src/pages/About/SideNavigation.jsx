import { Button } from '~/components/common/ui/Button'

const navigationItems = [
  { id: 'vision', icon: '🔭', label: 'Tầm nhìn' },
  { id: 'story', icon: '📚', label: 'Câu chuyện' },
  { id: 'values', icon: '💎', label: 'Giá trị cốt lõi' },
  { id: 'team', icon: '👥', label: 'Đội ngũ' },
]

const SideNavigation = ({ activeSection, setActiveSection }) => {
  return (
    <div className='hidden sm:block fixed left-8 top-1/2 transform -translate-y-1/2 z-30'>
      <div className='bg-white/80 backdrop-blur-sm rounded-full py-6 px-3 shadow-sm'>
        <nav className='flex flex-col items-center space-y-8'>
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id)
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })
              }}
              variant='ghost'
              size='icon'
              className={`group relative !rounded-full ${
                  activeSection === item.id ? 'bg-muted-foreground/70' : 'hover:bg-heritage-primary/70'
              }`}
              aria-label={item.label}
            >
              <span className='text-xl'>{item.icon}</span>
              <span className='absolute left-full ml-4 px-2 py-1 rounded bg-muted-foreground/70 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity'>
                {item.label}
              </span>
            </Button>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default SideNavigation
