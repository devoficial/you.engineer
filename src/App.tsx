import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, ExternalLink, Calendar, Award, Code, Database, Globe, Zap, ChevronDown, Star, Briefcase, GraduationCap, Building, MapPin as LocationIcon } from 'lucide-react';

function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'experience', 'skills', 'education', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const experiences = [
    {
      title: "Software Engineer II (UI)",
      company: "Cleartax",
      location: "Bangalore, Karnataka",
      period: "October 2021 - Present",
      current: true,
      techStack: ["ReactJS", "TypeScript", "Webpack 5", "Module Federation", "Rspack", "Zustand", "React Query", "Cypress", "SASS"],
      achievements: [
        "Platform UI Engineer building and owning various common components used across our product suite (over 15 products). Built UI Repo, Mint, Self Serve (Payment Management), and integrated Sentry for observability.",
        "Improved the reconciliation product architecture by decoupling the core UI from the monolith product and led development of the Clear Recon UI library using a headless hook architecture in React.js and Zustand. This approach significantly reduced the time required to integrate new reconciliation modules by 80% and cut integration time by over 2 weeks.",
        "Successfully built and shipped a micro frontend web application using React.js and TypeScript to manage TDS filing for our enterprise customers. Owned screens for various form generation flows, Filing Status Dashboard, TDS Workbench, and interactions with various government websites.",
        "Worked on writing automation scripts using Cypress to automate various tasks involved in TDS filing to help ease the filing process for customers. Worked on various optimizations to improve automation speed, improved success rate by 77.9%, and reduced manual intervention by 60%.",
        "Spearheaded i18n rollout across 15+ enterprise products using configuration-based injection, enabling 3x faster localization cycles.",
        "Optimized CI/CD workflows via Rspack and GitHub Actions, slashing PR check times by 50% and staging deployments by 95%."
      ]
    },
    {
      title: "Software Engineer I (UI)",
      company: "Cleartax",
      location: "Bangalore, Karnataka",
      period: "April 2020 - October 2021",
      techStack: ["ReactJS", "JavaScript", "Webpack 5", "Redux", "PubNub SDK", "GraphQL", "Next.js", "Tailwind CSS"],
      achievements: [
        "Implemented a PubNub-based Notification Library integrated across 15+ products; added API fallback for reliability and reduced latency by 20%.",
        "Designed a Messaging UI with infinite scroll and file preview support; improved responsiveness and increased retention.",
        "Co-developed a React component library using Context API and Hooks; reduced UI duplication by 40% and sped up delivery cycles.",
        "Served as #2 contributor to the GST product; contributed to 10+ modules, including reconciliation and ingestion flows.",
        "Executed key features like multipart uploads and S3 integration while optimizing rendering performance and bundle size."
      ]
    },
    {
      title: "Software Engineer (Contract)",
      company: "Cleartax",
      location: "Bengaluru, Karnataka", 
      period: "March 2019 - March 2020",
      techStack: ["Django", "Apache Airflow", "REST APIs", "HTML", "CSS"],
      achievements: [
        "Enhanced SEO of the consumer-facing ITR app via metadata structuring and page optimization; improved organic visibility.",
        "Built analytics features in Django apps and optimized Airflow DAGs to improve data accuracy and reliability."
      ]
    },
    {
      title: "Software Engineer Trainee",
      company: "Mountblue Technologies",
      location: "Bangalore, Karnataka",
      period: "October 2018 - February 2019",
      techStack: ["Multi-tenant architecture"],
      achievements: [
        "Collaborated and built a multi-tenant web platform to seamlessly onboard various insurance providers, gaining experience in building scalable, multi-tier architectures."
      ]
    }
  ];

  const skills = {
    "Frontend": {
      icon: <Code size={20} />,
      items: ["TypeScript", "JavaScript", "ReactJS", "NextJS", "HTML", "CSS", "SASS", "Tailwind"]
    },
    "State & Data": {
      icon: <Database size={20} />,
      items: ["Zustand", "Redux", "React Query", "GraphQL", "REST APIs"]
    },
    "Architecture": {
      icon: <Globe size={20} />,
      items: ["Microfrontends", "SPA", "Module Federation", "Webpack", "Rspack"]
    },
    "Backend": {
      icon: <Zap size={20} />,
      items: ["NodeJS", "Django", "Apache Airflow"]
    },
    "DevOps": {
      icon: <ExternalLink size={20} />,
      items: ["GitHub Actions", "Jenkins", "Terraform", "AWS CloudFormation"]
    },
    "Testing": {
      icon: <Award size={20} />,
      items: ["Cypress", "Jest", "Enzyme", "React Testing Library"]
    }
  };

  const education = [
    {
      degree: "B.Sc. in Data Science",
      institution: "IIT Madras",
      status: "Ongoing",
      icon: <Star size={16} />
    },
    {
      degree: "B.Sc. in Computer Science",
      institution: "Bhavans College",
      period: "2016 - 2018",
      status: "Pursued",
      icon: <GraduationCap size={16} />
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="font-bold text-xl text-gray-900">Debasis Nath</div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {['About', 'Experience', 'Skills', 'Education', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    activeSection === item.toLowerCase() ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div className={`h-0.5 bg-gray-900 transition-all ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></div>
                <div className={`h-0.5 bg-gray-900 transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`h-0.5 bg-gray-900 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></div>
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
              {['About', 'Experience', 'Skills', 'Education', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="block w-full text-left py-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center px-4 pt-20 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient Orbs */}
          <div 
            className="absolute w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"
            style={{
              left: `${mousePosition.x * 0.02}px`,
              top: `${mousePosition.y * 0.02}px`,
              transform: 'translate(-50%, -50%)'
            }}
          ></div>
          <div 
            className="absolute w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse"
            style={{
              right: `${mousePosition.x * 0.01}px`,
              bottom: `${mousePosition.y * 0.01}px`,
              transform: 'translate(50%, 50%)',
              animationDelay: '1s'
            }}
          ></div>
          
          {/* Floating Particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-blue-500/30 rounded-full animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              ></div>
            ))}
          </div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-8">
            {/* Enhanced Avatar */}
            <div className="relative w-40 h-40 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-full animate-spin-slow"></div>
              <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center relative overflow-hidden">
                  <span className="text-4xl font-bold text-white">DN</span>
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                </div>
              </div>
            </div>
            
            {/* Animated Text */}
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-6 relative">
                <span className="inline-block animate-fade-in-up">Hi, I'm </span>
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x inline-block animate-fade-in-up animation-delay-300">
                  Debasis
                </span>
              </h1>
              
              <div className="relative">
                <p className="text-2xl md:text-3xl text-gray-600 mb-6 font-light animate-fade-in-up animation-delay-600">
                  Senior Software Engineer (Frontend)
                </p>
                {/* Typing cursor effect */}
                <span className="absolute right-0 top-0 w-0.5 h-8 bg-blue-600 animate-pulse"></span>
              </div>
            </div>
            
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed mb-8 animate-fade-in-up animation-delay-900">
              I craft beautiful, scalable user interfaces and love solving complex frontend challenges. 
              Currently building amazing products at Cleartax with React, TypeScript, and modern web technologies.
            </p>
          </div>
          
          {/* Enhanced Contact Info */}
          <div className="flex flex-wrap justify-center gap-6 mb-12 animate-fade-in-up animation-delay-1200">
            <a href="mailto:debasisnath84@gmail.com" className="group flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-all duration-300 transform hover:scale-105">
              <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <Mail size={20} />
              </div>
              <span className="hidden sm:inline font-medium">debasisnath84@gmail.com</span>
            </a>
            <a href="tel:+919702819695" className="group flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-all duration-300 transform hover:scale-105">
              <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                <Phone size={20} />
              </div>
              <span className="hidden sm:inline font-medium">+91 9702819695</span>
            </a>
            <div className="group flex items-center gap-2 text-gray-600">
              <div className="p-2 bg-purple-50 rounded-lg">
                <MapPin size={20} />
              </div>
              <span className="hidden sm:inline font-medium">Bangalore, Karnataka</span>
            </div>
            <a href="https://www.linkedin.com/in/i-m-dev21/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-all duration-300 transform hover:scale-105">
              <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <Linkedin size={20} />
              </div>
              <span className="hidden sm:inline font-medium">LinkedIn</span>
            </a>
          </div>
          
          {/* Enhanced CTA */}
          <div className="flex justify-center animate-fade-in-up animation-delay-1500">
            <button
              onClick={() => scrollToSection('experience')}
              className="group relative px-12 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
            >
              <span className="relative z-10">View My Work</span>
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              {/* Ripple effect */}
              <div className="absolute inset-0 bg-white/10 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-300"></div>
            </button>
          </div>

          {/* Scroll Indicator */}
          <div className="mt-20 animate-bounce">
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm text-gray-400 font-medium">Scroll to explore</span>
              <ChevronDown size={24} className="text-gray-400" />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">About Me</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Code size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Frontend Expert</h3>
              <p className="text-gray-600">6+ years of experience building scalable React applications and component libraries used across 15+ products.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Globe size={24} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Architecture Enthusiast</h3>
              <p className="text-gray-600">Specialized in microfrontends, module federation, and modern build tools like Webpack 5 and Rspack.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Zap size={24} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Performance Optimizer</h3>
              <p className="text-gray-600">Reduced integration times by 80%, improved automation success rates by 77.9%, and optimized CI/CD workflows.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Professional Journey
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Over 6 years of experience building scalable frontend applications and leading UI architecture initiatives
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-600 hidden md:block"></div>
            
            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <div key={index} className="relative group">
                  {/* Timeline dot */}
                  <div className="absolute left-6 w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full border-4 border-white shadow-lg hidden md:block group-hover:scale-125 transition-transform"></div>
                  
                  <div className="md:ml-20 bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-blue-200">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                            <Briefcase size={20} className="text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900">{exp.title}</h3>
                            {exp.current && (
                              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mt-1">
                                Current Position
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <Building size={16} className="text-blue-500" />
                            <span className="font-semibold text-blue-600">{exp.company}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <LocationIcon size={16} className="text-gray-400" />
                            <span>{exp.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-gray-400" />
                            <span>{exp.period}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Code size={16} />
                        Technologies:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {exp.techStack.map((tech, techIndex) => (
                          <span key={techIndex} className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 rounded-lg text-sm font-medium border border-blue-100 hover:border-blue-300 transition-colors">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <Award size={16} />
                        Key Achievements:
                      </h4>
                      <ul className="space-y-3">
                        {exp.achievements.map((achievement, achIndex) => (
                          <li key={achIndex} className="flex items-start gap-3 text-gray-600 leading-relaxed">
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Technical Expertise
          </h2>
          <p className="text-center text-gray-600 mb-16">
            Technologies and tools I use to bring ideas to life
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(skills).map(([category, { icon, items }], index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
                    {icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill, skillIndex) => (
                    <span key={skillIndex} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-blue-100 hover:text-blue-700 transition-colors">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education & Awards Section */}
      <section id="education" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Education */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Education</h2>
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        {edu.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{edu.degree}</h3>
                        <p className="text-blue-600 mb-2">{edu.institution}</p>
                        <p className="text-gray-500">
                          {edu.period && `${edu.period} • `}{edu.status}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Awards */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Recognition</h2>
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Award size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Cleartax Noble Citizen Award</h3>
                    <p className="text-gray-600 leading-relaxed mb-3">
                      Awarded for exemplary work during the development phase of the Reconciliation Project and Ingestion project
                    </p>
                    <p className="text-blue-600 font-medium">December 2020</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Let's Build Something Amazing</h2>
          <p className="text-gray-600 mb-12 text-lg">
            Always excited to discuss new opportunities and innovative projects
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <a href="mailto:debasisnath84@gmail.com" className="group flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Mail size={24} className="text-blue-600 group-hover:text-white" />
              </div>
              <h3 className="text-gray-900 font-semibold mb-2">Email</h3>
              <p className="text-gray-600">debasisnath84@gmail.com</p>
            </a>
            
            <a href="tel:+919702819695" className="group flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <Phone size={24} className="text-green-600 group-hover:text-white" />
              </div>
              <h3 className="text-gray-900 font-semibold mb-2">Phone</h3>
              <p className="text-gray-600">+91 9702819695</p>
            </a>
            
            <a href="https://www.linkedin.com/in/i-m-dev21/" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Linkedin size={24} className="text-purple-600 group-hover:text-white" />
              </div>
              <h3 className="text-gray-900 font-semibold mb-2">LinkedIn</h3>
              <p className="text-gray-600">Let's connect</p>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500">
            © 2024 Debasis Nath. Built with passion using React & TypeScript.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;