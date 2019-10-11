import React, { useState, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Users from  './components/users/Users'
import User from  './components/users/User'
import Search from  './components/users/Search'
import Alert from './components/layout/Alert'
import About from './components/pages/About'
import axios from 'axios'

import './App.css';

const App = () => {
	const [users, setUsers] = useState([])
	const [user, setUser] = useState({})
	const [repos, setRepos] = useState([])
	const [loading, setLoading] = useState(false)
	const [alert, setAlert] = useState(null)
	
	// Search GH users using text input
	const searchUsers = async text => {
		setLoading(true)

		const res = await axios.get(`https://api.github.com/search/users?q=${text}`)
		
		setUsers(res.data.items)
		setLoading(false)
	}

	// Get single user
	const getUser = async (username) => {
		setLoading(true)

		const res = await axios.get(`https://api.github.com/users/${username}`)
		
		setUser(res.data)
		setLoading(false)
	}

	// Get User's repos
	const getUserRepos = async (username) => {
		setLoading(true)

		const res = await axios.get(`https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc`)
		
		setRepos(res.data)
		setLoading(false)
	}

	// Clear users from state
	const clearUsers = () => {
		setUsers([])
		setLoading(false)
	}

	const showAlert = (msg, type) => {
		setAlert({msg, type})

		setTimeout(() => setAlert(null), 3000)
	}

	return (
		<Router>
			<div className="App">
				<Navbar />
				<div className="container">
					<Alert alert={alert} />
					<Switch>
						<Route exact path='/' render={props => (
							<div>
								<Search 
									searchUsers={searchUsers} 
									clearUsers={clearUsers} 
									showClear={users.length > 0 ? true: false}
									setAlert={showAlert}
								/>
								<Users 
									users={users} 
									loading={loading}
								/>
							</div>
						)} />
						<Route exact path='/about' component={About}/>
						<Route exact path='/user/:login' render={props => (
							<User 
								{...props} 
								getUser={getUser} 
								getUserRepos={getUserRepos}
								user={user} 
								repos={repos}
								loading={loading}
							/>
						)} />
					</Switch>
				</div>
			</div>
		</Router>
	);
}

export default App;
