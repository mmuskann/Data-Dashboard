import { useEffect, useState, useMemo } from "react";
import { Routes, Route, Link } from "react-router-dom";
import BreweryDetail from "./components/BreweryDetail";
import Charts from "./components/Charts";
import "./App.css";

function Dashboard() {
  const [breweries, setBreweries] = useState([]);
  const [stateSearch, setStateSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
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
    const timer = setTimeout(() => {
      fetchBreweries(stateSearch);
    }, 400);

    return () => clearTimeout(timer);
  }, [stateSearch]);


  const filteredBreweries = useMemo(() => {
    if (typeFilter === "all") return breweries;

    return breweries.filter(
      (brewery) => brewery.brewery_type === typeFilter
    );
  }, [breweries, typeFilter]);


  const totalBreweries = useMemo(
    () => filteredBreweries.length,
    [filteredBreweries]
  );

  const citiesRepresented = useMemo(() => {
    return new Set(
      filteredBreweries.map((brewery) => brewery.city)
    ).size;
  }, [filteredBreweries]);

  const breweryTypes = useMemo(() => {
    return new Set(
      filteredBreweries.map((brewery) => brewery.brewery_type)
    ).size;
  }, [filteredBreweries]);

  const availableTypes = useMemo(() => {
    return [...new Set(breweries.map((b) => b.brewery_type))];
  }, [breweries]);

  return (
    <div className="App">
      <h1>🍺 Brewery Explorer</h1>

      <div className="controls">
        <input
          type="text"
          placeholder="Search by State..."
          value={stateSearch}
          onChange={(e) => setStateSearch(e.target.value)}
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Brewery Types</option>

          {availableTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="stats">
        <p>Total Breweries: {totalBreweries}</p>
        <p>Cities Represented: {citiesRepresented}</p>
        <p>Brewery Types: {breweryTypes}</p>
      </div>

      {/* Charts */}
      <Charts breweries={filteredBreweries} />

      {loading ? (
        <h2>Loading...</h2>
      ) : filteredBreweries.length === 0 ? (
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
              {filteredBreweries.map((brewery) => (
                <tr key={brewery.id}>
                  <td>
                    <Link to={`/brewery/${brewery.id}`}>
                      {brewery.name}
                    </Link>
                  </td>

                  <td>{brewery.brewery_type}</td>
                  <td>{brewery.city}</td>
                  <td>{brewery.state_province}</td>
                  <td>{brewery.country}</td>

                  <td>
                    {brewery.website_url ? (
                      <a
                        href={brewery.website_url}
                        target="_blank"
                        rel="noreferrer"
                      >
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/brewery/:id" element={<BreweryDetail />} />
    </Routes>
  );
}

export default App;