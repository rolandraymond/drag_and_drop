import React from 'react';
import SocialIcon from './SocialIcon';

interface SocialLink {
  type: 'linkedin' | 'github' | 'instagram';
  url: string;
}

interface TeamMemberCardProps {
  name: string;
  bio: string;
  image: string;
  socialLinks: SocialLink[];
  email: string;
  phone: string;
}


const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ name, bio, image, socialLinks, email, phone }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-b-4 border-[#E3FFCC]/40">
      <div className="flex flex-col items-center text-center">
        <div className="bg-[#E3FFCC]/10 rounded-full p-3 mb-6">
          <img
            src={image}
            alt={name}
            className="w-20 h-20 rounded-full object-cover"
          />
        </div>

        <h3 className="text-xl font-bold text-[#142F32] mb-3">{name}</h3>

        <p className="text-base text-[#777C90] mb-6 leading-relaxed">{bio}</p>

        <div className="flex space-x-4 mb-6">
          {socialLinks.map((social, index) => (
            <SocialIcon key={index} type={social.type} url={social.url} />
          ))}
        </div>

        <div className="text-sm text-[#777C90] space-y-1">
          <p>
            <span className="font-medium">Email:</span> {email}
          </p>
          <p>
            <span className="font-medium">Phone:</span> {phone}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;
