import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedContinent, setSelectedContinent] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [publicOnly, setPublicOnly] = useState(false)

 const API_URL = import.meta.env.VITE_API_URL || 'https://rest-api-react-yz5v.onrender.com'

  useEffect(() => {
    fetchDestinations()
  }, [selectedContinent, selectedCountry, publicOnly])

  const fetchDestinations = async () => {
    setLoading(true)
    setError(null)
    
    try {
      let url = `${API_URL}/api?`
      const params = new URLSearchParams()
      
      if (selectedContinent) params.append('continent', selectedContinent)
      if (selectedCountry) params.append('country', selectedCountry)
      if (publicOnly) params.append('is_open_to_public', 'true')
      
      url += params.toString()
      
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch destinations')
      
      const data = await response.json()
      setDestinations(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const continents = ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania']

  return (
    <div className="App">
      <header className="App-header">
        <h1>🌍 World's Most Interesting Places</h1>
        <p>Discover the planet's most fascinating destinations</p>
      </header>

      <div className="filters">
        <div className="filter-group">
          <label>Continent:</label>
          <select 
            value={selectedContinent} 
            onChange={(e) => setSelectedContinent(e.target.value)}
          >
            <option value="">All Continents</option>
            {continents.map(continent => (
              <option key={continent} value={continent}>{continent}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Country:</label>
          <input 
            type="text"
            placeholder="Enter country name"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          />
        </div>

        <div className="filter-group checkbox">
          <label>
            <input 
              type="checkbox"
              checked={publicOnly}
              onChange={(e) => setPublicOnly(e.target.checked)}
            />
            Open to Public Only
          </label>
        </div>

        <button 
          className="clear-btn"
          onClick={() => {
            setSelectedContinent('')
            setSelectedCountry('')
            setPublicOnly(false)
          }}
        >
          Clear Filters
        </button>
      </div>

      {loading && <div className="loading">Loading destinations...</div>}
      {error && <div className="error">Error: {error}</div>}

      <div className="destinations-grid">
        {destinations.map(destination => (
          <div key={destination.uuid} className="destination-card">
            <h2>{destination.name}</h2>
            <div className="location-info">
              <p className="location">📍 {destination.location}, {destination.country}</p>
              <p className="continent">🌎 {destination.continent}</p>
              <p className={destination.is_open_to_public ? 'status open' : 'status closed'}>
                {destination.is_open_to_public ? '✅ Open to Public' : '🚫 Not Open to Public'}
              </p>
            </div>
            <div className="details">
              {destination.details.map((detail, index) => (
                <div key={index}>
                  {detail.fun_fact && (
                    <p className="fun-fact">
                      <strong>💡 Fun Fact:</strong> {detail.fun_fact}
                    </p>
                  )}
                  {detail.description && (
                    <p className="description">{detail.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {!loading && destinations.length === 0 && (
        <div className="no-results">
          <p>No destinations found. Try different filters!</p>
        </div>
      )}

      <footer className="App-footer">
        <p>Total Destinations: {destinations.length}</p>
      </footer>
    </div>
  )
}

export default App