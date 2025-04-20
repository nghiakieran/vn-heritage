const SectionContainer = ({ id, className, children }) => {
  return (
    <section id={id} className={className} data-section-id={id}>
      <div className='lcn-container-x'>
        {children}
      </div>
    </section>
  )
}

export default SectionContainer
