import logo from './logo.svg';
import './App.css';
import ContextEditor from './ContextEditor.js'; // Create this new component

function App() {
  const [clickCount, setClickCount] = useState(0);
  const [showPasswordPanel, setShowPasswordPanel] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Handler for GIF click
  const handleGifClick = () => {
    setClickCount((prevCount) => prevCount + 1);
    if (clickCount + 1 === 5) {
      setShowPasswordPanel(true);
      setClickCount(0); // Reset the click count
    }
  };

  // Handler for password submission
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === 'Sb170000662') {
      setIsAuthenticated(true);
      setShowPasswordPanel(false);
    } else {
      alert('Incorrect password, try again.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
