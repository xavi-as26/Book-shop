import { HomeIcon, LibraryIcon, WishlistIcon } from './Icons';

const TabBar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'reading', label: 'Leer', icon: HomeIcon },
    { id: 'library', label: 'Biblioteca', icon: LibraryIcon },
    { id: 'wishlist', label: 'Deseos', icon: WishlistIcon },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 px-6 pb-8 pt-3 flex justify-around items-start border-t border-gray-200/30 bg-white/70 backdrop-blur-ios safe-bottom z-50">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex flex-col items-center justify-center w-16 transition-all duration-200"
          >
            <div className={`p-1.5 rounded-full transition-colors duration-200 ${isActive ? 'bg-ios-blue/10' : ''}`}>
              <tab.icon fill={isActive ? '#007AFF' : '#8E8E93'} />
            </div>
            <span className={`text-[11px] mt-1 font-medium transition-colors duration-200 ${isActive ? 'text-ios-blue' : 'text-ios-gray'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default TabBar;
