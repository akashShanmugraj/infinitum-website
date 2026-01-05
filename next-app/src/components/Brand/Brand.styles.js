'use client';
const styles = theme => ({
  root: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: 'none',
    margin: 0,
    padding: 0,
    boxShadow: 'none',
    textShadow: 'none',
    width: '100%'
  },
  link: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    border: 'none',
    outline: 'none',
    userSelect: 'none'
  },
  title: {
    position: 'absolute',
    left: 0,
    top: 0,
    visibility: 'hidden'
  },
  presenter: {
    fontFamily: theme.typography.secondary,
    fontSize: '1.5rem',
    fontWeight: 400,
    letterSpacing: '0.5em',
    textTransform: 'uppercase',
    color: theme.color.heading.main,
    textAlign: 'center',
    marginBottom: '15px',
    textShadow: `0 0 8px ${theme.color.secondary.main}`
  },
  svg: {
    display: 'block',
    margin: '0 auto',
    border: 'none',
    padding: '10px 0',
    opacity: 0,
    width: '100%',
    maxWidth: '500px',
    filter: `drop-shadow(0 0 2px ${theme.color.secondary.main})`
  },
  path: {
    fill: 'none',
    strokeWidth: 14,
    stroke: theme.color.heading.main,
    strokeLinecap: 'square',
    transition: `stroke ${theme.animation.time}ms ease-out`
  },
  dates: {
    fontFamily: theme.typography.primary,
    fontSize: '3.5rem',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: theme.color.heading.main,
    textAlign: 'center',
    marginTop: '20px',
    textShadow: `0 0 12px ${theme.color.secondary.main}, 0 0 25px ${theme.color.secondary.dark}`
  },
  hover: {
    '&:hover': {
      '& $path': {
        stroke: theme.color.secondary.main
      }
    }
  }
});

export { styles };

