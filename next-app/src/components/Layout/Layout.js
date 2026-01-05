'use client';
import React from 'react';
import PropTypes from 'prop-types';

import sounds from '../../settings/sounds';
import { SoundsProvider } from '../SoundsProvider';

// Note: Metadata is now handled in app/layout.js using Next.js Metadata API
// Stylesheets are loaded via next/head or layout.js

const Component = ({ children }) => (
  <SoundsProvider sounds={sounds}>
    {children}
  </SoundsProvider>
);

Component.displayName = 'Layout';

Component.propTypes = {
  children: PropTypes.node.isRequired
};

export { Component };
