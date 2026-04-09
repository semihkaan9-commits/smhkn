import React, { useState, useEffect, useRef, useContext } from 'react';
import { supabase } from '../lib/supabase';

interface ContentContextType {
  content: Record<string, string>;
  updateContent: (key: string, value: string) => Promise<void>;
  isAdmin: boolean;
}

export const ContentContext = React.createContext<ContentContextType>({
  content: {},
  updateContent: async () => {},
  isAdmin: false
});

interface EditableTextProps {
  textKey: string;
  defaultText: string;
  className?: string;
  as?: React.ElementType;
}

export const EditableText: React.FC<EditableTextProps> = ({ 
  textKey, 
  defaultText, 
  className = '', 
  as: Component = 'span' 
}) => {
  const { content, updateContent, isAdmin } = useContext(ContentContext);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const displayText = content[textKey] || defaultText;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (isAdmin) {
      e.stopPropagation();
      setDraft(displayText);
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    setIsEditing(false);
    if (draft.trim() !== '' && draft !== displayText) {
      await updateContent(textKey, draft.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setDraft(displayText);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
        className={`bg-white text-black border border-green-500 rounded px-1 focus:outline-none focus:ring-2 focus:ring-green-500 z-10 relative ${className}`}
        style={{ width: `${Math.max(draft.length, 5)}ch` }}
      />
    );
  }

  return (
    <Component 
      className={`${className} ${isAdmin ? 'cursor-pointer outline-dashed outline-1 outline-gray-300/30 hover:outline-green-500 hover:outline-2 transition-all relative z-0' : ''}`}
      onDoubleClick={handleDoubleClick}
      title={isAdmin ? "Düzenlemek için çift tıklayın" : undefined}
    >
      {displayText}
    </Component>
  );
};
