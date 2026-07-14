import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Charts({ breweries }) {
  // Count breweries by type
  const typeCounts = {};

  breweries.forEach((brewery) => {
    const type = brewery.brewery_type || "Unknown";
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });

  const typeData = Object.keys(typeCounts).map((type) => ({
    name: type,
    value: typeCounts[type],
  }));

  // Count breweries by city
  const cityCounts = {};

  breweries.forEach((brewery) => {
    const city = brewery.city || "Unknown";
    cityCounts[city] = (cityCounts[city] || 0) + 1;
  });

  const cityData = Object.keys(cityCounts).map((city) => ({
    city,
    breweries: cityCounts[city],
  }));

  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#00C49F",
    "#FFBB28",
    "#0088FE",
  ];

  return (
    <div className="charts-container">
      <h2>Brewery Statistics</h2>

      <div
        style={{
          display: "flex",
          gap: "40px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {/* Bar Chart */}
        <div style={{ width: 500, height: 350 }}>
          <h3>Breweries by City</h3>

          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cityData}>
              <XAxis dataKey="city" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="breweries" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div style={{ width: 500, height: 350 }}>
          <h3>Brewery Types</h3>

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={typeData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                {typeData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Charts;