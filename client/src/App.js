import {
  useQuery,
  gql
} from "@apollo/client";

const BASIC = gql`
    query Basic {
        business(id: "garaje-san-francisco") {
            name
            id
            alias
            rating
            url
        }
    }
`

function App() {
  const { loading, error, data } = useQuery(BASIC);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return (
    <pre>{JSON.stringify(data)}</pre>
  );
}

export default App;
