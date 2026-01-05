'use client'

import React, { useState } from 'react'
import { JssProvider, SheetsRegistry, createGenerateId } from 'react-jss'
import { useServerInsertedHTML } from 'next/navigation'

export default function JssRegistry({ children }) {
    const [sheets] = useState(() => new SheetsRegistry())
    const [generateId] = useState(() => {
        let counter = 0
        return (rule, sheet) => {
            counter++
            // Sanitize prefix: remove parentheses and other invalid CSS selector chars
            const prefix = (sheet.options.classNamePrefix || 'jss')
                .replace(/[^a-zA-Z0-9_-]/g, '_')
            return `${prefix}_${rule.key}_${counter}`
        }
    })

    useServerInsertedHTML(() => {
        return (
            <style
                id="server-side-styles"
                dangerouslySetInnerHTML={{ __html: sheets.toString() }}
            />
        )
    })

    return (
        <JssProvider registry={sheets} generateId={generateId}>
            {children}
        </JssProvider>
    )
}
