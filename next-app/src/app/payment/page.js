'use client';
import React, { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import './payment.css';
import { paymentService } from '@/services/paymentService';

function PaymentPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const code = searchParams.get('code');

    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [eventId, setEventId] = useState(null);
    const [error, setError] = useState(null);
    const [showAnimation, setShowAnimation] = useState(false);

    useEffect(() => {
        const verifyPayment = async () => {
            if (!code) {
                setError('No payment code provided');
                setLoading(false);
                setTimeout(() => {
                    setShowAnimation(true);
                }, 100);
                return;
            }

            try {
                const data = await paymentService.verifyCode(code);

                if (data.success) {
                    setSuccess(true);
                    setEventId(data.eventId);
                    setTimeout(() => {
                        setShowAnimation(true);
                    }, 100);
                } else {
                    setError(data.error || 'Failed to verify payment');
                    setSuccess(false);
                    setTimeout(() => {
                        setShowAnimation(true);
                    }, 100);
                }
            } catch (err) {
                console.error('Error verifying payment:', err);
                setError(err.response?.data?.error || 'Failed to verify payment');
                setSuccess(false);
                setTimeout(() => {
                    setShowAnimation(true);
                }, 100);
            } finally {
                setLoading(false);
            }
        };

        verifyPayment();
    }, [code]);

    const handleProceed = () => {
        if (eventId === '-1' || !eventId) {
            router.push('/events?category=events');
        } else {
            router.push(`/events?id=${eventId}`);
        }
    };

    if (loading) {
        return (
            <div className="payment-page">
                <div className="payment-card">
                    <div className="payment-header">
                        <div className="payment-icon-loading">
                            <div className="payment-spinner"></div>
                        </div>
                        <h1>Verifying Payment</h1>
                        <p>Please wait while we verify your payment...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!success) {
        return (
            <div className="payment-page">
                <div className="payment-card">
                    <div className="payment-header">
                        <div className={`payment-icon-error ${showAnimation ? 'payment-icon-animated payment-icon-shake' : ''}`}>
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={showAnimation ? 'payment-svg-draw-error' : ''}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h1>Payment Failed</h1>
                        <p style={{ color: '#fca5a5' }}>
                            {error || 'Unfortunately, your payment could not be processed. Please try again or contact support if the issue persists.'}
                        </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
                        <button
                            className="payment-btn"
                            onClick={handleProceed}
                            style={{ textAlign: 'center' }}
                        >
                            Proceed for event registration
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-page">
            <div className="payment-card">
                <div className="payment-header">
                    <div className={`payment-icon-success ${showAnimation ? 'payment-icon-animated payment-icon-bounce' : ''}`}>
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={showAnimation ? 'payment-svg-draw-success' : ''}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1>Payment Successful</h1>
                    <p>Your payment has been processed successfully.</p>
                    <p className="payment-status-text" style={{ marginTop: '16px', color: '#e04e94' }}>
                        Click the button below to proceed with your event registration.
                    </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
                    <button
                        className="payment-btn"
                        onClick={handleProceed}
                        style={{ textAlign: 'center' }}
                    >
                        Proceed for event registration
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={
            <div className="payment-page">
                <div className="payment-card">
                    <div className="payment-header">
                        <div className="payment-icon-loading">
                            <div className="payment-spinner"></div>
                        </div>
                        <h1>Loading</h1>
                        <p>Please wait...</p>
                    </div>
                </div>
            </div>
        }>
            <PaymentPageContent />
        </Suspense>
    );
}
