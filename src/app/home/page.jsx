import React from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/option'
import {redirect } from 'next/navigation'
import Signout from './signout'

const HomePage =async () => {
  const session = await getServerSession(authOptions)
  if(!session)
  {
    redirect("/")
  }
  return (
   <div>
     <div>HomePage</div>
    <p>{JSON.stringify(session)}</p>
    <Signout/>
   </div>
  )
}

export default HomePage