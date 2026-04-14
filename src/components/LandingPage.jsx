import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const featureCards = [
  {
    emoji: '💡',
    title: 'Innovation',
    description:
      'Work on cutting-edge projects that push the boundaries of technology and creativity.',
  },
  {
    emoji: '🚀',
    title: 'Career Growth',
    description:
      'Accelerate your career with mentorship programs, learning opportunities, and clear advancement paths.',
  },
  {
    emoji: '🤝',
    title: 'Great Culture',
    description:
      'Join a diverse, inclusive team that values collaboration, respect, and work-life balance.',
  },
  {
    emoji: '🌍',
    title: 'Global Impact',
    description:
      'Make a difference by contributing to solutions that reach millions of people worldwide.',
  },
];

function FeatureCard({ emoji, title, description }) {
  return (
    <div className="feature-card">
      <div className="feature-card-emoji">{emoji}</div>
      <h3 className="feature-card-title">{title}</h3>
      <p className="feature-card-description">{description}</p>
    </div>
  );
}

FeatureCard.propTypes = {
  emoji: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

function LandingPage() {
  return (
    <div className="landing-page">
      <section className="hero-section">
        <h1 className="hero-heading">Welcome to HireHub</h1>
        <p className="hero-subheading">
          Your gateway to an exciting career. Join our team and be part of
          something extraordinary.
        </p>
        <Link to="/apply" className="btn btn-primary hero-cta">
          Express Your Interest
        </Link>
      </section>

      <section className="features-section">
        <h2 className="features-heading">Why Join Us?</h2>
        <div className="features-grid">
          {featureCards.map((card) => (
            <FeatureCard
              key={card.title}
              emoji={card.emoji}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
      </section>

      <section className="bottom-cta-section">
        <h2 className="bottom-cta-heading">Ready to Start Your Journey?</h2>
        <p className="bottom-cta-subheading">
          Take the first step towards an amazing career at HireHub.
        </p>
        <Link to="/apply" className="btn btn-primary bottom-cta">
          Apply Now
        </Link>
      </section>
    </div>
  );
}

export default LandingPage;