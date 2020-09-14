import React, { useState, useEffect } from 'react';
import { MenuItem, Select, FormControl, Card, CardContent } from "@material-ui/core";
import { sortData, prettyPrintStat } from './util';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import LineGraph from './LineGraph';
import './App.css';
// Leaflet CSS
import "leaflet/dist/leaflet.css";


function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState('');
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountires] = useState([]);
  const [casesType, setCasesType] = useState('cases');

  // Get the list of all countries
  // Get the countries and their data
  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((res) => res.json())
        .then(data => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2
          }
          ))
          const sortedData = sortData(data);
          setTableData(sortedData)
          setCountries(countries)
          setMapCountires(data)
        })
    }
    getCountriesData();
  }, [])

  // Load Default for worldwide cases
  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then(res => res.json())
      .then(data => { setCountryInfo(data) })
  }, [])

  // Handle when country is changing via dropdown
  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    console.log('COUNTRY CODE>>>>>>>>>>>>>', countryCode);
    console.log(countryCode);
    const url = countryCode === 'worldwide' ?
      'https://disease.sh/v3/covid-19/all' :
      `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
      .then(res => res.json())
      .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);

        // Set Center on Map
        if (countryCode === 'worldwide') {
          setMapCenter([{ lat: 20.5937, lng: 78.9629 }])
          setMapZoom(3)
        } else {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(4);
        }
      })
  }

  // Log ContryInfo to see json
  console.log(countryInfo);
  console.log(tableData);

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID 19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" value={country} onChange={onCountryChange}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map(country => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            onClick={e => setCasesType('cases')}
            isActive={casesType === 'cases'}
            isRed
            title="Coronavirus Cases"
            total={countryInfo.cases}
            cases={prettyPrintStat(countryInfo.todayCases)} />

          <InfoBox
            onClick={e => setCasesType('recovered')}
            isActive={casesType === 'recovered'}
            title="Recovered"
            total={countryInfo.recovered}
            cases={prettyPrintStat(countryInfo.todayRecovered)} />

          <InfoBox
            onClick={e => setCasesType('deaths')}
            isRed
            isActive={casesType === 'deaths'}
            title="Deaths"
            total={countryInfo.deaths}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
          />
        </div>

        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />

      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3>Worldwide new {casesType}</h3>
          <LineGraph casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
