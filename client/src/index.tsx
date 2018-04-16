import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { VoteTotal } from "./components/vote_total";
import Config from './config';

fetch("http://localhost:5000/get_config").then(response => {
    return response.json();
}).then(cfg => {
    const config: Config = cfg;
    console.log(cfg);
});

ReactDOM.render(
    <VoteTotal  />,
    document.getElementById("vote_totals")
);