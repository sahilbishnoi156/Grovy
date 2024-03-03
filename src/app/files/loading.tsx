import Spinner from '@/components/Spinner'
import React from 'react'

export default function loading() {
  return (
    <div className='min-h-[90vh] w-full flex items-center justify-center'><Spinner height="h-8" width="w-8" color="text-orange-400"/></div>
  )
}
