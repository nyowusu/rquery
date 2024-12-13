import InfiniteScroll from "react-infinite-scroller";
import { Species } from "./Species";
import { useInfiniteQuery } from "@tanstack/react-query";

const initialUrl = "https://swapi.dev/api/species/";
const fetchUrl = async (url) => {
  console.log(url);
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {
  const {
    hasNextPage,
    isLoading,
    isFetching,
    isError,
    error,
    data,
    fetchNextPage,
    fetchPreviousPage,
  } = useInfiniteQuery({
    queryKey: ["in-species"],
    queryFn: ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    getNextPageParam: (lastPage) => lastPage.next || undefined,
    getPreviousPageParam: (lastPage) => lastPage.previous || undefined,
  });

  if (isLoading)
    return (
      <div className="loading">
        <p>Loading...</p>
      </div>
    );

  if (isError) return <h3>Something amiss ... {error.message}</h3>;

  return (
    <>
      {isFetching && (
        <div className="loading">
          <p>Loading...</p>
        </div>
      )}
      <InfiniteScroll
        initialLoad={false}
        hasMore={hasNextPage}
        loadMore={() => {
          if (!isFetching) fetchNextPage();
        }}
      >
        {data.pages.map((pageData) =>
          pageData.results.map((specie) => {
            return (
              <Species
                key={specie.name}
                name={specie.name}
                language={specie.language}
                averageLifespan={specie.average_lifespan}
                averageHeight={specie.average_height}
                classification={specie.classification}
              />
            );
          })
        )}
      </InfiniteScroll>
    </>
  );
}
