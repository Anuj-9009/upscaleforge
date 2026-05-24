import { useApp } from './context/AppContext';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import TopNav from './components/TopNav';
import Dashboard from './components/Dashboard';
import ImageWorkspace from './components/ImageWorkspace';
import VideoWorkspace from './components/VideoWorkspace';
import ShortcutsModal from './components/ShortcutsModal';
import HiddenFileInput from './components/HiddenFileInput';

export default function App() {
  const { state } = useApp();
  useKeyboardShortcuts();

  const renderView = () => {
    if (state.view === 'dashboard') {
      return <Dashboard />;
    }
    if (state.mode === 'image') {
      return <ImageWorkspace />;
    }
    return <VideoWorkspace />;
  };

  return (
    <div className="min-h-screen bg-mint-gradient">
      <TopNav />
      <main className="pt-[72px] min-h-screen">
        <div key={`${state.view}-${state.mode}`} className="view-enter">
          {renderView()}
        </div>
      </main>
      {state.showShortcuts && <ShortcutsModal />}
      <HiddenFileInput />
    </div>
  );
}
