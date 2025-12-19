import { FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';

interface SocialIconProps {
  type: 'linkedin' | 'github' | 'instagram';
  url: string;
}

const ICONS = {
  linkedin: FaLinkedin,
  github: FaGithub,
  instagram: FaInstagram,
};

const SocialIcon: React.FC<SocialIconProps> = ({ type, url }) => {
  const IconComponent = ICONS[type];

  const colors = {
    linkedin: '#0077B5',
    github: '#333',
    instagram: '#E4405F',
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 rounded-full hover:bg-[#E3FFCC]/20 transition-all duration-300 hover:scale-110"
      style={{ color: colors[type] }}
    >
      <IconComponent className="w-6 h-6" />
    </a>
  );
};

export default SocialIcon;