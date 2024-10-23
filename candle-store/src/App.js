import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import About from './pages/About';
import ItemDetails from './pages/ItemDetails';
import List from './pages/List';
import UpdateCandle from './pages/UpdateCandle';
import NotFound from './pages/NotFound';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Sidebar />
        <div className="main-content">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/about" component={About} />
            <Route path="/items" component={List} />
            <Route path="/item/:id" component={ItemDetails} />
            <Route path="/update/:id" component={UpdateCandle} />
            <Route component={NotFound} />
          </Switch>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
