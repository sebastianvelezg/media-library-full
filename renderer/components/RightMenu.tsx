import Link from "next/link";

function RightMenu({
  handleSliderChange,
  filterByDate,
  filterByName,
  filterByPopularity,
  filterByGenre,
}) {
  return (
    <div className="flex-none w-32 bg-primary p-4">
      <div className="mb-10">
        <h2 className="font-bold text-xl mb-4">Filters</h2>
        <button className="block mb-2" onClick={filterByDate}>
          Release Date
        </button>
        <button className="block mb-2" onClick={filterByName}>
          Name
        </button>
        <button className="block mb-2" onClick={filterByPopularity}>
          Popularity
        </button>
      </div>
      <div className="mb-10">
        <h2 className="font-bold text-xl mb-4">Genres</h2>
        <button className="block mb-2" onClick={() => filterByGenre("Action")}>
          Action
        </button>
        <button
          className="block mb-2"
          onClick={() => filterByGenre("Adventure")}
        >
          Adventure
        </button>
        <button
          className="block mb-2"
          onClick={() => filterByGenre("Animation")}
        >
          Animation
        </button>
        <button className="block mb-2" onClick={() => filterByGenre("Comedy")}>
          Comedy
        </button>
        <button className="block mb-2" onClick={() => filterByGenre("Crime")}>
          Crime
        </button>
        <button className="block mb-2" onClick={() => filterByGenre("Drama")}>
          Drama
        </button>
        <button className="block mb-2" onClick={() => filterByGenre("Fantasy")}>
          Fantasy
        </button>
        <button className="block mb-2" onClick={() => filterByGenre("History")}>
          History
        </button>
        <button className="block mb-2" onClick={() => filterByGenre("Horror")}>
          Horror
        </button>

        <button className="block mb-2" onClick={() => filterByGenre("Mystery")}>
          Mystery
        </button>
        <button className="block mb-2" onClick={() => filterByGenre("Romance")}>
          Romance
        </button>
        <button
          className="block mb-2"
          onClick={() => filterByGenre("Science Fiction")}
        >
          SCI-FI
        </button>

        <button
          className="block mb-2"
          onClick={() => filterByGenre("Thriller")}
        >
          Thriller
        </button>
      </div>
      <div>
        <div className="flex flex-col items-start">
          <label htmlFor="cardSize" className="mb-2 ">
            Movie Size
          </label>
          <input
            type="range"
            id="cardSize"
            name="cardSize"
            min="100"
            max="300"
            defaultValue="200"
            className="w-full"
            onChange={handleSliderChange}
          />
        </div>
      </div>
    </div>
  );
}

export default RightMenu;
