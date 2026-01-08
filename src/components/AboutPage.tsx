import React from 'react';
import Navbar from './Navbar';
import TeamMemberCard from './TeamMemberCard';
import TypingHeading from './TypingHeading';

interface TeamMember {
  name: string;
  bio: string;
  image: string;
  socialLinks: {
    type: 'linkedin' | 'github' | 'instagram';
    url: string;
  }[];
  email: string;
  phone: string;
}

const AboutPage: React.FC = () => {

  const teamMembers: TeamMember[] = [
    {
      name: 'Shehab Abdelaziz',
      bio: 'I have a strong technical background and skill set in network administration, server administration, SQL database, Python and bash script programming, and Windows and Linux server operating systems. I hold multiple Cisco certifications in endpoint security, networking devices, and networking basics, which demonstrate my proficiency and knowledge in these areas. I am also pursuing a Bachelor of Technology degree in Customer Service Support/Call Center/Teleservice Operation from CIC - Canadian International College, which will enhance my communication and customer service skills. I am passionate about learning new technologies and solving network problems, and I aim to deliver high-quality network solutions that meet the needs and expectations of the clients.',
      image: '',
      socialLinks: [
        { type: 'linkedin', url: 'https://www.linkedin.com/in/shehab-a-11ba26201/' },
        { type: 'github', url: 'https://github.com/shehababdelazizelsayed' },
        { type: 'instagram', url: '' }
      ],
      email: 'shehab200088111@gmail.com',
      phone: '01023323888'
    },
    {
      name: 'Roland Remon',
      bio: 'I’m a motivated Full Stack Web Developer currently training at the Information Technology Institute (ITI) in the Full Stack PHP track. I specialize in building dynamic, scalable, and user-friendly web applications using PHP (Laravel) and MEAN Stack (MongoDB, Express, Angular, Node.js). I have completed several Nano-degree programs from Udacity in Full-Stack and Web Development, and I’ve worked on many freelance projects involving UI/UX design, API integration, and WordPress development. Skills: PHP, Laravel, JavaScript, Angular, Node.js, Express, MongoDB, HTML, CSS, UI/UX Design, WordPress, REST APIs, Git, MySQL. I’m passionate about continuous learning, teamwork, and creating clean, maintainable code that delivers real impact.',
      image: '',
      socialLinks: [
        { type: 'linkedin', url: 'https://www.linkedin.com/in/roland-reymond-416129197/' },
        { type: 'github', url: 'https://github.com/rolandraymond' },
        { type: 'instagram', url: '' }
      ],
      email: 'rolandremon300@gmail.com',
      phone: '01099943763'
    },
    {
      name: 'Ahmed Essam',
      bio: 'Full Stack Developer skilled in PHP 8 (Laravel 10), Node.js/Express, and React. I build secure, clean, and maintainable backend systems including REST APIs, authentication (JWT, Sanctum), validation, pagination, rate limiting, logging, and structured error handling. On the frontend, I develop modern React applications using reusable components, clear state management, and organized project structures. I focus on writing humanized, readable code that improves clarity, performance, and developer experience. Graduate of ITI (Full Stack PHP) and EFE Egypt (Full Stack React PHP), with practical experience delivering real projects that integrate frontend and backend systems. I’m open to backend and full-stack opportunities where I can contribute to real products, collaborate with engineering teams, and continue improving through code reviews and best practices.',
      image: '',
      socialLinks: [
        { type: 'linkedin', url: 'https://www.linkedin.com/in/iam-ahmed-esam/' },
        { type: 'github', url: 'https://github.com/ahmedesamhasan' },
        { type: 'instagram', url: '' }
      ],
      email: 'iam.ahmedesam@gmail.com',
      phone: '01128284800'
    },
    {
      name: 'Nada Abdelsattar',
      bio: 'Junior Full-Stack Software Engineer with a strong passion for designing and building clean, scalable, and user-friendly web applications. Proficient in backend development using PHP, Laravel, Node.js, and Express, as well as frontend development with JavaScript, TypeScript, React, and Angular. Experienced in creating RESTful APIs, integrating databases like MySQL and MongoDB, and ensuring seamless communication between frontend and backend systems. Highly motivated to continuously learn and adopt new technologies, contribute to impactful projects, and collaborate effectively within agile, team-oriented environments. Skilled in problem-solving, code optimization, and implementing best practices to deliver high-quality software solutions. Passionate about developing applications that provide real value to users, enhance usability, and demonstrate attention to detail and maintainable code.',
      image: '../../public/TeamPic/Nada.jpg',
      socialLinks: [
        { type: 'linkedin', url: 'https://www.linkedin.com/in/nada-abdelsattar/' },
        { type: 'github', url: 'https://github.com/Nadaabdelsattar' },
        { type: 'instagram', url: '' }
      ],
      email: 'nadaabdelsattar93@gmail.com',
      phone: '01006382334'
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#282930] py-16 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto space-y-16">

      {/* About Section */}
      <div className="bg-[#F0F0F0] rounded-3xl shadow-2xl  mt-5 p-12 md:p-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-mono text-[#142F32] mb-6 min-h-[60px] flex items-center justify-center">
            <TypingHeading text="About Luild" />
          </h1>
          <div className="w-28 h-1 bg-[#142F32] mx-auto mb-8 rounded-full"></div>
          <p className="text-lg md:text-xl text-[#4A4D55] max-w-5xl mx-auto leading-relaxed">
  <span className="text-[#142F32] font-semibold">Luild</span> empowers educators, creators, and learners through <span className="text-[#142F32] font-semibold">innovative, collaborative learning experiences</span>. Our mission is to inspire <span className="text-[#142F32] font-semibold">creativity</span>, foster <span className="text-[#142F32] font-semibold">critical thinking</span>, and encourage lifelong learning.  
  <span className="text-[#142F32] font-semibold">Hands-on learning, teamwork, and practical solutions</span> are at our core, creating engaging educational platforms that make learning effective, enjoyable, and impactful. Luild transforms ideas into actionable learning journeys, helping creators deliver <span className="text-[#142F32] font-semibold">intelligent, interactive, and personalized education</span>.
</p>

        </div>
      </div>

      {/* Team Section */}
      <div className="bg-[#E3FFCC]/10 rounded-3xl shadow-2xl p-12 md:p-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-mono text-[#E3FFCC] text-center mb-6 min-h-[50px] flex items-center justify-center">
          <TypingHeading text="Meet Our Team" />
        </h2>
        <div className="w-24 h-1 bg-[#E3FFCC] mx-auto mb-12 rounded-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
          {teamMembers.map((member, index) => (
            <TeamMemberCard
              key={index}
              name={member.name}
              bio={member.bio}
              image={member.image}
              socialLinks={member.socialLinks}
              email={member.email}
              phone={member.phone}
              className="bg-[#F0F0F0] hover:bg-[#F5F5F5] rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 p-6 flex flex-col items-center text-center border-b-4 border-[#E3FFCC]/40"
            />
          ))}
        </div>
      </div>
    </div>
  </div>
    </>
  );
};

export default AboutPage;