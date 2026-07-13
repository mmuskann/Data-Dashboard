import { useEffect, useState, useMemo } from "react";
import "./App.css";

function App() {
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


  // Only API call now
  // Runs once on page load AND whenever stateSearch changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBreweries(stateSearch);
    }, 400);

    return () => clearTimeout(timer);
  }, [stateSearch]);


  // Client-side filter
  const filteredBreweries = useMemo(() => {
    if (typeFilter === "all") {
      return breweries;
    }

    return breweries.filter(
      (brewery) => brewery.brewery_type === typeFilter
    );

  }, [breweries, typeFilter]);


  // Statistics
  const totalBreweries = useMemo(() => {
    return breweries.length;
  }, [breweries]);


  const citiesRepresented = useMemo(() => {
    return new Set(
      breweries.map((brewery) => brewery.city)
    ).size;

  }, [breweries]);


  const breweryTypes = useMemo(() => {
    return new Set(
      breweries.map((brewery) => brewery.brewery_type)
    ).size;

  }, [breweries]);


  // Get available brewery types for dropdown
  const availableTypes = useMemo(() => {
    return [
      ...new Set(
        breweries.map((brewery) => brewery.brewery_type)
      )
    ];
  }, [breweries]);


  return (
    <div className="App">

      <h1>🍺 Brewery Explorer</h1>


      {/* Server-side search */}
      <input
        type="text"
        placeholder="Search by State..."
        value={stateSearch}
        onChange={(e) => setStateSearch(e.target.value)}
      />


      {/* Client-side filter */}
      <select
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
      >

        <option value="all">
          All Brewery Types
        </option>

        {availableTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}

      </select>


      <div className="stats">

        <p>Total Breweries: {totalBreweries}</p>

        <p>
          Cities Represented: {citiesRepresented}
        </p>

        <p>
          Brewery Types: {breweryTypes}
        </p>

      </div>



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
                    {brewery.name}
                  </td>

                  <td>
                    {brewery.brewery_type}
                  </td>

                  <td>
                    {brewery.city}
                  </td>

                  <td>
                    {brewery.state_province}
                  </td>

                  <td>
                    {brewery.country}
                  </td>


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

export default App;