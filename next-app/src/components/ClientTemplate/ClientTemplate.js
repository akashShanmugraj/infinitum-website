'use client'
import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { withStyles } from '@/tools/withStyles';
import { Layout } from '@/components/Layout';
import { App } from '@/components/App';
import { Popup } from '@/components/Popup';
import { styles } from './ClientTemplate.styles';

// Dynamically import Background with SSR disabled to prevent hydration mismatches
const Background = dynamic(
    () => import('@/components/Background').then(mod => mod.Background),
    { ssr: false }
);

const Template = (props) => {
    const { classes, theme, children } = props;
    const pathname = usePathname();

    // Original Gatsby flow: popup first, then show triggers animations
    const [show, setShow] = useState(false);
    const [enterShow, setEnterShow] = useState(false);
    const [enterAnimationShow, setEnterAnimationShow] = useState(true);

    const enterElementRef = useRef(null);

    useEffect(() => {
        // Show popup after a short delay
        const timeout = setTimeout(
            () => setEnterShow(true),
            theme.animation.time || 250
        );
        return () => clearTimeout(timeout);
    }, [theme]);

    const onEnter = () => {
        // Fade out popup
        setEnterAnimationShow(false);

        // After popup fades, trigger main site animations
        setTimeout(
            () => setShow(true),
            (theme.animation.time || 250) + (theme.animation.stagger || 50)
        );
    };

    const isURLContent = ['/news', '/music', '/charity', '/about'].find(path => {
        return pathname.startsWith(path);
    });

    const layoutProps = {};
    const backgroundProps = {};

    return (
        <Layout {...layoutProps}>
            <Background
                {...backgroundProps}
                animation={{ show, ...(backgroundProps.animation || {}) }}
            >
                {isURLContent ? <App>{children}</App> : children}

                {!show && (
                    <div className={classes.enterOverlay}>
                        {enterShow && (
                            <Popup
                                className={classes.enterElement}
                                ref={enterElementRef}
                                audio={{ silent: true }}
                                animation={{ independent: true, show: enterAnimationShow }}
                                message='Infinitum.com uses sounds.'
                                option='Enter'
                                onOption={onEnter}
                            />
                        )}
                    </div>
                )}
            </Background>
        </Layout>
    );
};

export default withStyles(styles)(Template);
