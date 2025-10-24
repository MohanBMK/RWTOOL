import React from 'react';
import './SimpleHeader.css';

const SimpleHeader = ({ title, subtitle }) => {
    return (
        <div className="simple-header">
            <div className="header-content">
                <h1 className="header-title">{title || 'RW Tool'}</h1>
                {subtitle && <p className="header-subtitle">{subtitle}</p>}
            </div>
        </div>
    );
};

export default SimpleHeader;
