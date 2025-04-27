const SocialIcon = ({ name, url, iconPath }) => (
  <a
    href={url}
    target='_blank'
    rel='noopener noreferrer'
    aria-label={`Follow us on ${name}`}
    className='group focus:outline-none'
  >
    <svg
      role='img'
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='currentColor'
      className='opacity-65 group-hover:opacity-100 group-focus:opacity-100 group-hover:fill-heritage transition-all duration-200'
    >
      <title>{name}</title>
      <path d={iconPath} />
    </svg>
  </a>
)

export default SocialIcon
