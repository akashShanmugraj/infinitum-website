'use client'

import React from 'react'
import { ThemeProvider } from 'react-jss'
import theme from '@/settings/theme'

export default function ThemeRegistry({ children }) {
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
