function ListItem({ item, quantity, setCollection }) {
  // Callbacks

  const increment = () =>
    setCollection((prev) => {
      return { ...prev, [item.id]: quantity + 1 };
    });

  const decrement = () =>
    setCollection((prev) => {
      if (!quantity || quantity < 1) return prev;
      const returnValue = { ...prev, [item.id]: quantity - 1 };
      if (returnValue[item.id] < 1) delete returnValue[item.id];
      return returnValue;
    });

  const clear = () =>
    setCollection((prev) => {
      const returnValue = { ...prev };
      delete returnValue[item.id];
      return returnValue;
    });

  // Adder

  let rightSide = (
    <div className="adder">
      <button onClick={decrement}>-</button>
      <span>{quantity}</span>
      <button onClick={increment}>+</button>
      <button onClick={clear}>x</button>
    </div>
  );
  if (quantity === 0) {
    rightSide = <button onClick={increment}>Add To Collection</button>;
  }

  return (
    <article
      className="list-item"
      {...(!item.display && { style: { display: 'none' } })}
    >
      <div className="list-item-top">
        <img
          src={item.image}
          style={{ width: '5rem' }}
          alt={'A sprite of the pokemon ' + item.name}
        />
        <span className="number">{item.id}</span>
        <h3>{item.name}</h3>
        <div className="butt-width">{rightSide}</div>
      </div>
      <div className="list-item-bottom">
        <div className="types">
          <span>{item.type[0]}</span>
          {item.type[1] && <span>{item.type[1]}</span>}
        </div>
        <div className="base-stats">
          <span className="stat">
            <span>HP:</span>
            <span>{item.stats.HP}</span>
          </span>
          <span className="stat">
            <span>Att:</span>
            <span>{item.stats.Attack}</span>
          </span>
          <span className="stat">
            <span>Def:</span>
            <span>{item.stats.Defense}</span>
          </span>
          <span className="stat">
            <span>Sp. Att:</span>
            <span>{item.stats['Sp. Attack']}</span>
          </span>
          <span className="stat">
            <span>Sp. Def:</span>
            <span>{item.stats['Sp. Defense']}</span>
          </span>
          <span className="stat">
            <span>Speed:</span>
            <span>{item.stats.Speed}</span>
          </span>
        </div>
      </div>
    </article>
  );
}

export default ListItem;
