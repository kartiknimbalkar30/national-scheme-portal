import React, { useState } from 'react';
import { startRegistration } from '@simplewebauthn/browser';

const PasskeyRegistration = ({ email }) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const registerPasskey = async () => {
        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            // Step 1: Get registration options
            const optionsRes = await fetch('https://national-scheme-portal.onrender.com/api/auth/passkey/register/options', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (!optionsRes.ok) {
                const error = await optionsRes.json();
                throw new Error(error.message || 'Failed to get registration options');
            }

            const options = await optionsRes.json();

            // Step 2: Start WebAuthn registration
            const attResp = await startRegistration(options);

            // Step 3: Verify registration
            const verifyRes = await fetch('https://national-scheme-portal.onrender.com/api/auth/passkey/register/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    registrationResponse: attResp
                })
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok) {
                throw new Error(verifyData.message || 'Verification failed');
            }

            if (verifyData.verified) {
                setMessage({ text: '✅ Passkey registered successfully!', type: 'success' });
            } else {
                throw new Error('Passkey verification failed');
            }

        } catch (error) {
            console.error('Passkey registration error:', error);
            
            let errorMsg = error.message || 'Failed to register passkey';
            
            if (error.name === 'InvalidStateError') {
                errorMsg = 'A passkey already exists for this account on this device.';
            } else if (error.name === 'NotAllowedError') {
                errorMsg = 'Registration cancelled or timed out. Please try again.';
            } else if (error.name === 'SecurityError') {
                errorMsg = 'Please use HTTPS or localhost for WebAuthn.';
            }
            
            setMessage({ text: `❌ ${errorMsg}`, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ marginTop: '10px' }}>
            <button 
                onClick={registerPasskey} 
                disabled={loading}
                style={{
                    padding: '12px 24px',
                    backgroundColor: '#2e7d32',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    opacity: loading ? 0.6 : 1
                }}
            >
                {loading ? '⏳ Registering...' : '🔑 Register Passkey'}
            </button>
            {message.text && (
                <p style={{ 
                    color: message.type === 'success' ? '#2e7d32' : '#c62828',
                    marginTop: '10px',
                    fontWeight: 'bold'
                }}>
                    {message.text}
                </p>
            )}
        </div>
    );
};

export default PasskeyRegistration;
