import React from 'react';

const Label = ({ children, ...props }) => (
    <label className="block text-sm font-medium text-gray-700" {...props}>
        {children}
    </label>
);

export { Label };