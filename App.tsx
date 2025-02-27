import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Camera, Bird, ChevronDown, Star, Clock, CheckCircle, XCircle, History, Compass as Logo, Sun, Cloud, Option as Lion, Car, Coffee, Tent, DollarSign, AlertCircle } from 'lucide-react';

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  adults: number;
  children: number;
  specialRequirements: string;
  totalAmount: number;
  bookingDate: string;
  packageName: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

interface HighlightProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Highlight: React.FC<HighlightProps> = ({ icon, title, description }) => (
  <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
    <div className="text-orange-600 mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

interface ItineraryDayProps {
  day: number;
  date: string;
  title: string;
  description: string;
  image: string;
}

const ItineraryDay: React.FC<ItineraryDayProps> = ({ day, date, title, description, image }) => (
  <div className="flex flex-col md:flex-row gap-8 py-12 border-b border-gray-200 last:border-0">
    <div className="md:w-1/3">
      <img src={image} alt={title} className="w-full h-64 object-cover rounded-lg shadow-lg" />
    </div>
    <div className="md:w-2/3">
      <div className="flex items-center gap-4 mb-4">
        <span className="text-3xl font-bold text-orange-600">Day {day}</span>
        <span className="text-gray-600">{date}</span>
      </div>
      <h3 className="text-2xl font-semibold mb-4">{title}</h3>
      <p className="text-gray-700 whitespace-pre-line">{description}</p>
    </div>
  </div>
);

function App() {
  const [isNavSticky, setIsNavSticky] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showBookingHistory, setShowBookingHistory] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeSection, setActiveSection] = useState('');
  const [bookingForm, setBookingForm] = useState({
    adults: 1,
    children: 0,
    name: '',
    email: '',
    phone: '',
    specialRequirements: ''
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsNavSticky(window.scrollY > 0);

      // Update active section based on scroll position
      const sections = ['overview', 'highlights', 'itinerary', 'pricing'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 80; // Approximate height of sticky nav
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const calculateTotalAmount = (adults: number, children: number) => {
    return adults * 1322 + children * 1127;
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      ...bookingForm,
      totalAmount: calculateTotalAmount(bookingForm.adults, bookingForm.children),
      bookingDate: new Date().toISOString(),
      packageName: 'Big Cats Week at Maasai Mara - Diwali 2023',
      status: 'confirmed'
    };
    setBookings([...bookings, newBooking]);
    setBookingSuccess(true);
    setTimeout(() => {
      setShowBookingModal(false);
      setBookingSuccess(false);
      setBookingForm({
        adults: 1,
        children: 0,
        name: '',
        email: '',
        phone: '',
        specialRequirements: ''
      });
    }, 2000);
  };

  const BookingHistoryModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Your Booking History</h3>
          <button 
            onClick={() => setShowBookingHistory(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No bookings found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div 
                key={booking.id} 
                className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-semibold">{booking.packageName}</h4>
                    <p className="text-gray-600">Booked on {new Date(booking.bookingDate).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Contact Details:</p>
                    <p>{booking.name}</p>
                    <p>{booking.email}</p>
                    <p>{booking.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Booking Details:</p>
                    <p>{booking.adults} Adults, {booking.children} Children</p>
                    <p className="font-semibold">Total Amount: ${booking.totalAmount}</p>
                  </div>
                </div>
                {booking.specialRequirements && (
                  <div className="mt-4">
                    <p className="text-gray-600">Special Requirements:</p>
                    <p>{booking.specialRequirements}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isNavSticky ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Logo className="w-8 h-8 text-orange-600" />
              <span className="text-2xl font-bold text-orange-600">Travel Ula</span>
            </div>
            <div className="hidden md:flex space-x-6">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'highlights', label: 'Highlights' },
                { id: 'itinerary', label: 'Itinerary' },
                { id: 'pricing', label: 'Pricing' }
              ].map(section => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`transition-colors ${
                    activeSection === section.id
                      ? 'text-orange-600 font-semibold'
                      : 'hover:text-orange-600'
                  }`}
                >
                  {section.label}
                </button>
              ))}
              <button 
                onClick={() => setShowBookingHistory(true)}
                className="flex items-center space-x-1 hover:text-orange-600 transition-colors"
              >
                <History className="w-5 h-5" />
                <span>Bookings</span>
              </button>
            </div>
            <button 
              onClick={() => setShowBookingModal(true)}
              className="bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition-colors flex items-center space-x-2"
            >
              <Calendar className="w-5 h-5" />
              <span>Book Now</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2048&q=80"
            alt="Maasai Mara Landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Big Cats Week at Maasai Mara
            </h1>
            <p className="text-2xl mb-4">Diwali 2023 Special</p>
            <p className="text-xl mb-8">
              Experience the majesty of Kenya's wildlife during the perfect season
            </p>
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <span>Nov 14-17, 2023</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <span>Maasai Mara, Kenya</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                <span>Small Groups</span>
              </div>
            </div>
            <button 
              onClick={() => setShowBookingModal(true)}
              className="bg-orange-600 text-white px-8 py-3 rounded-full text-lg hover:bg-orange-700 transition-colors flex items-center space-x-2 group"
            >
              <span>Book Your Safari</span>
              <Calendar className="w-6 h-6 transform group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
        <div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={() => scrollToSection('overview')}
        >
          <ChevronDown className="w-8 h-8 text-white animate-bounce" />
        </div>
      </section>

      {/* Overview Section */}
      <section id="overview" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Overview</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-gray-700 mb-6">
                November is one of the Best times to visit Kenya, especially to visit its prime park, Maasai Mara. This is because the large migratory herds would have returned to Tanzania and now the Big cats have to venture long distances to hunt their prey.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                November is also the season of short rains. This makes the plains of Maasai Mara lush green. The skies are truly dramatic and colourful. The Sun rise and Sun sets during November at Mara is simply breath taking.
              </p>
              <p className="text-lg text-gray-700">
                November is also a time for holidaying and getting together with our families. And the icing on the cake is we have curated this itinerary for such an affordable costs without compromising on any of the services.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1534177616072-ef7dc120449d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                alt="Maasai Mara Sunrise"
                className="rounded-lg shadow-lg"
              />
              <img 
                src="https://images.unsplash.com/photo-1516246580284-45f5d241d44d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                alt="Maasai Mara Wildlife"
                className="rounded-lg shadow-lg mt-8"
              />
              <img 
                src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                alt="Maasai Mara Hot Air Balloon Safari"
                className="rounded-lg shadow-lg col-span-2 mt-4"
              />
            </div>
          </div>
          
          {/* Hot Air Balloon Feature */}
          <div className="mt-16 bg-gray-50 rounded-xl p-8 shadow-lg">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1630693671431-89da2b827fda?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80" 
                  alt="Hot Air Balloon Safari over Maasai Mara"
                  className="rounded-lg shadow-lg w-full h-80 object-cover"
                />
              </div>
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold mb-4 text-orange-600">Experience the Magic of a Balloon Safari</h3>
                <p className="text-lg text-gray-700 mb-4">
                  Witness the breathtaking beauty of Maasai Mara from above with our optional hot air balloon safari. Float silently over the vast plains as the sun rises, offering unparalleled views of wildlife and landscapes.
                </p>
                <p className="text-lg text-gray-700 mb-4">
                  This once-in-a-lifetime experience provides a unique perspective of the Mara ecosystem and the perfect opportunity for stunning photography.
                </p>
                <div className="flex items-center text-gray-600 text-sm mt-4">
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-medium">Optional Add-on</span>
                  <span className="mx-2">•</span>
                  <span>$450 per person</span>
                  <span className="mx-2">•</span>
                  <span>1 hour flight</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section id="highlights" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Safari Highlights</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Highlight
              icon={<Sun className="w-8 h-8" />}
              title="Perfect Season"
              description="November offers the best weather conditions with dramatic skies and lush green plains"
            />
            <Highlight
              icon={<Lion className="w-8 h-8" />}
              title="Big Cats Sighting"
              description="Increased chances of witnessing big cats in action during their hunting expeditions"
            />
            <Highlight
              icon={<Car className="w-8 h-8" />}
              title="4x4 Land Cruisers"
              description="Comfortable and reliable vehicles for game drives with experienced Maasai guides"
            />
            <Highlight
              icon={<Coffee className="w-8 h-8" />}
              title="Bush Breakfast"
              description="Unique dining experience in the wilderness with stunning views"
            />
            <Highlight
              icon={<Camera className="w-8 h-8" />}
              title="Photography"
              description="Perfect lighting conditions for wildlife photography with dramatic backgrounds"
            />
            <Highlight
              icon={<Tent className="w-8 h-8" />}
              title="Luxury Camps"
              description="Stay at premium camps with modern amenities and authentic African charm"
            />
          </div>
        </div>
      </section>

      {/* Itinerary Section */}
      <section id="itinerary" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Your Safari Journey</h2>
          <div className="space-y-8">
            <ItineraryDay
              day={1}
              date="Nov 14th, 2023"
              title="Arrival & Journey to Maasai Mara"
              description="Early morning pickup from JKIA airport. Scenic drive through the Great Rift Valley. Afternoon game drive in the Talek and Topi plains area."
              image="https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            />
            <ItineraryDay
              day={2}
              date="Nov 15th, 2023"
              title="Morning & Afternoon Game Drives"
              description="Early morning game drive with packed breakfast. Witness the stunning sunrise over Mara. Afternoon game drive focusing on leopard tracking."
              image="https://images.unsplash.com/photo-1549366021-9f761d450615?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            />
            <ItineraryDay
              day={3}
              date="Nov 16th, 2023"
              title="Full Day Game Drive"
              description="Full day exploration of the Mara with packed meals. Visit to the Sand River border. Opportunity to spot the elusive rhino."
              image="https://images.unsplash.com/photo-1534177616072-ef7dc120449d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            />
            <ItineraryDay
              day={4}
              date="Nov 17th, 2023"
              title="Farewell to Mara"
              description="Leisure breakfast. Return journey to Nairobi. Drop off at JKIA airport."
              image="https://images.unsplash.com/photo-1516246580284-45f5d241d44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Pricing & Inclusions</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6">Special Diwali Offer</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span>Adults</span>
                  <span className="text-2xl font-bold text-orange-600">$1,322</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Children (4-9 years)</span>
                  <span className="text-2xl font-bold text-orange-600">$1,127</span>
                </div>
                <p className="text-sm text-gray-600">*Valid for bookings before August 14th, 2023</p>
              </div>
              <button
                onClick={() => setShowBookingModal(true)}
                className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Book Now
              </button>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-6">Package Inclusions</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                  <span>Internal transfers in 4x4 Land Cruisers</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                  <span>Accommodation at premium camps (Zebra Plains/Loyk/Julia River)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                  <span>All meals as per itinerary (B: Breakfast, L: Lunch, D: Dinner)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                  <span>Game drives with experienced Maasai guides</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                  <span>Park entrance fees and guide fees</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                  <span>Drinking water during game drives</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            {bookingSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Booking Confirmed!</h3>
                <p className="text-gray-600 mb-4">
                  Thank you for booking with Travel Ula. Your safari adventure awaits!
                </p>
                <p className="text-sm text-gray-500">
                  A confirmation email will be sent to you shortly.
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">Book Your Safari Adventure</h3>
                  <button 
                    onClick={() => setShowBookingModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        value={bookingForm.name}
                        onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        value={bookingForm.email}
                        onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        value={bookingForm.phone}
                        onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Adults
                        </label>
                        <input
                          type="number"
                          min="1"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          value={bookingForm.adults.toString()}
                          onChange={(e) => setBookingForm({...bookingForm, adults: parseInt(e.target.value) || 0})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Children (4-9)
                        </label>
                        <input
                          type="number"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          value={bookingForm.children.toString()}
                          onChange={(e) => setBookingForm({...bookingForm, children: parseInt(e.target.value) || 0})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Special Requirements
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        rows={4}
                        value={bookingForm.specialRequirements}
                        onChange={(e) => setBookingForm({...bookingForm, specialRequirements: e.target.value})}
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Booking Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Adults (${1322} × {bookingForm.adults})</span>
                        <span>${1322 * bookingForm.adults}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Children (${1127} × {bookingForm.children})</span>
                        <span>${1127 * bookingForm.children}</span>
                      </div>
                      <div className="border-t border-orange-200 pt-2 font-semibold flex justify-between text-base">
                        <span>Total Amount</span>
                        <span className="text-orange-600">${calculateTotalAmount(bookingForm.adults, bookingForm.children)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 bg-orange-600 text-white py-3 rounded-md hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>Confirm Booking</span>
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowBookingModal(false)}
                      className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Booking History Modal */}
      {showBookingHistory && <BookingHistoryModal />}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Travel Ula</h3>
              <p className="text-gray-400">
                Creating unforgettable African safari experiences since 2010.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#overview" className="hover:text-white">Overview</a></li>
                <li><a href="#itinerary" className="hover:text-white">Itinerary</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>info@travelula.com</li>
                <li>+254 123 456 789</li>
                <li>Nairobi, Kenya</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-orange-600">Instagram</a>
                <a href="#" className="hover:text-orange-600">Facebook</a>
                <a href="#" className="hover:text-orange-600">Twitter</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Travel Ula. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;