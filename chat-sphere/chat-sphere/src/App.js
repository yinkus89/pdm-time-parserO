// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Chat from './components/Chat';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';

const App = () => {
    const [user, setUser] = useState(null);

    return (
        <Router>
            <Switch>
                <Route path="/chat">
                    {user ? <Chat userId={user.id} /> : <Login setUser={setUser} />}
                </Route>
                <Route path="/register" component={Register} />
                <Route path="/profile">
                    {user ? <Profile user={user} /> : <Login setUser={setUser} />}
                </Route>
                <Route path="/" exact component={Login} />
            </Switch>
        </Router>
    );
};

export default App;
