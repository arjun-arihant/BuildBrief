import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/layout/Layout';
import {
  LandingPage,
  FeaturesPage,
  PricingPage,
  AboutPage,
  BlogPage,
  ContactPage,
  AppPage
} from './pages';

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            {/* Marketing pages with layout */}
            <Route path="/" element={<Layout><LandingPage /></Layout>} />
            <Route path="/features" element={<Layout><FeaturesPage /></Layout>} />
            <Route path="/pricing" element={<Layout><PricingPage /></Layout>} />
            <Route path="/about" element={<Layout><AboutPage /></Layout>} />
            <Route path="/blog" element={<Layout><BlogPage /></Layout>} />
            <Route path="/blog/:id" element={<Layout><BlogPage /></Layout>} />
            <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
            
            {/* App - no layout, full screen */}
            <Route path="/app" element={<AppPage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
