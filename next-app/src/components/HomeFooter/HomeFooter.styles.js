'use client';
const styles = theme => ({
    root: {
        position: 'relative',
        marginTop: 50,
        width: '100%'
    },
    content: {
        position: 'relative',
        zIndex: 10,
        padding: [20, 20, 40],
        maxWidth: 1400,
        margin: '0 auto'
    },

    // Logo Section
    logoSection: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 20
    },
    logo: {
        width: 200,
        height: 'auto',
        filter: `drop-shadow(0 0 10px ${theme.color.secondary.main})`,
        transition: 'filter 0.3s ease, transform 0.3s ease',
        '&:hover': {
            filter: `drop-shadow(0 0 20px ${theme.color.secondary.main})`,
            transform: 'scale(1.05)'
        },
        '@media (max-width: 768px)': {
            width: 150
        }
    },

    // Contact Grid
    contactGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 20,
        marginBottom: 40,
        width: '100%',
        '@media (max-width: 1024px)': {
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 30
        },
        '@media (max-width: 600px)': {
            gridTemplateColumns: 'repeat(1, 1fr)',
            gap: 30
        }
    },

    contactSection: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
    },

    sectionTitle: {
        fontFamily: theme.typography.primary,
        fontSize: 14,
        fontWeight: 700,
        color: theme.color.secondary.main,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        marginBottom: 15,
        paddingBottom: 8,
        borderBottom: `1px solid ${theme.color.secondary.dark}`,
        width: '100%',
        maxWidth: 200,
        textShadow: `0 0 8px ${theme.color.secondary.main}`
    },

    contactEntry: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 12,
        '&:last-child': {
            marginBottom: 0
        }
    },

    contactName: {
        fontFamily: theme.typography.secondary,
        fontSize: 14,
        fontWeight: 600,
        color: theme.color.text.primary,
        marginBottom: 2
    },

    contactPosition: {
        fontFamily: theme.typography.secondary,
        fontSize: 11,
        color: theme.color.primary.main,
        fontStyle: 'italic',
        marginBottom: 2,
        letterSpacing: '0.05em'
    },

    contactPhone: {
        fontFamily: theme.typography.secondary,
        fontSize: 13,
        color: theme.color.text.secondary,
        letterSpacing: '0.03em'
    },

    phoneLink: {
        color: 'inherit',
        textDecoration: 'none',
        transition: 'color 0.3s ease',
        '&:hover': {
            color: theme.color.primary.main
        }
    },

    // Social Section
    socialSection: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    socialLinks: {
        margin: 0
    },
    socialLinksItem: {
        fontSize: 24,
        color: theme.color.secondary.main,
        '&:hover': {
            color: theme.color.primary.main
        }
    }
});

export { styles };
