import React from 'react'
import Sidebar from './Sidebar'

const Setting = () => {
    return (
        <div className="flex min-h-screen bg-background text-text-primary">
            <Sidebar />

            <main className="flex-1 p-8 mt-20">


                Hello setting
            </main>
        </div>
    )
}

export default Setting