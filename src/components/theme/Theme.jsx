import React, { useContext } from 'react'
import { ConfigContext } from '../../constants/globals'

export default function Theme({ children }) {
    const { config } = useContext(ConfigContext)
    const theme = localStorage.getItem('theme')
    return (
        <div className='relative' data-theme={theme ? theme : config?.app?.theme}>
            {children}
        </div>
    )
}