import React from 'react'
import numeral from 'numeral'
import './Table.css'

function Table({ countries }) {    
    return (
        <div className="table">
            {countries.map(country=>(
                <tr key={country.countryInfo.iso2}>
                    <td>{country.country}</td>
                    <td><strong>{numeral(country.cases).format("0,0")}</strong></td>
                </tr>
            ))}
        </div>
    )
}

export default Table
