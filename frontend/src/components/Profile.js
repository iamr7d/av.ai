import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import '../styles/Profile.css';

// Default images as URLs instead of imports
const defaultProfile = 'https://via.placeholder.com/150';
const defaultCover = 'https://via.placeholder.com/1200x300/4836a3/ffffff';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [photoUrl, setPhotoUrl] = useState(user?.user_metadata?.photo_url || '');
  const [resumeUrl, setResumeUrl] = useState(user?.user_metadata?.resume_url || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resumeData, setResumeData] = useState(user?.user_metadata?.resume_data || null);
  const [parsingResume, setParsingResume] = useState(false);
  const photoInputRef = useRef();
  const resumeInputRef = useRef();
  // For displaying photo and resume, get signed URLs
  const [photoSignedUrl, setPhotoSignedUrl] = useState('');
  const [resumeSignedUrl, setResumeSignedUrl] = useState('');

  // Get signed URL for a file in private bucket
  const getSignedUrl = async (filePath) => {
    const { data, error } = await supabase.storage.from('user-files').createSignedUrl(filePath, 60 * 60); // 1 hour
    if (error) throw error;
    return data.signedUrl;
  };

  // Upload file to Supabase Storage with organized folder structure
  const uploadFile = async (file, type) => {
    if (!file) return null;
    const ext = file.name.split('.').pop();
    const username = (user.user_metadata?.full_name || user.email || user.id).replace(/[^a-zA-Z0-9_-]/g, '');
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
    
    // Create organized folder structure: userId/username/folder-type/filename
    // Keep the user ID as the first part of the path for RLS policy compliance
    const folderType = type === 'profile-photo' ? 'PROFILE_PIC' : 'RESUME';
    const fileName = `${dateStr}_${timeStr}.${ext}`;
    const filePath = `${user.id}/${username}/${folderType}/${fileName}`;
    
    const { error: uploadError } = await supabase.storage.from('user-files').upload(filePath, file, { upsert: true });
    if (uploadError) throw uploadError;
    return filePath;
  };
  // Parse resume using backend API
  const parseResume = async (file) => {
    if (!file) return null;
    
    try {
      setParsingResume(true);
      const formData = new FormData();
      formData.append('file', file);
      
      // Use environment variable or fallback to the relative API path
      const apiUrl = process.env.REACT_APP_API_URL || '/api';
      const response = await fetch(`${apiUrl}/resume/parse`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to parse resume');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Resume parsing error:", error);
      setError("Failed to parse resume: " + error.message);
      return null;
    } finally {
      setParsingResume(false);
    }
  };

  // Handle profile update
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let newPhotoPath = photoUrl;
      let newResumePath = resumeUrl;
      let newResumeData = resumeData;
      const photoFile = photoInputRef.current.files[0];
      const resumeFile = resumeInputRef.current.files[0];
      
      if (photoFile) newPhotoPath = await uploadFile(photoFile, 'profile-photo');
      
      if (resumeFile) {
        newResumePath = await uploadFile(resumeFile, 'resume');
        // Parse resume and get structured data
        newResumeData = await parseResume(resumeFile);
      }
      
      // Update user metadata
      const { data, error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          photo_url: newPhotoPath,
          resume_url: newResumePath,
          resume_data: newResumeData
        }
      });
      
      if (updateError) throw updateError;
      setUser(data.user); // Update context
      setPhotoUrl(newPhotoPath);
      setResumeUrl(newResumePath);
      setResumeData(newResumeData);
      setShowEdit(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchUrls() {
      if (photoUrl) {
        try {
          setPhotoSignedUrl(await getSignedUrl(photoUrl));
        } catch {
          setPhotoSignedUrl('');
        }
      } else {
        setPhotoSignedUrl('');
      }
      if (resumeUrl) {
        try {
          setResumeSignedUrl(await getSignedUrl(resumeUrl));
        } catch {
          setResumeSignedUrl('');
        }
      } else {
        setResumeSignedUrl('');
      }
    }
    fetchUrls();
  }, [photoUrl, resumeUrl]);  // Add Lottie player script to the document head if not already present
  useEffect(() => {
    if (!document.querySelector('script[src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js';
      document.head.appendChild(script);
    }
  }, []);

  if (!user) {
    return (
      <section className="profile-page flex items-center justify-center">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-6">Please sign in to view your profile</h2>
        </div>
      </section>
    );
  }  return (
    <div className="profile-page" style={{padding:0, position:'relative'}}>
      {/* Cover section */}
      <div style={{position:'relative', height:'220px'}}>
        {/* Simple Floating Edit Icon Button */}
        <button
          onClick={() => setShowEdit(true)}
          title="Edit Profile"
          style={{
            position: 'absolute',
            bottom: '18px',
            right: '28px',
            zIndex: 10010,
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'rgba(72,54,163,0.85)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer',
            transition: 'background 0.2s',
            outline: 'none',
            boxShadow: 'none',
            padding: 0
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = '#7c3aed';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = 'rgba(72,54,163,0.85)';
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 5.487a2.25 2.25 0 1 1 3.182 3.182l-9.193 9.193a2 2 0 0 1-.707.464l-3.25 1.083a.5.5 0 0 1-.634-.634l1.083-3.25a2 2 0 0 1 .464-.707l9.193-9.193z" />
          </svg>
        </button>
        {/* Background container */}
        <div style={{position:'absolute',top:0,left:0,width:'100%',height:'100%', overflow:'hidden'}}>{/* Main Profile Edit Button */}            <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: '1000',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <button 
              onClick={() => setShowEdit(true)} 
              title="Edit Profile"
              className="profile-edit-btn"
              style={{
                position: 'relative',
                background: 'rgba(72, 54, 163, 0.95)',
                backdropFilter: 'blur(12px)',
                borderRadius: '12px',
                padding: '10px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid rgba(255,255,255,0.2)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                color: 'white',
                fontWeight: '600',
                fontSize: '14px',
                letterSpacing: '0.3px'
              }}              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.03) translateY(-1px)';
                e.currentTarget.style.background = 'rgba(106, 87, 219, 0.95)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.background = 'rgba(72, 54, 163, 0.95)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
              }}>            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" viewBox="0 0 16 16" style={{flexShrink: 0}}>
              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
            </svg>
            <span style={{marginLeft: '4px', whiteSpace: 'nowrap'}}>Edit Profile</span>
          </button>
          </div>
          
          {/* Cover image */}
          <img
            src={defaultCover}
            alt="cover"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          {/* Gradient overlay */}
          <div style={{
            position:'absolute',
            bottom:0,
            left:0,
            width:'100%',
            height:'120px',
            background:'linear-gradient(to bottom, rgba(72,54,163,0) 0%, rgba(72,54,163,0.95) 100%)',
          }}></div>
          
          {/* Animated background items */}
          {Array.from({length: 900}).map((_, i) => {
            const types = ['circle', 'triangle', 'cube'];
            const type = types[Math.floor(Math.random() * types.length)];
            const size = Math.floor(Math.random() * 18) + 8;
            const leftPos = Math.random() * 92 + 2;
            const topPos = Math.random() * 85 + 5;
            const hue = Math.floor(Math.random() * 360);
            const opacity = 0.1 + Math.random() * 0.09;
            const anim = `float${(i%22)+1}`;
            const commonStyle = {
              position: 'absolute',
              left: `${leftPos}%`,
              top: `${topPos}%`,
              width: `${size}px`,
              height: `${size}px`,
              animation: `${anim} ${(6+Math.random()*5).toFixed(1)}s ease-in-out infinite`,
            };
            
            if (type === 'circle') {
              return (
                <div key={i} style={{
                  ...commonStyle,
                  borderRadius: '50%',
                  background: `hsla(${hue},70%,60%,${opacity})`,
                }}/>
              );
            } else if (type === 'cube') {
              return (
                <div key={i} style={{
                  ...commonStyle,
                  borderRadius: `${Math.floor(Math.random()*4)+2}px`,
                  background: `hsla(${hue},80%,50%,${opacity})`,
                }}/>
              );
            } else {
              return (
                <svg key={i} style={commonStyle} viewBox={`0 0 ${size} ${size}`}>
                  <polygon points={`${size/2},2 ${size-2},${size-2} 2,${size-2}`} fill={`hsla(${hue},80%,60%,${opacity})`} />
                </svg>
              );
            }
          })}
        </div>
        {/* Profile image overlaying the cover */}
        <div className="profile-cover-info" style={{position: 'relative', zIndex: 1000}}>          <div className="profile-top-image" style={{
            width:'150px',
            height:'150px',
            borderRadius:'50%',
            border:'6px solid #fff',
            overflow:'hidden',
            boxShadow:'0 8px 32px rgba(0,0,0,0.5)',
            background:'#fff',            position:'absolute',
            left:'40px',
            bottom:'20px',
            transform:'translateY(50%)',
            zIndex: 100000,
            isolation: 'isolate'
          }}>
            <img
              src={photoSignedUrl || defaultProfile}
              alt="profile"
              style={{
                width:'100%',
                height:'100%',
                objectFit:'cover',
              }}
            />
          </div>
          <div className="profile-name-job" style={{
            position:'absolute',
            left:'210px',
            top:'85%',
            transform:'translateY(-50%)',
            display:'flex',
            flexDirection:'column',
            gap: '2px',
            alignItems:'flex-start',
            zIndex: 10000
          }}>
            <div style={{display:'flex',alignItems:'center',gap:'0.4rem'}}>
              <div style={{
                textTransform:'uppercase',
                fontWeight:700,
                fontSize:'1.6rem',
                color:'#fff',
                letterSpacing:'-0.3px',
                textShadow:'0 3px 5px rgba(0,0,0,0.5)',
                lineHeight: '1.2'
              }}>
                {user?.user_metadata?.full_name || 'Not provided'}
              </div>
              {user?.email_confirmed_at && (
                <span style={{
                  display:'inline-block',
                  verticalAlign:'middle',
                  width:'28px',
                  height:'28px',
                  marginLeft:'4px',
                  marginTop:'-2px',
                  pointerEvents:'auto'
                }}>
                  <lottie-player
                    src="/verify-animation.json"
                    background="transparent"
                    speed="1"
                    style={{width:'100%',height:'100%'}}
                    loop
                    autoplay
                  />
                </span>
              )}
            </div>
            <div style={{
              color:'#fff',
              fontWeight:500,
              fontSize:'1.1rem',
              marginTop:'0px',
              lineHeight: '1.2',
              textShadow:'0 3px 5px rgba(0,0,0,0.5)'
            }}>
              {user?.user_metadata?.job_title || 'Web Developer'}
            </div>
          </div>
        </div>
      </div>      {/* Resume Data Section */}
      {resumeData && (
        <div className="mt-8 space-y-6 profile-main-card" style={{
          background:'rgba(30,32,40,0.75)',
          backdropFilter:'blur(16px)',
          borderRadius:'16px',
          boxShadow:'0 8px 32px 0 rgba(0,0,0,0.1)',
          padding:'2rem 1.8rem',
          marginTop:'80px',
          maxWidth:'900px',
          marginLeft:'auto',
          marginRight:'auto',
          position:'relative',
          zIndex:1
        }}>
          <h3 className="text-xl font-bold text-white mb-4">Resume Details</h3>
          {/* Education Section */}
          {resumeData.education && resumeData.education.length > 0 && (
            <div className="resume-section">
              <h4>Education</h4>
              <ul className="space-y-2">
                {resumeData.education.map((item, i) => (
                  <li key={i} className="text-gray-200">{item}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Skills Section */}
          {resumeData.skills && resumeData.skills.length > 0 && (
            <div className="resume-section">
              <h4>Skills</h4>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill, i) => (
                  <span key={i} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          )}
          {/* Experience Section */}
          {resumeData.experience && resumeData.experience.length > 0 && (
            <div className="resume-section">
              <h4>Work Experience</h4>
              <div className="space-y-4">
                {resumeData.experience.map((exp, i) => (
                  <div key={i} className="experience-item">
                    <p className="text-gray-200 whitespace-pre-line">{exp}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Certifications Section */}
          {resumeData.certifications && resumeData.certifications.length > 0 && (
            <div className="resume-section">
              <h4>Certifications</h4>
              <ul className="space-y-2">
                {resumeData.certifications.map((cert, i) => (
                  <li key={i} className="text-gray-200">{cert}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Achievements Section */}
          {resumeData.achievements && resumeData.achievements.length > 0 && (
            <div className="resume-section">
              <h4>Achievements</h4>
              <ul className="space-y-2">
                {resumeData.achievements.map((achievement, i) => (
                  <li key={i} className="text-gray-200">{achievement}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEdit && (
        <div className="edit-modal">
          <form onSubmit={handleSave} className="modal-content">
            <button type="button" className="absolute top-4 right-4 text-gray-400 hover:text-white" onClick={() => setShowEdit(false)}>&times;</button>
            <h3 className="text-xl font-bold mb-6 text-white">Edit Profile</h3>
            {error && <div className="mb-4 p-2 bg-red-500/20 text-red-300 rounded">{error}</div>}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">Full Name</label>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Profile Photo</label>
                <div className="file-input-wrapper">
                  <input type="file" accept="image/*" ref={photoInputRef} className="w-full text-white" />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 mb-1">
                  Resume (PDF, DOCX, TXT)
                  {parsingResume && (
                    <div className="inline-flex items-center ml-2">
                      <div className="loading-spinner mr-2"></div>
                      <span className="text-yellow-300 text-sm">Parsing resume...</span>
                    </div>
                  )}
                </label>
                <div className="file-input-wrapper">
                  <input type="file" accept=".pdf,.docx,.txt" ref={resumeInputRef} className="w-full text-white" />
                  <p className="mt-1 text-xs text-gray-400">Your resume will be automatically analyzed to extract education, skills and experience.</p>
                </div>
              </div>
              <button type="submit" className="edit-button disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading || parsingResume}>
                {loading || parsingResume ? 'Processing...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;
