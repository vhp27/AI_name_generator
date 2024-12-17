import React, { useState } from 'react';
import { theme } from '../styles/theme';
import { ToastManager } from '../components/Toast';
import { useTheme } from '../context/ThemeContext';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme: currentTheme } = useTheme();

  const t = theme[currentTheme];
  const c = theme.common;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://formspree.io/f/xeoqbglq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: `Contact Form Submission from ${name}`,
        }),
      });

      if (response.ok) {
        ToastManager.show({ 
          message: 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.', 
          type: 'success' 
        });
        // Clear form
        setName('');
        setEmail('');
        setMessage('');
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      ToastManager.show({ 
        message: 'Failed to send message. Please try again or email us directly.', 
        type: 'error' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className={`${t.paper} ${c.rounded} ${c.shadow} p-4 lg:p-6`}>
        <div className="max-w-2xl mx-auto px-4">
          <h1 className={`text-3xl font-bold mb-4 ${t.text.primary}`}>Contact Us</h1>
          <p className={`mb-8 ${t.text.secondary}`}>
            Have questions or suggestions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className={`block text-sm font-medium ${t.text.secondary} mb-2`}>Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={`w-full px-4 py-2 rounded-lg border transition-colors duration-200 ${t.input.background} ${t.input.border} ${t.input.text} ${t.input.focus} ${t.input.hover}`}
              />
            </div>
            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${t.text.secondary} mb-2`}>Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full px-4 py-2 rounded-lg border transition-colors duration-200 ${t.input.background} ${t.input.border} ${t.input.text} ${t.input.focus} ${t.input.hover}`}
              />
            </div>
            <div>
              <label htmlFor="message" className={`block text-sm font-medium ${t.text.secondary} mb-2`}>Message</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={6}
                className={`w-full px-4 py-2 rounded-lg border transition-colors duration-200 ${t.input.background} ${t.input.border} ${t.input.text} ${t.input.focus} ${t.input.hover}`}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors font-medium disabled:bg-indigo-400`}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
        <div className="mt-12">
          <h2 className={`text-xl font-semibold ${t.text.primary} mb-4`}>Other Ways to Reach Us</h2>
          <div className={`${t.text.secondary} space-y-2`}>
            <p>Email: support@getnames.online</p>
          </div>
        </div>
      </div>
    </div>
  );
};
