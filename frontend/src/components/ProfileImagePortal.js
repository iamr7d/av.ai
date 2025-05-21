import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import '../styles/ProfileImage.css';

const ProfileImagePortal = ({ photoUrl, defaultImage }) => {
  const [portalContainer, setPortalContainer] = useState(null);
  
  useEffect(() => {
    // Create a div that will be appended directly to the body
    const div = document.createElement('div');
    div.id = 'profile-image-portal';
    div.style.position = 'fixed';
    div.style.zIndex = '10000';
    div.style.pointerEvents = 'none'; // Allow clicks to pass through
      // Position it absolutely to match the original position
    const updatePosition = () => {
      const profilePage = document.querySelector('.profile-page');
      if (profilePage) {
        const rect = profilePage.getBoundingClientRect();
        div.style.left = `${rect.left + 22}px`;
        div.style.top = `${rect.top + 85}px`; // Moved higher up above the cover
      }
    };
    
    document.body.appendChild(div);
    setPortalContainer(div);
    
    // Update position initially and on resize
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);
    
    return () => {
      document.body.removeChild(div);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, []);
  
  if (!portalContainer) return null;
    return ReactDOM.createPortal(
    <div className="profile-top-image">
      <div style={{
        width:'150px',
        height:'150px',
        borderRadius:'50%',
        border:'6px solid #fff',
        overflow:'hidden',
        boxShadow:'0 8px 32px rgba(0,0,0,0.5)',
        background:'#fff',
        pointerEvents: 'auto', // Re-enable pointer events for the image
      }}>
        <img
          src={photoUrl || defaultImage}
          alt="profile"
          style={{
            width:'100%',
            height:'100%',
            objectFit:'cover',
          }}
        />
      </div>
    </div>,
    portalContainer
  );
};

export default ProfileImagePortal;
