import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function BreweryDetail() {
  const { id } = useParams();

  const [brewery, setBrewery] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrewery = async () => {
      try {
        const response = await fetch(
          `https://api.openbrewerydb.org/v1/breweries/${id}`
        );

        const data = await response.json();
        setBrewery(data);
      } catch (error) {
        console.error("Error fetching brewery:", error);
      }

      setLoading(false);
    };

    fetchBrewery();
  }, [id]);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!brewery) {
    return <h2>Brewery not found.</h2>;
  }

  return (
    <div className="detail-page">
      <Link to="/">← Back to Dashboard</Link>

      <h1>{brewery.name}</h1>

      <p>
        <strong>Type:</strong> {brewery.brewery_type}
      </p>

      <p>
        <strong>City:</strong> {brewery.city}
      </p>

      <p>
        <strong>State:</strong> {brewery.state_province}
      </p>

      <p>
        <strong>Country:</strong> {brewery.country}
      </p>

      <p>
        <strong>Street:</strong>{" "}
        {brewery.address_1 || "Not Available"}
      </p>

      <p>
        <strong>Postal Code:</strong>{" "}
        {brewery.postal_code || "Not Available"}
      </p>

      <p>
        <strong>Phone:</strong>{" "}
        {brewery.phone || "Not Available"}
      </p>

      {brewery.website_url ? (
        <p>
          <a
            href={brewery.website_url}
            target="_blank"
            rel="noreferrer"
          >
            Visit Brewery Website
          </a>
        </p>
      ) : (
        <p>No website available.</p>
      )}
    </div>
  );
}

export default BreweryDetail;