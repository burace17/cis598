import * as React from 'react';

export function LastUpdated() 
{
    return (
        <div>{new Date().toString()}</div>
    );
}