'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserPlus, UserCheck, Loader2 } from 'lucide-react';

export default function FollowButton({ targetUserId }: { targetUserId: string }) {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    // Don't show follow button for oneself
    if (user.uid === targetUserId) {
      setLoading(false);
      return;
    }

    const checkStatus = async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch(`https://healing-milestones-api.onrender.com/api/users/${targetUserId}/is-following`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setIsFollowing(data.isFollowing);
        }
      } catch (error) {
        console.error("Error checking follow status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [user, targetUserId]);

  const handleToggle = async () => {
    if (!user || toggling) return;
    
    setToggling(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`https://healing-milestones-api.onrender.com/api/users/${targetUserId}/follow`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setIsFollowing(data.status === 'followed');
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setToggling(false);
    }
  };

  if (loading || !user || user.uid === targetUserId) return null;

  return (
    <button 
      onClick={handleToggle} 
      disabled={toggling}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 16px',
        borderRadius: '20px',
        border: 'none',
        background: isFollowing ? 'rgba(255,255,255,0.1)' : 'var(--primary)',
        color: isFollowing ? 'var(--text-primary)' : '#000',
        fontWeight: 'bold',
        cursor: toggling ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        opacity: toggling ? 0.7 : 1,
        marginTop: '12px'
      }}
    >
      {toggling ? <Loader2 size={16} className="spin" /> : isFollowing ? <UserCheck size={16} /> : <UserPlus size={16} />}
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  );
}
