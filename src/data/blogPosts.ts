export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  publishDate: string; // ISO date string
  readTime: string;
  coverImage?: string;
}

// Each post publishes on a consecutive Friday
export const blogPosts: BlogPost[] = [
  {
    slug: "luxury-guide-to-mexico-city",
    title: "The Ultimate Luxury Guide to Mexico City",
    excerpt: "Discover the finest neighborhoods, world-class restaurants, and hidden gems that make CDMX one of the most exciting destinations for discerning travelers.",
    body: `Mexico City has emerged as one of the world's most compelling luxury destinations — a metropolis where centuries-old culture meets contemporary sophistication.

**Polanco: The Heart of Luxury**

Often compared to Beverly Hills or the Upper East Side, Polanco is home to flagship boutiques from Hermès to Louis Vuitton, Michelin-starred restaurants like Pujol and Quintonil, and some of the city's finest hotels including the St. Regis and Las Alcobas.

**Roma & Condesa: Creative Elegance**

These neighboring colonias offer a different kind of luxury — one rooted in architecture, art, and gastronomy. Tree-lined boulevards, Art Deco buildings, and an ever-evolving culinary scene make Roma-Condesa essential for any refined itinerary.

**Dining at the Highest Level**

Mexico City boasts more restaurants on the World's 50 Best list than any other city in Latin America. From Enrique Olvera's Pujol to Jorge Vallejo's Quintonil, the city's culinary scene is a masterclass in innovation rooted in tradition.

**Getting Around in Style**

Navigating Mexico City's sprawling landscape requires more than just a map — it requires a partner who understands timing, discretion, and the nuances of the city's rhythms. That's where Mexico City Black Car comes in, with Mikey AI coordinating every detail of your ground transport.`,
    category: "Lifestyle",
    publishDate: "2026-04-03",
    readTime: "5 min read",
  },
  {
    slug: "airport-transfer-tips-cdmx",
    title: "5 Insider Tips for Seamless Airport Transfers in CDMX",
    excerpt: "From navigating AICM terminals to timing your departure perfectly, here's how to make your Mexico City airport experience effortless.",
    body: `Arriving at or departing from Benito Juárez International Airport (AICM) can be overwhelming — but it doesn't have to be. With the right preparation and the right transport partner, your airport experience can be as smooth as the rest of your trip.

**1. Know Your Terminal**

AICM has two terminals connected by a free inter-terminal shuttle. Terminal 1 handles most domestic flights and several international carriers, while Terminal 2 is home to Aeroméxico and its SkyTeam partners. Confirm your terminal before booking your transfer.

**2. Time Your Arrival Strategically**

Mexico City traffic is notoriously unpredictable. For domestic flights, arrive 2 hours early. For international departures, plan for 3 hours. Our Mikey AI system monitors real-time traffic conditions and adjusts your pickup time automatically.

**3. Skip the Taxi Line**

Pre-arranged black car service eliminates the uncertainty of airport taxi queues. Your chauffeur will be waiting at arrivals with your name displayed, ready to assist with luggage and escort you to your vehicle.

**4. Leverage Flight Tracking**

The best transport services track your flight in real time. If your flight is delayed, your pickup adjusts automatically — no frantic calls or rebooking required. Mikey AI handles this seamlessly.

**5. Plan Your Return Early**

Don't leave your departure transfer to the last minute. Book your return trip when you book your arrival, and let the AI optimize your schedule around your flight time, hotel checkout, and any last-minute stops.`,
    category: "Transport",
    publishDate: "2026-04-10",
    readTime: "4 min read",
  },
  {
    slug: "how-mikey-ai-transforms-luxury-travel",
    title: "How Mikey AI Is Transforming Luxury Ground Transport",
    excerpt: "A behind-the-scenes look at the AI technology powering Mexico City Black Car — and why it matters for modern luxury travel.",
    body: `In an industry historically defined by phone calls, manual dispatching, and guesswork, Mikey AI represents a paradigm shift in how luxury ground transportation operates.

**Beyond Basic Booking**

Mikey AI isn't just a chatbot or a booking form. It's an intelligent coordination layer that manages the entire lifecycle of a journey — from initial request through route optimization to post-trip feedback. Every interaction is processed with context awareness: your preferences, your schedule, real-time traffic, even weather conditions.

**Predictive Routing**

Using machine learning models trained on Mexico City's unique traffic patterns, Mikey AI predicts congestion before it happens. This means your chauffeur is always routed through the most efficient path, saving you time without sacrificing comfort or safety.

**Natural Language Understanding**

Request a ride the way you'd ask a personal assistant. "I need a car at the St. Regis at 7 PM for dinner at Pujol" — Mikey understands context, location, timing, and intent. No forms, no dropdowns, just conversation.

**Continuous Learning**

Every trip makes Mikey smarter. The system learns from routing outcomes, client preferences, and operational data to continuously improve service quality. It's luxury transport that gets better every time you use it.

**Patents Pending**

The technology behind Mikey AI is proprietary to Infinite Logistics Technologies, with multiple patents pending. This isn't off-the-shelf software — it's purpose-built for the demands of luxury ground transport.`,
    category: "Technology",
    publishDate: "2026-04-17",
    readTime: "6 min read",
  },
  {
    slug: "executive-travel-mexico-city",
    title: "Executive Travel in Mexico City: What Top Professionals Expect",
    excerpt: "From corporate road shows to private meetings in Reforma, discover what sets executive-grade transport apart in Latin America's largest city.",
    body: `For C-suite executives, diplomats, and high-profile professionals visiting Mexico City, transportation isn't just about getting from A to B — it's about arriving prepared, protected, and on schedule.

**Discretion Is Non-Negotiable**

Executive travelers require absolute privacy. Tinted windows, soundproofed cabins, and chauffeurs trained in confidentiality protocols are baseline expectations, not upgrades. At Mexico City Black Car, discretion is embedded in every aspect of our service.

**The Reforma Corridor**

Paseo de la Reforma is the heartbeat of corporate Mexico City. Home to major banks, multinational headquarters, and luxury hotels, this boulevard demands a transport partner who knows its rhythms — from morning rush patterns to evening event traffic.

**Multi-Stop Efficiency**

Executive days rarely follow a linear schedule. Back-to-back meetings across Polanco, Santa Fe, and Lomas require a driver who can adapt in real time. Mikey AI optimizes multi-stop itineraries dynamically, ensuring you're never late.

**Security Awareness**

While Mexico City is a vibrant, world-class city, executive travelers benefit from working with a transport service that understands security best practices. Our chauffeurs are trained in defensive driving and situational awareness, and all vehicles are equipped with GPS tracking.

**The Premium Fleet**

Our Cadillac Escalade ESV fleet offers the space, comfort, and presence that executive travel demands. Whether you're heading to a board meeting or a private dinner, you arrive with the right impression.`,
    category: "Business",
    publishDate: "2026-04-24",
    readTime: "5 min read",
  },
];

// Helper: only return posts whose publishDate has passed
export const getPublishedPosts = (): BlogPost[] => {
  const now = new Date();
  return blogPosts.filter((post) => new Date(post.publishDate) <= now);
};
