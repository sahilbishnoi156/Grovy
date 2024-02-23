import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

export default function pages() {
  return (
    <div className='h-[90vh] w-full flex items-center justify-center text-2xl flex-col gap-4'>
        Still Implimenting
        <Button><Link href={'/'}>Go Back</Link></Button>
    </div>
  )
}
