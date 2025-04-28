import React from 'react';

const Table = ({ children }) => (
  <table className="w-full border-collapse">{children}</table>
);

const TableHeader = ({ children }) => <thead>{children}</thead>;

const TableBody = ({ children }) => <tbody>{children}</tbody>;

const TableRow = ({ children, minHeight = '50px', maxHeight = '50px' }) => (
  <tr style={{ minHeight: minHeight, maxHeight: maxHeight }}>{children}</tr>
);

const TableHead = ({ children }) => (
  <th className="border p-2">{children}</th>
);

const TableCell = ({ children, maxWidth = 'none' }) => (
  <td className="border p-2" style={{ maxWidth: maxWidth, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
    {children}
  </td>
);

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };