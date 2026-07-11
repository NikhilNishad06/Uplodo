import React from 'react';
import { Bell, Search, User, Sun, Moon, DownloadCloud } from 'lucide-react';
import jsPDF from 'jspdf';
import heroLogo from '../../assets/hero.jpg';

export function Navbar({ toggleSidebar, isSidebarOpen }) {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const handleDownloadPDF = () => {
    let keys = [];
    const savedCards = localStorage.getItem('erp_dynamic_cards');
    if (savedCards) {
      try {
        const cards = JSON.parse(savedCards);
        keys = cards.map(c => `image_${c.id}`);
      } catch (e) {}
    }
    
    if (keys.length === 0) {
      keys = ['image_billet_stock', 'image_material_purchase', 'image_daily_mis'];
    }

    const doc = new jsPDF('p', 'mm', 'a4');
    let hasImages = false;

    keys.forEach((key) => {
      const imgData = localStorage.getItem(key);
      if (imgData) {
        if (hasImages) {
          doc.addPage();
        }
        
        try {
          const props = doc.getImageProperties(imgData);
          const pdfPageWidth = doc.internal.pageSize.getWidth();
          const pdfPageHeight = doc.internal.pageSize.getHeight();
          const padding = 15; // 15mm padding

          const maxImgWidth = pdfPageWidth - (padding * 2);
          const maxImgHeight = pdfPageHeight - (padding * 2);

          let finalImgWidth = maxImgWidth;
          let finalImgHeight = (props.height * maxImgWidth) / props.width;

          if (finalImgHeight > maxImgHeight) {
            finalImgHeight = maxImgHeight;
            finalImgWidth = (props.width * maxImgHeight) / props.height;
          }

          const xOffset = (pdfPageWidth - finalImgWidth) / 2;
          const yOffset = (pdfPageHeight - finalImgHeight) / 2;
          
          // Determine format from data URL
          const formatMatch = imgData.match(/^data:image\/(\w+);base64,/);
          const format = formatMatch ? formatMatch[1].toUpperCase() : 'JPEG';
          const safeFormat = (format === 'JPEG' || format === 'JPG') ? 'JPEG' : 'PNG';
          
          doc.addImage(imgData, safeFormat, xOffset, yOffset, finalImgWidth, finalImgHeight);
          hasImages = true;
        } catch (e) {
          console.error("Error adding image to PDF", e);
        }
      }
    });

    if (hasImages) {
      doc.save('Steel_ERP_Reports_Combined.pdf');
    } else {
      alert('Koi bhi report image upload nahi hui hai. Pehle kam se kam ek image upload karein.');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-sm transition-colors">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <img src={heroLogo} alt="Logo" className="h-8 w-auto rounded object-cover shadow-sm" />
          <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">Uplodo</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
        <div className="hidden lg:flex relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Global Search..."
            className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all w-64"
          />
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-green-600 text-white rounded-full hover:bg-green-700 text-xs sm:text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
          >
            <DownloadCloud className="w-4 h-4" />
            <span className="hidden sm:inline">Download Combined PDF</span>
            <span className="inline sm:hidden">PDF</span>
          </button>

          <button className="hidden sm:block p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-900"></span>
          </button>
          
          <button 
            onClick={toggleTheme}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1 sm:mx-2 hidden sm:block"></div>
          
          <button className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 p-1 sm:p-1.5 rounded-full transition-colors pr-1 sm:pr-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center justify-center font-medium shadow-sm">
              <User className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 hidden lg:block">Admin User</span>
          </button>
        </div>
      </div>
    </header>
  );
}
