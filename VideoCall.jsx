import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './App.css';

// Define the public domain once (no magic cookie required)
const JITSI_PUBLIC_DOMAIN = 'meet.jit.si'; 

const VideoCall = () => {
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get('appointmentId');
  const doctorName = searchParams.get('doctorName') || 'Doctor';
  const navigate = useNavigate();
  const jitsiContainerRef = useRef(null);
  const jitsiApiRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (!appointmentId) {
      setError('Invalid video call link. Missing appointment ID.');
      setLoading(false);
      return;
    }

    if (!jitsiApiRef.current) {
        loadJitsiScript();
    }
    
    return () => {
      cleanupJitsi();
    };
    
  }, [appointmentId, navigate]);


  useEffect(() => {
    if (scriptLoaded && !jitsiApiRef.current) {
      const timeout = setTimeout(() => {
        if (window.JitsiMeetExternalAPI) {
          initializeJitsi();
        } else {
          setError('Jitsi API not available after script load timeout.');
          setLoading(false);
        }
      }, 500);
      
      return () => clearTimeout(timeout);
    }
  }, [scriptLoaded]);

  const loadJitsiScript = () => {
    const existingScript = document.getElementById('jitsi-meet-script');
    
    if (existingScript && window.JitsiMeetExternalAPI) {
      console.log('✅ Jitsi script already loaded');
      setScriptLoaded(true);
      return;
    }

    if (existingScript) {
      existingScript.remove();
    }

    console.log('📥 Loading Jitsi Meet script...');
    const script = document.createElement('script');
    script.id = 'jitsi-meet-script';
    // FIX 1: Use the public Jitsi script URL
    script.src = `https://${JITSI_PUBLIC_DOMAIN}/external_api.js`; 
    script.async = true;
    
    script.onload = () => {
      console.log('✅ Jitsi script loaded successfully');
      setScriptLoaded(true); 
    };
    
    script.onerror = (e) => {
      console.error('❌ Failed to load Jitsi script:', e);
      setError('Failed to load video call library. Please check your internet connection and try again.');
      setLoading(false);
    };
    
    document.body.appendChild(script);
  };

  const cleanupJitsi = () => {
    if (jitsiApiRef.current) {
      try {
        console.log('🧹 Cleaning up Jitsi instance');
        jitsiApiRef.current.dispose();
      } catch (e) {
        console.error('Error disposing Jitsi:', e);
      }
      jitsiApiRef.current = null;
    }
  };

  // AGGRESSIVE FIX: Helper function to safely extract the error message from the Jitsi object
  const getErrorMessage = (errorEvent) => {
    if (typeof errorEvent === 'string') {
      return errorEvent;
    }
    if (errorEvent && typeof errorEvent === 'object') {
      // Attempt to extract the readable message
      const readableMessage = errorEvent.message || errorEvent.error || errorEvent.name;
      
      if (readableMessage) {
          return readableMessage;
      }
      
      // AGGRESSIVE FALLBACK: Stringify the entire object to expose all details
      try {
          return JSON.stringify(errorEvent, null, 2);
      } catch (e) {
          // If stringification fails (circular reference), return generic message
          return 'An unparseable error object occurred.';
      }
    }
    return 'An unknown error occurred during the video call.';
  };

  const initializeJitsi = () => {
    if (jitsiApiRef.current) {
      console.log('⚠️ Jitsi already initialized. Skipping redundant call.');
      return;
    }

    if (!window.JitsiMeetExternalAPI || !jitsiContainerRef.current) {
      console.error('❌ JitsiMeetExternalAPI or container not available');
      setError('Video call service or container not ready.');
      setLoading(false);
      return;
    }

    try {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Define the simple room name
      const roomName = `MediConnect_Appointment_${appointmentId}`; 
      
      console.log('🎥 Initializing Jitsi with room:', roomName);
      console.log('👤 User:', currentUser.username || 'Guest');

      // Use the public domain
      const domain = JITSI_PUBLIC_DOMAIN; 
      
      const options = {
        // Use the simple room name directly
        roomName: roomName, 
        width: '100%',
        height: '100%',
        parentNode: jitsiContainerRef.current,
        
        // --- CONFIG OVERWRITE (SAFE SET) ---
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          prejoinPageEnabled: false, 
          disableDeepLinking: true,
          enableWelcomePage: false,
          enableClosePage: false,
          defaultLanguage: 'en',
          doNotStoreRoom: true,
        },
        
        // --- INTERFACE CONFIG OVERWRITE (SAFE SET) ---
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            'microphone',
            'camera',
            'desktop', 
            'fullscreen',
            'fodeviceselection',
            'hangup',
            'chat',
            'raisehand',
            'videoquality',
            'tileview',
            'settings',
            'mute-everyone',
          ],
          SETTINGS_SECTIONS: ['devices', 'language'],
          SHOW_JITSI_WATERMARK: false,
          DEFAULT_BACKGROUND: '#474747',
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
          HIDE_INVITE_MORE_HEADER: true,
          MOBILE_APP_PROMO: false,
        },
        userInfo: {
          displayName: currentUser?.username || 'User',
          email: currentUser?.email || ''
        }
      };

      jitsiApiRef.current = new window.JitsiMeetExternalAPI(domain, options);

      // Event listeners
      jitsiApiRef.current.addEventListener('videoConferenceJoined', (participant) => {
        console.log('✅ Joined video conference:', participant);
        setLoading(false);
        setError(null);
      });

      jitsiApiRef.current.addEventListener('videoConferenceLeft', () => {
        console.log('👋 Left video conference');
        handleEndCall();
      });

      jitsiApiRef.current.addEventListener('readyToClose', () => {
        console.log('🚪 Ready to close');
        handleEndCall();
      });

      // FIX: Use the new helper function to display a readable error
      jitsiApiRef.current.addEventListener('errorOccurred', (errorEvent) => {
        const readableError = getErrorMessage(errorEvent);
        console.error('❌ Jitsi error:', errorEvent);
        
        setError(`Video call failed: ${readableError}`);
        setLoading(false);
      });

      jitsiApiRef.current.addEventListener('participantJoined', (participant) => {
        console.log('👤 Participant joined:', participant.displayName);
      });

      jitsiApiRef.current.addEventListener('participantLeft', (participant) => {
        console.log('👋 Participant left:', participant.displayName);
      });

    } catch (err) {
      console.error('❌ Failed to initialize Jitsi:', err);
      setError(`Failed to start video call: ${err.message || 'Unknown error'}. Please try again.`);
      setLoading(false);
    }
  };

  const handleEndCall = () => {
    cleanupJitsi();
    navigate('/my-appointments');
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setScriptLoaded(false);
    cleanupJitsi();
    
    // Remove the script and reload
    const existingScript = document.getElementById('jitsi-meet-script');
    if (existingScript) {
      existingScript.remove();
    }
    
    // Reload after a short delay
    setTimeout(() => {
      loadJitsiScript();
    }, 500);
  };

  if (error) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-danger text-center">
              <i className="bi bi-exclamation-triangle-fill me-2" style={{ fontSize: '2rem' }}></i>
              <h4 className="alert-heading">Video Call Error</h4>
              <p className="mb-0">{error}</p>
            </div>
            
            <div className="text-center mt-4">
              <button className="btn btn-success me-3" onClick={handleRetry}>
                <i className="bi bi-arrow-clockwise me-2"></i>
                Try Again
              </button>
              <button className="btn btn-primary" onClick={() => navigate('/my-appointments')}>
                <i className="bi bi-arrow-left me-2"></i>
                Back to Appointments
              </button>
            </div>

            {/* Troubleshooting Tips */}
            <div className="card mt-4">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="bi bi-info-circle me-2"></i>
                  Troubleshooting Tips
                </h5>
                <ul className="mb-0">
                  <li>Check your internet connection</li>
                  <li>Allow camera and microphone permissions in your browser</li>
                  <li>Try refreshing the page</li>
                  <li>Make sure you're using a modern browser (Chrome, Firefox, Edge, Safari)</li>
                  <li>Disable any VPN or proxy that might block video calls</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      height: '100vh', 
      width: '100%', 
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999,
      backgroundColor: '#202124',
      overflow: 'hidden'
    }}>
      {/* Header Bar */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        padding: '1rem', 
        background: 'rgba(0,0,0,0.8)', 
        color: 'white',
        zIndex: 10000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div>
          <h5 className="mb-0" style={{ color: 'white' }}>
            <i className="bi bi-camera-video-fill me-2"></i>
            Video Consultation
          </h5>
          <small style={{ color: '#ccc' }}>
            {doctorName ? `with Dr. ${doctorName}` : 'Connecting...'}
          </small>
        </div>
        <button 
          className="btn btn-danger"
          onClick={handleEndCall}
          style={{ zIndex: 10001 }}
        >
          <i className="bi bi-telephone-x me-2"></i>
          End Call
        </button>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10000,
          textAlign: 'center',
          color: 'white',
          backgroundColor: 'rgba(0,0,0,0.8)',
          padding: '3rem',
          borderRadius: '1rem',
          minWidth: '300px'
        }}>
          <div className="spinner-border text-light mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 style={{ color: 'white', marginBottom: '1rem' }}>Connecting to video call...</h5>
          <p style={{ color: '#ccc', marginBottom: '0.5rem' }}>
            {!scriptLoaded ? 'Loading video call service...' : 'Joining meeting room...'}
          </p>
          <small style={{ color: '#999' }}>This may take a few moments</small>
        </div>
      )}

      {/* Jitsi Container */}
      <div 
        ref={jitsiContainerRef} 
        style={{ 
          height: '100%', 
          width: '100%',
          paddingTop: '60px',
          backgroundColor: '#202124'
        }}
      />
    </div>
  );
};

export default VideoCall;