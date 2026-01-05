'use client'
import JssRegistry from './JssRegistry'
import ThemeRegistry from './ThemeRegistry'

export default function StylesProvider({ children }) {
    return (
        <JssRegistry>
            <ThemeRegistry>{children}</ThemeRegistry>
        </JssRegistry>
    )
}
