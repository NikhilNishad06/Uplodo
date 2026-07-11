import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import ImageUploaderCard from '../components/ImageUploaderCard';

export default function ReportsDashboard() {
  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem('erp_dynamic_cards');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      { id: 'billet_stock', title: 'Billet Stock Report' },
      { id: 'material_purchase', title: 'Material Purchase' },
      { id: 'daily_mis', title: 'Daily MIS Report' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('erp_dynamic_cards', JSON.stringify(cards));
  }, [cards]);

  const handleAddCard = () => {
    const newId = `report_${Date.now()}`;
    setCards([...cards, { id: newId, title: `New Report ${cards.length + 1}` }]);
  };

  const handleImageUpload = () => {
    setCards(prevCards => {
      // If every card currently has an image in localStorage, automatically spawn a new one
      const allFilled = prevCards.every(c => localStorage.getItem(`image_${c.id}`));
      if (allFilled) {
        const newId = `report_${Date.now()}`;
        return [...prevCards, { id: newId, title: `New Report ${prevCards.length + 1}` }];
      }
      return prevCards;
    });
  };

  const handleRemoveCard = (id) => {
    setCards(cards.filter(c => c.id !== id));
    localStorage.removeItem(`image_${id}`);
  };

  const handleTitleChange = (id, newTitle) => {
    setCards(cards.map(c => c.id === id ? { ...c, title: newTitle } : c));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Your Images</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add as many reports as you need. You can edit their titles and download them all together as a single PDF.</p>
        </div>
        <button 
          onClick={handleAddCard}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-sm shrink-0"
        >
          <Plus className="w-5 h-5" /> Add New Report
        </button>
      </div>

      {cards.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 transition-colors">
          <p className="text-gray-500 dark:text-gray-400">No reports added yet. Click "Add New Report" to start.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {cards.map((card) => (
            <ImageUploaderCard 
              key={card.id}
              storageKey={`image_${card.id}`}
              initialTitle={card.title}
              onRemove={() => handleRemoveCard(card.id)}
              onTitleChange={(newTitle) => handleTitleChange(card.id, newTitle)}
              onImageUpload={handleImageUpload}
            />
          ))}
        </div>
      )}
    </div>
  );
}
