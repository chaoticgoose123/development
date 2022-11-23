import './App.css';
import { useEffect, useMemo, useState } from 'react';
import listData from './assets/list-data.json';
import ListItem from './components/ListItem.js';

listData.forEach((item) => {
  item.image = (process.env.PUBLIC_URL + '/' + item.image).replace('//', '/');
  item.display = true;
});

const zeroStat = {
  HP: 0,
  Attack: 0,
  Defense: 0,
  'Sp. Attack': 0,
  'Sp. Defense': 0,
  Speed: 0,
};

const addStats = (a, b, quantity) => {
  const c = { ...a };
  c.HP += b.HP * quantity;
  c.Attack += b.Attack * quantity;
  c.Defense += b.Defense * quantity;
  c['Sp. Attack'] += b['Sp. Attack'] * quantity;
  c['Sp. Defense'] += b['Sp. Defense'] * quantity;
  c.Speed += b.Speed * quantity;
  return c;
};

const types = {
  Normal: false,
  Fire: false,
  Water: false,
  Grass: false,
  Flying: false,
  Fighting: false,
  Poison: false,
  Electric: false,
  Ground: false,
  Rock: false,
  Psychic: false,
  Ice: false,
  Bug: false,
  Ghost: false,
  Steel: false,
  Dragon: false,
  Dark: false,
  Fairy: false,
};

const sortID = (a, b) => a.id - b.id;
const sortName = (a, b) => a.name.localeCompare(b.name);
const sortDispatch = (sortBy) => {
  switch (sortBy) {
    case 'id':
      return sortID;
    case 'name':
      return sortName;
    default:
      return (a, b) => true;
  }
};

const filterInCollection = (collection) => (x) => ({
  ...x,
  display: x.display && !!collection[x.id],
});
const filterNotInCollection = (collection) => (x) => ({
  ...x,
  display: x.display && !collection[x.id],
});
const filterDispatch = (filterCriteria) => {
  switch (filterCriteria) {
    case 'in-collection':
      return filterInCollection;
    case 'not-in-collection':
      return filterNotInCollection;
    default:
      return () => (x) => x;
  }
};

const filterAllTypes = (filterTypes) => (x) => ({
  ...x,
  display:
    x.display &&
    Object.entries(filterTypes).every(
      ([type, checking]) => !checking || x.type.includes(type)
    ),
});

function App() {
  const [sortBy, setSortBy] = useState('id');
  const [filterBy, setFilterBy] = useState({
    'in-collection': false,
    'not-in-collection': false,
  });
  const [filterTypes, setFilterTypes] = useState({ ...types });
  const [processedList, setProcessedList] = useState([...listData]);
  const [collection, setCollection] = useState({});

  const totalStats = Object.entries(collection).reduce(
    (acc, [id, quantity]) => addStats(acc, listData[id].stats, quantity),
    zeroStat
  );
  const totalQuantity = Object.entries(collection).reduce(
    (acc, [_, quantity]) => acc + quantity,
    0
  );

  const onSortByChange = (e) => {
    setSortBy(e.target.value);
  };
  const onFilterByChange = (e) => {
    setFilterBy((prev) => ({
      ...prev,
      [e.target.value]: !prev[e.target.value],
    }));
  };
  const onFilterTypesChange = (e) => {
    setFilterTypes((prev) => ({
      ...prev,
      [e.target.value]: !prev[e.target.value],
    }));
  };

  useEffect(() => {
    console.log('filtering');
    setProcessedList((prev) => {
      let newProcessedList = prev.map((x) => ({ ...x, display: true }));
      newProcessedList.sort(sortDispatch(sortBy));
      // Instead of using filter, toggle CSS display attribute for performance
      for (const [k, v] of Object.entries(filterBy)) {
        if (!v) continue;
        newProcessedList = newProcessedList.map(filterDispatch(k)(collection));
      }
      return newProcessedList.map(filterAllTypes(filterTypes));
    });
  }, [sortBy, filterBy, filterTypes, collection]);

  return (
    <main id="app">
      <h1>Meaningless Collection</h1>

      <section id="list">
        <h2>List</h2>
        {processedList.map((item) => (
          <ListItem
            key={item.id}
            item={item}
            index={item.id}
            quantity={collection[item.id] ?? 0}
            setCollection={setCollection}
          />
        ))}
      </section>

      <div id="right">
        <section id="sort-filter">
          <h2>Sort / Filter</h2>
          <div className="gray-box">
            <div id="sort-options" className="fake-fieldset">
              <legend>Sort by:</legend>
              <div>
                <input
                  type="radio"
                  name="sort-by"
                  id="id"
                  value="id"
                  defaultChecked
                  onChange={onSortByChange}
                />
                <label for="id">ID</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="sort-by"
                  id="name"
                  value="name"
                  onChange={onSortByChange}
                />
                <label for="name">Name</label>
              </div>
            </div>
            <div id="filter-options" className="fake-fieldset">
              <legend>Filter by:</legend>
              <div>
                <input
                  type="checkbox"
                  name="filter-by"
                  id="in-collection"
                  value="in-collection"
                  onChange={onFilterByChange}
                />
                <label for="in-collection">In Collection</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  name="filter-by"
                  id="not-in-collection"
                  value="not-in-collection"
                  onChange={onFilterByChange}
                />
                <label for="not-in-collection">Not In Collection</label>
              </div>
            </div>
            <div id="filter-type" className="fake-fieldset">
              <legend>Filter by type:</legend>
              {Object.keys(types).map((type) => (
                <div key={type}>
                  <input
                    type="checkbox"
                    name="filter-by"
                    id={type}
                    value={type}
                    onChange={onFilterTypesChange}
                  />
                  <label for={type}>{type}</label>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="collection">
          <h2>Collection</h2>
          <div className="gray-box">
            {Object.entries(collection).map(([id, quantity]) => (
              <p key={id}>
                {quantity} x {listData[id - 1].name}
              </p>
            ))}
            {Object.entries(collection).length === 0 &&
              'Your collection is empty.'}
            {Object.entries(collection).length !== 0 && (
              <>
                <hr />
                <p>{'Meaningless sum of base stats:'}</p>
                <div className="base-stats">
                  <span className="stat">
                    <span>HP:</span>
                    <span>{totalStats.HP}</span>
                  </span>
                  <span className="stat">
                    <span>Att:</span>
                    <span>{totalStats.Attack}</span>
                  </span>
                  <span className="stat">
                    <span>Def:</span>
                    <span>{totalStats.Defense}</span>
                  </span>
                  <span className="stat">
                    <span>Sp. Att:</span>
                    <span>{totalStats['Sp. Attack']}</span>
                  </span>
                  <span className="stat">
                    <span>Sp. Def:</span>
                    <span>{totalStats['Sp. Defense']}</span>
                  </span>
                  <span className="stat">
                    <span>Speed:</span>
                    <span>{totalStats.Speed}</span>
                  </span>
                </div>
                <hr />
                <p>{'Count = ' + totalQuantity}</p>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
