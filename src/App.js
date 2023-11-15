import { Routes, Route, BrowserRouter} from 'react-router-dom';
import './App.css';
import Docs from './Component/Docs';
import ReactQuile from './Component/ReactQuile';

function App() {
  return (
    <div className="App">
      <Routes>
          <Route path='/' element={<Docs />} />
          <Route path='/documents/:id' element={<ReactQuile />} />
  
      </Routes>
    </div>
  );
}

export default App;
