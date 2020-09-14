import React from 'react';
import { prettyPrintStat } from './util';
import { Card, CardContent, Typography } from "@material-ui/core";
import './InfoBox.css';

function InfoBox({ title, cases, total, isActive, isRed, ...props }) {
    return (
        // style={cardStyle['recovered']}
        <Card className={`infoBox ${isActive && 'infoBox__selected'} ${isActive && isRed && 'infoBox__red'}`} onClick={props.onClick}>
            <CardContent>
                <Typography className="infoBox__title" color="textSecondary">
                    {title}
                </Typography>

                <h2 className={`infoBox__cases ${!isRed && "infoBox__green"}`}>{cases}</h2>

                <Typography className="infoBox__total" color="textSecondary">
                    {prettyPrintStat(total)} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox

