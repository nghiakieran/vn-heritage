import { MoveRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import React from 'react'

const FeatureItem = ({ item }) => {
  return (
    <div className='flex flex-col p-6 shadow-md rounded-lg items-center'>
      <div className='h-16 w-16 rounded-full bg-heritage-light mb-6 flex items-center justify-center'>
        <item.icon className='h-8 w-8 text-heritage-dark' />
      </div>
      <h3 className='text-xl mb-3 font-medium text-heritage-dark'>{item.title}</h3>
      <p className='text-muted-foreground mb-4 flex-grow text-center'>{item.description}</p>
      <Link to={item.to} className='inline-flex items-center justify-center gap-2 text-sm px-4 py-2 h-10 w-full font-medium border hover:bg-accent hover:text-accent-foreground rounded-md'>
        Khám phá ngay
        <MoveRight className='ml-2' size={16} />
      </Link>
    </div>
  )
}

export default FeatureItem
