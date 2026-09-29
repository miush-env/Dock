import React from 'react'

export default function Welcome({user}: {user: string}) {
  return (
    <section>
      <h2 className="text-5xl font-semibold text-balance tracking-[2.2px] text-black ">
        <span className='text-gray-500'>Hola {user},</span>
        ¿Qué sala querés abrir hoy?</h2>
    </section>
  )
}
