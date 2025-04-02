import React, { useState } from 'react';
import { RefreshCw, Heart, Trash2, Eye, EyeOff } from 'lucide-react';

interface IconButtonProps {
  onClick?: () => void;
  label?: string;
  className?: string;
}

const ReloadButton: React.FC<IconButtonProps> = ({ onClick, label = "リロード", className = "" }) => {
  return (
    <button 
      onClick={onClick} 
      aria-label={label}
      className={`rounded-full hover:bg-gray-100 transition-colors ${className}`}
    >
      <RefreshCw className="w-5 h-5 text-gray-600" />
    </button>
  );
};

const LikeButton: React.FC<IconButtonProps> = ({ onClick, label = "いいね", className = "" }) => {
  const [liked, setLiked] = useState(false);
  
  const handleClick = () => {
    setLiked(!liked);
    if (onClick) onClick();
  };
  
  return (
    <button 
      onClick={handleClick} 
      aria-label={label}
      className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${className}`}
    >
      <Heart 
        className={`w-5 h-5 ${liked ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} 
      />
    </button>
  );
};

const TrashButton: React.FC<IconButtonProps> = ({ onClick, label = "削除", className = "" }) => {
  return (
    <button 
      onClick={onClick} 
      aria-label={label}
      className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${className}`}
    >
      <Trash2 className="w-5 h-5 text-gray-600" />
    </button>
  );
};

const VisibilityToggleButton: React.FC<IconButtonProps> = ({ onClick, label = "表示切替", className = "" }) => {
  const [visible, setVisible] = useState(true);
  
  const handleClick = () => {
    setVisible(!visible);
    if (onClick) onClick();
  };
  
  return (
    <button 
      onClick={handleClick} 
      aria-label={label}
      className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${className}`}
    >
      {visible ? (
        <Eye className="w-5 h-5 text-gray-600" />
      ) : (
        <EyeOff className="w-5 h-5 text-gray-600" />
      )}
    </button>
  );
};

export {ReloadButton, LikeButton, TrashButton, VisibilityToggleButton}