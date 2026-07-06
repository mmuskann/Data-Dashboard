import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [breweries, setBreweries] = useState([]);
  const [stateSearch, setStateSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBreweries = async (state = "") => {
    setLoading(true);

    let url = "https://api.openbrewerydb.org/v1/breweries?per_page=15";

    if (state.trim() !== "") {
      url += `&by_state=${encodeURIComponent(state)}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      setBreweries(data);
    } catch (error) {
      console.error("Error fetching breweries:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchBreweries();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBreweries(stateSearch);
    }, 400); 

    return () => clearTimeout(timer);
  }, [stateSearch]);

 
  const totalBreweries = breweries.length;

  const citiesRepresented = new Set(
    breweries.map((brewery) => brewery.city)
  ).size;

  const breweryTypes = new Set(
    breweries.map((brewery) => brewery.brewery_type)
  ).size;

  return (
    <div className="App">
      <h1>🍺 Brewery Explorer</h1>

      <input
        type="text"
        placeholder="Search by State..."
        value={stateSearch}
        onChange={(e) => setStateSearch(e.target.value)}
      />

      <div className="stats">

        <p>Total Breweries: {totalBreweries}</p>
        <p>Cities Represented: {citiesRepresented}</p>
        <p>Brewery Types: {breweryTypes}</p>
      </div>

      {loading ? (
        <h2>Loading...</h2>
      ) : breweries.length === 0 ? (
        <h2>No breweries found.</h2>
      ) : (
        <div className="table-container">
          <table className="brewery-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>City</th>
                <th>State</th>
                <th>Country</th>
                <th>Website</th>
              </tr>
            </thead>

            <tbody>
              {breweries.map((brewery) => (
                <tr key={brewery.id}>
                  <td>{brewery.name}</td>
                  <td>{brewery.brewery_type}</td>
                  <td>{brewery.city}</td>
                  <td>{brewery.state_province}</td>
                  <td>{brewery.country}</td>
                  <td>
                    {brewery.website_url ? (
                      <a href={brewery.website_url} target="_blank" rel="noreferrer">
                        Visit
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;