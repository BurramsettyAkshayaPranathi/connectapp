import React from 'react';

function FilterToolbar({ title, searchValue, onSearchChange, searchPlaceholder, filters = [] }) {
  return (
    <article className="section-card filter-toolbar">
      <div className="section-head">
        <div>
          <h2>{title}</h2>
          <p>Search and narrow the list to what matters right now.</p>
        </div>
      </div>

      <div className="filter-toolbar__grid">
        <input
          className="ops-input focus-outline filter-toolbar__search"
          type="text"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
        />

        {filters.map((filter) => (
          <select
            key={filter.label}
            className="ops-input focus-outline"
            value={filter.value}
            onChange={(event) => filter.onChange(event.target.value)}
          >
            {filter.options.map((option) => (
              <option key={option} value={option}>
                {option === 'all' ? `All ${filter.label}` : option}
              </option>
            ))}
          </select>
        ))}
      </div>
    </article>
  );
}

export default FilterToolbar;
