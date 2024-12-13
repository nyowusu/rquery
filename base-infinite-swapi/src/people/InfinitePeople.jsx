import InfiniteScroll from "react-infinite-scroller";
import { Person } from "./Person";
import { useInfiniteQuery } from "@tanstack/react-query";

const initialUrl = "https://swapi.dev/api/people/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfinitePeople() {
  const {
    isLoading,
    isError,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["sw-people"],
    queryFn: ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    getNextPageParam: (lastPage) => lastPage.next || undefined,
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
        {data.pages.map((pageData) => {
          return pageData.results.map((person) => (
            <Person
              key={person.name}
              name={person.name}
              hairColor={person.hair_color}
              eyeColor={person.eye_color}
            />
          ));
        })}
      </InfiniteScroll>
    </>
  );
}
