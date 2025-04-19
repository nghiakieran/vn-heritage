const SectionContainer = ({ id, className, children }) => {
  return (
    <section id={id} className={className}>
      <div className='lcn-container-x'>
        {children}
      </div>
    </section>
  )
}

export default SectionContainer
