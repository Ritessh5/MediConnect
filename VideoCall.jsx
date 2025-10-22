import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './App.css';

const VideoCall = () => {
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get('appointmentId');
  const doctorName = searchParams.get('doctorName');
  const navigate = useNavigate();
  const jitsiContainerRef = useRef(null);
  const jitsiApiRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!appointmentId) {
      setError('Invalid video call link');
      setTimeout(() => navigate('/'), 2000);
      return;
    }

    // Cleanup any existing Jitsi instance
    if (jitsiApiRef.current) {
      jitsiApiRef.current.dispose();
      jitsiApiRef.current = null;
    }

    // Load and initialize Jitsi
    loadJitsi();

    return () => {
      // Cleanup on unmount
      if (jitsiApiRef.current) {
        try {
          jitsiApiRef.current.dispose();
        } catch (e) {
          console.error('Error disposing Jitsi:', e);
        }
        jitsiApiRef.current = null;
      }
    };
  }, [appointmentId]);

  const loadJitsi = () => {
    // Check if script already exists
    const existingScript = document.getElementById('jitsi-script');
    
    if (existingScript) {
      // Script already loaded, just initialize
      if (window.JitsiMeetExternalAPI) {
        initializeJitsi();
      }
      return;
    }

    // Load script for first time
    const script = document.createElement('script');
    script.id = 'jitsi-script';
    script.src = 'https://meet.jit.si/external_api.js';
    script.async = true;
    script.onload = () => {
      console.log('✅ Jitsi script loaded');
      initializeJitsi();
    };
    script.onerror = () => {
      setError('Failed to load video call. Please check your internet connection.');
      setLoading(false);
    };
    document.body.appendChild(script);
  };

  const initializeJitsi = () => {
    if (!window.JitsiMeetExternalAPI) {
      setError('Jitsi API not available');
      setLoading(false);
      return;
    }

    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const roomName = `MediConnect_Appointment_${appointmentId}`;
      
      const options = {
        roomName: roomName,
        width: '100%',
        height: '100%',
        parentNode: jitsiContainerRef.current,
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          prejoinPageEnabled: false, // Skip lobby
          enableWelcomePage: false,
          disableDeepLinking: true,
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            'microphone',
            'camera',
            'desktop',
            'fullscreen',
            'hangup',
            'chat',
            'raisehand',
            'settings',
          ],
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK: false,
          DEFAULT_BACKGROUND: '#474747',
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        },
        userInfo: {
          displayName: currentUser?.username || 'Guest',
          email: currentUser?.email || ''
        }
      };

      console.log('🎥 Initializing Jitsi with room:', roomName);
      
      jitsiApiRef.current = new window.JitsiMeetExternalAPI('meet.jit.si', options);

      // Event listeners
      jitsiApiRef.current.on('videoConferenceJoined', () => {
        console.log('✅ Joined video conference');
        setLoading(false);
      });

      jitsiApiRef.current.on('readyToClose', () => {
        console.log('👋 Video call ended');
        navigate('/my-appointments');
      });

      jitsiApiRef.current.on('errorOccurred', (error) => {
        console.error('❌ Jitsi error:', error);
        setError('An error occurred during the video call');
      });

    } catch (err) {
      console.error('❌ Failed to initialize Jitsi:', err);
      setError('Failed to start video call. Please try again.');
      setLoading(false);
    }
  };

  const handleEndCall = () => {
    if (jitsiApiRef.current) {
      try {
        jitsiApiRef.current.executeCommand('hangup');
      } catch (e) {
        console.error('Error ending call:', e);
      }
    }
    navigate('/my-appointments');
  };

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/my-appointments')}>
          Back to Appointments
        </button>
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
      backgroundColor: '#000'
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
        alignItems: 'center'
      }}>
        <div>
          <h5 className="mb-0" style={{ color: 'white' }}>
            <i className="bi bi-camera-video-fill me-2"></i>
            Video Consultation
          </h5>
          {doctorName && (
            <small style={{ color: '#ccc' }}>with {doctorName}</small>
          )}
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
          color: 'white'
        }}>
          <div className="spinner-border text-light mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Connecting to video call...</p>
        </div>
      )}

      {/* Jitsi Container */}
      <div 
        ref={jitsiContainerRef} 
        style={{ 
          height: '100%', 
          width: '100%',
          paddingTop: '60px'
        }}
      />
    </div>
  );
};

export default VideoCall;