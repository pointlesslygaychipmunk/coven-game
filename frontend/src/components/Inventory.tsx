import React from 'react';

function Inventory({ inventory }: any) {
  return (
    <div className="inventory">
      <h2>Inventory 🧺</h2>
      <ul>
        {inventory.map((item: any, idx: number) => (
          <li key={idx}>
            {item.name} × {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Inventory;
