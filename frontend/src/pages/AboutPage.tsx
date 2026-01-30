import SEO from '../components/SEO';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <SEO
        title="About Us"
        description="Learn about Vibe Holidays - your trusted travel partner. Discover our mission, values, and commitment to creating unforgettable travel experiences."
        keywords="about vibe holidays, travel agency, our story, travel company, holiday experts"
        url="/about"
      />
      <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
      <p className="text-lg text-gray-600">
        Learn more about Vibe Holidays and our mission
      </p>
    </div>
  );
};

export default AboutPage;
