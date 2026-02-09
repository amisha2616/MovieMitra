/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

const Search = ({ searchTerm, setsearchTerm, PH}) => {
  return (
    <div className="search">
      <div className="">
        <img src="search.svg" alt="search"/>
        <input
          type="text"
          placeholder={PH}
          value={searchTerm}
          onChange={(e) => setsearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Search;
