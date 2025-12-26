import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle, Phone, Mail, Menu, ChevronRight, MapPin } from 'lucide-react';

interface Message {
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

interface UserData {
  name: string;
  email: string;
  phone: string;
}

interface Course {
  id: number;
  name: string;
  description: string;
  icon: string;
  link: string;
}

const LeapfrogWebsite = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [userData, setUserData] = useState<UserData>({ name: '', email: '', phone: '' });
  const [currentStep, setCurrentStep] = useState('welcome');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

  const courses = [
    {
      id: 1,
      name: 'Advance UX Designing',
      description: 'Learn UX design from experts. Focus on user research, wireframing, prototyping, and user testing.',
      icon: '🎯',
      link: 'http://www.leapfrogmultimedia.com/ux-design-training-institute-in-hyderabad.html'
    },
    {
      id: 2,
      name: 'UX UI Designing',
      description: 'Comprehensive UX UI design course covering user experience and interface design principles.',
      icon: '🎨',
      link: 'http://www.leapfrogmultimedia.com/best-ui-design-development-training-institute-in-ameerpet-hyderabad.html'
    },
    {
      id: 3,
      name: 'Responsive Web Design',
      description: 'Learn modern web design with responsive techniques for all devices.',
      icon: '💻',
      link: 'http://www.leapfrogmultimedia.com/web-design.html'
    },
    {
      id: 4,
      name: 'Graphic Designing',
      description: 'Master graphic design tools and principles for creating stunning visuals.',
      icon: '🖼️',
      link: 'http://www.leapfrogmultimedia.com/graphic-design.html'
    },
    {
      id: 5,
      name: 'Digital Branding',
      description: 'Learn digital branding strategies and create compelling brand identities.',
      icon: '🚀',
      link: 'http://www.leapfrogmultimedia.com/best-digital-branding-course-in-hyderabad.html'
    },
    {
      id: 6,
      name: 'Service Design',
      description: 'Learn service design methodologies and create exceptional service experiences.',
      icon: '⚙️',
      link: 'http://www.leapfrogmultimedia.com/best-servicedesign-training-institutes-in-hyderabad.html'
    }
  ];

  const contactInfo = {
    address: '#304, 4th floor megasri classic, Dwarakapuricolony, Model house lane, Punjagutta, Hyderabad-500 082',
    phone: ['040 40 11 02 22', '+91-988 55 55 166'],
    email: 'sai@leapfrogstudios.in'
  };

  const sendToGoogleSheet = async (data: UserData) => {
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          timestamp: new Date().toISOString(),
          source: 'Chatbot'
        })
      });
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addBotMessage = (text: string, delay = 500) => {
    setTimeout(() => {
      setMessages(prev => [...prev, { text, sender: 'bot' as const, timestamp: new Date() }]);
    }, delay);
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, { text, sender: 'user' as const, timestamp: new Date() }]);
  };

  useEffect(() => {
    if (isChatOpen && messages.length === 0) {
      addBotMessage('Hello! Welcome to Leapfrog Multimedia Design School. 👋\n\nBefore we begin, I\'d love to know a bit about you. May I have your name?');
      setCurrentStep('collectName');
    }
  }, [isChatOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleUserDataCollection = async (value: string) => {
    if (currentStep === 'collectName') {
      setUserData(prev => ({ ...prev, name: value }));
      addUserMessage(value);
      addBotMessage(`Nice to meet you, ${value}! 😊\n\nCould you please share your email address?`);
      setCurrentStep('collectEmail');
    } else if (currentStep === 'collectEmail') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        addBotMessage('Please enter a valid email address.');
        return;
      }
      setUserData(prev => ({ ...prev, email: value }));
      addUserMessage(value);
      addBotMessage('Great! And finally, what\'s your phone number?');
      setCurrentStep('collectPhone');
    } else if (currentStep === 'collectPhone') {
      const phoneRegex = /^[0-9+\-\s()]{10,}$/;
      if (!phoneRegex.test(value)) {
        addBotMessage('Please enter a valid phone number.');
        return;
      }
      const completeData = { ...userData, phone: value };
      setUserData(completeData);
      addUserMessage(value);
      addBotMessage('Processing your information...', 100);
      await sendToGoogleSheet(completeData);
      showMainMenu();
    }
  };

  const showMainMenu = () => {
    setCurrentStep('mainMenu');
    addBotMessage(
      `Perfect! Thank you for sharing your details. 🎉\n\nHow can I help you today?\n\n1️⃣ View all courses\n2️⃣ Ask about a specific course\n3️⃣ Contact information\n4️⃣ Speak with a human\n\nJust type the number or ask me anything!`,
      800
    );
  };

  const handleMainMenuResponse = (input: string) => {
    const lowerInput = input.toLowerCase();
    if (input === '1' || lowerInput.includes('course')) {
      addUserMessage(input);
      showCourses();
    } else if (input === '2' || lowerInput.includes('specific')) {
      addUserMessage(input);
      addBotMessage('Which course would you like to know more about?\n\n' + 
        courses.map((c, i) => `${i + 1}. ${c.name}`).join('\n'));
      setCurrentStep('courseDetail');
    } else if (input === '3' || lowerInput.includes('contact')) {
      addUserMessage(input);
      showContactInfo();
    } else if (input === '4' || lowerInput.includes('human')) {
      addUserMessage(input);
      addBotMessage(`I'll connect you with our team!\n\n📞 ${contactInfo.phone[0]}\n✉️ ${contactInfo.email}`);
      setTimeout(() => showMainMenu(), 2000);
    } else if (lowerInput.includes('ux') || lowerInput.includes('ui') || lowerInput.includes('web') || 
               lowerInput.includes('graphic') || lowerInput.includes('branding') || lowerInput.includes('service')) {
      addUserMessage(input);
      handleCourseQuery(lowerInput);
    } else {
      addUserMessage(input);
      addBotMessage('I\'m not sure I understand. Could you please choose from the menu options?');
      setTimeout(() => showMainMenu(), 1500);
    }
  };

  const showCourses = () => {
    const courseList = courses.map((c, i) => 
      `\n${i + 1}. ${c.name}\n   ${c.description}`
    ).join('\n');
    addBotMessage(`Here are all our courses:\n${courseList}\n\nWould you like to know more about any specific course?`);
    setCurrentStep('courseDetail');
  };

  const handleCourseQuery = (query: string) => {
    let foundCourse = null;
    if (query.includes('advance') && query.includes('ux')) foundCourse = courses[0];
    else if (query.includes('ux') && query.includes('ui')) foundCourse = courses[1];
    else if (query.includes('web')) foundCourse = courses[2];
    else if (query.includes('graphic')) foundCourse = courses[3];
    else if (query.includes('branding')) foundCourse = courses[4];
    else if (query.includes('service')) foundCourse = courses[5];

    if (foundCourse) {
      addBotMessage(`📚 ${foundCourse.name}\n\n${foundCourse.description}\n\n🔗 More details: ${foundCourse.link}`);
      setTimeout(() => showMainMenu(), 2000);
    } else {
      addBotMessage('I couldn\'t find that course. Here are all available courses:');
      setTimeout(() => showCourses(), 500);
    }
  };

  const handleCourseDetail = (input: string) => {
    const courseNum = parseInt(input);
    if (courseNum >= 1 && courseNum <= courses.length) {
      const course = courses[courseNum - 1];
      addUserMessage(input);
      addBotMessage(`📚 ${course.name}\n\n${course.description}\n\n🔗 ${course.link}`);
      setTimeout(() => showMainMenu(), 2000);
    } else {
      handleMainMenuResponse(input);
    }
  };

  const showContactInfo = () => {
    addBotMessage(
      `📍 Address:\n${contactInfo.address}\n\n📞 Phone:\n${contactInfo.phone.join('\n')}\n\n✉️ Email:\n${contactInfo.email}`
    );
    setTimeout(() => showMainMenu(), 2000);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    const value = inputValue.trim();
    setInputValue('');

    if (currentStep === 'collectName' || currentStep === 'collectEmail' || currentStep === 'collectPhone') {
      handleUserDataCollection(value);
    } else if (currentStep === 'mainMenu') {
      handleMainMenuResponse(value);
    } else if (currentStep === 'courseDetail') {
      handleCourseDetail(value);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl">L</span>
              </div>
              <div className="ml-3">
                <h1 className="text-2xl font-bold text-gray-900">Leapfrog</h1>
                <p className="text-xs text-gray-600">Multimedia Design School</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-blue-600 transition">Home</a>
              <a href="#courses" className="text-gray-700 hover:text-blue-600 transition">Courses</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition">About</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition">Contact</a>
            </nav>

            {/* Contact Info */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <Phone size={16} className="mr-2 text-blue-600" />
                <span>040 40 11 02 22</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Mail size={16} className="mr-2 text-blue-600" />
                <span>sai@leapfrogstudios.in</span>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <nav className="px-4 py-4 space-y-3">
              <a href="#home" className="block text-gray-700 hover:text-blue-600">Home</a>
              <a href="#courses" className="block text-gray-700 hover:text-blue-600">Courses</a>
              <a href="#about" className="block text-gray-700 hover:text-blue-600">About</a>
              <a href="#contact" className="block text-gray-700 hover:text-blue-600">Contact</a>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Best UI/UX Design Training in Hyderabad
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Learn from Industry Experts. Build Your Design Career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setIsChatOpen(true)}
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:shadow-xl transition transform hover:scale-105"
              >
                Get Started - Talk to Us
              </button>
              <a href="#courses" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition">
                View Courses
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#000000' }}>Our Courses</h2>
            <p className="text-xl text-gray-600">Industry-leading design courses for your career</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition p-8 group">
                <div className="text-5xl mb-4">{course.icon}</div>
                <h3 className="text-2xl font-bold mb-3" style={{ color: '#000000' }}>{course.name}</h3>
                <p className="text-gray-600 mb-6">{course.description}</p>
                <a 
                  href={course.link}
                  className="inline-flex items-center text-blue-600 font-semibold group-hover:text-purple-600 transition"
                >
                  Learn More <ChevronRight size={20} className="ml-1" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6" style={{ color: '#000000' }}>Why Choose Leapfrog?</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1" style={{ color: '#000000' }}>Expert Instructors</h3>
                    <p className="text-gray-600">Learn from industry professionals with years of experience</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1" style={{ color: '#000000' }}>Hands-on Projects</h3>
                    <p className="text-gray-600">Build real-world projects for your portfolio</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1" style={{ color: '#000000' }}>Career Support</h3>
                    <p className="text-gray-600">Get placement assistance and career guidance</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1" style={{ color: '#000000' }}>Flexible Learning</h3>
                    <p className="text-gray-600">Online and offline training options available</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-12 text-white">
              <h3 className="text-3xl font-bold mb-6">Start Your Design Journey</h3>
              <p className="text-lg mb-8">Join thousands of successful designers who learned with us</p>
              <button 
                onClick={() => setIsChatOpen(true)}
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:shadow-xl transition transform hover:scale-105"
              >
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#000000' }}>Get In Touch</h2>
            <p className="text-xl text-gray-600">We're here to help you start your design career</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin size={32} className="text-blue-600" />
              </div>
              <h3 className="font-bold text-xl mb-3" style={{ color: '#000000' }}>Visit Us</h3>
              <p className="text-gray-600">{contactInfo.address}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone size={32} className="text-blue-600" />
              </div>
              <h3 className="font-bold text-xl mb-3" style={{ color: '#000000' }}>Call Us</h3>
              {contactInfo.phone.map((phone, idx) => (
                <p key={idx} className="text-gray-600">{phone}</p>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={32} className="text-blue-600" />
              </div>
              <h3 className="font-bold text-xl mb-3" style={{ color: '#000000' }}>Email Us</h3>
              <p className="text-gray-600">{contactInfo.email}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">©2007 - 2025 All rights reserved. | Leapfrog Creative Studios</p>
        </div>
      </footer>

      {/* Chatbot */}
      <div className="fixed bottom-4 right-4 left-4 sm:right-6 sm:left-auto z-50 flex justify-end">
        {!isChatOpen && (
          <button
            onClick={() => setIsChatOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 animate-pulse"
          >
            <MessageCircle size={32} />
          </button>
        )}

        {isChatOpen && (
          <div className="bg-white rounded-2xl shadow-2xl w-full sm:w-96 max-w-[calc(100vw-32px)] sm:max-w-none h-[60vh] sm:h-[600px] flex flex-col overflow-hidden mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 sm:p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xl">L</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Leapfrog Bot</h3>
                  <p className="text-xs text-blue-100">Design School Assistant</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="hover:bg-white/20 rounded-full p-1 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gray-50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] sm:max-w-[80%] p-2 sm:p-3 rounded-2xl whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 shadow-md rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 sm:p-4 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 sm:py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-2 sm:p-3 hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeapfrogWebsite;