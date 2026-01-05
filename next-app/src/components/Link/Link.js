'use client';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter, usePathname } from 'next/navigation';
import cx from 'classnames';

const checkURLExternal = /^https?:\/\//;
let globalLinkTimeout = null;

const Link = (props) => {
  const {
    theme,
    classes,
    audio,
    sounds,
    href = '',
    target,
    delay,
    className,
    activeClassName = 'link-active',
    children,
    onClick,
    onLinkStart,
    onLinkEnd,
    ...etc
  } = props;

  const router = useRouter();
  const pathname = usePathname();

  const onLinkTrigger = (event) => {
    event.preventDefault();

    if (!href) {
      onClick && onClick(event);
      return;
    }

    sounds.click.play();

    // Determine functionality
    const isSame = pathname === href; // Simple check, might need search params
    const isExternalURL = checkURLExternal.test(href);
    const isOut = !!target;
    // const isInternal = !isOut && !isSame;
    const isInternal = !isOut && !isExternalURL; // Logic adjustment for App Router? 
    // The original logic: isInternal = !isOut && !isSame.
    // If it is same, it is not internal?
    // Let's stick to original logic:
    const linkProps = { href, isOut, isExternalURL, isSame, isInternal: !isOut && !isSame };

    onClick && onClick(event);
    onLinkStart && onLinkStart(event, linkProps);

    const routeChangeStartEvent = new CustomEvent('route-change-start', { detail: linkProps });
    if (typeof window !== 'undefined') window.dispatchEvent(routeChangeStartEvent);

    if (isSame) {
      return;
    }

    const timeout = delay || theme.animation.time;

    clearTimeout(globalLinkTimeout);
    globalLinkTimeout = setTimeout(() => {
      if (typeof window === 'undefined') return;

      if (target) {
        window.open(href);
      } else if (isExternalURL) {
        window.location.href = href;
      } else {
        router.push(href);
      }

      onLinkEnd && onLinkEnd(event, linkProps);

      const routeChangeEndEvent = new CustomEvent('route-change-end', { detail: linkProps });
      window.dispatchEvent(routeChangeEndEvent);
    }, timeout);
  };

  const linkMatchesURL = pathname === href; // simplified

  return (
    <a
      {...etc}
      className={cx(className, linkMatchesURL && activeClassName)}
      href={href}
      target={target}
      onClick={onLinkTrigger}
    >
      {children}
    </a>
  );
};

Link.displayName = 'Link';

Link.propTypes = {
  theme: PropTypes.object.isRequired,
  classes: PropTypes.object, // classes might not be passed if not styled? But Link usually isn't styled with JSS directly here in original? Wait, props said classes: object.isRequired.
  audio: PropTypes.object,
  sounds: PropTypes.object,
  className: PropTypes.any,
  activeClassName: PropTypes.any,
  children: PropTypes.any,
  href: PropTypes.string,
  target: PropTypes.string,
  delay: PropTypes.number,
  onClick: PropTypes.func,
  onLinkStart: PropTypes.func,
  onLinkEnd: PropTypes.func
};

export { Link as Component };
